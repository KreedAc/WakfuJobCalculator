// Opens the global search palette from anywhere (top bar, Home hero…).
export const OPEN_SEARCH_EVENT = 'wjc:open-search';

export function openSearch(query = '') {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT, { detail: { query } }));
}
