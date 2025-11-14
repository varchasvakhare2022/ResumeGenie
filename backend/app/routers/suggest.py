"""Suggestion router for AI-powered resume suggestions."""
from fastapi import APIRouter, HTTPException, Request
from app.schemas import SuggestRequest, SuggestResponse
from app.config import settings
from app.gemini_client import generate_suggestions
from app.rate_limiter import rate_limiter
from typing import List


router = APIRouter()


def get_client_ip(http_request: Request) -> str:
    """Extract client IP address from request."""
    # Check for forwarded IP (if behind proxy)
    forwarded_for = http_request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP in the chain
        return forwarded_for.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = http_request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct client IP
    if http_request.client:
        return http_request.client.host
    
    return "unknown"


@router.post("/", response_model=SuggestResponse)
async def get_suggestions(request: SuggestRequest, http_request: Request):
    """
    Get AI-powered suggestions for resume content.
    
    This endpoint uses Gemini API to generate suggestions for improving
    resume content based on the task type.
    
    - bullet: Convert responsibility to 2-4 STAR-style bullets
    - summary: Generate 2-3 line summary tailored to role/level
    - skills: Return categorized skills
    - rewrite: Grammar/tone improvement
    """
    # Check if Gemini API key is configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
        raise HTTPException(
            status_code=503,
            detail=(
                "AI service is currently unavailable. "
                "Please configure GEMINI_API_KEY in your environment variables. "
                "See backend/README_ENV.md for setup instructions."
            )
        )
    
    # Rate limiting per IP (async)
    client_ip = get_client_ip(http_request)
    is_allowed, remaining = await rate_limiter.is_allowed(client_ip)
    
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Rate limit exceeded. "
                f"Limit: {rate_limiter.max_requests} requests per {rate_limiter.window_seconds} seconds. "
                f"Please try again later."
            )
        )
    
    try:
        # Generate suggestions using Gemini API
        suggestions = await generate_suggestions(
            task=request.task,
            source_text=request.sourceText,
            role=request.role,
            level=request.level,
            job_desc=request.jobDesc,
            count=request.count,
        )
        
        # Ensure we have at least one suggestion
        if not suggestions:
            suggestions = [
                "Unable to generate suggestions. Please try again or refine your input."
            ]
        
        return SuggestResponse(suggestions=suggestions)
        
    except ValueError as e:
        # Configuration errors (e.g., missing API key)
        error_msg = str(e)
        # Never expose API key in error messages
        if "GEMINI_API_KEY" in error_msg or "API key" in error_msg:
            error_msg = "AI service configuration error. Please contact support."
        raise HTTPException(
            status_code=503,
            detail=f"Service configuration error: {error_msg}"
        )
    except Exception as e:
        # API errors or other exceptions
        error_message = str(e)
        
        # Never expose API key in error messages
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in error_message:
            error_message = error_message.replace(settings.GEMINI_API_KEY, "[REDACTED]")
        
        # Check for specific error types
        if "Gemini API error" in error_message or "API" in error_message:
            # Gemini API returned an error - don't expose internal details
            raise HTTPException(
                status_code=503,
                detail="AI service is currently unavailable. Please try again later."
            )
        elif "Network error" in error_message or "connection" in error_message.lower():
            # Network/connection error
            raise HTTPException(
                status_code=503,
                detail="Unable to connect to AI service. Please try again later."
            )
        else:
            # Unknown error - don't expose internal details
            raise HTTPException(
                status_code=500,
                detail="An error occurred while processing your request. Please try again later."
            )


@router.post("/summary", response_model=SuggestResponse)
async def suggest_summary(request: SuggestRequest, http_request: Request):
    """Generate summary suggestions."""
    # Force task to summary
    request.task = "summary"
    return await get_suggestions(request, http_request)


@router.post("/bullet", response_model=SuggestResponse)
async def suggest_bullet_points(request: SuggestRequest, http_request: Request):
    """Generate bullet point suggestions."""
    # Force task to bullet
    request.task = "bullet"
    return await get_suggestions(request, http_request)
