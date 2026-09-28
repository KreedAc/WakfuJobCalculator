// Input validation for the gallery API, kept free of Worker bindings so it can
// be unit-tested (worker/validate.test.ts).

export const MAX_LEVEL = 245;
export const CLASS_COUNT = 18;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Plain single-line text: no control characters, collapsed spaces, bounded length. */
export function cleanText(value: unknown, max: number, multiline = false): string {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  let s = value.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ');
  s = multiline ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ');
  return s.trim().slice(0, max);
}

/**
 * Validates a Builder share code (base64url of [1, level, ...itemIds]) and
 * returns its level. Mirrors decodeBuild in src/lib/builder.ts.
 */
export function codeLevel(code: unknown): number {
  if (typeof code !== 'string' || code.length > 400 || !/^[A-Za-z0-9_-]+$/.test(code)) {
    throw new HttpError(400, 'invalid build code');
  }
  let arr: unknown;
  try {
    arr = JSON.parse(atob(code.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    throw new HttpError(400, 'invalid build code');
  }
  if (!Array.isArray(arr) || arr[0] !== 1 || arr.length > 24) throw new HttpError(400, 'invalid build code');
  const [, level, ...ids] = arr;
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) throw new HttpError(400, 'invalid level');
  if (!ids.every((id) => Number.isInteger(id) && id >= 0 && id < 1e7)) throw new HttpError(400, 'invalid items');
  if (!ids.some((id) => id > 0)) throw new HttpError(400, 'empty build');
  return level;
}
