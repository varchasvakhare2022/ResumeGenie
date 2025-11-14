import { forwardRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import TemplateFrame from './TemplateFrame'

const ClassicA = forwardRef<HTMLDivElement>((props, ref) => {
  const { resume } = useResumeStore()
  const { personal, summary, experience, education, skills, projects, achievements, extras } = resume

  return (
    <TemplateFrame ref={ref} className="max-w-4xl mx-auto">
      <div className="space-y-6 resume-section">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold">
            {personal.firstName} {personal.lastName}
          </h1>
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Summary</h2>
            <p className="text-sm">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {project.url && <span>URL: {project.url}</span>}
                      {project.github && <span className="ml-2">GitHub: {project.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-2">Achievements</h2>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  )}
                  {achievement.date && (
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {(extras.languages.length > 0 || extras.certifications.length > 0 || extras.interests.length > 0) && (
          <div className="resume-section">
            {(extras.languages.length > 0 || extras.certifications.length > 0) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {extras.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {extras.languages.map((lang, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {extras.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Certifications</h3>
                    <div className="flex flex-wrap gap-1">
                      {extras.certifications.map((cert, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {extras.interests.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-1">Interests</h3>
                <div className="flex flex-wrap gap-1">
                  {extras.interests.map((interest, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TemplateFrame>
  )
})

ClassicA.displayName = 'ClassicA'

export default ClassicA

