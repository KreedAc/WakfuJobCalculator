import { describe, expect, it } from 'vitest';
import { cleanText, codeLevel, HttpError } from './validate';

const code = (arr: unknown[]) => btoa(JSON.stringify(arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

describe('build code validation', () => {
  it('accepts a Builder share code and returns its level', () => {
    expect(codeLevel(code([1, 230, 29171, 0, 0]))).toBe(230);
  });
  it.each([
    ['not base64', 'abc$'],
    ['wrong version', code([2, 230, 1])],
    ['level out of range', code([1, 999, 1])],
    ['no items', code([1, 200, 0, 0])],
    ['non-integer item', code([1, 200, 'x'])],
    ['not a string', 42],
  ])('rejects %s', (_, value) => {
    expect(() => codeLevel(value)).toThrow(HttpError);
  });
});

describe('text cleaning', () => {
  it('collapses whitespace and strips control characters on one line', () => {
    expect(cleanText('  Iop \n tank\u0007 230 ', 60)).toBe('Iop tank 230');
  });
  it('keeps line breaks in descriptions, at most one blank line', () => {
    expect(cleanText('a\n\n\n\nb\tc', 500, true)).toBe('a\n\nb c');
  });
  it('bounds the length and ignores non-strings', () => {
    expect(cleanText('x'.repeat(100), 30)).toHaveLength(30);
    expect(cleanText(null, 30)).toBe('');
  });
});
