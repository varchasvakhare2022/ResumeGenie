import { useResumeStore } from '../../store/useResumeStore'

export const ClassicA = () => {
  const resume = useResumeStore((state) => state.resume)

  return (
    <article className="space-y-6 text-sm">
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-semibold text-slate-900">{resume.personal.fullName}</h1>
        <p className="mt-1 text-base text-slate-600">{resume.personal.headline}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{resume.personal.email}</span>
          <span>{resume.personal.phone}</span>
          <span>{resume.personal.location}</span>
          {resume.personal.website ? <span>{resume.personal.website}</span> : null}
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Summary</h2>
        <p className="leading-relaxed text-slate-700">{resume.summary}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Experience</h2>
        <div className="space-y-4">
          {resume.experience.map((item) => (
            <div key={`${item.company}-${item.role}`} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.role}</p>
                  <p className="text-xs text-slate-500">{item.company}</p>
                </div>
                <p className="text-xs text-slate-500">
                  {item.startDate} – {item.endDate || 'Present'}
                </p>
              </div>
              <ul className="ml-4 list-disc space-y-1 text-xs text-slate-600">
                {item.achievements.map((achievement, index) => (
                  <li key={`${achievement}-${index}`}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Skills</h2>
        <div className="flex flex-wrap gap-2 text-xs text-slate-700">
          {resume.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-2 py-1">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Projects</h2>
        <div className="space-y-3">
          {resume.projects.map((project) => (
            <div key={project.name}>
              <p className="text-sm font-semibold text-slate-800">{project.name}</p>
              <p className="text-xs text-slate-600">{project.description}</p>
              {project.link ? (
                <a href={project.link} className="mt-1 inline-block text-xs text-indigo-600">
                  {project.link}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Education</h2>
        <div className="space-y-3">
          {resume.education.map((edu) => (
            <div key={edu.school}>
              <p className="text-sm font-semibold text-slate-800">{edu.school}</p>
              <p className="text-xs text-slate-600">{edu.degree}</p>
              <p className="text-xs text-slate-500">
                {edu.startDate} – {edu.endDate}
              </p>
              {edu.details ? <p className="text-xs text-slate-500">{edu.details}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Achievements</h2>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-xs text-slate-600">
            {resume.achievements.map((achievement, index) => (
              <li key={`${achievement}-${index}`}>{achievement}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800 uppercase tracking-wide">Extras</h2>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-xs text-slate-600">
            {resume.extras.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  )
}


