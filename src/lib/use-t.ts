/**
 * Lightweight i18n translation utilities.
 *
 * - `useT()` — React hook for client components. Returns a `t(key, vars?)` function.
 * - `getMessages()` — Direct import for server components. Access via `messages.nav.home`.
 *
 * All strings come from src/i18n/messages/en.json. When additional locales are needed,
 * upgrade this to read from a React context with dynamic imports.
 */

import messages from '@/i18n/messages/en.json'

type Messages = typeof messages

/** Resolve a dot-path key like "nav.home" from the messages object. */
function resolve(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

/** Interpolate variables: "Hello {name}" + {name: "Raj"} → "Hello Raj" */
function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  )
}

/**
 * Translation function. Resolves a dot-path key from the messages JSON.
 * Returns the key itself if not found (visible in dev, never blank).
 */
export function t(
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw = resolve(messages as unknown as Record<string, unknown>, key)
  if (raw === undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing translation key: "${key}"`)
    }
    return key
  }
  return interpolate(raw, vars)
}

/**
 * React hook for client components.
 * Usage: const t = useT(); return <h1>{t('home.headline')}</h1>
 */
export function useT() {
  return t
}

/**
 * Direct access to the messages object for server components.
 * Usage: const m = getMessages(); return <h1>{m.home.headline}</h1>
 */
export function getMessages(): Messages {
  return messages
}
