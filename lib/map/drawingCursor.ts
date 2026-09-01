const PEN_CURSOR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 20l1.2-3.6L16.5 5.1a2 2 0 0 1 2.8 2.8L8 19.2 4 20z" fill="#fff" stroke="#0f172a" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 6l4 4" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/></svg>';

/** Custom pen cursor for map drawing — hotspot at the pen tip (bottom-left). */
export const DRAWING_PEN_CURSOR = `url('data:image/svg+xml,${encodeURIComponent(PEN_CURSOR_SVG)}') 4 20, crosshair`;
