import { forwardRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import TemplateFrame from './TemplateFrame'

const ModernB = forwardRef<HTMLDivElement>((props, ref) => {
  const { resume } = useResumeStore()
  const { personal, summary, experience, education, skills, projects, achievements, extras } = resume

  return (
    <TemplateFrame ref={ref} className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white">
      <div className="space-y-8 resume-section">
        {/* Header with colored background */}
        <div className="bg-brand-primary text-white p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">
            {personal.firstName} {personal.lastName}
          </h1>
          <div className="flex flex-wrap gap-4 text-blue-100">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && <span>{personal.website}</span>}
            {personal.linkedin && <span>LinkedIn</span>}
            {personal.github && <span>GitHub</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-brand-primary mb-2">Professional Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Work Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-brand-primary">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-brand-primary">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education and Skills in two columns */}
        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="resume-section">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs text-gray-500 mt-2">
                      {project.url && <a href={project.url} className="text-brand-primary hover:underline mr-3">{project.url}</a>}
                      {project.github && <a href={project.github} className="text-brand-primary hover:underline">{project.github}</a>}
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
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-gray-700 text-sm mt-1">{achievement.description}</p>
                  )}
                  {achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {(extras.languages.length > 0 || extras.certifications.length > 0 || extras.interests.length > 0) && (
          <div className="resume-section">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Additional Information</h2>
            <div className="grid grid-cols-3 gap-4">
              {extras.languages.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-sm mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {extras.languages.map((lang, index) => (
                      <span key={index} className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {extras.certifications.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-sm mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-1">
                    {extras.certifications.map((cert, index) => (
                      <span key={index} className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {extras.interests.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-sm mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-1">
                    {extras.interests.map((interest, index) => (
                      <span key={index} className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TemplateFrame>
  )
})

ModernB.displayName = 'ModernB'

export default ModernB

