import { Helmet } from "react-helmet-async";
import type { Language } from "../constants/translations";

const SITE = "https://wakfujobcalculator.com";
const OG_IMAGE = `${SITE}/424478.jpg`;

type SeoText = { title: string; description: string };

const SEO_TEXT: Record<Language, Record<"/" | "/sublimations" | "/items-craft-guide", SeoText>> = {
  en: {
    "/": {
      title: "Wakfu XP Calculator | WakfuJobCalculator",
      description: "Calculate profession XP and leveling progress in Wakfu. Plan resources and level faster."
    },
    "/sublimations": {
      title: "Wakfu Sublimations | WakfuJobCalculator",
      description: "Browse Wakfu sublimations and effects to optimize your build."
    },
    "/items-craft-guide": {
      title: "Wakfu Items Craft Guide | WakfuJobCalculator",
      description: "Item craft guide for Wakfu: materials and crafting planning."
    }
  },
  fr: {
    "/": {
      title: "Calculateur d’XP Wakfu | WakfuJobCalculator",
      description: "Calculez l’XP des métiers et la progression. Planifiez vos ressources et montez plus vite."
    },
    "/sublimations": {
      title: "Sublimations Wakfu | WakfuJobCalculator",
      description: "Consultez les sublimations Wakfu et leurs effets pour optimiser votre build."
    },
    "/items-craft-guide": {
      title: "Guide de craft d’objets Wakfu | WakfuJobCalculator",
      description: "Guide de craft Wakfu : matériaux et planification."
    }
  },
  es: {
    "/": {
      title: "Calculadora de XP Wakfu | WakfuJobCalculator",
      description: "Calcula la XP de profesiones y tu progreso. Planifica recursos y sube más rápido."
    },
    "/sublimations": {
      title: "Sublimaciones Wakfu | WakfuJobCalculator",
      description: "Explora sublimaciones de Wakfu y sus efectos para optimizar tu build."
    },
    "/items-craft-guide": {
      title: "Guía de crafteo de objetos Wakfu | WakfuJobCalculator",
      description: "Guía de crafteo Wakfu: materiales y planificación."
    }
  },
  pt: {
    "/": {
      title: "Calculadora de XP Wakfu | WakfuJobCalculator",
      description: "Calcule a XP de profissões e seu progresso. Planeje recursos e evolua mais rápido."
    },
    "/sublimations": {
      title: "Sublimações Wakfu | WakfuJobCalculator",
      description: "Veja sublimações do Wakfu e efeitos para otimizar sua build."
    },
    "/items-craft-guide": {
      title: "Guia de craft de itens Wakfu | WakfuJobCalculator",
      description: "Guia de craft Wakfu: materiais e planejamento."
    }
  }
};

function normalizePath(pathname: string): "/" | "/sublimations" | "/items-craft-guide" {
  if (pathname === "/") return "/";
  if (pathname.startsWith("/sublimations")) return "/sublimations";
  if (pathname.startsWith("/items-craft-guide")) return "/items-craft-guide";
  return "/";
}

export function Seo({ lang, pathname }: { lang: Language; pathname: string }) {
  const route = normalizePath(pathname);
  const { title, description } = SEO_TEXT[lang][route];
  const url = `${SITE}${route === "/" ? "" : route}`;

  return (
    <Helmet>
      {/* Lingua corretta sull'html */}
      <html lang={lang} />

      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Robots + preview immagine grande */}
      <meta name="robots" content="index,follow,max-image-preview:large" />

      {/* Privacy */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Canonical per route */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content="WakfuJobCalculator" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:alt" content="WakfuJobCalculator - Wakfu tools" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
