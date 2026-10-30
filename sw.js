/* Brewer Lab · service worker: guarda la app en el teléfono para usarla sin conexión */
const VERSION = "1.0.3";
const APP = `brewer-lab-v${VERSION}`;
const EXT = "brewer-lab-externos";   /* fuentes y librerías de terceros: se reutilizan entre versiones */
const SHELL = ["./", "index.html", "contenido.js", "nucleo.js", "ia.js", "sync.js", "app.js", "extras.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-192.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
const FUENTES = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Instrument+Sans:wght@400..700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
const HTML2PDF = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
/* Datos en vivo: nunca desde la caché */
const EN_VIVO = ["api.github.com", "api.anthropic.com"];

async function guardarFuentes(cache) {
  const r = await fetch(FUENTES, { mode: "cors" });
  if (!r.ok) return;
  await cache.put(FUENTES, r.clone());
  const css = await r.text();
  /* Solo los alfabetos que usa el español */
  const urls = css.split("/* ").slice(1)
    .map(b => ({ sub: b.slice(0, b.indexOf(" */")), url: (b.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/) || [])[1] }))
    .filter(b => b.url && (b.sub === "latin" || b.sub === "latin-ext")).map(b => b.url);
  await Promise.all(urls.map(async u => { try { if (!(await cache.match(u))) { const f = await fetch(u, { mode: "cors" }); if (f.ok) await cache.put(u, f); } } catch (e) { /* se guarda al usarse */ } }));
}

self.addEventListener("install", ev => {
  ev.waitUntil((async () => {
    const app = await caches.open(APP);
    await app.addAll(SHELL.map(u => new Request(u, { cache: "reload" })));
    const ext = await caches.open(EXT);
    try { await guardarFuentes(ext); } catch (e) { /* sin fuentes: se usan las del sistema */ }
    try { if (!(await ext.match(HTML2PDF))) { const r = await fetch(HTML2PDF, { mode: "cors" }); if (r.ok) await ext.put(HTML2PDF, r); } } catch (e) { /* se guarda al usarse */ }
  })());
});

self.addEventListener("activate", ev => {
  ev.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("brewer-lab-v") && k !== APP) await caches.delete(k);
    await self.clients.claim();
  })());
});

/* La página pide activar la versión nueva cuando la persona toca "Actualizar" */
self.addEventListener("message", ev => { if (ev.data && ev.data.tipo === "activar") self.skipWaiting(); });

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.protocol !== "https:" && url.protocol !== "http:") return;
  if (EN_VIVO.includes(url.hostname)) return;

  /* La app: primero lo guardado, así abre al instante y sin señal */
  if (url.origin === self.location.origin) {
    ev.respondWith((async () => {
      const app = await caches.open(APP);
      if (req.mode === "navigate") {
        const r = await app.match(req, { ignoreSearch: true }) || await app.match("index.html");
        if (r) return r;
        return fetch(req);
      }
      const r = await app.match(req, { ignoreSearch: true });
      if (r) return r;
      const net = await fetch(req);
      if (net.ok) app.put(req, net.clone()).catch(() => {});
      return net;
    })());
    return;
  }

  /* Fuentes y librerías: lo guardado y, en segundo plano, la versión más reciente */
  ev.respondWith((async () => {
    const ext = await caches.open(EXT);
    const guardado = await ext.match(req, { ignoreVary: true });
    const red = fetch(req).then(r => { if (r.ok || r.type === "opaque") ext.put(req, r.clone()).catch(() => {}); return r; });
    if (guardado) { ev.waitUntil(red.catch(() => {})); return guardado; }
    return red;
  })());
});
