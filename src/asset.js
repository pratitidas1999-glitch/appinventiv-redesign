// Resolve a /public asset against Vite's base URL so paths work whether the
// site is served from a domain root (Netlify/Vercel) or a subpath such as a
// GitHub Pages project site (username.github.io/repo/).
export const asset = (p) => import.meta.env.BASE_URL.replace(/\/$/, '') + p
