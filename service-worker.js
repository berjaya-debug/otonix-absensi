const CACHE_NAME = 'absen-cbb-v2'; // ← ganti versi setiap ada update

const urlsToCache = [
  '/',
  'index.html',
  'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Install: simpan cache baru
self.addEventListener('install', event => {
  self.skipWaiting(); // ← langsung aktif tanpa nunggu tab lama ditutup
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: hapus cache lama otomatis
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // semua cache selain versi sekarang
          .map(key => caches.delete(key))    // dihapus
      )
    ).then(() => self.clients.claim()) // ← langsung kuasai semua tab
  );
});

// Fetch: ambil dari jaringan dulu, cache sebagai fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Simpan salinan response ke cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // kalau offline, pakai cache
  );
});
