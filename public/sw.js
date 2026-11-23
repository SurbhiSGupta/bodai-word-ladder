// Bodai Word Ladder's service worker: once a page has loaded, the game keeps working
// offline. Pages come from the network first (so a new version shows up), falling back
// to the copy saved last time. Everything else (scripts, word lists, sounds) has a
// fingerprint or never changes, so the saved copy is used first.
// Bump VERSION only to throw every saved file away.

const VERSION = 'v1';
const CACHE = `bodai-ladder-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/'])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Only this site's own files, and never Storybook or analytics.
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/storybook')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (saved) =>
        saved ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
