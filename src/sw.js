/*
Copyright 2015, 2019 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.

self.addEventListener('install', (event) => {
  console.log(event)
});

self.addEventListener('activate', (event) => {
  if (navigator.onLine) {
    event.waitUntil((async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
  }
});

self.addEventListener('fetch', (event) => {
  if (navigator.onLine) {
    event.waitUntil((async () => {
      
      if (event.request.url.includes('partner?')) {
       
        var login
        await fetch(event.request).then(result => // Get login image
          result.json().then(
            resultJson => { login = resultJson.login }
          )
        )
        const cache = await caches.open(CACHE_NAME);
        await cache.put("loginImage", new Response(login), { // Adding login imagen to cache
          headers: {
            'content-type': 'image/png'
          }
        })
        createOfflinePage();
      }
    })());
    event.waitUntil((async () => {
     
      if (event.request.url.includes('initialelements?')) {
        
        var favicon
        await fetch(event.request).then(result => // Get favicon image
          result.json().then(
            resultJson => { favicon = resultJson.favicon }))

        const cache = await caches.open(CACHE_NAME);
        await cache.put("faviconImage", new Response(favicon), { // Adding favicon to cache
          headers: {
            'content-type': 'image/png'
          }
        })

        createOfflinePage();
      }
    })());

    event.waitUntil((async () => {
      var headerText
      var paragraphText

      if (event.request.url.includes('i18n')) {

        var language
        await fetch(event.request).then(result => // Get offline texts
          result.json().then(
            resultJson => { language = resultJson, headerText = language.OFFLINE.HEADER, paragraphText = language.OFFLINE.TEXT }))

        const cache = await caches.open(CACHE_NAME);
        await cache.put("headerText", new Response(headerText), { // Adding header text
          headers: {
          }
        })
        await cache.put("paragraphText", new Response(paragraphText), { // Adding paragrapgh text
          headers: {
          }
        })

        createOfflinePage();
      }
    })());
  }
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        if (!navigator.onLine) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match("offlinePage.html");
          return cachedResponse;
        }
        else {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        }
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match("offlinePage.html");
        return cachedResponse;
      }
    })());

  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});

async function createOfflinePage() {
  const cache = await caches.open(CACHE_NAME);
  const cachedLogin = await cache.match("loginImage");
  const cachedFavicon = await cache.match("faviconImage");
  const cachedOfflineHeader = await cache.match("headerText");
  const cachedOfflineParagraph = await cache.match("headerText");
  if (cachedLogin && cachedFavicon && cachedOfflineHeader && cachedOfflineParagraph) {
    var html
    var faviconImage
    var loginImage
    var headerText
    var paragraphText
    await fetch('offline.html').then(result => // Get offline template
      result.text().then(fileHtml => { html = fileHtml }))

    await cache.match("faviconImage").then(res => // Get favicon image cached
      res.text().then(
        result => { faviconImage = result }
      )
    )
    await cache.match("loginImage").then(res => // Get login image cached
      res.text().then(
        result => { loginImage = result }
      )
    )
    await cache.match("headerText").then(res => // Get header text cached
      res.text().then(
        result => { headerText = result }
      )
    )
    await cache.match("paragraphText").then(res => // Get paragrapgh text cached
      res.text().then(
        result => { paragraphText = result }
      )
    )
    await cache.put("offlinePage.html", new Response(html.replace("{{loginImage}}", loginImage)
      .replace("{{faviconImage}}", faviconImage)
      .replace("{{headerText}}", headerText)
      .replace("{{paragraphText}}", paragraphText), { // Adding custom page
      headers: {
        'content-type': 'text/html'
      }
    }))
  }
}