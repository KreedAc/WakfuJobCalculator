import { describe, expect, it } from 'vitest';
import { localizedPath, splitLocale } from './locale';

describe('language in the URL', () => {
  it('reads the language prefix', () => {
    expect(splitLocale('/')).toEqual({ language: 'en', path: '/' });
    expect(splitLocale('/treasures')).toEqual({ language: 'en', path: '/treasures' });
    expect(splitLocale('/fr')).toEqual({ language: 'fr', path: '/' });
    expect(splitLocale('/es/guides/complete-sublimations-guide')).toEqual({ language: 'es', path: '/guides/complete-sublimations-guide' });
    // only a whole path segment is a language
    expect(splitLocale('/french-page')).toEqual({ language: 'en', path: '/french-page' });
  });

  it('builds the path of a page in a language', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('en', '/treasures')).toBe('/treasures');
    expect(localizedPath('pt', '/')).toBe('/pt');
    expect(localizedPath('pt', '/treasures')).toBe('/pt/treasures');
  });
});
