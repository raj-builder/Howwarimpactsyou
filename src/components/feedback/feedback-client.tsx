'use client'

import { useState } from 'react'

type SocialPlatform = 'x' | 'linkedin' | ''

export function FeedbackClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('')
  const [socialHandle, setSocialHandle] = useState('')
  const [message, setMessage] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          socialHandle: socialHandle || null,
          socialPlatform: socialPlatform || null,
          message,
          sourceUrl: sourceUrl || null,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      setName('')
      setEmail('')
      setSocialPlatform('')
      setSocialHandle('')
      setMessage('')
      setSourceUrl('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-light border border-[#b5d9c5] rounded-[10px] p-6 text-center">
        <span className="text-3xl block mb-3" aria-hidden="true">&#10003;</span>
        <h3 className="font-sans text-[1rem] font-bold text-green mb-2">
          Feedback submitted
        </h3>
        <p className="font-sans text-[0.85rem] text-[#1e5a38]">
          Your submission will be reviewed. If it leads to a data correction, it will appear in the list below.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 font-sans text-[0.8rem] text-green font-semibold underline cursor-pointer bg-transparent border-none"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-[10px] p-6 md:p-8 shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label htmlFor="fb-name" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="fb-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="fb-email" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="fb-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Social */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="fb-platform" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
            Social platform
          </label>
          <select
            id="fb-platform"
            value={socialPlatform}
            onChange={(e) => setSocialPlatform(e.target.value as SocialPlatform)}
            className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent"
          >
            <option value="">None</option>
            <option value="x">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>

        <div>
          <label htmlFor="fb-handle" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
            Handle / profile URL
          </label>
          <input
            id="fb-handle"
            type="text"
            value={socialHandle}
            onChange={(e) => setSocialHandle(e.target.value)}
            className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent"
            placeholder="@yourhandle or profile URL"
          />
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label htmlFor="fb-message" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
          Feedback or data correction <span className="text-accent">*</span>
        </label>
        <textarea
          id="fb-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent resize-y"
          placeholder="Describe what's wrong or what could be improved. Include country, category, and expected values if applicable."
        />
      </div>

      {/* Source URL */}
      <div className="mb-6">
        <label htmlFor="fb-source" className="font-sans text-[0.78rem] font-semibold text-ink block mb-1.5">
          Source link (for better data or correction)
        </label>
        <input
          id="fb-source"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="w-full bg-bg-alt border border-border rounded-md px-3 py-2.5 font-sans text-[0.85rem] text-ink focus:outline-2 focus:outline-accent"
          placeholder="https://example.com/article-with-better-data"
        />
        <p className="font-sans text-[0.7rem] text-ink-muted mt-1">
          Links are reviewed for legitimacy before any data is updated.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-accent text-white font-sans text-[0.85rem] font-semibold px-6 py-3 rounded-md hover:bg-[#b03e27] transition-colors disabled:opacity-50 cursor-pointer"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit feedback'}
      </button>

      {status === 'error' && (
        <p className="font-sans text-[0.8rem] text-accent mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
