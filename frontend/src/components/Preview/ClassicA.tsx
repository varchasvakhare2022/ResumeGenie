import { forwardRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import TemplateFrame from './TemplateFrame'

const ClassicA = forwardRef<HTMLDivElement>((props, ref) => {
  const { resume } = useResumeStore()
  const { personal, summary, experience, education, skills, projects, achievements, extras } = resume

  return (
    <TemplateFrame ref={ref} className="w-full max-w-full">
      <div className="space-y-6 resume-section">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {personal.firstName || 'Your'} {personal.lastName || 'Name'}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
            {personal.email && <span className="whitespace-nowrap">{personal.email}</span>}
            {personal.phone && <span className="whitespace-nowrap">{personal.phone}</span>}
            {personal.location && <span className="whitespace-nowrap">{personal.location}</span>}
            {personal.website && <span className="whitespace-nowrap">{personal.website}</span>}
            {personal.linkedin && <span className="whitespace-nowrap">LinkedIn: {personal.linkedin}</span>}
            {personal.github && <span className="whitespace-nowrap">GitHub: {personal.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-3 text-gray-900">Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Experience</h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{exp.position || 'Position'}</h3>
                      <p className="text-sm text-gray-700 font-medium">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {exp.startDate || 'Start'} - {exp.current ? 'Present' : (exp.endDate || 'End')}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                      <p className="text-sm text-gray-700">{edu.institution || 'Institution'}</p>
                      {edu.gpa && <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {edu.startDate || ''} {edu.startDate && edu.endDate && '-'} {edu.endDate || ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="resume-section mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md font-medium">
                  {skill.name || 'Skill'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="resume-section mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{project.name || 'Project Name'}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs text-gray-600 mt-2 space-x-3">
                      {project.url && <span className="whitespace-nowrap">URL: {project.url}</span>}
                      {project.github && <span className="whitespace-nowrap">GitHub: {project.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="resume-section mb-5 pb-5 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title || 'Achievement'}</h3>
                      {achievement.description && (
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">{achievement.description}</p>
                      )}
                    </div>
                    {achievement.date && (
                      <div className="text-xs text-gray-600 whitespace-nowrap ml-4">{achievement.date}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {(extras.languages.length > 0 || extras.certifications.length > 0 || extras.interests.length > 0) && (
          <div className="resume-section mb-0 pb-0">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">Additional Information</h2>
            <div className="space-y-4">
              {extras.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {extras.languages.map((lang, index) => (
                      <span key={index} className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {extras.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {extras.certifications.map((cert, index) => (
                      <span key={index} className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {extras.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {extras.interests.map((interest, index) => (
                      <span key={index} className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md font-medium">
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

ClassicA.displayName = 'ClassicA'

export default ClassicA

