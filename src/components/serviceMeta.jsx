/* Shared visual meta for every Services layout variant — one source of truth
   for the per-service grounds and icons, so a change here updates all layouts. */

/* purple / charcoal / rust / white (the 4th is light-grounded → dark ink) */
export const GRADIENTS = [
  'linear-gradient(155deg, #5a3ad0 0%, #3d2597 100%)',
  'linear-gradient(155deg, #2c2933 0%, #17161a 100%)',
  'linear-gradient(155deg, #cb551f 0%, #8f3a12 100%)',
  'linear-gradient(155deg, #ffffff 0%, #f1ecdf 100%)',
]
export const LIGHT = new Set([3])

/* monoline icons in section order: Consulting · Product · AI/Data · Cloud */
const ICONS = [
  <><circle cx="12" cy="12" r="9" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" /></>,
  <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
  <><path d="M4 20V10M9.5 20V4M15 20v-7M20.5 20V8" /></>,
  <><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
]

export function Icon({ i }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[i]}
    </svg>
  )
}

export const sectionInView = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}
