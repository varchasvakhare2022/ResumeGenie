import { Link } from 'react-router-dom'

export const Landing = () => {
  return (
    <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
          ResumeGenie
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Tailored resumes. Powered by AI.
        </h1>
        <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
          Build polished, data-backed resumes in minutes. ResumeGenie guides you with smart suggestions, live previews, and export-ready templates designed to impress both humans and ATS.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/builder"
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Start Building
          </Link>
          <a
            href="https://resume.io"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Explore Inspiration
          </a>
        </div>
      </div>
    </section>
  )
}

