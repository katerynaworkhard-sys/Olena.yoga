// Shared input-validation helpers for public form submissions.
// Goal: enforce sane field lengths + email format server-side so the
// public POST endpoints can't be abused to bloat the database or store junk.

export const FIELD_LIMITS = {
  name: 120,
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  company: 160,
  location: 160,
  preferredDates: 200,
  comment: 4000,
  message: 4000,
} as const

/** Permissive but real email shape check (full RFC validation is impractical). */
export function isValidEmail(value: string): boolean {
  return value.length <= FIELD_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Coerce to a trimmed string ('' for non-strings). */
export function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** True if the (already-trimmed) value is empty. */
export function isBlank(value: string): boolean {
  return value.length === 0
}

/** True if the value exceeds the allowed maximum length. */
export function exceeds(value: string, max: number): boolean {
  return value.length > max
}
