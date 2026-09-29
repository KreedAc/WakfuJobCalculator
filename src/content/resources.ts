// External sites recommended to players (Home and Guides pages).
import type { Language } from '../constants/translations';

export interface Resource {
  name: string;
  url: string;
  host: string;
  desc: Record<Language, string>;
}

export const RESOURCES: Resource[] = [
  {
    name: 'Wakfuli',
    url: 'https://www.wakfuli.com/',
    host: 'wakfuli.com',
    desc: {
      en: 'Build planner, skins and an encyclopedia of spells, items, dungeons and monsters.',
      fr: 'Créateur de builds, skins et encyclopédie des sorts, objets, donjons et monstres.',
      es: 'Creador de builds, skins y enciclopedia de hechizos, objetos, mazmorras y monstruos.',
      pt: 'Criador de builds, skins e enciclopédia de feitiços, itens, masmorras e monstros.',
    },
  },
  {
    name: 'Bestiário do Neze',
    url: 'https://bestiariodoneze.com.br/index.html',
    host: 'bestiariodoneze.com.br',
    desc: {
      en: 'Dungeon guide: how every dungeon and boss phase works (in Portuguese).',
      fr: 'Guide des donjons : le fonctionnement de chaque donjon et phase de boss (en portugais).',
      es: 'Guía de mazmorras: cómo funciona cada mazmorra y fase de jefe (en portugués).',
      pt: 'Guia de masmorras: como funciona cada masmorra e cada fase de chefe.',
    },
  },
  {
    name: 'WAKFU',
    url: 'https://www.wakfu.com/',
    host: 'wakfu.com',
    desc: {
      en: 'The official site by Ankama: news, patch notes and the official encyclopedia.',
      fr: "Le site officiel d'Ankama : actualités, notes de mise à jour et encyclopédie officielle.",
      es: 'El sitio oficial de Ankama: noticias, notas de parche y la enciclopedia oficial.',
      pt: 'O site oficial da Ankama: notícias, notas de atualização e a enciclopédia oficial.',
    },
  },
];

export const RESOURCES_T: Record<Language, { title: string; subtitle: string }> = {
  en: { title: 'Recommended resources', subtitle: 'Other great Wakfu sites made by the community and by Ankama.' },
  fr: { title: 'Ressources recommandées', subtitle: "D'autres excellents sites Wakfu, créés par la communauté et par Ankama." },
  es: { title: 'Recursos recomendados', subtitle: 'Otros grandes sitios de Wakfu hechos por la comunidad y por Ankama.' },
  pt: { title: 'Recursos recomendados', subtitle: 'Outros ótimos sites de Wakfu feitos pela comunidade e pela Ankama.' },
};
