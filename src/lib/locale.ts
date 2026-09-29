// Every page exists once per language: English at the root (/sublimations),
// the others under a prefix (/fr/sublimations). The app runs under that prefix
// as the router basename, so links inside it never mention the language.
import { createContext, useContext } from 'react';
import type { Language } from '../constants/translations';

export const LANGUAGES: Language[] = ['en', 'fr', 'es', 'pt'];
export const DEFAULT_LANGUAGE: Language = 'en';

/** "" for English, "/fr" for French… */
export const localePrefix = (language: Language) => (language === DEFAULT_LANGUAGE ? '' : `/${language}`);

/** The language of a full URL path and the page path inside it: "/fr/treasures" → fr, "/treasures". */
export function splitLocale(pathname: string): { language: Language; path: string } {
  const m = pathname.match(/^\/(fr|es|pt)(?=\/|$)(.*)$/);
  if (!m) return { language: DEFAULT_LANGUAGE, path: pathname || '/' };
  return { language: m[1] as Language, path: m[2] || '/' };
}

/** Full URL path of a page in a language: ("fr", "/") → "/fr", ("fr", "/treasures") → "/fr/treasures". */
export function localizedPath(language: Language, path: string): string {
  const prefix = localePrefix(language);
  if (path === '/' || path === '') return prefix || '/';
  return `${prefix}${path}`;
}

/** Current page language, for components far from the page props (SEO tags…). */
export const LanguageContext = createContext<Language>(DEFAULT_LANGUAGE);
export const useLanguage = () => useContext(LanguageContext);
