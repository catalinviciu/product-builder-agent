import mixpanel from "mixpanel-browser";

const CONSENT_KEY = "pa-analytics-consent";
const MIXPANEL_TOKEN = "9131ceb444679029be44598ab362c54e";
const DECLINE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

let initialized = false;

export type ConsentState = "accepted" | "declined" | null;

interface ConsentRecord {
  status: "accepted" | "declined";
  timestamp: number;
}

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;

  try {
    const record: ConsentRecord = JSON.parse(raw);
    if (record.status === "accepted") return "accepted";
    if (record.status === "declined") {
      // Re-ask after 1 week
      if (Date.now() - record.timestamp > DECLINE_EXPIRY_MS) return null;
      return "declined";
    }
    return null;
  } catch {
    return null;
  }
}

export function setConsent(value: "accepted" | "declined"): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = { status: value, timestamp: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  if (value === "accepted") initMixpanel();
}

function initMixpanel(): void {
  if (initialized) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: true,
    record_sessions_percent: 100,
    api_host: "https://api-eu.mixpanel.com",
  });
  initialized = true;
}

export function initIfConsented(): void {
  if (getConsent() === "accepted") initMixpanel();
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  mixpanel.track(name, properties);
}
