'use client'
import { useState } from 'react'

interface EmailCaptureProps {
  headline: string
  subtext: string
  buttonText: string
  source: string
  leadMagnet: string
  variant?: 'inline' | 'banner'
}

export default function EmailCapture({
  headline,
  subtext,
  buttonText,
  source,
  leadMagnet,
  variant = 'inline'
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, leadMagnet }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-2xl border border-sage-200 dark:border-sage-800 bg-sage-50 dark:bg-sage-900/20 p-6 text-center ${variant === 'banner' ? 'w-full' : ''}`} role="status" aria-live="polite">
        <span className="text-2xl">&#10003;</span>
        <p className="text-sage-700 dark:text-sage-300 font-medium mt-2">Check your inbox — your results are on the way.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border border-cream-300 dark:border-bark-700 bg-cream-100 dark:bg-bark-800 p-6 shadow-sm ${variant === 'banner' ? 'w-full' : ''}`} role="complementary" aria-label="Save your results">
      <p className="font-bold text-bark-800 dark:text-cream-100 text-lg mb-1">{headline}</p>
      <p className="text-bark-500 dark:text-bark-400 text-sm mb-4">{subtext}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
        <input
          id={`email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          aria-describedby={errorMsg ? `error-${source}` : undefined}
          className="flex-1 px-4 py-2 border border-cream-300 dark:border-bark-600 bg-white dark:bg-bark-700 rounded-lg text-sm text-bark-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          className="px-6 py-2 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {status === 'loading' ? 'Sending...' : buttonText}
        </button>
      </div>
      {errorMsg && (
        <p id={`error-${source}`} className="text-rose-600 dark:text-rose-400 text-xs mt-2" role="alert">{errorMsg}</p>
      )}
      <p className="text-xs text-bark-400 dark:text-bark-500 mt-3">
        No spam. Unsubscribe anytime. We never sell your data.
      </p>
    </div>
  )
}
