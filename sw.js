/* Cache hanya fail aplikasi; panggilan API, rekod dan evidens tidak dicache. */
const CACHE='skas-shell-v1.0.0';
const ASSETS=['./','./index.html','./styles.css','./config.js','./app.js','./manifest.webmanifest','./assets/lencana.png','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/jakarta.woff2'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('skas-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const known=ASSETS.some(path=>new URL(path,self.registration.scope).href===url.href);
  if(event.request.mode!=='navigate'&&!known)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok&&response.type==='basic'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(async()=>{const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate'){const shell=await caches.match(new URL('index.html',self.registration.scope).href);if(shell)return shell;}return new Response('Luar talian. Buka semula apabila Internet tersedia.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}));
});
