/* MacNeil Guide service worker: caches the whole app so it works with no signal. */
const CACHE="macneil-guide-468127143a";
const FILES=["index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.concat(["./"]))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("macneil-guide-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==="navigate"){e.respondWith(caches.open(CACHE).then(c=>c.match("index.html").then(hit=>{const net=fetch(r).then(res=>{if(res.ok)c.put("index.html",res.clone());return res}).catch(()=>hit);return hit||net})));return}
 e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))))});
