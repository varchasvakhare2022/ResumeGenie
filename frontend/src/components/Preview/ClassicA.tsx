import { forwardRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import TemplateFrame from './TemplateFrame'

const ClassicA = forwardRef<HTMLDivElement>((props, ref) => {
  const { resume } = useResumeStore()
  const { personal, summary, experience, education, skills, projects, achievements, extras } = resume

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)

  // Format date range
  const formatDateRange = (start?: string, end?: string, current?: boolean) => {
    if (!start && !end) return ''
    const startStr = start || ''
    const endStr = current ? 'Present' : (end || '')
    return startStr && endStr ? `${startStr} – ${endStr}` : startStr || endStr
  }

  // Parse description into bullet points
  const parseBullets = (text: string) => {
    if (!text) return []
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove existing bullet markers
        return line.replace(/^[•\-\*]\s*/, '')
      })
  }

  return (
    <TemplateFrame ref={ref} className="w-full max-w-full" style={{ fontFamily: 'Inter, Roboto, Lato, Calibri, Helvetica, sans-serif', userSelect: 'text', WebkitUserSelect: 'text' }}>
      <div className="resume-section" style={{ lineHeight: '1.1', fontSize: '10px', color: '#000000', userSelect: 'text', WebkitUserSelect: 'text' }}>
        {/* 1. HEADER / CONTACT INFORMATION */}
        <div style={{ marginBottom: '8px', borderBottom: '2px solid #000000', paddingBottom: '6px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '2px', color: '#000000' }}>
            {personal.firstName || 'First'} {personal.lastName || 'Last'}
          </h1>
          {personal.location && (
            <div style={{ fontSize: '10px', color: '#000000', marginBottom: '4px' }}>
              {personal.location}
            </div>
          )}
          <div style={{ fontSize: '10px', color: '#000000', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
            {personal.phone && <span>{personal.phone}</span>}
            {personal.email && <span>| {personal.email}</span>}
            {personal.linkedin && <span>| LinkedIn: {personal.linkedin}</span>}
            {personal.github && <span>| GitHub: {personal.github}</span>}
            {personal.website && <span>| {personal.website}</span>}
          </div>
        </div>

        {/* 2. PROFESSIONAL SUMMARY / OBJECTIVE */}
        {summary && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Profile Summary
            </h2>
            <div style={{ marginTop: '4px', fontSize: '10px', lineHeight: '1.15' }}>
              {parseBullets(summary).map((bullet, idx) => (
                <div key={idx} style={{ marginBottom: '2px', color: '#000000' }}>
                  • {bullet}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SKILLS SECTION - BEFORE EXPERIENCE */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Technical Skills
            </h2>
            <div style={{ marginTop: '4px', fontSize: '10px', lineHeight: '1.15' }}>
              {Object.entries(skillsByCategory).map(([category, skillList]) => (
                <div key={category} style={{ marginBottom: '3px' }}>
                  <span style={{ fontWeight: '600', color: '#000000' }}>{category}:</span>{' '}
                  <span style={{ color: '#000000' }}>{skillList.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EXPERIENCE / INTERNSHIPS / WORK */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Experience
            </h2>
            <div style={{ marginTop: '4px' }}>
              {experience.map((exp) => {
                const bullets = parseBullets(exp.description || '')
                const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
                
                return (
                  <div key={exp.id} style={{ marginBottom: '6px', position: 'relative' }}>
                    <div style={{ marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#000000', flex: '1' }}>
                        {exp.company || 'Company'} — {exp.position || 'Position'}
                      </span>
                      {dateRange && (
                        <span style={{ fontSize: '10px', color: '#000000', textAlign: 'right', marginLeft: '8px' }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {bullets.length > 0 && (
                      <div style={{ marginLeft: '8px', marginTop: '2px', fontSize: '10px', lineHeight: '1.15' }}>
                        {bullets.slice(0, 5).map((bullet, idx) => (
                          <div key={idx} style={{ marginBottom: '2px', color: '#000000' }}>
                            • {bullet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 5. PROJECTS SECTION */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Projects
            </h2>
            <div style={{ marginTop: '4px' }}>
              {projects.map((project) => {
                const bullets = parseBullets(project.description || '')
                const techStack = project.technologies?.length > 0 ? project.technologies.join(', ') : ''
                const projectParts = [
                  project.name || 'Project Name',
                  techStack,
                  (project.url || project.github) ? (project.url ? 'GitHub Repository' : project.github ? 'Live Dashboard' : '') : ''
                ].filter(Boolean)
                
                return (
                  <div key={project.id} style={{ marginBottom: '6px', position: 'relative' }}>
                    <div style={{ marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#000000', flex: '1' }}>
                        {projectParts.join(' | ')}
                      </span>
                    </div>
                    {bullets.length > 0 && (
                      <div style={{ marginLeft: '8px', marginTop: '2px', fontSize: '10px', lineHeight: '1.15' }}>
                        {bullets.slice(0, 3).map((bullet, idx) => (
                          <div key={idx} style={{ marginBottom: '2px', color: '#000000' }}>
                            • {bullet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 6. EDUCATION */}
        {education.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Education
            </h2>
            <div style={{ marginTop: '4px' }}>
              {education.map((edu) => {
                const dateRange = formatDateRange(edu.startDate, edu.endDate)
                
                return (
                  <div key={edu.id} style={{ marginBottom: '4px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#000000', marginBottom: '2px' }}>
                      {edu.degree || 'Degree'} — {edu.institution || 'Institution'}
                    </div>
                    {dateRange && (
                      <div style={{ fontSize: '10px', color: '#000000', marginBottom: '2px' }}>
                        {dateRange}
                      </div>
                    )}
                    {edu.gpa && (
                      <div style={{ fontSize: '10px', color: '#000000' }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 7. CERTIFICATIONS */}
        {extras.certifications.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Certifications
            </h2>
            <div style={{ marginTop: '4px', fontSize: '10px', lineHeight: '1.15' }}>
              {extras.certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: '2px', color: '#000000' }}>
                  • {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ACHIEVEMENTS / AWARDS */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: '8px', paddingBottom: '6px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Achievements
            </h2>
            <div style={{ marginTop: '4px' }}>
              {achievements.map((achievement) => (
                <div key={achievement.id} style={{ marginBottom: '4px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#000000' }}>
                    {achievement.title || 'Achievement'}
                  </div>
                  {achievement.description && (
                    <div style={{ fontSize: '10px', color: '#000000', marginTop: '2px', marginLeft: '8px' }}>
                      • {achievement.description}
                    </div>
                  )}
                  {achievement.date && (
                    <div style={{ fontSize: '10px', color: '#000000', marginTop: '1px' }}>
                      {achievement.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. EXTRAS (Languages, Publications, Volunteering, Interests) */}
        {(extras.languages.length > 0 || extras.interests.length > 0) && (
          <div style={{ marginBottom: '0px', paddingBottom: '0px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#000000', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
              Additional Information
            </h2>
            <div style={{ marginTop: '4px', fontSize: '10px', lineHeight: '1.15' }}>
              {extras.languages.length > 0 && (
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ fontWeight: '600', color: '#000000' }}>Languages:</span>{' '}
                  <span style={{ color: '#000000' }}>{extras.languages.join(', ')}</span>
                </div>
              )}
              {extras.interests.length > 0 && (
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ fontWeight: '600', color: '#000000' }}>Interests:</span>{' '}
                  <span style={{ color: '#000000' }}>{extras.interests.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TemplateFrame>
  )
})

ClassicA.displayName = 'ClassicA'

export default ClassicA
