// Public visitor counter (worker/index.ts, /api/visit). Each browser reports
// itself once per UTC day; later page loads only read the totals. One request
// per page load, shared by every component that shows the numbers.
import { useEffect, useState } from 'react';

export interface VisitTotals {
  total: number;
  today: number;
}

const KEY = 'wjc-visit-day';
let request: Promise<VisitTotals | null> | null = null;

function load(): Promise<VisitTotals | null> {
  const day = new Date().toISOString().slice(0, 10);
  let counted = false;
  try {
    counted = localStorage.getItem(KEY) === day;
  } catch {
    // storage unavailable: the server de-duplicates anyway
  }
  const res = counted ? fetch('/api/visits') : fetch('/api/visit', { method: 'POST' });
  return res
    .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? r.json() : null))
    .then((data: VisitTotals | null) => {
      if (data && !counted) {
        try {
          localStorage.setItem(KEY, day);
        } catch {
          // ignore
        }
      }
      return data && typeof data.total === 'number' ? data : null;
    })
    .catch(() => null);
}

/** Visitor totals, or null while loading / when the counter is unavailable. */
export function useVisitTotals(): VisitTotals | null {
  const [totals, setTotals] = useState<VisitTotals | null>(null);
  useEffect(() => {
    let alive = true;
    request ??= load();
    request.then((t) => { if (alive) setTotals(t); });
    return () => { alive = false; };
  }, []);
  return totals;
}
