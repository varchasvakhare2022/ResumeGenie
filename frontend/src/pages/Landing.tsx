import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkHealth } from '../lib/api'
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'

export default function Landing() {
  const [healthStatus, setHealthStatus] = useState<{
    status: string
    env: string
    db: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckAPI = async () => {
    setLoading(true)
    setError(null)
    setHealthStatus(null)

    try {
      const result = await checkHealth()
      setHealthStatus(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check API health')
      console.error('Health check error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Build Your Perfect Resume
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create professional resumes with ease using ResumeGenie
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link
            to="/builder"
            className="inline-block bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
          <button
            onClick={handleCheckAPI}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking...
              </>
            ) : (
              'Check API'
            )}
          </button>
        </div>

        {/* Health Status Display */}
        {healthStatus && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">API Health Status</h3>
              {healthStatus.status === 'ok' ? (
                <CheckCircle2 size={24} className="text-green-500" />
              ) : (
                <XCircle size={24} className="text-red-500" />
              )}
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-semibold ${
                  healthStatus.status === 'ok' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {healthStatus.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Environment:</span>
                <span className="text-sm font-semibold text-gray-900">{healthStatus.env}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database:</span>
                <span className={`text-sm font-semibold flex items-center gap-1 ${
                  healthStatus.db ? 'text-green-600' : 'text-red-600'
                }`}>
                  {healthStatus.db ? (
                    <>
                      <CheckCircle2 size={16} />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Disconnected
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 rounded-lg shadow-md border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-red-500" />
              <h3 className="text-lg font-semibold text-red-900">Error</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

