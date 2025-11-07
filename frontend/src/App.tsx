import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { useCallback } from 'react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Landing } from './pages/Landing'
import { Builder } from './pages/Builder'
import { useResumeStore } from './store/useResumeStore'

const Layout = () => {
  const previewRef = useResumeStore((state) => state.previewRef)

  const handleExport = useCallback(async () => {
    if (!previewRef) {
      console.warn('Nothing to export yet – open the builder to generate a preview.')
      return
    }

    try {
      const canvas = await toPng(previewRef, {
        cacheBust: true,
        includeQueryParams: true,
      })

      const pdf = new jsPDF({ unit: 'px', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgProps = pdf.getImageProperties(canvas)
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height)

      const width = imgProps.width * ratio
      const height = imgProps.height * ratio

      pdf.addImage(canvas, 'PNG', (pageWidth - width) / 2, 20, width, height)
      pdf.save('resume.pdf')
    } catch (error) {
      console.error('Failed to export preview', error)
    }
  }, [previewRef])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            ResumeGenie
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <NavLink
              to="/builder"
              className={({ isActive }: { isActive: boolean }) =>
                `transition hover:text-white ${isActive ? 'text-indigo-400' : ''}`
              }
            >
              Builder
            </NavLink>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Export PDF
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-slate-950">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        Crafted with purpose · ResumeGenie
      </footer>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="builder" element={<Builder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
