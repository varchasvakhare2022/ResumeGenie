import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Builder from './pages/Builder'
import ATSChecker from './pages/ATSChecker'
import CoverLetter from './pages/CoverLetter'
import InterviewQuestions from './pages/InterviewQuestions'
import ResumeRoaster from './pages/ResumeRoaster'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/ats-checker" element={<ATSChecker />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/interview-questions" element={<InterviewQuestions />} />
        <Route path="/resume-roaster" element={<ResumeRoaster />} />
      </Routes>
    </div>
  )
}

export default App

