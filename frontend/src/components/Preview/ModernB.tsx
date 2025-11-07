import { useResumeStore } from '../../store/useResumeStore'

export const ModernB = () => {
  const resume = useResumeStore((state) => state.resume)

  return (
    <div className="grid gap-6 text-sm text-slate-200" style={{ background: 'linear-gradient(140deg, #111826 0%, #1e2133 100%)', borderRadius: '1rem', padding: '2.5rem' }}>
      <header className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-semibold text-white">{resume.personal.fullName}</h1>
        <p className="mt-1 text-base text-indigo-200">{resume.personal.headline}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
          <span>{resume.personal.email}</span>
          <span>{resume.personal.phone}</span>
          <span>{resume.personal.location}</span>
          {resume.personal.website ? <span>{resume.personal.website}</span> : null}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Profile</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-200/90">{resume.summary}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-indigo-300/30 bg-indigo-300/10 px-2 py-1 text-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Projects</h2>
            <div className="mt-2 space-y-3">
              {resume.projects.map((project) => (
                <div key={project.name} className="rounded-lg border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-200/80">{project.description}</p>
                  {project.link ? (
                    <a
                      href={project.link}
                      className="mt-1 inline-block text-xs text-indigo-200"
                    >
                      {project.link}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Experience</h2>
            <div className="mt-2 space-y-4">
              {resume.experience.map((item) => (
                <div key={`${item.company}-${item.role}`} className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.role}</p>
                      <p className="text-xs text-indigo-200">{item.company}</p>
                    </div>
                    <p className="text-xs text-slate-300">
                      {item.startDate} – {item.endDate || 'Present'}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-slate-200/80">
                    {item.achievements.map((achievement, index) => (
                      <li key={`${achievement}-${index}`}>• {achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Education</h2>
              <div className="mt-2 space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.school} className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-sm font-semibold text-white">{edu.school}</p>
                    <p className="text-xs text-indigo-200">{edu.degree}</p>
                    <p className="text-xs text-slate-300">
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Highlights</h2>
              <ul className="mt-2 space-y-2 text-xs text-slate-200/80">
                {resume.achievements.map((achievement, index) => (
                  <li key={`${achievement}-${index}`} className="rounded-md border border-white/5 bg-white/5 px-3 py-2">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Extras</h2>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-200/80">
              {resume.extras.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-full border border-white/5 bg-white/5 px-3 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}


