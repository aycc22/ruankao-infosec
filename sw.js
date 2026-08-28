/* eslint-disable no-restricted-globals */
// Service Worker：离线缓存课程与速查（版本号随内容更新递增）
var CACHE_VERSION = 'ruankao-v1';
var CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/lesson.css',
  './assets/home.css',
  './assets/quiz.js',
  './assets/course-catalog.js',
  './assets/course-nav.js',
  './assets/pwa.js',
  './assets/home.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

importScripts('./assets/course-catalog.js');

function textbookUrls() {
  var urls = [];
  for (var i = 1; i <= 26; i++) {
    var n = i < 10 ? '0' + i : '' + i;
    urls.push('./reference/textbook/ch' + n + '.html');
  }
  return urls;
}

function buildPrecacheList() {
  var urls = CORE_ASSETS.slice();
  COURSE_CATALOG.lessons.forEach(function (item) {
    urls.push('./lessons/' + item.file);
  });
  COURSE_CATALOG.references.forEach(function (item) {
    urls.push('./reference/' + item.file);
  });
  return urls.concat(textbookUrls());
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(buildPrecacheList());
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_VERSION; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var networkFetch = fetch(event.request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function () {
        return cached;
      });

      return cached || networkFetch;
    })
  );
});
