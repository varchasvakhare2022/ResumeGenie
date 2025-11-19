"""Interview questions router for generating interview questions based on resume and job description."""
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from app.schemas import (
    InterviewQuestionsRequest,
    InterviewQuestionsResponse,
    InterviewQuestion,
    Resume
)
from app.config import settings
from app.gemini_client import call_gemini_api
from app.rate_limiter import rate_limiter
from app.utils_parse import parse_resume_file
from typing import List
import json
import re
import logging

router = APIRouter()


def get_client_ip(http_request: Request) -> str:
    """Extract client IP address from request."""
    forwarded_for = http_request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = http_request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    if http_request.client:
        return http_request.client.host
    
    return "unknown"


def build_resume_summary(resume: Resume) -> str:
    """Build a summary of the resume for prompt generation."""
    parts = []
    
    # Personal info
    if resume.personal:
        parts.append(f"Name: {resume.personal.firstName} {resume.personal.lastName}")
        if resume.personal.location:
            parts.append(f"Location: {resume.personal.location}")
    
    # Summary
    if resume.summary:
        parts.append(f"\nProfessional Summary:\n{resume.summary}")
    
    # Experience
    if resume.experience:
        parts.append("\nWork Experience:")
        for exp in resume.experience:
            exp_text = f"- {exp.position} at {exp.company}"
            if exp.startDate:
                exp_text += f" ({exp.startDate} - {exp.endDate if exp.endDate else 'Present'})"
            if exp.description:
                exp_text += f"\n  {exp.description}"
            parts.append(exp_text)
    
    # Education
    if resume.education:
        parts.append("\nEducation:")
        for edu in resume.education:
            edu_text = f"- {edu.degree}"
            if edu.field:
                edu_text += f" in {edu.field}"
            edu_text += f" from {edu.institution}"
            if edu.endDate:
                edu_text += f" ({edu.endDate})"
            parts.append(edu_text)
    
    # Skills
    if resume.skills:
        skill_names = [skill.name for skill in resume.skills]
        parts.append(f"\nSkills: {', '.join(skill_names)}")
    
    # Projects
    if resume.projects:
        parts.append("\nProjects:")
        for proj in resume.projects:
            proj_text = f"- {proj.name}"
            if proj.description:
                proj_text += f": {proj.description}"
            if proj.technologies:
                proj_text += f"\n  Technologies: {', '.join(proj.technologies)}"
            parts.append(proj_text)
    
    # Achievements
    if resume.achievements:
        parts.append("\nAchievements:")
        for ach in resume.achievements:
            ach_text = f"- {ach.title}"
            if ach.description:
                ach_text += f": {ach.description}"
            parts.append(ach_text)
    
    return "\n".join(parts)


async def generate_technical_questions(
    resume_summary: str,
    job_desc: str,
    count: int
) -> List[InterviewQuestion]:
    """Generate technical interview questions."""
    job_section = ("No specific job description provided. Generate general technical questions based on the resume."
                   if not job_desc else "Job Description:\n" + job_desc)
    prompt = f"""You are an expert technical interviewer. Based on the COMPLETE resume content and job description provided below, generate EXACTLY {count} technical interview questions that would be asked for this position.

IMPORTANT: Use ALL information from the resume including:
- All technologies, frameworks, and tools mentioned
- All projects and their descriptions
- All work experience and achievements
- All skills and certifications
- Any other relevant technical details

Complete Resume Content:
{resume_summary}

{job_section}

Generate EXACTLY {count} technical questions that:
1. Test knowledge of ALL technologies, frameworks, and tools mentioned in the resume
2. Assess problem-solving abilities based on projects and experience described
3. Evaluate technical depth and understanding relevant to the candidate's background
4. Are specifically relevant to the position described in the job description
5. Range from fundamental to advanced concepts appropriate for the candidate's experience level
6. Reference specific projects, technologies, or experiences from the resume when relevant

For each question, provide:
1. The question itself
2. A detailed suggested answer (2-3 paragraphs) that demonstrates expertise

Format your response as a JSON array with this structure:
[
  {{
    "question": "Question text here",
    "suggested_answer": "Detailed answer here (2-3 paragraphs explaining the concept, implementation, and best practices)",
    "category": "technical"
  }}
]

Return ONLY the JSON array, no additional text before or after."""

    try:
        logger = logging.getLogger(__name__)
        logger.info(f"Generating {count} technical questions. Resume length: {len(resume_summary)} chars, Job desc length: {len(job_desc)} chars")
        
        response = await call_gemini_api(
            prompt=prompt,
            temperature=0.7,
            max_tokens=8000  # Increased to allow for more detailed questions and answers
        )
        
        logger.info(f"Received response from Gemini API. Response length: {len(response) if response else 0} chars")
        logger.debug(f"Response preview (first 500 chars): {response[:500] if response else 'None'}")
        
        # Check if response is empty or None
        if not response or not response.strip():
            logger.error("Empty response from AI service")
            raise Exception("Empty response from AI service")
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                questions_data = json.loads(json_str)
                logger.info(f"Successfully parsed JSON. Found {len(questions_data)} questions in response")
            except json.JSONDecodeError as e:
                # If JSON parsing fails, log and fall through to text parsing
                logger.warning(f"Failed to parse JSON from response: {e}. Response preview: {response[:200]}")
                json_match = None  # Force fallback to text parsing
            
            if json_match:  # Only if JSON was successfully parsed
                questions = []
                for q_data in questions_data:
                    if isinstance(q_data, dict) and 'question' in q_data and 'suggested_answer' in q_data:
                        questions.append(InterviewQuestion(
                            question=q_data['question'],
                            suggested_answer=q_data['suggested_answer'],
                            category='technical'
                        ))
                
                logger.info(f"Successfully created {len(questions)} technical questions")
                return questions[:count] if questions else []
        
        # Fallback: try to parse as plain text
        logger.info("Attempting to parse response as plain text (JSON parsing failed or no JSON found)")
        lines = [line.strip() for line in response.split('\n') if line.strip()]
        questions = []
        current_question = None
        current_answer = []
        
        for line in lines:
            if line.startswith('Q:') or line.startswith('Question:'):
                if current_question:
                    questions.append(InterviewQuestion(
                        question=current_question,
                        suggested_answer=' '.join(current_answer),
                        category='technical'
                    ))
                current_question = line.replace('Q:', '').replace('Question:', '').strip()
                current_answer = []
            elif line.startswith('A:') or line.startswith('Answer:'):
                current_answer.append(line.replace('A:', '').replace('Answer:', '').strip())
            elif current_question:
                current_answer.append(line)
        
        if current_question:
            questions.append(InterviewQuestion(
                question=current_question,
                suggested_answer=' '.join(current_answer) if current_answer else "Answer based on your experience.",
                category='technical'
            ))
        
        logger.info(f"Parsed {len(questions)} questions from text format")
        if not questions:
            logger.warning(f"No questions extracted. Full response: {response[:1000]}")
        
        return questions[:count] if questions else []
            
    except Exception as e:
        raise Exception(f"Failed to generate technical questions: {str(e)}")


async def generate_behavioral_questions(
    resume_summary: str,
    job_desc: str,
    count: int
) -> List[InterviewQuestion]:
    """Generate behavioral interview questions."""
    job_section = ("No specific job description provided. Generate general behavioral questions based on the resume."
                   if not job_desc else "Job Description:\n" + job_desc)
    prompt = f"""You are an expert behavioral interviewer. Based on the COMPLETE resume content and job description provided below, generate EXACTLY {count} behavioral interview questions using the STAR method (Situation, Task, Action, Result).

IMPORTANT: Use ALL information from the resume including:
- All work experience and roles
- All projects and achievements
- All leadership and collaboration experiences
- All challenges overcome and results achieved
- Any other relevant experiences that demonstrate soft skills

Complete Resume Content:
{resume_summary}

{job_section}

Generate EXACTLY {count} behavioral questions that:
1. Are based on common STAR interview questions (teamwork, leadership, problem-solving, conflict resolution, time management, etc.)
2. Are specifically tailored to the candidate's actual experience and background from the resume
3. Would be highly relevant for the position described in the job description
4. Help assess soft skills and cultural fit based on the candidate's demonstrated experience
5. Reference specific experiences, projects, or achievements from the resume when crafting questions

For each question, provide:
1. The question itself
2. A detailed suggested answer that follows the STAR format (Situation, Task, Action, Result) and draws from the resume experience

Format your response as a JSON array with this structure:
[
  {{
    "question": "Question text here",
    "suggested_answer": "STAR-format answer here (Situation: context, Task: goal, Action: what you did, Result: outcome and impact)",
    "category": "behavioral"
  }}
]

Return ONLY the JSON array, no additional text before or after."""

    try:
        logger = logging.getLogger(__name__)
        logger.info(f"Generating {count} behavioral questions. Resume length: {len(resume_summary)} chars, Job desc length: {len(job_desc)} chars")
        
        response = await call_gemini_api(
            prompt=prompt,
            temperature=0.7,
            max_tokens=8000  # Increased to allow for more detailed questions and answers
        )
        
        logger.info(f"Received response from Gemini API. Response length: {len(response) if response else 0} chars")
        logger.debug(f"Response preview (first 500 chars): {response[:500] if response else 'None'}")
        
        # Check if response is empty or None
        if not response or not response.strip():
            logger.error("Empty response from AI service")
            raise Exception("Empty response from AI service")
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                questions_data = json.loads(json_str)
                logger.info(f"Successfully parsed JSON. Found {len(questions_data)} questions in response")
            except json.JSONDecodeError as e:
                # If JSON parsing fails, log and fall through to text parsing
                logger.warning(f"Failed to parse JSON from response: {e}. Response preview: {response[:200]}")
                json_match = None  # Force fallback to text parsing
            
            if json_match:  # Only if JSON was successfully parsed
                questions = []
                for q_data in questions_data:
                    if isinstance(q_data, dict) and 'question' in q_data and 'suggested_answer' in q_data:
                        questions.append(InterviewQuestion(
                            question=q_data['question'],
                            suggested_answer=q_data['suggested_answer'],
                            category='behavioral'
                        ))
                
                logger.info(f"Successfully created {len(questions)} behavioral questions")
                return questions[:count] if questions else []
        
        # Fallback: try to parse as plain text
        logger.info("Attempting to parse response as plain text (JSON parsing failed or no JSON found)")
        lines = [line.strip() for line in response.split('\n') if line.strip()]
        questions = []
        current_question = None
        current_answer = []
        
        for line in lines:
            if line.startswith('Q:') or line.startswith('Question:'):
                if current_question:
                    questions.append(InterviewQuestion(
                        question=current_question,
                        suggested_answer=' '.join(current_answer),
                        category='behavioral'
                    ))
                current_question = line.replace('Q:', '').replace('Question:', '').strip()
                current_answer = []
            elif line.startswith('A:') or line.startswith('Answer:'):
                current_answer.append(line.replace('A:', '').replace('Answer:', '').strip())
            elif current_question:
                current_answer.append(line)
        
        if current_question:
            questions.append(InterviewQuestion(
                question=current_question,
                suggested_answer=' '.join(current_answer) if current_answer else "Use the STAR method: describe a Situation, Task, Action, and Result from your experience.",
                category='behavioral'
            ))
        
        logger.info(f"Parsed {len(questions)} questions from text format")
        if not questions:
            logger.warning(f"No questions extracted. Full response: {response[:1000]}")
        
        return questions[:count] if questions else []
            
    except Exception as e:
        raise Exception(f"Failed to generate behavioral questions: {str(e)}")


@router.post("/generate", response_model=InterviewQuestionsResponse)
async def generate_interview_questions(
    request: InterviewQuestionsRequest,
    http_request: Request
):
    """
    Generate interview questions (technical and behavioral) based on resume and job description.
    
    This endpoint uses Gemini API to generate:
    - Technical questions based on skills, technologies, and experience
    - Behavioral questions using STAR method based on resume experience
    - Suggested answers for each question
    """
    # Check if Gemini API key is configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
        raise HTTPException(
            status_code=503,
            detail=(
                "AI service is currently unavailable. "
                "Please configure GEMINI_API_KEY in your environment variables."
            )
        )
    
    # Rate limiting
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
        # Build resume summary
        resume_summary = build_resume_summary(request.resume)
        job_desc = request.jobDesc or ""
        
        # Generate technical and behavioral questions
        technical_questions = await generate_technical_questions(
            resume_summary=resume_summary,
            job_desc=job_desc,
            count=request.numTechQuestions
        )
        
        behavioral_questions = await generate_behavioral_questions(
            resume_summary=resume_summary,
            job_desc=job_desc,
            count=request.numBehavioralQuestions
        )
        
        # Ensure we have at least some questions
        if not technical_questions and not behavioral_questions:
            raise HTTPException(
                status_code=500,
                detail="Unable to generate interview questions. Please try again or refine your input."
            )
        
        return InterviewQuestionsResponse(
            technical_questions=technical_questions,
            behavioral_questions=behavioral_questions
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error_message = str(e)
        # Never expose API key
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in error_message:
            error_message = error_message.replace(settings.GEMINI_API_KEY, "[REDACTED]")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while generating questions: {error_message}"
        )


@router.post("/generate-file", response_model=InterviewQuestionsResponse)
async def generate_interview_questions_from_file(
    http_request: Request,
    file: UploadFile = File(...),
    jobDesc: str | None = Form(None),
    numTechQuestions: int = Form(5),
    numBehavioralQuestions: int = Form(5)
):
    """
    Generate interview questions using an uploaded resume file (PDF/DOCX) and optional job description.
    """
    # Check AI availability
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.strip() == "":
        raise HTTPException(
            status_code=503,
            detail=(
                "AI service is currently unavailable. "
                "Please configure GEMINI_API_KEY in your environment variables."
            )
        )

    # Rate limiting
    client_ip = get_client_ip(http_request)
    is_allowed, _remaining = await rate_limiter.is_allowed(client_ip)
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Rate limit exceeded. "
                f"Limit: {rate_limiter.max_requests} requests per {rate_limiter.window_seconds} seconds. "
                f"Please try again later."
            )
        )

    # Validate and read file
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "pdf",
        "docx",
        "doc",
    ]
    file_type = file.content_type or ""
    file_ext = file.filename.split(".")[-1].lower() if file.filename else ""
    if file_type not in allowed_types and file_ext not in ["pdf", "docx", "doc"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or DOCX file.")

    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 5MB")

    # Parse file to text
    try:
        resume_text = await parse_resume_file(file_content, file_type or file_ext)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {str(e)}")

    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Unable to extract sufficient text from the resume file.")

    # Validate question counts
    numTechQuestions = max(1, min(20, numTechQuestions))  # Clamp between 1-20
    numBehavioralQuestions = max(1, min(20, numBehavioralQuestions))  # Clamp between 1-20

    # Build prompts using ALL resume text (increase limit to 20000 chars for comprehensive resumes)
    # Most resumes are under 20000 chars, but we keep a safety cap
    resume_summary = f"Complete Resume Content (all text extracted from file):\n{resume_text[:20000]}"
    if len(resume_text) > 20000:
        resume_summary += f"\n\n[Note: Resume content truncated at 20000 characters. Total length: {len(resume_text)} characters]"
    
    job_desc = (jobDesc or "").strip()

    # Generate questions
    try:
        technical_questions = await generate_technical_questions(
            resume_summary=resume_summary,
            job_desc=job_desc,
            count=numTechQuestions,
        )
        behavioral_questions = await generate_behavioral_questions(
            resume_summary=resume_summary,
            job_desc=job_desc,
            count=numBehavioralQuestions,
        )
        return InterviewQuestionsResponse(
            technical_questions=technical_questions,
            behavioral_questions=behavioral_questions,
        )
    except Exception as e:
        error_message = str(e)
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in error_message:
            error_message = error_message.replace(settings.GEMINI_API_KEY, "[REDACTED]")
        raise HTTPException(status_code=500, detail=f"An error occurred while generating questions: {error_message}")

