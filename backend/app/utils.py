"""Utility functions for sanitization and validation."""
import re
from typing import Any, Dict, Optional
from html import escape


# Maximum lengths for text fields
MAX_TEXT_LENGTH = 10000  # Maximum length for long text fields (descriptions, summaries)
MAX_SHORT_TEXT_LENGTH = 500  # Maximum length for short text fields (names, titles)
MAX_URL_LENGTH = 2048  # Maximum length for URLs


def sanitize_text(text: str, max_length: int = MAX_TEXT_LENGTH) -> str:
    """
    Sanitize text by trimming whitespace and limiting length.
    
    Args:
        text: Text to sanitize
        max_length: Maximum allowed length
    
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Trim whitespace
    text = text.strip()
    
    # Limit length
    if len(text) > max_length:
        text = text[:max_length]
    
    # Remove null bytes and control characters (except newlines and tabs)
    text = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F]', '', text)
    
    return text


def sanitize_url(url: str) -> Optional[str]:
    """
    Sanitize URL by validating format and limiting length.
    
    Args:
        url: URL to sanitize
    
    Returns:
        Sanitized URL or None if invalid
    """
    if not url or not url.strip():
        return None
    
    url = url.strip()
    
    # Limit length
    if len(url) > MAX_URL_LENGTH:
        return None
    
    # Validate URL format (basic check)
    if not url.startswith(('http://', 'https://')):
        return None
    
    # Remove null bytes and control characters
    url = re.sub(r'[\x00-\x1F]', '', url)
    
    return url


def sanitize_resume_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitize resume data dictionary recursively.
    
    Args:
        data: Resume data dictionary
    
    Returns:
        Sanitized resume data dictionary
    """
    sanitized = {}
    
    for key, value in data.items():
        if isinstance(value, str):
            # Sanitize strings based on field type
            if key in ['summary', 'description']:
                sanitized[key] = sanitize_text(value, MAX_TEXT_LENGTH)
            elif key in ['url', 'website', 'linkedin', 'github', 'url']:
                sanitized[key] = sanitize_url(value)
            else:
                sanitized[key] = sanitize_text(value, MAX_SHORT_TEXT_LENGTH)
        elif isinstance(value, list):
            # Sanitize list items
            sanitized[key] = [
                sanitize_resume_data(item) if isinstance(item, dict)
                else sanitize_text(item, MAX_SHORT_TEXT_LENGTH) if isinstance(item, str)
                else item
                for item in value
            ]
        elif isinstance(value, dict):
            # Recursively sanitize nested dictionaries
            sanitized[key] = sanitize_resume_data(value)
        else:
            # Keep other types as-is
            sanitized[key] = value
    
    return sanitized


def validate_text_length(text: str, max_length: int = MAX_TEXT_LENGTH, field_name: str = "field") -> str:
    """
    Validate and sanitize text length.
    
    Args:
        text: Text to validate
        max_length: Maximum allowed length
        field_name: Name of the field for error messages
    
    Returns:
        Sanitized text
    
    Raises:
        ValueError: If text exceeds maximum length
    """
    if not text:
        return ""
    
    text = sanitize_text(text, max_length)
    
    if len(text) > max_length:
        raise ValueError(f"{field_name} exceeds maximum length of {max_length} characters")
    
    return text

