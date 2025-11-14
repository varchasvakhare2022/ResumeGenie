"""Tests for Pydantic schema parsing and validation."""
import pytest
from pydantic import ValidationError
from app.schemas import (
    Personal,
    Experience,
    Education,
    Skill,
    Project,
    Achievement,
    Extras,
    Resume,
    SuggestRequest,
    ATSRequest,
    ATSResponse,
)


class TestPersonal:
    """Tests for Personal schema."""
    
    def test_valid_personal(self):
        """Test valid personal information."""
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1 (555) 123-4567",
            "location": "San Francisco, CA",
            "website": "https://johndoe.dev",
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe",
        }
        personal = Personal(**data)
        assert personal.firstName == "John"
        assert personal.lastName == "Doe"
        assert personal.email == "john.doe@example.com"
        assert personal.phone == "+1 (555) 123-4567"
    
    def test_personal_missing_required_fields(self):
        """Test personal with missing required fields."""
        with pytest.raises(ValidationError):
            Personal(firstName="John")  # Missing lastName and email
    
    def test_personal_invalid_email(self):
        """Test personal with invalid email."""
        with pytest.raises(ValidationError):
            Personal(
                firstName="John",
                lastName="Doe",
                email="invalid-email"
            )
    
    def test_personal_invalid_url(self):
        """Test personal with invalid URL."""
        with pytest.raises(ValidationError):
            Personal(
                firstName="John",
                lastName="Doe",
                email="john@example.com",
                website="not-a-url"
            )
    
    def test_personal_empty_url(self):
        """Test personal with empty URL (should be allowed)."""
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "website": "",
            "linkedin": "",
            "github": "",
        }
        personal = Personal(**data)
        assert personal.website is None
        assert personal.linkedin is None
        assert personal.github is None
    
    def test_personal_text_sanitization(self):
        """Test that text fields are sanitized."""
        data = {
            "firstName": "  John  ",
            "lastName": "  Doe  ",
            "email": "john@example.com",
            "location": "  San Francisco  ",
        }
        personal = Personal(**data)
        assert personal.firstName == "John"
        assert personal.lastName == "Doe"
        assert personal.location == "San Francisco"


class TestExperience:
    """Tests for Experience schema."""
    
    def test_valid_experience(self):
        """Test valid experience entry."""
        data = {
            "id": "exp-1",
            "company": "Tech Corp",
            "position": "Software Engineer",
            "location": "San Francisco, CA",
            "startDate": "2021-01",
            "endDate": "2023-12",
            "current": False,
            "description": "Developed web applications",
        }
        exp = Experience(**data)
        assert exp.company == "Tech Corp"
        assert exp.position == "Software Engineer"
        assert exp.current is False
    
    def test_experience_missing_required_fields(self):
        """Test experience with missing required fields."""
        with pytest.raises(ValidationError):
            Experience(id="exp-1", company="Tech Corp")  # Missing position
    
    def test_experience_current_position(self):
        """Test experience with current position."""
        data = {
            "id": "exp-1",
            "company": "Tech Corp",
            "position": "Software Engineer",
            "startDate": "2021-01",
            "current": True,
        }
        exp = Experience(**data)
        assert exp.current is True
        assert exp.endDate is None or exp.endDate == ""


class TestEducation:
    """Tests for Education schema."""
    
    def test_valid_education(self):
        """Test valid education entry."""
        data = {
            "id": "edu-1",
            "institution": "University of California",
            "degree": "Bachelor of Science",
            "field": "Computer Science",
            "location": "Berkeley, CA",
            "startDate": "2015-09",
            "endDate": "2019-05",
            "gpa": "3.8",
        }
        edu = Education(**data)
        assert edu.institution == "University of California"
        assert edu.degree == "Bachelor of Science"
        assert edu.gpa == "3.8"


class TestSkill:
    """Tests for Skill schema."""
    
    def test_valid_skill(self):
        """Test valid skill entry."""
        data = {
            "id": "skill-1",
            "name": "JavaScript",
            "category": "Programming Languages",
        }
        skill = Skill(**data)
        assert skill.name == "JavaScript"
        assert skill.category == "Programming Languages"
    
    def test_skill_without_category(self):
        """Test skill without category (optional)."""
        data = {
            "id": "skill-1",
            "name": "JavaScript",
        }
        skill = Skill(**data)
        assert skill.name == "JavaScript"
        assert skill.category is None


class TestProject:
    """Tests for Project schema."""
    
    def test_valid_project(self):
        """Test valid project entry."""
        data = {
            "id": "proj-1",
            "name": "E-Commerce Platform",
            "description": "Built a full-stack e-commerce platform",
            "technologies": ["React", "Node.js", "MongoDB"],
            "url": "https://example.com/project",
            "github": "https://github.com/user/project",
        }
        project = Project(**data)
        assert project.name == "E-Commerce Platform"
        assert len(project.technologies) == 3
        assert project.url == "https://example.com/project"


class TestResume:
    """Tests for Resume schema."""
    
    def test_valid_resume(self):
        """Test valid resume."""
        data = {
            "personal": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john@example.com",
            },
            "summary": "Experienced software engineer",
            "experience": [
                {
                    "id": "exp-1",
                    "company": "Tech Corp",
                    "position": "Software Engineer",
                }
            ],
            "education": [],
            "skills": [],
            "projects": [],
            "achievements": [],
            "extras": {
                "languages": [],
                "certifications": [],
                "interests": [],
            },
        }
        resume = Resume(**data)
        assert resume.personal.firstName == "John"
        assert resume.summary == "Experienced software engineer"
        assert len(resume.experience) == 1
    
    def test_resume_missing_personal(self):
        """Test resume with missing personal information."""
        with pytest.raises(ValidationError):
            Resume(
                summary="Test summary",
                experience=[],
                education=[],
                skills=[],
                projects=[],
                achievements=[],
                extras={"languages": [], "certifications": [], "interests": []},
            )
    
    def test_resume_text_length_limits(self):
        """Test that text fields respect length limits."""
        from app.utils import MAX_TEXT_LENGTH, MAX_SHORT_TEXT_LENGTH
        
        # Test summary length limit
        long_summary = "a" * (MAX_TEXT_LENGTH + 100)
        data = {
            "personal": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john@example.com",
            },
            "summary": long_summary,
        }
        resume = Resume(**data)
        assert len(resume.summary) <= MAX_TEXT_LENGTH


class TestSuggestRequest:
    """Tests for SuggestRequest schema."""
    
    def test_valid_suggest_request(self):
        """Test valid suggestion request."""
        data = {
            "task": "bullet",
            "role": "Software Engineer",
            "level": "senior",
            "sourceText": "Developed web applications",
            "jobDesc": "Looking for a senior software engineer",
            "count": 3,
        }
        request = SuggestRequest(**data)
        assert request.task == "bullet"
        assert request.role == "Software Engineer"
        assert request.level == "senior"
        assert request.count == 3
    
    def test_suggest_request_invalid_task(self):
        """Test suggestion request with invalid task."""
        with pytest.raises(ValidationError):
            SuggestRequest(
                task="invalid_task",
                sourceText="Test text",
                count=1,
            )
    
    def test_suggest_request_invalid_level(self):
        """Test suggestion request with invalid level."""
        with pytest.raises(ValidationError):
            SuggestRequest(
                task="bullet",
                sourceText="Test text",
                level="invalid_level",
                count=1,
            )
    
    def test_suggest_request_count_limits(self):
        """Test suggestion request count limits."""
        # Count too high
        with pytest.raises(ValidationError):
            SuggestRequest(
                task="bullet",
                sourceText="Test text",
                count=20,  # Max is 10
            )
        
        # Count too low
        with pytest.raises(ValidationError):
            SuggestRequest(
                task="bullet",
                sourceText="Test text",
                count=0,  # Min is 1
            )


class TestATSRequest:
    """Tests for ATSRequest schema."""
    
    def test_valid_ats_request(self):
        """Test valid ATS request."""
        resume_data = {
            "personal": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john@example.com",
            },
            "summary": "Experienced engineer",
            "experience": [],
            "education": [],
            "skills": [],
            "projects": [],
            "achievements": [],
            "extras": {"languages": [], "certifications": [], "interests": []},
        }
        resume = Resume(**resume_data)
        data = {
            "resume": resume.model_dump(),
            "jobDesc": "Looking for a software engineer",
        }
        request = ATSRequest(**data)
        assert request.resume.personal.firstName == "John"
        assert request.jobDesc == "Looking for a software engineer"


class TestATSResponse:
    """Tests for ATSResponse schema."""
    
    def test_valid_ats_response(self):
        """Test valid ATS response."""
        data = {
            "score": 85,
            "breakdown": {
                "keywords": 90,
                "verbs": 80,
                "metrics": 75,
                "sections": 100,
                "experience": 85,
            },
            "tips": [
                "Add more keywords",
                "Include more metrics",
            ],
        }
        response = ATSResponse(**data)
        assert response.score == 85
        assert len(response.tips) == 2
    
    def test_ats_response_score_limits(self):
        """Test ATS response score limits."""
        # Score too high
        with pytest.raises(ValidationError):
            ATSResponse(
                score=150,  # Max is 100
                breakdown={},
                tips=[],
            )
        
        # Score too low
        with pytest.raises(ValidationError):
            ATSResponse(
                score=-10,  # Min is 0
                breakdown={},
                tips=[],
            )

