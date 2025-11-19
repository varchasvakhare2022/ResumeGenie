"""Gemini API client helper for making HTTP requests to Gemini API.

This module isolates the Gemini API call logic so it can be easily updated
if the Gemini API or library changes in the future.
"""
import httpx
import json
import logging
import os
from typing import Optional, Dict, Any, List
from pathlib import Path
from app.config import settings
from app.utils import sanitize_text, MAX_TEXT_LENGTH, MAX_SHORT_TEXT_LENGTH

# Set up logger
logger = logging.getLogger(__name__)

# Try to import Google Auth for service account support (optional)
try:
    from google.auth import default
    from google.auth.transport.requests import Request as AuthRequest
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False
    logger.debug("google-auth not installed. Service account authentication not available.")


def _redact_long_text(text: str, max_length: int = 100) -> str:
    """
    Redact long text for logging purposes.
    
    Args:
        text: Text to redact
        max_length: Maximum length to show before truncation
    
    Returns:
        Redacted text (first max_length chars + "... [TRUNCATED]")
    """
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    return text[:max_length] + f"... [TRUNCATED {len(text) - max_length} chars]"


def _get_auth_token() -> Optional[str]:
    """
    Get authentication token from service account credentials if available.
    
    Returns:
        Access token string or None if not available
    """
    if not GOOGLE_AUTH_AVAILABLE:
        return None
    
    # Check for GOOGLE_APPLICATION_CREDENTIALS environment variable
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not creds_path:
        return None
    
    try:
        creds_path = Path(creds_path)
        if not creds_path.exists():
            logger.warning(f"GOOGLE_APPLICATION_CREDENTIALS path does not exist: {creds_path}")
            return None
        
        logger.debug(f"Using service account credentials from: {creds_path}")
        credentials, project = default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
        
        # Refresh token if needed
        if not credentials.valid:
            credentials.refresh(AuthRequest())
        
        return credentials.token
    except Exception as e:
        logger.warning(f"Failed to get service account token: {str(e)}")
        return None


async def _make_gemini_http_request(
    url: str,
    payload: Dict[str, Any],
    api_key: Optional[str] = None,
    access_token: Optional[str] = None,
) -> httpx.Response:
    """
    Make HTTP request to Gemini API with proper authentication.
    
    This function isolates all HTTP request logic in one place for easier debugging
    and maintenance.
    
    Args:
        url: Gemini API endpoint URL
        payload: Request payload dictionary
        api_key: API key for authentication (used as query parameter)
        access_token: OAuth access token (used as Bearer token, advanced)
    
    Returns:
        httpx.Response object
    
    Raises:
        ValueError: If neither api_key nor access_token is provided
        httpx.HTTPStatusError: If API request fails
        httpx.RequestError: If network request fails
    """
    # Validate authentication
    if not api_key and not access_token:
        raise ValueError("Either GEMINI_API_KEY or service account credentials must be configured")
    
    # Prepare headers
    headers = {
        "Content-Type": "application/json",
    }
    
    # Add Bearer token if using service account
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
        logger.debug("Using Bearer token authentication (service account)")
    
    # Prepare query parameters
    params = {}
    if api_key:
        params["key"] = api_key
        logger.debug("Using API key authentication")
    
    # Log request (with redacted payload)
    redacted_payload = payload.copy()
    if "contents" in redacted_payload:
        if isinstance(redacted_payload["contents"], list) and len(redacted_payload["contents"]) > 0:
            if "parts" in redacted_payload["contents"][0]:
                for part in redacted_payload["contents"][0]["parts"]:
                    if "text" in part:
                        part["text"] = _redact_long_text(part["text"], max_length=200)
    
    logger.info(f"Gemini API request: POST {url}")
    logger.debug(f"Request payload (redacted): {json.dumps(redacted_payload, indent=2)}")
    logger.debug(f"Request params: key={'[REDACTED]' if api_key else 'None'}, access_token={'[REDACTED]' if access_token else 'None'}")
    
    # Make the HTTP request
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            headers=headers,
            json=payload,
            params=params if params else None,
        )
        
        # Log response (with redacted content)
        logger.info(f"Gemini API response: {response.status_code} {response.reason_phrase}")
        
        if response.status_code >= 400:
            # Log error response (redacted)
            try:
                error_data = response.json()
                redacted_error = json.dumps(error_data, indent=2)
                # Redact any potential API key exposure
                if api_key and api_key in redacted_error:
                    redacted_error = redacted_error.replace(api_key, "[REDACTED]")
                logger.error(f"Gemini API error response: {redacted_error}")
            except:
                logger.error(f"Gemini API error response (non-JSON): {response.text[:500]}")
        else:
            # Log successful response (redacted)
            try:
                response_data = response.json()
                redacted_response = response_data.copy()
                # Redact long text in response
                if "candidates" in redacted_response:
                    for candidate in redacted_response.get("candidates", []):
                        if "content" in candidate and "parts" in candidate["content"]:
                            for part in candidate["content"]["parts"]:
                                if "text" in part:
                                    part["text"] = _redact_long_text(part["text"], max_length=200)
                logger.debug(f"Response data (redacted): {json.dumps(redacted_response, indent=2)}")
            except:
                logger.debug(f"Response (non-JSON): {_redact_long_text(response.text, max_length=500)}")
        
        return response


async def call_gemini_api(
    prompt: str,
    model: str = "gemini-pro",
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> str:
    """
    Call Gemini API using HTTP REST interface.
    
    Supports two authentication methods:
    1. API Key (GEMINI_API_KEY) - Simple, recommended for most cases
    2. Service Account (GOOGLE_APPLICATION_CREDENTIALS) - Advanced, for Cloud Run/Anthos
    
    Args:
        prompt: The prompt text to send to Gemini
        model: The Gemini model to use (default: "gemini-pro")
        temperature: Sampling temperature (0.0 to 1.0)
        max_tokens: Maximum tokens to generate
    
    Returns:
        The generated text response from Gemini
    
    Raises:
        ValueError: If API key or credentials are not configured
        httpx.HTTPStatusError: If API request fails
        Exception: For other errors
    """
    # Check for API key or service account credentials
    api_key = settings.GEMINI_API_KEY.strip() if settings.GEMINI_API_KEY else ""
    access_token = None
    
    # Try to get service account token if available (advanced)
    if not api_key:
        logger.info("GEMINI_API_KEY not configured, attempting service account authentication...")
        access_token = _get_auth_token()
        if not access_token:
            raise ValueError(
                "GEMINI_API_KEY is not configured and service account credentials are not available. "
                "Please set GEMINI_API_KEY in backend/env.txt or configure GOOGLE_APPLICATION_CREDENTIALS."
            )
    
    # Sanitize prompt text (limit length to prevent abuse)
    prompt = sanitize_text(prompt, MAX_TEXT_LENGTH * 2)  # Allow longer prompts for AI
    
    # Construct the Gemini API endpoint
    # Use v1beta for compatibility (v1 may not have all models)
    base_url = "https://generativelanguage.googleapis.com"
    endpoint = f"/v1beta/models/{model}:generateContent"
    url = f"{base_url}{endpoint}"
    
    # Prepare request body
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        }
    }
    
    # Make the HTTP request using isolated helper function
    try:
        response = await _make_gemini_http_request(
            url=url,
            payload=payload,
            api_key=api_key if api_key else None,
            access_token=access_token,
        )
        
        response.raise_for_status()
        
        # Parse the response
        data = response.json()
        
        # Extract text from Gemini response
        # Response structure: {"candidates": [{"content": {"parts": [{"text": "..."}]}}]}
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0 and "text" in parts[0]:
                    result_text = parts[0]["text"]
                    logger.info(f"Successfully received response from Gemini API ({len(result_text)} chars)")
                    return result_text
        
        # Fallback: try to extract text from response
        if "text" in data:
            result_text = data["text"]
            logger.info(f"Successfully received response from Gemini API ({len(result_text)} chars)")
            return result_text
        
        # If no text found, return error message
        logger.error(f"Unexpected response format: {json.dumps(data)}")
        raise ValueError(f"Unexpected response format: {json.dumps(data)}")
        
    except httpx.HTTPStatusError as e:
        error_detail = "API request failed"
        try:
            error_data = e.response.json()
            error_detail = error_data.get("error", {}).get("message", "API request failed")
            # Never expose API key in error messages
            if api_key and api_key in error_detail:
                error_detail = error_detail.replace(api_key, "[REDACTED]")
            if access_token and access_token in error_detail:
                error_detail = error_detail.replace(access_token, "[REDACTED]")
        except:
            # Don't expose response details that might contain API key
            error_detail = f"HTTP {e.response.status_code}"
        logger.error(f"Gemini API HTTP error: {error_detail}")
        raise Exception(f"Gemini API error: {error_detail}")
    except httpx.RequestError as e:
        # Don't expose connection details or API key
        error_str = str(e)
        if api_key and api_key in error_str:
            error_str = error_str.replace(api_key, "[REDACTED]")
        if access_token and access_token in error_str:
            error_str = error_str.replace(access_token, "[REDACTED]")
        # Redact any potential API key in URLs
        import re
        error_str = re.sub(r'[?&]key=[^&\s]+', '?key=[REDACTED]', error_str)
        logger.error(f"Gemini API network error: {error_str}")
        raise Exception(f"Network error: Unable to connect to AI service")
    except Exception as e:
        # Don't expose internal error details
        error_msg = str(e)
        # Never expose API key or token - check multiple patterns
        if api_key:
            error_msg = error_msg.replace(api_key, "[REDACTED]")
            if len(api_key) > 10:
                partial_key = api_key[:10]
                if partial_key in error_msg:
                    error_msg = error_msg.replace(partial_key, "[REDACTED]")
        if access_token:
            error_msg = error_msg.replace(access_token, "[REDACTED]")
        # Redact any potential API key in URLs
        import re
        error_msg = re.sub(r'[?&]key=[^&\s]+', '?key=[REDACTED]', error_msg)
        logger.error(f"Gemini API error: {error_msg}")
        raise Exception(f"Error calling Gemini API: {error_msg}")


def build_prompt_for_task(
    task: str,
    source_text: str,
    role: Optional[str] = None,
    level: Optional[str] = None,
    job_desc: Optional[str] = None,
    count: int = 1,
) -> str:
    """
    Build a prompt for Gemini based on the task type.
    
    Args:
        task: Task type (bullet, summary, skills, rewrite)
        source_text: Source text to improve
        role: Job role/title (optional)
        level: Experience level (optional)
        job_desc: Job description (optional)
        count: Number of suggestions to generate
    
    Returns:
        Formatted prompt string
    """
    # Sanitize inputs before building prompt
    source_text = sanitize_text(source_text, MAX_TEXT_LENGTH)
    role = sanitize_text(role, MAX_SHORT_TEXT_LENGTH) if role else None
    level = sanitize_text(level, 20) if level else None
    job_desc = sanitize_text(job_desc, MAX_TEXT_LENGTH) if job_desc else None
    count = max(1, min(10, count))  # Ensure count is between 1-10
    
    prompts = {
        "bullet": f"""Convert the following job responsibility into {count} concise STAR-style bullet points. 
Each bullet should start with an action verb, include specific metrics/numbers where possible, and be achievement-focused.

Responsibility:
{source_text}

{f"Job Role: {role}" if role else ""}
{f"Experience Level: {level}" if level else ""}
{f"Job Description Context: {job_desc}" if job_desc else ""}

Generate {count} bullet points, one per line, without numbering or bullets:""",

        "summary": f"""Write a professional {count}-sentence summary for a resume based on the following information.

{f"Role: {role}" if role else ""}
{f"Experience Level: {level}" if level else ""}
{source_text}

{f"Job Description: {job_desc}" if job_desc else ""}

Generate a concise professional summary that highlights key skills and experience:""",

        "skills": f"""Categorize and suggest skills based on the following information.

{source_text}

{f"Job Role: {role}" if role else ""}
{f"Experience Level: {level}" if level else ""}
{f"Job Description: {job_desc}" if job_desc else ""}

Generate {count} relevant skills, one per line, organized by category if applicable:""",

        "rewrite": f"""Improve the grammar, tone, and clarity of the following text while maintaining its meaning.

{source_text}

{f"Job Description Context: {job_desc}" if job_desc else ""}

Rewrite the text to be more professional and clear:""",
    }
    
    return prompts.get(task, f"Improve the following text:\n\n{source_text}")


async def generate_suggestions(
    task: str,
    source_text: str,
    role: Optional[str] = None,
    level: Optional[str] = None,
    job_desc: Optional[str] = None,
    count: int = 1,
) -> List[str]:
    """
    Generate suggestions using Gemini API.
    
    Args:
        task: Task type (bullet, summary, skills, rewrite)
        source_text: Source text to improve
        role: Job role/title (optional)
        level: Experience level (optional)
        job_desc: Job description (optional)
        count: Number of suggestions to generate
    
    Returns:
        List of suggestion strings
    """
    # Build the prompt
    prompt = build_prompt_for_task(task, source_text, role, level, job_desc, count)
    
    # Call Gemini API
    response_text = await call_gemini_api(prompt, temperature=0.7, max_tokens=2048)
    
    # Parse response into list of suggestions
    # Split by newlines and clean up
    suggestions = [
        line.strip()
        for line in response_text.split("\n")
        if line.strip() and not line.strip().startswith("#")
    ]
    
    # Remove common prefixes like "- ", "* ", "1. ", etc.
    cleaned_suggestions = []
    for suggestion in suggestions:
        # Remove leading bullet points, numbers, etc.
        cleaned = suggestion.lstrip("- *•1234567890. )")
        cleaned = cleaned.strip()
        # Sanitize each suggestion before adding
        if cleaned:
            cleaned = sanitize_text(cleaned, MAX_TEXT_LENGTH)
            if cleaned:
                cleaned_suggestions.append(cleaned)
    
    # Limit to requested count and ensure we have at least one suggestion
    result = cleaned_suggestions[:count] if cleaned_suggestions else [sanitize_text(response_text.strip(), MAX_TEXT_LENGTH)]
    return result if result else [sanitize_text("Unable to generate suggestions. Please try again.", MAX_TEXT_LENGTH)]

