import type { Utms } from "@/services/fluxoApi";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "b2bflow_utms_v1";

/** UTMs da URL atual (guardadas na sessão para sobreviver à navegação). */
export function captureUtms(): Utms {
  const params = new URLSearchParams(window.location.search);
  const found: Utms = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) found[k] = v.slice(0, 200);
  }
  try {
    if (Object.keys(found).length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      return found;
    }
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return found;
  }
}
