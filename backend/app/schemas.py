"""Pydantic schemas for request/response models."""
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
import re
from app.utils import sanitize_text, sanitize_url, MAX_TEXT_LENGTH, MAX_SHORT_TEXT_LENGTH


# ============================================================================
# Personal Information Schema
# ============================================================================

class Personal(BaseModel):
    """Personal information schema matching frontend."""
    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
    )
    
    firstName: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="First name")
    lastName: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Last name")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, max_length=50, description="Phone number")
    location: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Location")
    website: Optional[str] = Field(None, max_length=2048, description="Website URL")
    linkedin: Optional[str] = Field(None, max_length=2048, description="LinkedIn URL")
    github: Optional[str] = Field(None, max_length=2048, description="GitHub URL")

    @field_validator('firstName', 'lastName', 'phone', 'location', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)

    @field_validator('website', 'linkedin', 'github', mode='before')
    @classmethod
    def validate_url_or_empty(cls, v):
        """Allow empty string or valid URL."""
        if v == '' or v is None:
            return None
        sanitized = sanitize_url(str(v))
        if sanitized is None:
            raise ValueError('URL must start with http:// or https:// and be valid')
        return sanitized


# ============================================================================
# Experience Schema
# ============================================================================

class Experience(BaseModel):
    """Work experience schema matching frontend."""
    id: str = Field(..., min_length=1, max_length=100, description="Unique identifier")
    company: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Company name")
    position: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Job position/title")
    location: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Job location")
    startDate: Optional[str] = Field(None, max_length=20, description="Start date")
    endDate: Optional[str] = Field(None, max_length=20, description="End date")
    current: bool = Field(False, description="Currently working here")
    description: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Job description")

    @field_validator('company', 'position', 'location', 'startDate', 'endDate', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)

    @field_validator('description', mode='before')
    @classmethod
    def sanitize_description(cls, v):
        """Sanitize description field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)

    @model_validator(mode='after')
    def validate_dates(self):
        """Validate that endDate is set if not current."""
        if not self.current and not self.endDate:
            # This is allowed, but might want to warn
            pass
        return self


# ============================================================================
# Education Schema
# ============================================================================

class Education(BaseModel):
    """Education schema matching frontend."""
    id: str = Field(..., min_length=1, max_length=100, description="Unique identifier")
    institution: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Institution name")
    degree: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Degree name")
    field: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Field of study")
    location: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Location")
    startDate: Optional[str] = Field(None, max_length=20, description="Start date")
    endDate: Optional[str] = Field(None, max_length=20, description="End date")
    gpa: Optional[str] = Field(None, max_length=20, description="GPA")

    @field_validator('institution', 'degree', 'field', 'location', 'startDate', 'endDate', 'gpa', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)


# ============================================================================
# Skills Schema
# ============================================================================

class Skill(BaseModel):
    """Skill schema matching frontend."""
    id: str = Field(..., min_length=1, max_length=100, description="Unique identifier")
    name: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Skill name")
    category: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Skill category")

    @field_validator('name', 'category', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)


# ============================================================================
# Projects Schema
# ============================================================================

class Project(BaseModel):
    """Project schema matching frontend."""
    id: str = Field(..., min_length=1, max_length=100, description="Unique identifier")
    name: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Project name")
    description: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Project description")
    technologies: List[str] = Field(default_factory=list, description="Technologies used")
    url: Optional[str] = Field(None, max_length=2048, description="Project URL")
    github: Optional[str] = Field(None, max_length=2048, description="GitHub URL")

    @field_validator('name', mode='before')
    @classmethod
    def sanitize_name(cls, v):
        """Sanitize name field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)

    @field_validator('description', mode='before')
    @classmethod
    def sanitize_description(cls, v):
        """Sanitize description field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)

    @field_validator('technologies', mode='before')
    @classmethod
    def sanitize_technologies(cls, v):
        """Sanitize technologies list."""
        if not v:
            return []
        return [sanitize_text(str(item), MAX_SHORT_TEXT_LENGTH) for item in v if item]

    @field_validator('url', 'github', mode='before')
    @classmethod
    def validate_url_or_empty(cls, v):
        """Allow empty string or valid URL."""
        if v == '' or v is None:
            return None
        sanitized = sanitize_url(str(v))
        if sanitized is None:
            raise ValueError('URL must start with http:// or https:// and be valid')
        return sanitized


# ============================================================================
# Achievements Schema
# ============================================================================

class Achievement(BaseModel):
    """Achievement schema matching frontend."""
    id: str = Field(..., min_length=1, max_length=100, description="Unique identifier")
    title: str = Field(..., min_length=1, max_length=MAX_SHORT_TEXT_LENGTH, description="Achievement title")
    description: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Achievement description")
    date: Optional[str] = Field(None, max_length=20, description="Achievement date")

    @field_validator('title', 'date', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_SHORT_TEXT_LENGTH)

    @field_validator('description', mode='before')
    @classmethod
    def sanitize_description(cls, v):
        """Sanitize description field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)


# ============================================================================
# Extras Schema
# ============================================================================

class Extras(BaseModel):
    """Extra information schema matching frontend."""
    languages: List[str] = Field(default_factory=list, description="Languages")
    certifications: List[str] = Field(default_factory=list, description="Certifications")
    interests: List[str] = Field(default_factory=list, description="Interests")

    @field_validator('languages', 'certifications', 'interests', mode='before')
    @classmethod
    def sanitize_list_fields(cls, v):
        """Sanitize list fields."""
        if not v:
            return []
        return [sanitize_text(str(item), MAX_SHORT_TEXT_LENGTH) for item in v if item]


# ============================================================================
# Resume Schema
# ============================================================================

class Resume(BaseModel):
    """Complete resume schema matching frontend zod schema."""
    personal: Personal = Field(..., description="Personal information")
    summary: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Professional summary")
    experience: List[Experience] = Field(default_factory=list, description="Work experience")
    education: List[Education] = Field(default_factory=list, description="Education")
    skills: List[Skill] = Field(default_factory=list, description="Skills")
    projects: List[Project] = Field(default_factory=list, description="Projects")
    achievements: List[Achievement] = Field(default_factory=list, description="Achievements")
    extras: Extras = Field(default_factory=Extras, description="Extra information")

    @field_validator('summary', mode='before')
    @classmethod
    def sanitize_summary(cls, v):
        """Sanitize summary field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)


# ============================================================================
# Resume CRUD Schemas
# ============================================================================

class ResumeCreate(Resume):
    """Resume creation schema."""
    pass


class ResumeResponse(Resume):
    """Resume response schema with database fields."""
    id: Optional[str] = Field(None, description="Database ID")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Update timestamp")


# ============================================================================
# Suggestion Schemas
# ============================================================================

class SuggestRequest(BaseModel):
    """Request schema for AI-powered suggestions."""
    task: str = Field(..., min_length=1, max_length=50, description="Task type (e.g., 'summary', 'bullet', 'description')")
    role: Optional[str] = Field(None, max_length=MAX_SHORT_TEXT_LENGTH, description="Job role/title")
    level: Optional[str] = Field(None, max_length=20, description="Experience level (e.g., 'junior', 'senior', 'mid')")
    sourceText: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH, description="Source text to improve")
    jobDesc: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Job description for context")
    count: int = Field(1, ge=1, le=10, description="Number of suggestions to generate")

    @field_validator('sourceText', 'jobDesc', 'role', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        max_len = MAX_TEXT_LENGTH if isinstance(v, str) and len(v) > MAX_SHORT_TEXT_LENGTH else MAX_SHORT_TEXT_LENGTH
        return sanitize_text(str(v), max_len)

    @field_validator('task')
    @classmethod
    def validate_task(cls, v):
        """Validate task type."""
        if not v or not isinstance(v, str):
            raise ValueError('Task must be a non-empty string')
        v = sanitize_text(str(v), 50).lower()
        valid_tasks = ['summary', 'bullet', 'skills', 'rewrite', 'achievement']
        if v not in valid_tasks:
            raise ValueError(f'Task must be one of: {", ".join(valid_tasks)}')
        return v

    @field_validator('level', mode='before')
    @classmethod
    def validate_level(cls, v):
        """Validate experience level."""
        if v is None:
            return None
        valid_levels = ['junior', 'mid', 'senior', 'entry', 'intern']
        if v.lower() not in valid_levels:
            raise ValueError(f'Level must be one of: {", ".join(valid_levels)}')
        return v.lower()


class SuggestResponse(BaseModel):
    """Response schema for suggestions."""
    suggestions: List[str] = Field(..., description="List of suggestions")


# ============================================================================
# ATS Schemas
# ============================================================================

class ATSRequest(BaseModel):
    """Request schema for ATS analysis."""
    resume: Resume = Field(..., description="Resume to analyze")
    jobDesc: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Job description for comparison")

    @field_validator('jobDesc', mode='before')
    @classmethod
    def sanitize_job_desc(cls, v):
        """Sanitize job description field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)

    @model_validator(mode='after')
    def validate_job_desc(self):
        """Validate that job description is provided for ATS analysis."""
        if not self.jobDesc or self.jobDesc.strip() == '':
            # Allow it to be optional, but warn
            pass
        return self


class ATSResponse(BaseModel):
    """Response schema for ATS analysis."""
    score: int = Field(..., ge=0, le=100, description="ATS score (0-100)")
    breakdown: Dict[str, Any] = Field(
        default_factory=dict,
        description="Score breakdown by category"
    )
    tips: List[str] = Field(default_factory=list, description="Improvement tips")

    @field_validator('breakdown')
    @classmethod
    def validate_breakdown(cls, v):
        """Ensure breakdown is a valid dictionary."""
        if not isinstance(v, dict):
            raise ValueError('Breakdown must be a dictionary')
        return v


# ============================================================================
# Legacy/Backward Compatibility Schemas
# ============================================================================

# Alias for backward compatibility
PersonalInfo = Personal

# Legacy ATS schemas (for backward compatibility)
class ATSScoreRequest(BaseModel):
    """Legacy ATS score request schema."""
    model_config = ConfigDict(
        populate_by_name=True,
    )
    
    resume: Resume = Field(..., description="Resume to analyze")
    job_description: Optional[str] = Field(None, description="Job description for comparison")


class ATSScoreResponse(BaseModel):
    """Legacy ATS score response schema."""
    score: float = Field(..., ge=0.0, le=100.0)
    feedback: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


# Legacy Suggestion schemas (for backward compatibility)
class SuggestionRequest(BaseModel):
    """Legacy suggestion request schema."""
    text: str = Field(..., min_length=1)
    context: Optional[str] = None
    type: Optional[str] = None


class SuggestionResponse(BaseModel):
    """Legacy suggestion response schema."""
    suggestions: List[str] = Field(default_factory=list)


# ============================================================================
# Interview Questions Schemas
# ============================================================================

class InterviewQuestion(BaseModel):
    """Single interview question with suggested answer."""
    question: str = Field(..., min_length=1, max_length=500, description="Interview question")
    suggested_answer: str = Field(..., min_length=1, max_length=2000, description="Suggested answer")
    category: str = Field(..., description="Question category (technical or behavioral)")

    @field_validator('question', 'suggested_answer', mode='before')
    @classmethod
    def sanitize_text_fields(cls, v):
        """Sanitize text fields."""
        if v is None:
            return None
        max_len = 2000 if len(str(v)) > 500 else 500
        return sanitize_text(str(v), max_len)


class InterviewQuestionsRequest(BaseModel):
    """Request schema for interview questions generation."""
    resume: Resume = Field(..., description="Resume for generating questions")
    jobDesc: Optional[str] = Field(None, max_length=MAX_TEXT_LENGTH, description="Job description for targeted questions")
    numTechQuestions: int = Field(5, ge=1, le=20, description="Number of technical questions to generate")
    numBehavioralQuestions: int = Field(5, ge=1, le=20, description="Number of behavioral questions to generate")

    @field_validator('jobDesc', mode='before')
    @classmethod
    def sanitize_job_desc(cls, v):
        """Sanitize job description field."""
        if v is None:
            return None
        return sanitize_text(str(v), MAX_TEXT_LENGTH)


class InterviewQuestionsResponse(BaseModel):
    """Response schema for interview questions."""
    technical_questions: List[InterviewQuestion] = Field(default_factory=list, description="Technical questions")
    behavioral_questions: List[InterviewQuestion] = Field(default_factory=list, description="Behavioral questions")
