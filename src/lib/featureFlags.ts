// Features that are live in the code but not yet shown to visitors.
//
// While BUILDER_WIP is true, /builder and /builds show a "Work in progress"
// page, are left out of the sitemap and are not indexed. To try them on the
// live site anyway, open /builder?preview=builder once (remembered on that
// device); /builder?preview=off forgets it. Set to false to launch.
import { useEffect, useState } from 'react';

export const BUILDER_WIP = true;

const PREVIEW_KEY = 'wjc-preview-builder';

/** true when this device opted into the preview (always false while prerendering). */
export function useBuilderPreview(): boolean {
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('preview');
      if (param === 'builder') localStorage.setItem(PREVIEW_KEY, '1');
      if (param === 'off') localStorage.removeItem(PREVIEW_KEY);
      setPreview(localStorage.getItem(PREVIEW_KEY) === '1');
    } catch {
      setPreview(new URLSearchParams(window.location.search).get('preview') === 'builder');
    }
  }, []);
  return preview;
}
