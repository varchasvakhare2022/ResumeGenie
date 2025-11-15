"""ATS scoring utilities based on 100-point industry standard system."""
from typing import Dict, List, Any, Set, Optional
import re
from app.schemas import Resume, Experience, Achievement

# ============================================================================
# ATS Scoring Constants (100-point system)
# ============================================================================

# Scoring weights (must sum to 100 points)
POINTS_KEYWORD_MATCH = 40  # Keyword Match Score
POINTS_STRUCTURE = 20      # Resume Structure & Section Presence
POINTS_FORMATTING = 15     # Formatting, Readability & ATS Parsing
POINTS_EXPERIENCE = 10     # Experience Strength
POINTS_EDUCATION = 5       # Education Relevance
POINTS_FILE_OPT = 5        # File Optimization (not scored in API)
POINTS_CONTACT = 5         # Contact Information Quality
POINTS_JOB_RELEVANCE = 10  # Job-Relevance Score

# Action verbs for Experience Strength scoring
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

# Standard section names that ATS expects
STANDARD_SECTIONS = {
    'experience', 'work experience', 'employment', 'employment history',
    'education', 'academic background', 'academic credentials',
    'skills', 'technical skills', 'core competencies', 'competencies',
    'projects', 'project experience', 'selected projects',
    'certifications', 'certificates', 'professional certifications',
    'achievements', 'awards', 'honors', 'recognition',
    'summary', 'professional summary', 'profile summary', 'objective', 'career objective'
}

# Professional email patterns
PROFESSIONAL_EMAIL_DOMAINS = {
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
    'protonmail.com', 'mail.com', 'zoho.com', 'aol.com'
}


# ============================================================================
# Helper Functions
# ============================================================================

def extract_keywords(text: str, min_length: int = 3) -> Set[str]:
    """Extract keywords from text (non-stop words, minimum length)."""
    if not text:
        return set()
    
    # Convert to lowercase and split into words
    words = re.findall(r'\b[a-z]{' + str(min_length) + r',}\b', text.lower())
    
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
        'now', 'than', 'then', 'there', 'their', 'them', 'these', 'they'
    }
    
    # Filter out stop words and short words
    keywords = {w for w in words if w not in stop_words and len(w) >= min_length}
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
    ]
    
    metric_count = 0
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        metric_count += len(matches)
    
    # Also count standalone numbers that might be metrics (3+ digits or decimals)
    standalone_numbers = re.findall(r'\b\d{3,}\b|\b\d+\.\d+\b', text)
    metric_count += len(standalone_numbers)
    
    return metric_count


def validate_email(email: str) -> bool:
    """Validate if email is professional."""
    if not email:
        return False
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False
    
    # Check for professional domain (basic check)
    domain = email.split('@')[1].lower() if '@' in email else ''
    return domain in PROFESSIONAL_EMAIL_DOMAINS or not any(
        unprofessional in email.lower() 
        for unprofessional in ['coolkid', 'awesome', 'l33t', 'hacker', 'ninja', 'pro']
    )


def validate_phone(phone: str) -> bool:
    """Validate phone number format."""
    if not phone:
        return False
    
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    # Check if it's all digits and reasonable length (10-15 digits)
    return cleaned.isdigit() and 10 <= len(cleaned) <= 15


# ============================================================================
# ATS Scoring Functions (100-point system)
# ============================================================================

def score_keyword_match(resume_text: str, job_desc: str) -> Dict[str, Any]:
    """
    Score keyword match (40 points).
    
    Breakdown:
    - Technical skills match: 20 pts
    - Soft skills match: 5 pts
    - Job title alignment: 5 pts
    - Tool/Framework match: 10 pts
    """
    if not job_desc:
        return {
            'score': 20,  # Neutral score when no job description
            'points': 20,
            'max_points': 40,
            'breakdown': {
                'technical_skills': 10,
                'soft_skills': 2,
                'job_title': 2,
                'tools_frameworks': 6
            },
            'matched_keywords': [],
            'missing_keywords': [],
            'suggestions': ['Add a job description to get keyword matching analysis']
        }
    
    # Extract keywords from both
    job_keywords = extract_keywords(job_desc)
    resume_keywords = extract_keywords(resume_text)
    
    # Find matched and missing keywords
    matched_keywords = job_keywords.intersection(resume_keywords)
    missing_keywords = job_keywords - resume_keywords
    
    # Categorize keywords (simple heuristic)
    technical_keywords = matched_keywords.intersection({
        'python', 'javascript', 'java', 'react', 'node', 'sql', 'database',
        'api', 'git', 'docker', 'aws', 'cloud', 'linux', 'machine', 'learning',
        'algorithm', 'data', 'structure', 'backend', 'frontend', 'fullstack',
        'framework', 'library', 'testing', 'deployment', 'cicd', 'kubernetes'
    })
    
    # Calculate scores
    total_keywords = len(job_keywords)
    matched_count = len(matched_keywords)
    
    if total_keywords == 0:
        technical_score = 10
        soft_score = 2
        job_title_score = 2
        tools_score = 6
    else:
        match_ratio = matched_count / total_keywords
        
        # Technical skills (20 pts)
        technical_ratio = len(technical_keywords) / max(1, len(extract_keywords(job_desc).intersection({
            'python', 'javascript', 'java', 'react', 'node', 'sql', 'database',
            'api', 'git', 'docker', 'aws', 'cloud', 'linux', 'machine', 'learning',
            'algorithm', 'data', 'structure', 'backend', 'frontend', 'fullstack',
            'framework', 'library', 'testing', 'deployment', 'cicd', 'kubernetes'
        })))
        technical_score = int(technical_ratio * 20)
        
        # Soft skills (5 pts)
        soft_score = int((match_ratio - technical_ratio * 0.7) * 5)
        soft_score = max(0, soft_score)
        
        # Job title alignment (5 pts) - simplified
        job_title_score = int(match_ratio * 5)
        
        # Tools/Frameworks (10 pts)
        tools_score = int(match_ratio * 10)
    
    total_score = technical_score + soft_score + job_title_score + tools_score
    
    return {
        'score': total_score,
        'points': total_score,
        'max_points': 40,
        'breakdown': {
            'technical_skills': technical_score,
            'soft_skills': soft_score,
            'job_title': job_title_score,
            'tools_frameworks': tools_score
        },
        'matched_keywords': list(matched_keywords)[:15],
        'missing_keywords': list(missing_keywords)[:15],
        'suggestions': [
            f"Add {len(missing_keywords[:10])} missing keywords to improve match",
            "Include technical skills from job description in your skills section",
            "Use keywords naturally in experience descriptions"
        ] if missing_keywords else []
    }


def score_structure_sections(resume: Resume) -> Dict[str, Any]:
    """
    Score structure & section presence (20 points).
    
    Points for each required section:
    - Contact Info: 4 pts
    - Skills section: 4 pts
    - Experience: 6 pts
    - Education: 4 pts
    - Projects/Certifications: 2 pts
    """
    points = 0
    max_points = 20
    
    # Contact Info (4 pts)
    if resume.personal and resume.personal.email and resume.personal.firstName:
        points += 4
    
    # Skills section (4 pts)
    if len(resume.skills) > 0:
        points += 4
    
    # Experience (6 pts)
    if len(resume.experience) > 0:
        points += 6
    
    # Education (4 pts)
    if len(resume.education) > 0:
        points += 4
    
    # Projects/Certifications (2 pts)
    if len(resume.projects) > 0 or len(resume.extras.certifications) > 0:
        points += 2
    
    suggestions = []
    if not resume.personal or not resume.personal.email:
        suggestions.append("Add contact information (email, phone)")
    if len(resume.skills) == 0:
        suggestions.append("Add a Skills section with relevant technologies")
    if len(resume.experience) == 0:
        suggestions.append("Add work Experience section")
    if len(resume.education) == 0:
        suggestions.append("Add Education section")
    if len(resume.projects) == 0 and len(resume.extras.certifications) == 0:
        suggestions.append("Consider adding Projects or Certifications section")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'sections_present': {
            'contact': bool(resume.personal and resume.personal.email),
            'skills': len(resume.skills) > 0,
            'experience': len(resume.experience) > 0,
            'education': len(resume.education) > 0,
            'projects_certs': len(resume.projects) > 0 or len(resume.extras.certifications) > 0
        },
        'suggestions': suggestions
    }


def score_formatting_readability(resume_text: str, resume: Resume) -> Dict[str, Any]:
    """
    Score formatting & readability (15 points).
    
    Points:
    - Simple fonts: 4 pts (assumed if text is parseable)
    - Consistent formatting: 3 pts
    - No text boxes/tables: 4 pts (assumed)
    - PDF with selectable text: 2 pts (not checkable in API)
    - Clear hierarchy: 2 pts
    """
    points = 0
    max_points = 15
    
    # Simple fonts (4 pts) - Assume good if text is readable
    points += 4
    
    # Consistent formatting (3 pts) - Check bullet points consistency
    has_bullets = bool(re.search(r'[•\-\*]\s+', resume_text))
    if has_bullets:
        points += 3
    
    # No text boxes/tables (4 pts) - Assume good if structured
    points += 4
    
    # PDF selectable text (2 pts) - Cannot check in API
    # Always give partial credit
    points += 1
    
    # Clear hierarchy (2 pts) - Check for section headings
    has_sections = bool(re.search(r'\b(experience|education|skills|summary|projects)\b', resume_text, re.I))
    if has_sections:
        points += 1
    
    suggestions = []
    if not has_bullets:
        suggestions.append("Use consistent bullet points (•) in experience descriptions")
    if not has_sections:
        suggestions.append("Ensure section headings are clearly labeled (Experience, Education, Skills)")
    if points < 12:
        suggestions.append("Use simple, ATS-friendly fonts (Roboto, Lato, Calibri, Helvetica)")
        suggestions.append("Avoid text boxes, tables, and columns - use single column layout")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'suggestions': suggestions
    }


def score_experience_strength(resume: Resume) -> Dict[str, Any]:
    """
    Score experience strength (10 points).
    
    Scoring:
    - Internship or job present: 5 pts
    - Action verbs at bullet start: 3 pts
    - Measurable results (% or numbers): 2 pts
    """
    points = 0
    max_points = 10
    
    if len(resume.experience) == 0:
        return {
            'score': 0,
            'points': 0,
            'max_points': max_points,
            'suggestions': ['Add work experience entries']
        }
    
    # Internship or job present (5 pts)
    points += 5
    
    # Collect experience text
    experience_text = ' '.join([
        (exp.description or '') + ' ' + (exp.position or '')
        for exp in resume.experience
    ])
    
    # Action verbs at bullet start (3 pts)
    bullets = re.split(r'[\n\r]', experience_text)
    bullets_with_verbs = sum(1 for bullet in bullets if any(
        bullet.strip().lower().startswith(verb + ' ') 
        for verb in ACTION_VERBS
    ))
    if bullets_with_verbs >= 3:
        points += 3
    elif bullets_with_verbs >= 1:
        points += 2
    else:
        points += 0
    
    # Measurable results (2 pts)
    metric_count = count_quantitative_metrics(experience_text)
    if metric_count >= 2:
        points += 2
    elif metric_count >= 1:
        points += 1
    
    suggestions = []
    if bullets_with_verbs < 3:
        suggestions.append(f"Start more bullet points with action verbs (found {bullets_with_verbs}, need 3+)")
        suggestions.append("Examples: 'Developed...', 'Managed...', 'Improved...', 'Led...'")
    if metric_count < 2:
        suggestions.append(f"Add quantitative metrics with numbers and percentages (found {metric_count}, need 2+)")
        suggestions.append("Examples: 'Increased sales by 30%', 'Managed team of 5', 'Reduced costs by $50K'")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'action_verbs_count': bullets_with_verbs,
        'metrics_count': metric_count,
        'suggestions': suggestions
    }


def score_education_relevance(resume: Resume) -> Dict[str, Any]:
    """
    Score education relevance (5 points).
    
    Scoring:
    - Degree matches job area: 3 pts
    - Recent or still pursuing: 1 pt
    - GPA/percentage added: 1 pt
    """
    points = 0
    max_points = 5
    
    if len(resume.education) == 0:
        return {
            'score': 0,
            'points': 0,
            'max_points': max_points,
            'suggestions': ['Add Education section']
        }
    
    # Degree present (assume relevance - 3 pts)
    points += 3
    
    # Recent or still pursuing (1 pt) - Check dates
    has_recent = any(
        edu.endDate and int(edu.endDate.split('-')[0]) >= 2020 
        for edu in resume.education 
        if edu.endDate
    )
    if has_recent:
        points += 1
    
    # GPA/percentage added (1 pt)
    has_gpa = any(edu.gpa for edu in resume.education)
    if has_gpa:
        points += 1
    
    suggestions = []
    if not has_gpa:
        suggestions.append("Consider adding GPA or percentage if it's strong (above 3.5 or 80%+)")
    if not has_recent:
        suggestions.append("Ensure education dates are included")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'has_gpa': has_gpa,
        'suggestions': suggestions
    }


def score_contact_quality(resume: Resume) -> Dict[str, Any]:
    """
    Score contact information quality (5 points).
    
    Scoring:
    - Professional email: 2 pts
    - Valid phone number format: 2 pts
    - LinkedIn/GitHub links valid: 1 pt
    """
    points = 0
    max_points = 5
    
    if not resume.personal:
        return {
            'score': 0,
            'points': 0,
            'max_points': max_points,
            'suggestions': ['Add contact information']
        }
    
    # Professional email (2 pts)
    if resume.personal.email and validate_email(resume.personal.email):
        points += 2
    
    # Valid phone number format (2 pts)
    if resume.personal.phone and validate_phone(resume.personal.phone):
        points += 2
    
    # LinkedIn/GitHub links valid (1 pt)
    has_valid_links = bool(
        (resume.personal.linkedin and 'linkedin.com' in resume.personal.linkedin) or
        (resume.personal.github and 'github.com' in resume.personal.github)
    )
    if has_valid_links:
        points += 1
    
    suggestions = []
    if not resume.personal.email or not validate_email(resume.personal.email):
        suggestions.append("Use a professional email address (e.g., firstname.lastname@gmail.com)")
    if not resume.personal.phone or not validate_phone(resume.personal.phone):
        suggestions.append("Add a valid phone number in standard format")
    if not has_valid_links:
        suggestions.append("Add LinkedIn profile or GitHub link")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'suggestions': suggestions
    }


def score_job_relevance(resume: Resume, job_desc: str) -> Dict[str, Any]:
    """
    Score job-relevance (10 points).
    
    Checks if skills, projects, and summary align with job expectations.
    """
    if not job_desc:
        return {
            'score': 5,  # Neutral
            'points': 5,
            'max_points': 10,
            'suggestions': ['Add job description for relevance analysis']
        }
    
    points = 0
    max_points = 10
    
    # Extract keywords from job description
    job_keywords = extract_keywords(job_desc, min_length=4)
    
    # Check skills alignment
    skills_text = ' '.join([skill.name for skill in resume.skills])
    skills_keywords = extract_keywords(skills_text)
    skills_match = len(skills_keywords.intersection(job_keywords))
    if skills_match >= 5:
        points += 4
    elif skills_match >= 3:
        points += 3
    elif skills_match >= 1:
        points += 2
    
    # Check projects alignment
    projects_text = ' '.join([proj.name + ' ' + (proj.description or '') for proj in resume.projects])
    projects_keywords = extract_keywords(projects_text)
    projects_match = len(projects_keywords.intersection(job_keywords))
    if projects_match >= 3:
        points += 3
    elif projects_match >= 1:
        points += 2
    
    # Check summary/objective alignment
    summary_keywords = extract_keywords(resume.summary or '')
    summary_match = len(summary_keywords.intersection(job_keywords))
    if summary_match >= 2:
        points += 3
    elif summary_match >= 1:
        points += 2
    
    suggestions = []
    if skills_match < 3:
        suggestions.append("Add more skills from the job description")
    if projects_match < 2:
        suggestions.append("Highlight projects relevant to the job requirements")
    if summary_match < 2:
        suggestions.append("Update summary to include job-relevant keywords")
    
    return {
        'score': points,
        'points': points,
        'max_points': max_points,
        'suggestions': suggestions
    }


def calculate_ats_score_100(resume: Resume, job_desc: str = "") -> Dict[str, Any]:
    """
    Calculate ATS score based on 100-point industry standard system.
    
    Returns detailed breakdown with scores and suggestions.
    """
    # Combine resume text for analysis
    resume_text_parts = [
        resume.personal.firstName + ' ' + resume.personal.lastName if resume.personal else '',
        resume.summary or '',
        ' '.join([exp.position + ' ' + (exp.description or '') for exp in resume.experience]),
        ' '.join([edu.degree + ' ' + (edu.field or '') for edu in resume.education]),
        ' '.join([skill.name for skill in resume.skills]),
        ' '.join([proj.name + ' ' + (proj.description or '') for proj in resume.projects]),
        ' '.join([ach.title + ' ' + (ach.description or '') for ach in resume.achievements]),
    ]
    resume_text = ' '.join(resume_text_parts)
    
    # Calculate all category scores
    keyword_result = score_keyword_match(resume_text, job_desc)
    structure_result = score_structure_sections(resume)
    formatting_result = score_formatting_readability(resume_text, resume)
    experience_result = score_experience_strength(resume)
    education_result = score_education_relevance(resume)
    contact_result = score_contact_quality(resume)
    relevance_result = score_job_relevance(resume, job_desc)
    
    # Calculate total score
    total_score = (
        keyword_result['points'] +
        structure_result['points'] +
        formatting_result['points'] +
        experience_result['points'] +
        education_result['points'] +
        contact_result['points'] +
        relevance_result['points']
    )
    
    # Combine all suggestions
    all_suggestions = (
        keyword_result.get('suggestions', []) +
        structure_result.get('suggestions', []) +
        formatting_result.get('suggestions', []) +
        experience_result.get('suggestions', []) +
        education_result.get('suggestions', []) +
        contact_result.get('suggestions', []) +
        relevance_result.get('suggestions', [])
    )
    
    return {
        'total_score': total_score,
        'max_score': 100,
        'breakdown': {
            'keyword_match': keyword_result,
            'structure_sections': structure_result,
            'formatting_readability': formatting_result,
            'experience_strength': experience_result,
            'education_relevance': education_result,
            'contact_quality': contact_result,
            'job_relevance': relevance_result
        },
        'suggestions': all_suggestions[:20]  # Limit to top 20
    }

