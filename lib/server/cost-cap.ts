// Daily cost guard for the AI pairing route.
//
// Caps the number of LLM calls and (estimated) tokens spent per UTC day so a
// runaway client or bug can't run up a bill. Counters reset at midnight UTC.
//
// Configuration (environment):
//   PAIRING_DAILY_REQUEST_CAP  max LLM calls per day   (default 500)
//   PAIRING_DAILY_TOKEN_CAP    max tokens per day       (default 200000)

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

const DEFAULT_REQUEST_CAP = 500
const DEFAULT_TOKEN_CAP = 200_000

interface Counters {
  date: string
  requests: number
  tokens: number
}

let counters: Counters = { date: todayKey(), requests: 0, tokens: 0 }

function caps() {
  const requestCap = Number(process.env.PAIRING_DAILY_REQUEST_CAP) || DEFAULT_REQUEST_CAP
  const tokenCap = Number(process.env.PAIRING_DAILY_TOKEN_CAP) || DEFAULT_TOKEN_CAP
  return { requestCap, tokenCap }
}

function rolloverIfNeeded() {
  const today = todayKey()
  if (counters.date !== today) {
    counters = { date: today, requests: 0, tokens: 0 }
  }
}

export interface BudgetStatus {
  requests: number
  tokens: number
  requestCap: number
  tokenCap: number
  remainingRequests: number
  remainingTokens: number
}

export function budgetStatus(): BudgetStatus {
  rolloverIfNeeded()
  const { requestCap, tokenCap } = caps()
  return {
    requests: counters.requests,
    tokens: counters.tokens,
    requestCap,
    tokenCap,
    remainingRequests: Math.max(0, requestCap - counters.requests),
    remainingTokens: Math.max(0, tokenCap - counters.tokens),
  }
}

/** True when another LLM call is allowed today. */
export function hasBudget(): boolean {
  rolloverIfNeeded()
  const status = budgetStatus()
  return status.remainingRequests > 0 && status.remainingTokens > 0
}

/**
 * Record spend after a call. Pass the token count reported by the provider
 * (prompt + completion) or a conservative estimate.
 */
export function charge(tokens: number, requests = 1): void {
  rolloverIfNeeded()
  counters.requests += requests
  counters.tokens += Math.max(0, Math.round(tokens))
}

// Exposed for tests / manual reset.
export function _resetBudget(): void {
  counters = { date: todayKey(), requests: 0, tokens: 0 }
}