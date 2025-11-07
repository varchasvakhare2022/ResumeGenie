import { analyzeResume } from '../lib/ats'
import { useResumeStore } from '../store/useResumeStore'

export const ATSPanel = () => {
  const resume = useResumeStore((state) => state.resume)
  const insights = analyzeResume(resume)

  return (
    <aside className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-200 shadow-lg shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">ATS Insights</h3>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
          Score {insights.score}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Quick heuristic estimation. A dedicated ATS service will provide deeper telemetry once connected to the backend.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2">
          <dt className="text-slate-400">Keyword Matches</dt>
          <dd className="mt-1 text-lg font-semibold text-white">
            {insights.keywordMatches}/{insights.totalKeywords}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2">
          <dt className="text-slate-400">Suggestions</dt>
          <dd className="mt-1 text-lg font-semibold text-white">{insights.suggestions.length}</dd>
        </div>
      </dl>
      {Boolean(insights.keywordsMissing.length) && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Missing Keywords</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {insights.keywordsMissing.map((keyword) => (
              <span key={keyword} className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-slate-300">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      {Boolean(insights.suggestions.length) && (
        <ul className="mt-4 space-y-3 text-xs text-slate-300">
          {insights.suggestions.map((suggestion) => (
            <li key={suggestion} className="rounded-md border border-slate-800/60 bg-slate-900/80 p-3">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}


