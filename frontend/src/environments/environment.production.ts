/**
 * Production build: the API is expected behind the same domain (reverse proxy `/api` → Django).
 * Change `apiUrl` to an absolute URL if the API is hosted elsewhere.
 */
export const environment = {
  production: true,
  apiUrl: '/api',
};
