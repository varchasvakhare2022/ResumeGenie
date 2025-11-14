import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Builder from './pages/Builder'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold text-brand-primary">
              ResumeGenie
            </a>
            <nav>
              <a
                href="/builder"
                className="text-gray-700 hover:text-brand-primary transition-colors"
              >
                Builder
              </a>
            </nav>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </div>
  )
}

export default App

