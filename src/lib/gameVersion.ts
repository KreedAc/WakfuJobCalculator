// Game data version, bundled at build time (the monthly data workflow updates
// the file, and every deploy rebuilds the site). "1.93.1.62" → "1.93".
import data from '../../public/data/wakfu_version.json';

export const GAME_VERSION: string = String(data.version).split('.').slice(0, 2).join('.');
