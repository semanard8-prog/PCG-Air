/* ============================================================
   AIRLIFE PCG — service worker
   Offline-first. The whole app is one HTML file, so the shell
   precache is small and the aircraft never needs a signal.
   Bump CACHE on every deploy so phones pick the new build up.
   ============================================================ */

var CACHE = 'airlife-pcg-v10-dispatch-vent';
var FONTS = 'airlife-fonts-v1';

var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE && k !== FONTS) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('message', function(e){
  if(e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;

  var url = new URL(req.url);

  /* Google Fonts: stale-while-revalidate, so the typeface survives
     the first flight out of coverage. Opaque responses cache fine. */
  if(url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    e.respondWith(
      caches.open(FONTS).then(function(c){
        return c.match(req).then(function(hit){
          var net = fetch(req).then(function(res){
            if(res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
            return res;
          }).catch(function(){ return hit; });
          return hit || net;
        });
      })
    );
    return;
  }

  if(url.origin !== self.location.origin) return;

  /* Navigations always resolve to the cached shell when offline —
     hash routes never hit the network, but a cold launch might. */
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put('./index.html', copy); });
        return res;
      }).catch(function(){
        return caches.match('./index.html').then(function(hit){
          return hit || new Response(
            '<h1>Offline</h1><p>The app has not been cached yet. Open it once with a signal.</p>',
            {headers:{'Content-Type':'text/html'}}
          );
        });
      })
    );
    return;
  }

  /* Everything else: cache first, fall back to network, then store. */
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit) return hit;
      return fetch(req).then(function(res){
        if(res && res.ok){
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
