/**
 * Auth-protected API 401 javobida chaqiriladigan callback.
 * AuthProvider buni logout + redirect bilan o'rnatadi.
 */
let onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(fn: (() => void) | null) {
  onUnauthorized = fn
}

export function getOnUnauthorized() {
  return onUnauthorized
}

export function triggerUnauthorized() {
  onUnauthorized?.()
}
