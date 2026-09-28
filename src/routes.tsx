// Route config module, not a component file: fast-refresh boundaries do not apply.
/* eslint-disable react-refresh/only-export-components */
import { lazy, type ReactNode } from 'react';
import type { Language } from './constants/translations';
import { CalculatorPage } from './pages/CalculatorPage';
import { BuilderWipGate } from './components/WorkInProgress';
import { BUILDER_WIP } from './lib/featureFlags';
import { BUILDER_T } from './constants/builderTranslations';
import { BUILD_GALLERY_T } from './content/buildGallery';

// Single source of truth for the site's pages: the app router, the build-time
// prerenderer and the sitemap are all generated from this list.

// Every page except the landing one is lazy-loaded to keep the initial bundle small.
const SublimationsPage = lazy(() => import('./pages/SublimationsPage').then(m => ({ default: m.SublimationsPage })));
const ItemsCraftGuidePage = lazy(() => import('./pages/ItemsCraftGuidePage').then(m => ({ default: m.ItemsCraftGuidePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage').then(m => ({ default: m.ChangelogPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const TreasuresPage = lazy(() => import('./pages/TreasuresPage'));
const BeginnersGuideProfessions = lazy(() => import('./pages/guides/BeginnersGuideProfessions').then(m => ({ default: m.BeginnersGuideProfessions })));
const CompleteSublimationsGuide = lazy(() => import('./pages/guides/CompleteSublimationsGuide').then(m => ({ default: m.CompleteSublimationsGuide })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const CombatCalcPage = lazy(() => import('./pages/CombatCalcPage').then(m => ({ default: m.CombatCalcPage })));
const BuilderPage = lazy(() => import('./pages/BuilderPage').then(m => ({ default: m.BuilderPage })));
const BuildsGalleryPage = lazy(() => import('./pages/BuildsGalleryPage').then(m => ({ default: m.BuildsGalleryPage })));
export const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export interface RouteDef {
  path: string;
  render: (language: Language) => ReactNode;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
  /** false keeps the page out of sitemap.xml */
  inSitemap?: boolean;
}

export const ROUTES: RouteDef[] = [
  { path: '/', render: (l) => <CalculatorPage language={l} />, changefreq: 'weekly', priority: 1.0 },
  {
    path: '/builder',
    render: (l) => <BuilderWipGate language={l} title={BUILDER_T[l].pageTitle} path="/builder"><BuilderPage language={l} /></BuilderWipGate>,
    changefreq: 'weekly', priority: 0.9, inSitemap: !BUILDER_WIP,
  },
  {
    path: '/builds',
    render: (l) => <BuilderWipGate language={l} title={BUILD_GALLERY_T[l].title} path="/builds"><BuildsGalleryPage language={l} /></BuilderWipGate>,
    changefreq: 'daily', priority: 0.8, inSitemap: !BUILDER_WIP,
  },
  { path: '/sublimations', render: (l) => <SublimationsPage language={l} />, changefreq: 'weekly', priority: 0.9 },
  { path: '/items-craft-guide', render: (l) => <ItemsCraftGuidePage language={l} />, changefreq: 'weekly', priority: 0.8 },
  { path: '/combat-calc', render: (l) => <CombatCalcPage language={l} />, changefreq: 'monthly', priority: 0.8 },
  { path: '/treasures', render: (l) => <TreasuresPage language={l} />, changefreq: 'monthly', priority: 0.8 },
  { path: '/guides', render: (l) => <GuidesPage language={l} />, changefreq: 'monthly', priority: 0.8 },
  { path: '/guides/beginners-guide-professions', render: (l) => <BeginnersGuideProfessions language={l} />, changefreq: 'monthly', priority: 0.7 },
  { path: '/guides/complete-sublimations-guide', render: (l) => <CompleteSublimationsGuide language={l} />, changefreq: 'monthly', priority: 0.7 },
  { path: '/about', render: (l) => <AboutPage language={l} />, changefreq: 'monthly', priority: 0.5 },
  { path: '/changelog', render: (l) => <ChangelogPage language={l} />, changefreq: 'monthly', priority: 0.5 },
  { path: '/contact', render: (l) => <ContactPage language={l} />, changefreq: 'yearly', priority: 0.4 },
  { path: '/privacy', render: (l) => <PrivacyPolicyPage language={l} />, changefreq: 'yearly', priority: 0.3 },
  { path: '/terms', render: (l) => <TermsOfServicePage language={l} />, changefreq: 'yearly', priority: 0.3 },
  { path: '/cookies', render: (l) => <CookiePolicyPage language={l} />, changefreq: 'yearly', priority: 0.3 },
  { path: '/disclaimer', render: (l) => <DisclaimerPage language={l} />, changefreq: 'yearly', priority: 0.3 },
];
