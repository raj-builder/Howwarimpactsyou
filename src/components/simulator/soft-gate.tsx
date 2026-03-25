'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_COUNT_KEY = 'hwiy_sim_count'
const STORAGE_SUBMITTED_KEY = 'hwiy_sim_submitted'
const STORAGE_DISMISSED_KEY = 'hwiy_sim_dismissed'
const GATE_THRESHOLD = 5

interface SoftGateProps {
  /** Current war selection for signup context */
  war: string
  /** Current category selection for signup context */
  category: string
  /** Called when a gated action is attempted; returns true if allowed */
  onGatedAction?: () => boolean
}

export function SoftGate({ war, category }: SoftGateProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already submitted
    if (typeof window === 'undefined') return
    const alreadySubmitted = localStorage.getItem(STORAGE_SUBMITTED_KEY)
    if (alreadySubmitted === 'true') {
      setSubmitted(true)
      return
    }

    // Check if dismissed this session
    const dismissed = localStorage.getItem(STORAGE_DISMISSED_KEY)
    if (dismissed === 'true') return

    // Check exploration count
    const count = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || '0', 10)
    if (count >= GATE_THRESHOLD) {
      setShowBanner(true)
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setShowBanner(false)
    localStorage.setItem(STORAGE_DISMISSED_KEY, 'true')
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      const trimmed = contact.trim()
      if (!trimmed || trimmed.length < 5) {
        setError('Please enter a valid email or phone number.')
        return
      }

      setSubmitting(true)
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact: trimmed,
            war,
            category,
            type: 'soft-gate',
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: 'Signup failed' }))
          setError(data.error || 'Something went wrong.')
          return
        }

        setSubmitted(true)
        setShowBanner(false)
        localStorage.setItem(STORAGE_SUBMITTED_KEY, 'true')
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [contact, war, category],
  )

  if (submitted || !showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in">
      <div className="bg-[#1a1a1a] border-t border-border shadow-lg">
        <div className="container-page py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="font-sans text-[0.88rem] font-bold text-white mb-0.5">
                Help us build a better model
              </h4>
              <p className="font-sans text-[0.75rem] text-white/60 leading-relaxed">
                Get notified when we add new countries, categories, or live data feeds.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 shrink-0 w-full sm:w-auto"
            >
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone"
                className="flex-1 sm:w-56 border border-white/20 rounded-lg px-3 py-2 font-sans text-[0.82rem] text-white bg-white/10 placeholder:text-white/40 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-accent text-white font-sans text-[0.82rem] font-semibold px-4 py-2 rounded-lg hover:bg-[#b03e27] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </form>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="font-sans text-[0.82rem] text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>

          {error && (
            <p className="font-sans text-[0.72rem] text-accent mt-1.5">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Increment the exploration counter in localStorage.
 * Call this each time the user updates the simulator view.
 */
export function incrementExplorationCount(): number {
  if (typeof window === 'undefined') return 0
  const current = parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || '0', 10)
  const next = current + 1
  localStorage.setItem(STORAGE_COUNT_KEY, String(next))
  return next
}

/**
 * Check if the user has already submitted the soft gate.
 */
export function isSoftGateUnlocked(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(STORAGE_SUBMITTED_KEY) === 'true'
}
