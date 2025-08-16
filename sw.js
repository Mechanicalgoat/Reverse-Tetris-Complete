const CACHE_NAME = 'reverse-tetris-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './js/languages.js',
    './js/constants.js',
    './js/tetrominos.js',
    './js/board.js',
    './js/ai.js',
    './js/game.js',
    './js/ui.js',
    './js/main.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});