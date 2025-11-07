import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useResumeStore } from '../../store/useResumeStore'

interface TemplateFrameProps {
  children: ReactNode
}

export const TemplateFrame = ({ children }: TemplateFrameProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const setPreviewRef = useResumeStore((state) => state.setPreviewRef)

  useEffect(() => {
    setPreviewRef(containerRef.current)
    return () => setPreviewRef(null)
  }, [setPreviewRef])

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-slate-800/80 bg-white p-8 text-slate-900 shadow-2xl"
    >
      {children}
    </div>
  )
}


