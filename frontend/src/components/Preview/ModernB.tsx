import { forwardRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import TemplateFrame from './TemplateFrame'
import { Phone, Mail, Globe, Briefcase, GraduationCap, FileText, Lightbulb, Heart } from 'lucide-react'

const ModernB = forwardRef<HTMLDivElement>((props, ref) => {
  const { resume } = useResumeStore()
  const { personal, summary, experience, education, skills, projects, achievements, extras } = resume

  // Format date range
  const formatDateRange = (start?: string, end?: string, current?: boolean) => {
    if (!start && !end) return ''
    const startStr = start || ''
    const endStr = current ? 'Present' : (end || '')
    return startStr && endStr ? `${startStr} – ${endStr}` : startStr || endStr
  }

  // Parse description into first sentence/paragraph
  const getFirstSentence = (text: string) => {
    if (!text) return ''
    const firstLine = text.split('\n')[0].trim()
    // Take first sentence or first 150 characters
    const firstSentence = firstLine.split('.')[0] + (firstLine.includes('.') ? '.' : '')
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence
  }

  // Modern color scheme
  const colors = {
    sidebarBg: '#2C2C2C', // Dark charcoal gray
    sidebarText: '#FFFFFF',
    sidebarTextLight: '#CCCCCC',
    accent: '#FFD700', // Yellow
    mainBg: '#FFFFFF',
    mainText: '#000000',
    divider: '#E0E0E0',
  }

  return (
    <TemplateFrame ref={ref} className="w-full max-w-full resume-modern" style={{ fontFamily: 'Lato, Inter, Roboto, Calibri, Helvetica, sans-serif', userSelect: 'text', WebkitUserSelect: 'text', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
      <div className="resume-section" style={{ display: 'flex', minHeight: '100%', backgroundColor: colors.mainBg, userSelect: 'text', WebkitUserSelect: 'text', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
        {/* Left Sidebar - Dark with Yellow Accents */}
        <div style={{ 
          width: '35%', 
          backgroundColor: colors.sidebarBg, 
          color: colors.sidebarText,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          colorAdjust: 'exact'
        }}>
          {/* Name and Title */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.sidebarText, marginBottom: '4px', lineHeight: '1.2' }}>
              {personal.firstName || 'First'} {personal.lastName || 'Last'}
            </h1>
            {summary && (
              <div style={{ fontSize: '11px', color: colors.sidebarTextLight, fontWeight: '500', marginTop: '4px' }}>
                {summary.split('.')[0].substring(0, 50) || 'Professional'}
              </div>
            )}
          </div>

          {/* Contact Section */}
          {(personal.email || personal.phone || personal.website || personal.linkedin || personal.github) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={14} color={colors.accent} />
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.sidebarText }}>Contact</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
                {personal.email && (
                  <div>
                    <div style={{ color: colors.sidebarText, fontWeight: '500', marginBottom: '2px' }}>Email</div>
                    <div style={{ color: colors.sidebarTextLight }}>{personal.email}</div>
                  </div>
                )}
                {personal.phone && (
                  <div>
                    <div style={{ color: colors.sidebarText, fontWeight: '500', marginBottom: '2px' }}>Phone</div>
                    <div style={{ color: colors.sidebarTextLight }}>{personal.phone}</div>
                  </div>
                )}
                {personal.website && (
                  <div>
                    <div style={{ color: colors.sidebarText, fontWeight: '500', marginBottom: '2px' }}>Website</div>
                    <div style={{ color: colors.sidebarTextLight }}>{personal.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                  </div>
                )}
                {personal.linkedin && (
                  <div>
                    <div style={{ color: colors.sidebarText, fontWeight: '500', marginBottom: '2px' }}>LinkedIn</div>
                    <div style={{ color: colors.sidebarTextLight }}>{personal.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                  </div>
                )}
                {personal.github && (
                  <div>
                    <div style={{ color: colors.sidebarText, fontWeight: '500', marginBottom: '2px' }}>GitHub</div>
                    <div style={{ color: colors.sidebarTextLight }}>{personal.github.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Lightbulb size={14} color={colors.accent} />
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.sidebarText }}>Skills</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
                {skills.map((skill) => (
                  <div key={skill.id} style={{ color: colors.sidebarText }}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {extras.interests.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Heart size={14} color={colors.accent} />
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.sidebarText }}>Interests</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px' }}>
                {extras.interests.map((interest, idx) => (
                  <div key={idx} style={{ color: colors.sidebarText }}>{interest}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content - White with Yellow Accents */}
        <div style={{ 
          width: '65%', 
          backgroundColor: colors.mainBg, 
          color: colors.mainText,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Profile Section */}
          {summary && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.mainText }} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Profile</h2>
              </div>
              <p style={{ fontSize: '10px', lineHeight: '1.5', color: colors.mainText, marginLeft: '28px' }}>
                {summary}
              </p>
            </div>
          )}

          {/* Experience Section with Timeline */}
          {experience.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <Briefcase size={12} color={colors.mainText} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Experience</h2>
              </div>
              <div style={{ position: 'relative', marginLeft: '10px', paddingLeft: '28px' }}>
                {/* Timeline line */}
                <div style={{ 
                  position: 'absolute', 
                  left: '4px', 
                  top: '0', 
                  bottom: '0', 
                  width: '2px', 
                  backgroundColor: colors.divider 
                }} />
                {experience.map((exp, idx) => {
                  const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current)
                  const description = getFirstSentence(exp.description || '')
                  return (
                    <div key={exp.id} style={{ position: 'relative', marginBottom: idx < experience.length - 1 ? '18px' : '0' }}>
                      {/* Timeline dot */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-32px', 
                        top: '4px',
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: '#FFD700',
                        border: `2px solid ${colors.mainBg}`,
                        zIndex: 1,
                        printColorAdjust: 'exact',
                        WebkitPrintColorAdjust: 'exact',
                        colorAdjust: 'exact'
                      }} />
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: colors.mainText, marginBottom: '2px' }}>
                          {exp.position || 'Position'}
                        </div>
                        <div style={{ fontSize: '10px', color: colors.mainText, marginBottom: '2px' }}>
                          {exp.company || 'Company'} {exp.location && `| ${exp.location}`}
                        </div>
                        {dateRange && (
                          <div style={{ fontSize: '9px', color: '#666666', marginBottom: '4px' }}>
                            {dateRange}
                          </div>
                        )}
                      </div>
                      {description && (
                        <div style={{ fontSize: '10px', lineHeight: '1.4', color: colors.mainText, marginLeft: '0' }}>
                          {description}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <GraduationCap size={12} color={colors.mainText} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Education</h2>
              </div>
              <div style={{ marginLeft: '28px' }}>
                {education.map((edu) => {
                  const dateRange = formatDateRange(edu.startDate, edu.endDate)
                  return (
                    <div key={edu.id} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: colors.mainText, marginBottom: '2px' }}>
                        {edu.degree || 'Degree'}
                      </div>
                      <div style={{ fontSize: '10px', color: colors.mainText, marginBottom: '2px' }}>
                        {edu.institution || 'Institution'} {edu.location && `| ${edu.location}`}
                      </div>
                      {dateRange && (
                        <div style={{ fontSize: '9px', color: '#666666' }}>
                          Graduated: {edu.endDate || dateRange}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Projects/Portfolio Section */}
          {projects.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <FileText size={12} color={colors.mainText} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Portfolio</h2>
              </div>
              <div style={{ marginLeft: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((project) => {
                  const description = getFirstSentence(project.description || '')
                  return (
                    <div key={project.id}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: colors.mainText, marginBottom: '4px' }}>
                        {project.name || 'Project Name'}
                        {project.technologies && project.technologies.length > 0 && (
                          <span style={{ fontSize: '10px', fontWeight: '400', color: '#666666' }}>
                            {' '}for {project.technologies.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                      {description && (
                        <div style={{ fontSize: '10px', lineHeight: '1.4', color: colors.mainText }}>
                          {description}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.mainText }} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Achievements</h2>
              </div>
              <div style={{ marginLeft: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {achievements.map((achievement) => (
                  <div key={achievement.id}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.mainText, marginBottom: '2px' }}>
                      {achievement.title || 'Achievement'}
                    </div>
                    {achievement.description && (
                      <div style={{ fontSize: '10px', lineHeight: '1.4', color: colors.mainText }}>
                        {achievement.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {extras.certifications.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <div style={{ width: '10px', height: '10px', border: `2px solid ${colors.mainText}`, borderRadius: '2px' }} />
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Certifications</h2>
              </div>
              <div style={{ marginLeft: '28px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {extras.certifications.map((cert, idx) => (
                  <div key={idx} style={{ fontSize: '10px', color: colors.mainText }}>{cert}</div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {extras.languages.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: colors.mainText }}>L</div>
                </div>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: colors.mainText }}>Languages</h2>
              </div>
              <div style={{ marginLeft: '28px', fontSize: '10px', color: colors.mainText }}>
                {extras.languages.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </TemplateFrame>
  )
})

ModernB.displayName = 'ModernB'

export default ModernB
