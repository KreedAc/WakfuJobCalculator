// Remembers when each tool was last opened on this device, for the Home page.
const KEY = 'wjc-recent';

export function recordVisit(path: string) {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    data[path] = Date.now();
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

export function lastVisits(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

/** "today", "yesterday", "3 days ago"… in the given language. */
export function relativeDay(ts: number, language: string): string {
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 86400000);
  return new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(-days, 'day');
}
