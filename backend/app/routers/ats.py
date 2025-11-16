"""ATS (Applicant Tracking System) router for resume analysis."""
import re
from typing import List, Set, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.schemas import ATSRequest, ATSResponse, Resume, Experience, Achievement
from app.utils_parse import parse_resume_file

router = APIRouter()


# ============================================================================
# Configuration Constants - Adjust these to tune scoring algorithm
# ============================================================================

# Scoring weights (must sum to 1.0)
WEIGHT_KEYWORDS = 0.35  # Keyword overlap with job description
WEIGHT_VERBS = 0.15     # Action verb usage
WEIGHT_METRICS = 0.20   # Quantitative metrics (numbers, percentages)
WEIGHT_SECTIONS = 0.15  # Required sections presence
WEIGHT_EXPERIENCE = 0.15  # Experience quality and completeness

# Keyword matching thresholds
KEYWORD_MIN_LENGTH = 3  # Minimum keyword length
KEYWORD_MATCH_RATIO_THRESHOLD = 0.3  # Minimum ratio of matched keywords to total keywords

# Action verbs (common resume action verbs)
ACTION_VERBS = {
    'achieved', 'acted', 'adapted', 'administered', 'advanced', 'advised', 'allocated',
    'analyzed', 'applied', 'appointed', 'approved', 'architected', 'assembled', 'assessed',
    'assigned', 'attained', 'authored', 'automated', 'balanced', 'built', 'calculated',
    'catalyzed', 'championed', 'changed', 'clarified', 'closed', 'coached', 'collaborated',
    'collected', 'communicated', 'completed', 'composed', 'computed', 'conceived',
    'conducted', 'configured', 'consolidated', 'constructed', 'consulted', 'contracted',
    'contributed', 'controlled', 'converted', 'coordinated', 'created', 'critiqued',
    'customized', 'decreased', 'delegated', 'delivered', 'demonstrated', 'designed',
    'determined', 'developed', 'devised', 'directed', 'discovered', 'distributed',
    'dramatized', 'drove', 'earned', 'edited', 'educated', 'elected', 'elicited',
    'eliminated', 'emphasized', 'employed', 'enabled', 'enforced', 'engineered',
    'enhanced', 'enlarged', 'enlisted', 'ensured', 'established', 'evaluated',
    'examined', 'exceeded', 'executed', 'expanded', 'expedited', 'experimented',
    'explained', 'explored', 'exported', 'extracted', 'facilitated', 'fashioned',
    'focused', 'forecasted', 'formed', 'formulated', 'fostered', 'founded',
    'generated', 'governed', 'grouped', 'guided', 'headed', 'helped', 'hired',
    'honed', 'hosted', 'hypothesized', 'identified', 'illustrated', 'implemented',
    'improved', 'increased', 'influenced', 'informed', 'initiated', 'innovated',
    'inspected', 'inspired', 'installed', 'instituted', 'instructed', 'integrated',
    'interpreted', 'interviewed', 'introduced', 'invented', 'investigated', 'invited',
    'involved', 'joined', 'judged', 'justified', 'launched', 'led', 'lectured',
    'lobbied', 'located', 'logged', 'maintained', 'managed', 'manipulated', 'mapped',
    'marketed', 'mastered', 'matched', 'maximized', 'measured', 'mediated', 'merged',
    'minimized', 'modeled', 'moderated', 'modernized', 'modified', 'monitored',
    'motivated', 'moved', 'named', 'navigated', 'negotiated', 'nominated', 'operated',
    'optimized', 'orchestrated', 'organized', 'originated', 'overhauled', 'oversaw',
    'participated', 'partnered', 'performed', 'persuaded', 'pioneered', 'planned',
    'positioned', 'prepared', 'presented', 'presided', 'prioritized', 'processed',
    'produced', 'programmed', 'projected', 'promoted', 'proposed', 'proved', 'provided',
    'publicized', 'published', 'purchased', 'pursued', 'qualified', 'quantified',
    'questioned', 'raised', 'ran', 'ranked', 'rated', 'realized', 'received',
    'recognized', 'recommended', 'reconciled', 'recorded', 'recruited', 'redesigned',
    'reduced', 'referred', 'refined', 'regulated', 'reinforced', 'rejected', 'related',
    'remedied', 'remodeled', 'reorganized', 'repaired', 'replaced', 'reported',
    'represented', 'researched', 'resolved', 'responded', 'restored', 'restructured',
    'retained', 'retrieved', 'revamped', 'reviewed', 'revised', 'revitalized',
    'scheduled', 'secured', 'selected', 'separated', 'served', 'serviced', 'set',
    'shaped', 'shared', 'showed', 'signaled', 'simplified', 'simulated', 'sold',
    'solved', 'sorted', 'sought', 'sparked', 'sponsored', 'standardized', 'started',
    'stimulated', 'stopped', 'strengthened', 'stressed', 'stretched', 'structured',
    'studied', 'submitted', 'substituted', 'succeeded', 'suggested', 'summarized',
    'supervised', 'supplied', 'supported', 'surpassed', 'surveyed', 'sustained',
    'synthesized', 'systematized', 'tabulated', 'tailored', 'taught', 'teamed',
    'terminated', 'tested', 'tightened', 'tolerated', 'touched', 'trained',
    'transcended', 'transferred', 'transformed', 'translated', 'transmitted',
    'traveled', 'treated', 'trimmed', 'tripled', 'troubleshot', 'trusted', 'turned',
    'uncovered', 'understood', 'unified', 'united', 'unveiled', 'updated', 'upgraded',
    'used', 'utilized', 'validated', 'valued', 'verified', 'viewed', 'visited',
    'volunteered', 'waged', 'won', 'worked', 'wrote'
}

# Required sections for a complete resume
REQUIRED_SECTIONS = ['personal', 'experience', 'skills']
OPTIONAL_SECTIONS = ['summary', 'education', 'projects', 'achievements']

# Minimum number of action verbs expected in experience section
MIN_ACTION_VERBS = 3

# Minimum number of quantitative metrics expected
MIN_METRICS = 2

# Scoring thresholds
SCORE_EXCELLENT = 80
SCORE_GOOD = 60
SCORE_FAIR = 40


# ============================================================================
# Helper Functions
# ============================================================================

def extract_keywords(text: str) -> Set[str]:
    """Extract keywords from text (non-stop words, minimum length)."""
    if not text:
        return set()
    
    # Convert to lowercase and split into words
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())
    
    # Common stop words to exclude
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
        'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
        'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
        'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
        'now'
    }
    
    # Filter out stop words and short words
    keywords = {w for w in words if w not in stop_words and len(w) >= KEYWORD_MIN_LENGTH}
    return keywords


def count_action_verbs(text: str) -> int:
    """Count action verbs in text."""
    if not text:
        return 0
    
    words = re.findall(r'\b[a-z]+\b', text.lower())
    verb_count = sum(1 for word in words if word in ACTION_VERBS)
    return verb_count


def count_quantitative_metrics(text: str) -> int:
    """Count quantitative metrics (numbers, percentages) in text."""
    if not text:
        return 0
    
    # Match numbers (integers, decimals, percentages, ratios)
    patterns = [
        r'\d+%',  # Percentages
        r'\$\d+(?:,\d{3})*(?:\.\d+)?',  # Currency
        r'\d+(?:\.\d+)?[x×]',  # Multipliers (2x, 3.5x)
        r'\d+(?:\.\d+)?\s*(?:million|billion|thousand|k|M|B)',  # Large numbers
        r'\d+(?:\.\d+)?\s*(?:years?|months?|weeks?|days?)',  # Time periods
        r'\d+(?:\.\d+)?\s*(?:people|users|customers|clients|team|employees)',  # Counts
        r'\d+(?:\.\d+)?\s*(?:points?|units?|items?|projects?|features?)',  # Counts
        r'\d+\/\d+',  # Ratios
        r'\d+(?:\.\d+)?%',  # Percentages (alternative)
    ]
    
    metric_count = 0
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        metric_count += len(matches)
    
    # Also count standalone numbers that might be metrics (3+ digits or decimals)
    standalone_numbers = re.findall(r'\b\d{3,}\b|\b\d+\.\d+\b', text)
    metric_count += len(standalone_numbers)
    
    return metric_count


def calculate_keyword_score(resume_text: str, job_desc: str) -> Dict[str, Any]:
    """Calculate keyword overlap score between resume and job description."""
    if not job_desc:
        return {
            'score': 50,  # Neutral score when no job description
            'matched_keywords': [],
            'missing_keywords': [],
            'total_keywords': 0,
            'matched_count': 0
        }
    
    # Extract keywords from job description and resume
    job_keywords = extract_keywords(job_desc)
    resume_keywords = extract_keywords(resume_text)
    
    # Find matched and missing keywords
    matched_keywords = job_keywords.intersection(resume_keywords)
    missing_keywords = job_keywords - resume_keywords
    
    # Calculate score based on match ratio
    total_keywords = len(job_keywords)
    matched_count = len(matched_keywords)
    
    if total_keywords == 0:
        score = 50  # Neutral score
    else:
        match_ratio = matched_count / total_keywords
        # Score ranges from 0-100 based on match ratio
        score = int(match_ratio * 100)
    
    return {
        'score': score,
        'matched_keywords': list(matched_keywords)[:10],  # Limit to 10 for response
        'missing_keywords': list(missing_keywords)[:10],
        'total_keywords': total_keywords,
        'matched_count': matched_count
    }


def calculate_verbs_score(resume: Resume) -> Dict[str, Any]:
    """Calculate action verb usage score."""
    # Collect text from experience and achievements
    experience_text = ' '.join([
        (exp.description or '') + ' ' + exp.position
        for exp in resume.experience
    ])
    
    achievements_text = ' '.join([
        (ach.description or '') + ' ' + ach.title
        for ach in resume.achievements
    ])
    
    all_text = experience_text + ' ' + achievements_text
    
    # Count action verbs
    verb_count = count_action_verbs(all_text)
    
    # Calculate score (0-100) based on verb count
    # More verbs = better score, capped at 100
    if verb_count >= MIN_ACTION_VERBS * 3:
        score = 100
    elif verb_count >= MIN_ACTION_VERBS * 2:
        score = 80
    elif verb_count >= MIN_ACTION_VERBS:
        score = 60
    elif verb_count > 0:
        score = 40
    else:
        score = 20
    
    return {
        'score': score,
        'verb_count': verb_count,
        'recommended_min': MIN_ACTION_VERBS
    }


def calculate_metrics_score(resume: Resume) -> Dict[str, Any]:
    """Calculate quantitative metrics score."""
    # Collect text from experience, achievements, and projects
    experience_text = ' '.join([
        exp.description or ''
        for exp in resume.experience
    ])
    
    achievements_text = ' '.join([
        ach.description or ''
        for ach in resume.achievements
    ])
    
    projects_text = ' '.join([
        proj.description or ''
        for proj in resume.projects
    ])
    
    all_text = experience_text + ' ' + achievements_text + ' ' + projects_text
    
    # Count metrics
    metric_count = count_quantitative_metrics(all_text)
    
    # Calculate score (0-100) based on metric count
    if metric_count >= MIN_METRICS * 3:
        score = 100
    elif metric_count >= MIN_METRICS * 2:
        score = 80
    elif metric_count >= MIN_METRICS:
        score = 60
    elif metric_count > 0:
        score = 40
    else:
        score = 20
    
    return {
        'score': score,
        'metric_count': metric_count,
        'recommended_min': MIN_METRICS
    }


def calculate_sections_score(resume: Resume) -> Dict[str, Any]:
    """Calculate sections presence score."""
    sections_present = {
        'personal': bool(resume.personal),
        'summary': bool(resume.summary),
        'experience': len(resume.experience) > 0,
        'education': len(resume.education) > 0,
        'skills': len(resume.skills) > 0,
        'projects': len(resume.projects) > 0,
        'achievements': len(resume.achievements) > 0,
    }
    
    # Count required sections
    required_count = sum(1 for section in REQUIRED_SECTIONS if sections_present[section])
    required_total = len(REQUIRED_SECTIONS)
    
    # Count optional sections
    optional_count = sum(1 for section in OPTIONAL_SECTIONS if sections_present[section])
    optional_total = len(OPTIONAL_SECTIONS)
    
    # Calculate score
    # Required sections are weighted 70%, optional sections 30%
    required_score = (required_count / required_total) * 70 if required_total > 0 else 0
    optional_score = (optional_count / optional_total) * 30 if optional_total > 0 else 0
    score = int(required_score + optional_score)
    
    return {
        'score': score,
        'sections_present': sections_present,
        'required_count': required_count,
        'required_total': required_total,
        'optional_count': optional_count,
        'optional_total': optional_total
    }


def calculate_experience_score(resume: Resume) -> Dict[str, Any]:
    """Calculate experience quality score."""
    if not resume.experience:
        return {
            'score': 0,
            'experience_count': 0,
            'has_descriptions': False,
            'has_dates': False
        }
    
    experience_count = len(resume.experience)
    has_descriptions = sum(1 for exp in resume.experience if exp.description) > 0
    has_dates = sum(1 for exp in resume.experience if exp.startDate) > 0
    
    # Calculate score based on completeness
    score = 0
    if experience_count > 0:
        score += 30  # Base score for having experience
    if has_descriptions:
        score += 35  # Descriptions are important
    if has_dates:
        score += 20  # Dates add credibility
    if experience_count >= 3:
        score += 15  # Multiple experiences are better
    
    return {
        'score': min(100, score),
        'experience_count': experience_count,
        'has_descriptions': has_descriptions,
        'has_dates': has_dates
    }


def generate_tips(
    keyword_result: Dict[str, Any],
    verbs_result: Dict[str, Any],
    metrics_result: Dict[str, Any],
    sections_result: Dict[str, Any],
    experience_result: Dict[str, Any],
    job_desc: str
) -> List[str]:
    """Generate improvement tips based on scoring results."""
    tips = []
    
    # Keyword tips
    if keyword_result['score'] < 60 and job_desc:
        missing_keywords = keyword_result.get('missing_keywords', [])
        if missing_keywords:
            tips.append(f"Add these keywords from the job description: {', '.join(missing_keywords[:5])}")
        else:
            tips.append("Improve keyword matching with the job description")
    
    # Verb tips
    if verbs_result['score'] < 60:
        tips.append(f"Use more action verbs in your experience section (found {verbs_result['verb_count']}, recommended: {verbs_result['recommended_min']}+)")
        tips.append("Start bullet points with action verbs like 'achieved', 'developed', 'managed', 'led'")
    
    # Metrics tips
    if metrics_result['score'] < 60:
        tips.append(f"Add quantitative metrics to your resume (found {metrics_result['metric_count']}, recommended: {metrics_result['recommended_min']}+)")
        tips.append("Include numbers, percentages, and specific achievements (e.g., 'increased sales by 30%', 'managed team of 5')")
    
    # Sections tips
    if sections_result['score'] < 70:
        missing_required = [s for s in REQUIRED_SECTIONS if not sections_result['sections_present'][s]]
        if missing_required:
            tips.append(f"Add missing required sections: {', '.join(missing_required)}")
        
        # Suggest optional sections
        missing_optional = [s for s in OPTIONAL_SECTIONS if not sections_result['sections_present'][s]]
        if missing_optional:
            tips.append(f"Consider adding: {', '.join(missing_optional[:2])}")
    
    # Experience tips
    if experience_result['score'] < 60:
        if not experience_result['has_descriptions']:
            tips.append("Add detailed descriptions to your work experience")
        if not experience_result['has_dates']:
            tips.append("Include dates for your work experience")
        if experience_result['experience_count'] < 2:
            tips.append("Add more work experience entries if available")
    
    # General tips based on overall score
    if not tips:
        tips.append("Your resume looks good! Consider adding more specific achievements and metrics.")
    
    return tips


# ============================================================================
# API Endpoints
# ============================================================================

@router.post("/score", response_model=ATSResponse)
async def get_ats_score(request: ATSRequest):
    """
    Analyze resume against job description and provide ATS score.
    
    This endpoint calculates an ATS score based on:
    - Keyword overlap with job description (35%)
    - Action verb usage (15%)
    - Quantitative metrics (20%)
    - Sections presence (15%)
    - Experience quality (15%)
    """
    resume = request.resume
    job_desc = request.jobDesc or ""
    
    # Combine resume text for keyword matching
    resume_text_parts = [
        resume.personal.firstName + ' ' + resume.personal.lastName,
        resume.summary or '',
        ' '.join([exp.position + ' ' + (exp.description or '') for exp in resume.experience]),
        ' '.join([edu.degree + ' ' + (edu.field or '') for edu in resume.education]),
        ' '.join([skill.name for skill in resume.skills]),
        ' '.join([proj.name + ' ' + (proj.description or '') for proj in resume.projects]),
        ' '.join([ach.title + ' ' + (ach.description or '') for ach in resume.achievements]),
    ]
    resume_text = ' '.join(resume_text_parts)
    
    # Calculate individual scores
    keyword_result = calculate_keyword_score(resume_text, job_desc)
    verbs_result = calculate_verbs_score(resume)
    metrics_result = calculate_metrics_score(resume)
    sections_result = calculate_sections_score(resume)
    experience_result = calculate_experience_score(resume)
    
    # Calculate weighted overall score
    overall_score = int(
        keyword_result['score'] * WEIGHT_KEYWORDS +
        verbs_result['score'] * WEIGHT_VERBS +
        metrics_result['score'] * WEIGHT_METRICS +
        sections_result['score'] * WEIGHT_SECTIONS +
        experience_result['score'] * WEIGHT_EXPERIENCE
    )
    
    # Ensure score is between 0-100
    overall_score = max(0, min(100, overall_score))
    
    # Build breakdown
    breakdown = {
        'keywords': keyword_result['score'],
        'verbs': verbs_result['score'],
        'metrics': metrics_result['score'],
        'sections': sections_result['score'],
        'experience': experience_result['score'],
        'details': {
            'keywords': {
                'matched_count': keyword_result['matched_count'],
                'total_keywords': keyword_result['total_keywords'],
                'missing_keywords': keyword_result['missing_keywords'][:5]
            },
            'verbs': {
                'count': verbs_result['verb_count'],
                'recommended': verbs_result['recommended_min']
            },
            'metrics': {
                'count': metrics_result['metric_count'],
                'recommended': metrics_result['recommended_min']
            },
            'sections': sections_result['sections_present'],
            'experience': {
                'count': experience_result['experience_count'],
                'has_descriptions': experience_result['has_descriptions'],
                'has_dates': experience_result['has_dates']
            }
        }
    }
    
    # Generate tips
    tips = generate_tips(
        keyword_result,
        verbs_result,
        metrics_result,
        sections_result,
        experience_result,
        job_desc
    )
    
    return ATSResponse(
        score=overall_score,
        breakdown=breakdown,
        tips=tips
    )


@router.post("/analyze", response_model=ATSResponse)
async def analyze_resume(request: ATSRequest):
    """Detailed resume analysis (alias for /score)."""
    return await get_ats_score(request)


@router.post("/score-file", response_model=ATSResponse)
async def get_ats_score_from_file(
    file: UploadFile = File(...),
    jobDesc: Optional[str] = Form(None)
):
    """
    Analyze resume from uploaded file against job description and provide ATS score.
    
    Accepts PDF or DOCX files. Extracts text from the file and analyzes it.
    """
    # Validate file type
    allowed_types = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'pdf',
        'docx',
        'doc'
    ]
    
    file_type = file.content_type or ''
    file_ext = file.filename.split('.')[-1].lower() if file.filename else ''
    
    if file_type not in allowed_types and file_ext not in ['pdf', 'docx', 'doc']:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload a PDF or DOCX file."
        )
    
    # Validate file size (max 5MB)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5MB"
        )
    
    # Parse file
    try:
        resume_text = await parse_resume_file(file_content, file_type or file_ext)
        if not resume_text or len(resume_text.strip()) < 100:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from the file. Please ensure the file contains selectable text."
            )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse file: {str(e)}"
        )
    
    # For file-based analysis, we'll analyze the text directly
    # Since we don't have structured Resume object, we'll score based on text analysis
    job_desc = jobDesc or ""
    
    # Calculate keyword score
    keyword_result = calculate_keyword_score(resume_text, job_desc)
    
    # Calculate verb score from text
    verb_count = count_action_verbs(resume_text)
    if verb_count >= MIN_ACTION_VERBS * 3:
        verbs_score = 100
    elif verb_count >= MIN_ACTION_VERBS * 2:
        verbs_score = 80
    elif verb_count >= MIN_ACTION_VERBS:
        verbs_score = 60
    elif verb_count > 0:
        verbs_score = 40
    else:
        verbs_score = 20
    
    # Calculate metrics score
    metric_count = count_quantitative_metrics(resume_text)
    if metric_count >= MIN_METRICS * 3:
        metrics_score = 100
    elif metric_count >= MIN_METRICS * 2:
        metrics_score = 80
    elif metric_count >= MIN_METRICS:
        metrics_score = 60
    elif metric_count > 0:
        metrics_score = 40
    else:
        metrics_score = 20
    
    # For file-based, we'll estimate sections score
    sections_present = {
        'personal': bool(re.search(r'\b(email|phone|contact)\b', resume_text, re.I)),
        'experience': bool(re.search(r'\b(experience|work|employment)\b', resume_text, re.I)),
        'education': bool(re.search(r'\b(education|degree|university|college)\b', resume_text, re.I)),
        'skills': bool(re.search(r'\b(skills|competencies|technologies)\b', resume_text, re.I)),
    }
    sections_score = sum([
        4 if sections_present.get('personal') else 0,
        6 if sections_present.get('experience') else 0,
        4 if sections_present.get('education') else 0,
        4 if sections_present.get('skills') else 0,
    ])
    
    # Experience score based on text
    has_experience = sections_present.get('experience', False)
    experience_score = 50 if has_experience else 0
    if has_experience and verb_count >= MIN_ACTION_VERBS:
        experience_score += 30
    if metric_count >= MIN_METRICS:
        experience_score += 20
    experience_score = min(100, experience_score)
    
    # Calculate weighted overall score
    overall_score = int(
        keyword_result['score'] * WEIGHT_KEYWORDS +
        verbs_score * WEIGHT_VERBS +
        metrics_score * WEIGHT_METRICS +
        sections_score * WEIGHT_SECTIONS +
        experience_score * WEIGHT_EXPERIENCE
    )
    overall_score = max(0, min(100, overall_score))
    
    # Build breakdown
    breakdown = {
        'keywords': keyword_result['score'],
        'verbs': verbs_score,
        'metrics': metrics_score,
        'sections': sections_score,
        'experience': experience_score,
        'details': {
            'keywords': {
                'matched_count': keyword_result['matched_count'],
                'total_keywords': keyword_result['total_keywords'],
                'missing_keywords': keyword_result['missing_keywords'][:5]
            },
            'verbs': {
                'count': verb_count,
                'recommended': MIN_ACTION_VERBS
            },
            'metrics': {
                'count': metric_count,
                'recommended': MIN_METRICS
            },
            'sections': sections_present,
            'experience': {
                'count': 1 if has_experience else 0,
                'has_descriptions': has_experience,
                'has_dates': bool(re.search(r'\d{4}', resume_text))
            }
        }
    }
    
    # Generate tips
    tips = []
    if keyword_result['score'] < 60 and job_desc:
        missing = keyword_result.get('missing_keywords', [])
        if missing:
            tips.append(f"Add these keywords: {', '.join(missing[:5])}")
    
    if verbs_score < 60:
        tips.append(f"Use more action verbs (found {verb_count}, recommended: {MIN_ACTION_VERBS}+)")
        tips.append("Start bullet points with action verbs like 'Developed', 'Managed', 'Led'")
    
    if metrics_score < 60:
        tips.append(f"Add quantitative metrics (found {metric_count}, recommended: {MIN_METRICS}+)")
        tips.append("Include numbers, percentages, and specific achievements")
    
    if sections_score < 15:
        missing = [k for k, v in sections_present.items() if not v]
        if missing:
            tips.append(f"Ensure these sections are clearly labeled: {', '.join(missing)}")
    
    if not tips:
        tips.append("Your resume looks good! Consider adding more specific achievements and metrics.")
    
    return ATSResponse(
        score=overall_score,
        breakdown=breakdown,
        tips=tips
    )
