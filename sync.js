/* Brewer Lab · sincronización con GitHub: sube notas y fotos al repositorio privado cuando hay internet */
(() => {
"use strict";
const B = window.BL, S = B.Store;
const API = "https://api.github.com";
const Sync = B.Sync = { corriendo: false, timer: null };

Sync.configurado = () => { const g = S.github || {}; return !!(g.owner && g.repo && g.token); };
const cab = () => ({ "Accept": "application/vnd.github+json", "Authorization": `Bearer ${S.github.token}`, "X-GitHub-Api-Version": "2022-11-28" });
const ruta = p => p.split("/").map(encodeURIComponent).join("/");
const repoUrl = () => `${API}/repos/${encodeURIComponent(S.github.owner)}/${encodeURIComponent(S.github.repo)}`;
const b64texto = s => { const bytes = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); };
const textoB64 = b => { const bin = atob(String(b).replace(/\s/g, "")); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); };
const blobB64 = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });

async function contenido(metodo, path, cuerpo) {
  const rama = S.github.branch || "main";
  const url = `${repoUrl()}/contents/${ruta(path)}` + (metodo === "GET" ? `?ref=${encodeURIComponent(rama)}` : "");
  const r = await fetch(url, { method: metodo, headers: Object.assign(cab(), cuerpo ? { "Content-Type": "application/json" } : {}), body: cuerpo ? JSON.stringify(cuerpo) : undefined, cache: "no-store" });
  let data = null; try { data = await r.json(); } catch (e) { /* sin cuerpo */ }
  return { status: r.status, data };
}

/* Crea o actualiza un archivo. Si ya existe y pertenece a otro registro, no lo pisa. */
async function subir(path, b64, mensaje, sha, idApp) {
  const g = S.github; const rama = g.branch || "main";
  const extra = g.nombre && g.email ? { committer: { name: g.nombre, email: g.email } } : {};
  let r = await contenido("PUT", path, Object.assign({ message: mensaje, content: b64, branch: rama }, sha ? { sha } : {}, extra));
  if (r.status === 409 || r.status === 422) {
    const ex = await contenido("GET", path);
    if (ex.status === 200 && ex.data && ex.data.sha) {
      if (idApp && ex.data.content) {
        const m = textoB64(ex.data.content).match(/brewer_app_id:\s*"?([^"\n]+)"?/);
        if (m && m[1].trim() !== idApp) return { conflicto: true };
      }
      r = await contenido("PUT", path, Object.assign({ message: mensaje, content: b64, branch: rama, sha: ex.data.sha }, extra));
    }
  }
  if (r.status === 200 || r.status === 201) return { sha: r.data && r.data.content && r.data.content.sha };
  throw { code: "github_" + r.status, mensaje: (r.data && r.data.message) || "" };
}
async function borrar(path, sha, mensaje) {
  const r = await contenido("DELETE", path, { message: mensaje, sha, branch: S.github.branch || "main" });
  return r.status === 200;
}

Sync.mensajeError = code => ({
  github_401: "El token de GitHub no es válido o venció. Crea uno nuevo en Ajustes.",
  github_403: "El token no tiene permiso de escritura en el repositorio (Contents: Read and write).",
  github_404: "No encuentro el repositorio. Revisa usuario, nombre del repositorio y permisos del token.",
  sin_red: "Sin conexión: se sincronizará al volver internet.",
  sin_config: "Conecta tu GitHub en Ajustes para sincronizar."
}[code] || "Hubo un problema al sincronizar. Se reintentará más tarde.");

Sync.probar = async () => {
  if (!Sync.configurado()) return { ok: false, code: "sin_config" };
  const r = await fetch(repoUrl(), { headers: cab(), cache: "no-store" });
  if (r.status !== 200) return { ok: false, code: "github_" + r.status };
  const d = await r.json();
  return { ok: true, privado: !!d.private, escribir: !!(d.permissions && (d.permissions.push || d.permissions.admin)), rama: d.default_branch };
};

Sync.ejecutar = async () => {
  if (Sync.corriendo) return { ok: false, code: "en_curso" };
  if (!Sync.configurado()) return { ok: false, code: "sin_config" };
  if (!navigator.onLine) return { ok: false, code: "sin_red" };
  Sync.corriendo = true; S.emit();
  const res = { notas: 0, fotos: 0, conflictos: [], errores: [] };
  let fatal = null;
  try {
    const fotos = (await S.fotos()).filter(f => f.sync !== "sincronizado" && f.blob);
    for (const f of fotos) {
      try { const out = await subir(`Brewer Lab/Adjuntos/${f.id}.jpg`, await blobB64(f.blob), `Brewer Lab: foto ${f.id}`, f.gh_sha, null); await S.marcarFoto(f.id, { sync: "sincronizado", gh_sha: out.sha }); res.fotos++; }
      catch (e) { res.errores.push(e.code || "error"); if (/github_40[134]/.test(e.code || "")) { fatal = e.code; break; } }
    }
    if (!fatal) for (const col of S.COLS) {
      for (const r of S.d[col].filter(x => x.sync === "pendiente")) {
        try {
          const mismo = r.obsidian === r.ruta;
          const out = await subir(r.ruta, b64texto(r.md), `Brewer Lab: ${S.NOMBRES_COL[col][0]} · ${r.ruta.split("/").pop().replace(/\.md$/, "")}`, mismo ? r.gh_sha : null, r.id);
          if (out.conflicto) { res.conflictos.push(r.ruta); continue; }
          if (r.obsidian && !mismo && r.gh_sha) { try { await borrar(r.obsidian, r.gh_sha, `Brewer Lab: renombrado a ${r.ruta.split("/").pop()}`); } catch (e) { /* el archivo viejo queda */ } }
          await S.marcar(col, r.id, { sync: "sincronizado", obsidian: r.ruta, gh_sha: out.sha, sincronizado_en: new Date().toISOString() });
          res.notas++;
        } catch (e) { res.errores.push(e.code || "error"); if (/github_40[134]/.test(e.code || "")) { fatal = e.code; break; } }
      }
      if (fatal) break;
    }
  } finally { Sync.corriendo = false; }
  await S.guardarConfig("sync", { ultimo: new Date().toISOString(), notas: res.notas, fotos: res.fotos, conflictos: res.conflictos, errores: res.errores.length, fatal });
  return Object.assign({ ok: !fatal && !res.errores.length }, res, { code: fatal });
};

Sync.programar = (ms = 4000) => {
  if ((S.prefs || {}).auto_sync === false) return;
  clearTimeout(Sync.timer);
  Sync.timer = setTimeout(() => { if (navigator.onLine && Sync.configurado()) Sync.ejecutar(); }, ms);
};

window.addEventListener("online", async () => {
  S.emit();
  if (B.IA && B.IA.procesarPendientes) { try { await B.IA.procesarPendientes(); } catch (e) { /* se reintenta luego */ } }
  Sync.programar(1500);
});
window.addEventListener("offline", () => S.emit());
})();
