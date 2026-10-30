/* Brewer Lab · núcleo: utilidades, almacenamiento, cálculos, notas de Obsidian e informes */
(() => {
"use strict";
const B = window.BL;

/* ------------------------------ Utilidades ------------------------------ */
const U = B.U = {};
U.esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
U.z2 = n => String(n).padStart(2, "0");
U.hoy = () => { const d = new Date(); return `${d.getFullYear()}-${U.z2(d.getMonth() + 1)}-${U.z2(d.getDate())}`; };
U.hora = () => { const d = new Date(); return `${U.z2(d.getHours())}h${U.z2(d.getMinutes())}`; };
U.num = v => { if (v === "" || v === null || v === undefined) return null; const n = Number(String(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
U.fmt = (n, d = 1) => (n === null || n === undefined || !Number.isFinite(Number(n))) ? "—" : Number(n).toLocaleString("es", { minimumFractionDigits: d, maximumFractionDigits: d });
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
U.fechaLarga = iso => { if (!iso) return ""; const [y, m, d] = String(iso).split("-").map(Number); if (!y || !m || !d) return String(iso); return `${d} de ${MESES[m - 1]} de ${y}`; };
U.diasDesde = iso => { if (!iso) return null; const t = new Date(iso + "T00:00:00").getTime(); if (!Number.isFinite(t)) return null; return Math.floor((Date.now() - t) / 86400000); };
U.lista = s => Array.isArray(s) ? s : String(s || "").split(",").map(x => x.trim()).filter(Boolean);
U.nombreNota = s => (String(s || "").replace(/[\\/:*?"<>|#^[\]]/g, "-").replace(/\s+/g, " ").trim().replace(/[. ]+$/, "").slice(0, 120)) || "Sin nombre";
U.ordenar = (arr, key, dir = -1) => [...arr].sort((a, b) => { const x = a[key] ?? "", y = b[key] ?? ""; return x < y ? -dir : x > y ? dir : 0; });
U.iniciales = s => (String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^(finca|hacienda|granja|cafetal|el|la|los|las)\s+/i, "").split(/\s+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || "FIN";
U.comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };

/* ------------------------------ Cálculos ------------------------------ */
const Calc = B.Calc = {};
Calc.ratio = r => { const a = U.num(r.agua_g), d = U.num(r.dosis_g); return a && d ? a / d : null; };
Calc.ey = r => { const t = U.num(r.tds), b = U.num(r.bebida_g), d = U.num(r.dosis_g); return t !== null && b && d ? t * b / d : null; };
Calc.suma = r => { let s = 0; for (const a of B.listas.atributos) { const v = U.num(r[a.key]); if (v === null) return null; s += v; } return s; };
Calc.pbl = r => { const s = Calc.suma(r); return s === null ? null : 0.65625 * s + 52.75; };
Calc.cva = r => { const p = Calc.pbl(r); if (p === null) return null; return p - 2 * (U.num(r.tazas_no_uniformes) || 0) - 4 * (U.num(r.tazas_defectuosas) || 0); };
Calc.banda = p => p === null ? null : p < 80 ? { t: "Algo falla", c: "bad" } : p < 84 ? { t: "Buena", c: "warn" } : p < 88 ? { t: "Muy buena", c: "ok" } : p < 92 ? { t: "Excelente", c: "ok" } : { t: "Memorable", c: "ok" };
Calc.indice = v => { const vals = B.areas.map(a => U.num(v["s_" + a.key])).filter(x => x !== null); if (!vals.length) return null; return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 20); };
Calc.nEval = v => B.areas.filter(a => U.num(v["s_" + a.key]) !== null).length;
Calc.semaforo = i => i === null ? null : i >= 85 ? { t: "Referente", c: "ok" } : i >= 70 ? { t: "Bueno", c: "ok" } : i >= 50 ? { t: "En desarrollo", c: "warn" } : { t: "Crítico", c: "bad" };
Calc.triangular = (n, k) => { let p = 0; for (let i = k; i <= n; i++) p += U.comb(n, i) * Math.pow(1 / 3, i) * Math.pow(2 / 3, n - i); return p; };
Calc.minAciertos = n => { for (let k = 0; k <= n; k++) if (Calc.triangular(n, k) < 0.05) return k; return null; };

/* ------------------------------ Base de datos local (IndexedDB: funciona sin conexión) ------------------------------ */
const IDB = B.IDB = {
  db: null,
  abrir() {
    return new Promise((res, rej) => {
      if (!("indexedDB" in window)) { rej(new Error("sin indexedDB")); return; }
      const rq = indexedDB.open("brewerlab", 1);
      rq.onupgradeneeded = () => {
        const d = rq.result;
        if (!d.objectStoreNames.contains("registros")) d.createObjectStore("registros", { keyPath: "id" });
        if (!d.objectStoreNames.contains("fotos")) d.createObjectStore("fotos", { keyPath: "id" });
        if (!d.objectStoreNames.contains("config")) d.createObjectStore("config", { keyPath: "k" });
      };
      rq.onsuccess = () => { this.db = rq.result; res(this.db); };
      rq.onerror = () => rej(rq.error);
    });
  },
  _rq(store, modo, hacer) {
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, modo); const rq = hacer(t.objectStore(store)); let out;
      if (rq) rq.onsuccess = () => { out = rq.result; };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  },
  todos(store) { return this._rq(store, "readonly", s => s.getAll()).then(x => x || []); },
  get(store, key) { return this._rq(store, "readonly", s => s.get(key)); },
  put(store, val) { return this._rq(store, "readwrite", s => s.put(val)); },
  del(store, key) { return this._rq(store, "readwrite", s => s.delete(key)); }
};
U.nuevoId = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

/* ------------------------------ Almacenamiento ------------------------------ */
const COLS = ["cafes", "preparaciones", "recetas", "experimentos", "catas", "fincas", "visitas", "lotes", "informes", "diagnosticos", "manuales"];
const NOMBRES_COL = { cafes: ["café", "cafés"], preparaciones: ["preparación", "preparaciones"], recetas: ["receta", "recetas"], experimentos: ["experimento", "experimentos"], catas: ["cata", "catas"], fincas: ["finca", "fincas"], visitas: ["visita", "visitas"], lotes: ["lote", "lotes"], informes: ["informe", "informes"], diagnosticos: ["diagnóstico con foto", "diagnósticos con foto"], manuales: ["manual", "manuales"] };
const CONFIGS = ["ajustes", "sync", "github", "ia", "prefs"];
const Store = B.Store = {
  COLS, NOMBRES_COL, modo: "cargando", motivo: "", listo: false,
  d: Object.fromEntries(COLS.map(c => [c, []])),
  ajustes: {}, sync: {}, github: {}, ia: {}, prefs: {}, _l: new Set(), _fotos: new Map(),
  on(fn) { this._l.add(fn); },
  emit() { this._l.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); },
  async init() {
    try {
      await IDB.abrir();
      const regs = await IDB.todos("registros");
      regs.forEach(r => { if (this.d[r.col]) this.d[r.col].push(r); });
      (await IDB.todos("config")).forEach(x => { if (CONFIGS.includes(x.k)) this[x.k] = x.v || {}; });
      this.modo = "local";
      try { if (navigator.storage && navigator.storage.persist) this.persistente = await navigator.storage.persist(); } catch (e) { /* opcional */ }
    } catch (e) {
      console.error(e); this.modo = "memoria";
      this.motivo = "Este navegador no deja guardar datos (¿modo privado?). Lo que registres se perderá al cerrar la app.";
    }
    this.listo = true; this.emit();
  },
  buscar(col, id) { return (this.d[col] || []).find(x => x.id === id) || null; },
  pendientes() {
    const r = { total: 0, por: {} };
    COLS.forEach(c => { const n = this.d[c].filter(x => x.sync === "pendiente").length; if (n) { r.por[c] = n; r.total += n; } });
    return r;
  },
  resumenPendientes() {
    const p = this.pendientes();
    return Object.entries(p.por).map(([c, n]) => `${n} ${NOMBRES_COL[c][n === 1 ? 0 : 1]}`).join(", ");
  },
  async guardar(col, rec, opts = {}) {
    const ahora = new Date().toISOString();
    const r = Object.assign({}, rec);
    const nuevo = !r.id;
    const previo = nuevo ? null : this.buscar(col, r.id);
    if (nuevo) { r.id = U.nuevoId(); r.creado = ahora; if (this.ajustes.consultor) r.autor = this.ajustes.consultor; }
    r.col = col;
    r.actualizado = ahora;
    r.sync = "pendiente";
    const nota = B.Notas.generar(col, r);
    r.ruta = nota.ruta; r.md = nota.md;
    Object.keys(r).forEach(k => { if (r[k] === undefined) delete r[k]; });
    if (this.modo === "local") await IDB.put("registros", r);
    const arr = this.d[col]; const i = arr.findIndex(x => x.id === r.id);
    if (i >= 0) arr[i] = r; else arr.push(r);
    this.emit();
    if (!opts.sinDependientes && previo) await this.regenerarDependientes(col, previo, r);
    if (!opts.silencioso && B.Sync) B.Sync.programar();
    return r.id;
  },
  /* Cambios que no deben volver a marcar el registro como pendiente (los usa la sincronización) */
  async marcar(col, id, cambios) {
    const r = this.buscar(col, id); if (!r) return;
    Object.assign(r, cambios);
    if (this.modo === "local") await IDB.put("registros", r);
    this.emit();
  },
  /* Importa registros de otra persona o de otro dispositivo */
  async importar(regs) {
    let n = 0;
    for (const x of regs) {
      if (!x || !x.id || !COLS.includes(x.col)) continue;
      const actual = this.buscar(x.col, x.id);
      if (actual && (actual.actualizado || "") >= (x.actualizado || "")) continue;
      const r = Object.assign({}, x, { sync: "pendiente" }); delete r.gh_sha; delete r.hash_sync; delete r.obsidian;
      const nota = B.Notas.generar(r.col, r); r.ruta = nota.ruta; r.md = nota.md;
      if (this.modo === "local") await IDB.put("registros", r);
      const arr = this.d[r.col]; const i = arr.findIndex(y => y.id === r.id); if (i >= 0) arr[i] = r; else arr.push(r);
      n++;
    }
    this.emit(); if (B.Sync) B.Sync.programar();
    return n;
  },
  /* Fotos (se guardan como archivos en el dispositivo) */
  async guardarFoto(f) { const x = Object.assign({ sync: "pendiente" }, f); if (this.modo === "local") await IDB.put("fotos", x); else this._fotos.set(x.id, x); return x.id; },
  async foto(id) { return this.modo === "local" ? IDB.get("fotos", id) : this._fotos.get(id); },
  async fotos() { return this.modo === "local" ? IDB.todos("fotos") : [...this._fotos.values()]; },
  async marcarFoto(id, cambios) { const f = await this.foto(id); if (!f) return; Object.assign(f, cambios); if (this.modo === "local") await IDB.put("fotos", f); else this._fotos.set(id, f); },
  async borrarFoto(id) { if (this.modo === "local") await IDB.del("fotos", id); else this._fotos.delete(id); },
  async regenerarDependientes(col, previo, actual) {
    const cambia = (a, b) => (a || "") !== (b || "");
    let hijos = [];
    if (col === "cafes" && cambia(previo.nombre, actual.nombre)) hijos = [["preparaciones", this.d.preparaciones.filter(p => p.cafe_id === actual.id)]];
    if (col === "recetas" && (cambia(previo.nombre, actual.nombre) || cambia(previo.metodo, actual.metodo))) hijos = [["preparaciones", this.d.preparaciones.filter(p => p.receta === "own:" + actual.id)]];
    if (col === "fincas" && cambia(previo.nombre, actual.nombre)) hijos = [["visitas", this.d.visitas.filter(v => v.finca_id === actual.id)], ["lotes", this.d.lotes.filter(v => v.finca_id === actual.id)], ["informes", this.d.informes.filter(v => v.finca_id === actual.id)], ["diagnosticos", this.d.diagnosticos.filter(v => v.finca_id === actual.id)]];
    for (const [c, lista] of hijos) for (const h of lista) await this.guardar(c, h, { sinDependientes: true, silencioso: true });
  },
  async eliminar(col, id) {
    const r = this.buscar(col, id);
    if (this.modo === "local") await IDB.del("registros", id);
    this.d[col] = this.d[col].filter(x => x.id !== id);
    if (r && col === "diagnosticos") for (const f of (r.fotos || [])) { try { const ft = await this.foto(f); if (ft && ft.sync !== "sincronizado") await this.borrarFoto(f); } catch (e) { /* sin foto */ } }
    this.emit();
  },
  async guardarConfig(k, data) {
    this[k] = Object.assign({}, data);
    if (this.modo === "local") await IDB.put("config", { k, v: this[k] });
    this.emit();
  }
};

/* ------------------------------ Notas para Obsidian ------------------------------ */
const Y = {
  s: v => (v === null || v === undefined || v === "") ? "" : " " + JSON.stringify(String(v)),
  n: v => { const x = U.num(v); return x === null ? "" : " " + x; },
  d: v => /^\d{4}-\d{2}-\d{2}$/.test(v || "") ? " " + v : "",
  b: v => " " + (v ? "true" : "false"),
  l: v => (v ? " " + JSON.stringify(`[[${v}]]`) : ""),
  a: a => { const arr = U.lista(a); return arr.length ? "\n" + arr.map(x => "  - " + JSON.stringify(String(x))).join("\n") : " []"; }
};
const fm = rows => "---\ncssclasses:\n  - brewer-lab\n" + rows.map(([k, v]) => `${k}:${v}`).join("\n") + "\n---\n";
const td = s => String(s ?? "").replace(/\|/g, "\\|").replace(/\s*\n+\s*/g, " ").trim();
const bloque = (s, vacio = "—") => (s && String(s).trim()) ? String(s).trim() : vacio;
const BASE = "Brewer Lab";
const FINCAS = `${BASE}/09 Coffee Farm Lab/Fincas`;

const Nom = B.Nom = {
  cafe: c => U.nombreNota(c && c.nombre),
  receta: r => U.nombreNota(`${r.metodo || "Método"} · ${r.nombre || "Receta"}`),
  finca: f => U.nombreNota(f && f.nombre),
  prep(p) {
    const cafe = Store.buscar("cafes", p.cafe_id);
    const base = `${p.fecha || U.hoy()} · ${p.metodo || "Preparación"} · ${cafe ? cafe.nombre : (p.cafe_txt || "Café")}`;
    const dup = Store.d.preparaciones.some(o => o.id !== p.id && o.titulo_base === base && (o.creado || "") < (p.creado || "9"));
    return U.nombreNota(dup ? `${base} · ${p.hora || "2"}` : base);
  },
  recetaLink(valor) {
    if (!valor) return "";
    if (valor.startsWith("ref:")) return valor.slice(4);
    if (valor.startsWith("own:")) { const r = Store.buscar("recetas", valor.slice(4)); return r ? Nom.receta(r) : ""; }
    return "";
  },
  recetaTexto(valor) {
    if (!valor) return "";
    if (valor.startsWith("ref:")) return valor.slice(4);
    const r = Store.buscar("recetas", valor.slice(4)); return r ? `${r.metodo} · ${r.nombre}` : "";
  }
};

const BASE_PREP = (titulo, puntajeTxt = "Puntaje PBL") => "```base\nfilters:\n  and:\n    - 'tipo == \"preparacion\"'\n    - file.hasLink(this.file)\nformulas:\n  ratio: '(agua_g / dosis_g).round(1)'\n  puntaje: '(0.65625 * (fragancia + aroma + sabor + retrogusto + acidez + dulzor + cuerpo + general) + 52.75).round(2)'\nproperties:\n  formula.ratio:\n    displayName: Ratio 1:x\n  formula.puntaje:\n    displayName: " + puntajeTxt + "\nviews:\n  - type: table\n    name: " + titulo + "\n    order:\n      - note.fecha\n      - file.name\n      - note.metodo\n      - formula.ratio\n      - note.clicks\n      - note.temp_c\n      - formula.puntaje\n    sort:\n      - property: note.fecha\n        direction: DESC\n```";
const BASE_FINCA = "```base\nfilters:\n  and:\n    - 'tipo == \"visita\"'\n    - file.hasLink(this.file)\nformulas:\n  indice: '((s_genetica + s_sanidad + s_suelo + s_sombra + s_manejo + s_cosecha + s_beneficio + s_secado + s_calidad + s_trazabilidad + s_social + s_ambiente + s_economia) / 13 * 20).round(0)'\nproperties:\n  formula.indice:\n    displayName: Índice Farm Lab\nviews:\n  - type: table\n    name: Visitas\n    order:\n      - note.fecha\n      - file.name\n      - note.tipo_visita\n      - formula.indice\n    sort:\n      - property: note.fecha\n        direction: DESC\n```\n\n## 📦 Lotes\n\n```base\nfilters:\n  and:\n    - 'tipo == \"lote\"'\n    - file.hasLink(this.file)\nviews:\n  - type: table\n    name: Lotes\n    order:\n      - file.name\n      - note.parcela\n      - note.variedad\n      - note.proceso\n      - note.fecha_cosecha\n      - note.puntaje_cva\n      - note.estado\n```";

const Notas = B.Notas = {};
Notas.generar = (col, r) => {
  const g = Notas[col];
  if (!g) return { ruta: "", md: "" };
  return g(r);
};

Notas.cafes = c => {
  const nombre = Nom.cafe(c);
  const md = fm([
    ["tipo", Y.s("cafe")], ["tostador", Y.s(c.tostador)], ["pais", Y.s(c.pais)], ["region", Y.s(c.region)], ["finca", Y.s(c.finca)], ["productor", Y.s(c.productor)],
    ["variedad", Y.a(c.variedad)], ["proceso", Y.s(c.proceso)], ["altitud_m", Y.n(c.altitud_m)], ["cosecha", Y.s(c.cosecha)],
    ["fecha_tueste", Y.d(c.fecha_tueste)], ["fecha_apertura", Y.d(c.fecha_apertura)], ["peso_g", Y.n(c.peso_g)], ["precio", Y.n(c.precio)],
    ["nivel_tueste", Y.s(c.nivel_tueste)], ["notas_tostador", Y.a(c.notas_tostador)], ["estado", Y.s(c.estado || "abierto")], ["rating_cafe", Y.n(c.rating_cafe)],
    ["brewer_app_id", Y.s(c.id)], ["tags", Y.a(["brewer-lab/cafe"])]
  ]) + `# ${nombre}

## 🧾 Origen

- **Finca / productor**: ${bloque([c.finca, c.productor].filter(Boolean).join(" · "))}
- **Región**: ${bloque([c.region, c.pais].filter(Boolean).join(", "))}${U.num(c.altitud_m) ? ` · ${c.altitud_m} m` : ""}
- **Variedad**: ${bloque(U.lista(c.variedad).join(", "))}
- **Proceso**: ${bloque(c.proceso)}
- **Lo que dice el tostador**: ${bloque(U.lista(c.notas_tostador).join(", "))}

## 👃 Primera impresión

${bloque(c.impresion)}

## 🎯 Mejor receta encontrada

${bloque(c.mejor_receta)}

## 📓 Preparaciones con este café

${BASE_PREP("Preparaciones con este café")}

## 🏁 Cierre de la bolsa

${bloque(c.cierre)}
`;
  return { ruta: `${BASE}/06 Cafés/${nombre}.md`, md };
};

Notas.preparaciones = p => {
  const titulo = Nom.prep(p);
  p.titulo_base = `${p.fecha || U.hoy()} · ${p.metodo || "Preparación"} · ${(Store.buscar("cafes", p.cafe_id) || {}).nombre || p.cafe_txt || "Café"}`;
  const cafe = Store.buscar("cafes", p.cafe_id);
  const pbl = Calc.pbl(p), ratio = Calc.ratio(p), ey = Calc.ey(p);
  const md = fm([
    ["tipo", Y.s("preparacion")], ["fecha", Y.d(p.fecha)], ["cafe", cafe ? Y.l(Nom.cafe(cafe)) : Y.s(p.cafe_txt)], ["metodo", Y.s(p.metodo)],
    ["receta", Y.l(Nom.recetaLink(p.receta))], ["dosis_g", Y.n(p.dosis_g)], ["agua_g", Y.n(p.agua_g)], ["bebida_g", Y.n(p.bebida_g)],
    ["clicks", Y.n(p.clicks)], ["temp_c", Y.n(p.temp_c)], ["tiempo", Y.s(p.tiempo)], ["filtro", Y.s(p.filtro)], ["agua", Y.s(p.agua)], ["tds", Y.n(p.tds)],
    ...B.listas.atributos.map(a => [a.key, Y.n(p[a.key])]),
    ["estrellas", Y.n(p.estrellas)], ["repetir", Y.b(p.repetir)], ["notas_sabor", Y.a(p.notas_sabor)],
    ["brewer_app_id", Y.s(p.id)], ["tags", Y.a(["brewer-lab/preparacion"])]
  ]) + `# ${titulo}

> [!abstract] Lecturas
> Ratio **1:${U.fmt(ratio, 1)}** · Extracción **${ey === null ? "—" : U.fmt(ey, 1) + " %"}** · Puntaje **${pbl === null ? "—" : U.fmt(pbl, 2)}**${U.num(p.estrellas) ? ` · ${"⭐".repeat(U.num(p.estrellas))}` : ""}

## ⏱️ Paso a paso real

${bloque(p.pasos)}

## 👅 Cata

${bloque(p.cata)}

- **Sabores percibidos**: ${bloque(U.lista(p.notas_sabor).join(", "))}

## 🔧 Siguiente paso

- **La próxima vez cambio UNA cosa**: ${bloque(p.siguiente)}
`;
  return { ruta: `${BASE}/04 Bitácora/${titulo}.md`, md };
};

Notas.recetas = r => {
  const nombre = Nom.receta(r);
  const pasos = (r.pasos || []).filter(x => x && (x.t || x.accion || x.agua));
  const hist = (r.historial || []).filter(x => x && (x.version || x.cambio));
  const md = fm([
    ["tipo", Y.s("receta")], ["autoria", Y.s("propia")], ["metodo", Y.s(r.metodo)], ["estado", Y.s(r.estado || "en prueba")], ["version", Y.n(r.version || 1)],
    ["dosis_g", Y.n(r.dosis_g)], ["agua_g", Y.n(r.agua_g)], ["clicks_rango", Y.s(r.clicks_rango)], ["temp_c", Y.n(r.temp_c)],
    ["tiempo_objetivo", Y.s(r.tiempo_objetivo)], ["filtro", Y.s(r.filtro)], ["fuente", Y.s(r.fuente || "propia")],
    ["brewer_app_id", Y.s(r.id)], ["tags", Y.a(["brewer-lab/receta"])]
  ]) + `# ${nombre}

> [!summary] Receta en una línea
> ${U.num(r.dosis_g) ? r.dosis_g + " g" : "— g"} · ${U.num(r.agua_g) ? r.agua_g + " g" : "— g"}${Calc.ratio(r) ? ` (1:${U.fmt(Calc.ratio(r), 1)})` : ""} · ${r.clicks_rango ? r.clicks_rango + " clicks C5" : "clicks —"} · ${U.num(r.temp_c) ? r.temp_c + " °C" : "— °C"} · ${r.tiempo_objetivo || "—"}

## Pasos

| Tiempo | Acción | Agua acumulada (g) |
|---|---|---|
${pasos.length ? pasos.map(x => `| ${td(x.t)} | ${td(x.accion)} | ${td(x.agua)} |`).join("\n") : "| | | |"}

## Por qué funciona

${bloque(r.por_que)}

## Historial de versiones

| Versión | Fecha | Cambio | Resultado |
|---|---|---|---|
${hist.length ? hist.map(x => `| ${td(x.version)} | ${td(x.fecha)} | ${td(x.cambio)} | ${td(x.resultado)} |`).join("\n") : `| ${r.version || 1} | ${U.hoy()} | Versión inicial | |`}

## Preparaciones con esta receta

${BASE_PREP("Preparaciones")}
`;
  return { ruta: `${BASE}/03 Recetas/Mis recetas/${nombre}.md`, md };
};

Notas.experimentos = e => {
  const nombre = U.nombreNota(`${e.fecha || U.hoy()} · ${e.titulo || "Experimento"}`);
  const res = (e.resultados || []).filter(Boolean);
  const n = res.length, k = res.filter(x => x.acierto).length;
  const p = n ? Calc.triangular(n, k) : null;
  const cafe = Store.buscar("cafes", e.cafe_id);
  const md = fm([
    ["tipo", Y.s("experimento")], ["fecha", Y.d(e.fecha)], ["pregunta", Y.s(e.pregunta)], ["hipotesis", Y.s(e.hipotesis)], ["variable", Y.s(e.variable)],
    ["valores", Y.a(e.valores)], ["constantes", Y.s(e.constantes)], ["metodo", Y.s(e.metodo)], ["cafe", cafe ? Y.l(Nom.cafe(cafe)) : ""],
    ["tipo_prueba", Y.s(e.tipo_prueba || "triangular")], ["ensayos", Y.n(n || null)], ["aciertos", Y.n(n ? k : null)],
    ["significativo", Y.b(p !== null && p < 0.05)], ["ganador", Y.s(e.ganador)], ["estado", Y.s(e.estado || "planeado")],
    ["brewer_app_id", Y.s(e.id)], ["tags", Y.a(["brewer-lab/experimento"])]
  ]) + `# ${nombre}

> [!question] Pregunta
> ${bloque(e.pregunta)}

## Diseño

- **Hipótesis**: ${bloque(e.hipotesis)}
- **Variable**: ${bloque(e.variable)} · **Valores**: ${bloque(U.lista(e.valores).join(" vs. "))}
- **Constantes**: ${bloque(e.constantes)}
- **Tipo de prueba**: ${e.tipo_prueba || "triangular"}

## Resultados

| Ensayo | ¿Acerté? | Preferencia | Notas |
|---|---|---|---|
${n ? res.map((x, i) => `| ${i + 1} | ${x.acierto ? "✅" : "❌"} | ${td(x.preferencia)} | ${td(x.notas)} |`).join("\n") : "| | | | |"}

**Aciertos**: ${k} de ${n}${p !== null ? ` · p = ${U.fmt(p, 3)} → ${p < 0.05 ? "**significativo**" : "no significativo"}` : ""}

## Conclusión

${bloque(e.conclusion)}
`;
  return { ruta: `${BASE}/05 Experimentos/${nombre}.md`, md };
};

Notas.catas = c => {
  const nombre = U.nombreNota(`${c.fecha || U.hoy()} · ${c.muestra || "Muestra"}`);
  const cafe = Store.buscar("cafes", c.cafe_id);
  const cva = Calc.cva(c);
  const I = [["i_fragancia", "Fragancia"], ["i_aroma", "Aroma"], ["i_sabor", "Sabor"], ["i_retrogusto", "Sabor residual"], ["i_acidez", "Acidez"], ["i_dulzor", "Dulzor"], ["i_cuerpo", "Sensación en boca"]];
  const md = fm([
    ["tipo", Y.s("cata")], ["fecha", Y.d(c.fecha)], ["sesion", Y.s(c.sesion)], ["muestra_n", Y.n(c.muestra_n)], ["cafe", cafe ? Y.l(Nom.cafe(cafe)) : ""],
    ["origen", Y.s(c.origen)], ["variedad", Y.a(c.variedad)], ["proceso", Y.s(c.proceso)], ["nivel_tueste", Y.s(c.nivel_tueste)], ["objetivo", Y.s(c.objetivo)],
    ...I.map(([k]) => [k, Y.n(c[k])]),
    ["descriptores_aroma", Y.a(c.descriptores_aroma)], ["descriptores_sabor", Y.a(c.descriptores_sabor)], ["gustos_predominantes", Y.a(c.gustos_predominantes)], ["sensacion_boca", Y.a(c.sensacion_boca)],
    ...B.listas.atributos.map(a => [a.key, Y.n(c[a.key])]),
    ["tazas_no_uniformes", Y.n(c.tazas_no_uniformes || 0)], ["tazas_defectuosas", Y.n(c.tazas_defectuosas || 0)], ["defecto", Y.s(c.defecto)],
    ["brewer_app_id", Y.s(c.id)], ["tags", Y.a(["brewer-lab/cata"])]
  ]) + `# ${nombre}

> [!cata] Puntaje CVA (afectivo)
> **${cva === null ? "—" : U.fmt(cva, 2)}** · tazas no uniformes: ${c.tazas_no_uniformes || 0} · tazas defectuosas: ${c.tazas_defectuosas || 0}${c.defecto ? ` (${c.defecto})` : ""}

## Parte 1 · Evaluación descriptiva (0–15)

| Atributo | Intensidad |
|---|---|
${I.map(([k, t]) => `| ${t} | ${U.num(c[k]) === null ? "—" : c[k]} |`).join("\n")}

- **Fragancia / aroma**: ${bloque(U.lista(c.descriptores_aroma).join(", "))}
- **Sabor / sabor residual**: ${bloque(U.lista(c.descriptores_sabor).join(", "))}
- **Gustos predominantes**: ${bloque(U.lista(c.gustos_predominantes).join(", "))}
- **Sensación en boca**: ${bloque(U.lista(c.sensacion_boca).join(", "))}

## Parte 2 · Evaluación afectiva (1–9)

| Atributo | Puntaje |
|---|---|
${B.listas.atributos.map(a => `| ${a.nombre} | ${U.num(c[a.key]) === null ? "—" : c[a.key]} |`).join("\n")}

## Parte 3 · Información extrínseca

- **Cultivo**: ${bloque(c.ext_cultivo)}
- **Procesamiento**: ${bloque(c.ext_proceso)}
- **Comercio**: ${bloque(c.ext_comercio)}
- **Certificaciones**: ${bloque(U.lista(c.ext_certificaciones).join(", "))}
- **Premios**: ${bloque(c.ext_premios)}

## Conclusión en una frase

${bloque(c.conclusion)}
`;
  return { ruta: `${BASE}/08 Cata SCA CVA/Sesiones/${nombre}.md`, md };
};

Notas.fincas = f => {
  const nombre = Nom.finca(f);
  const parcelas = (f.parcelas || []).filter(x => x && (x.id || x.variedad));
  const md = fm([
    ["tipo", Y.s("finca")], ["codigo", Y.s(f.codigo)], ["productor", Y.s(f.productor)], ["contacto", Y.s(f.contacto)], ["pais", Y.s(f.pais)], ["region", Y.s(f.region)],
    ["municipio", Y.s(f.municipio)], ["coordenadas", Y.s(f.coordenadas)], ["altitud_min", Y.n(f.altitud_min)], ["altitud_max", Y.n(f.altitud_max)],
    ["area_total_ha", Y.n(f.area_total_ha)], ["area_cafe_ha", Y.n(f.area_cafe_ha)], ["variedades", Y.a(f.variedades)], ["procesos", Y.a(f.procesos)],
    ["certificaciones", Y.a(f.certificaciones)], ["mercado", Y.s(f.mercado)], ["estado_consultoria", Y.s(f.estado_consultoria || "diagnóstico")],
    ["indice_ultimo", Y.n(f.indice_ultimo)], ["fecha_primera_visita", Y.d(f.fecha_primera_visita)],
    ["brewer_app_id", Y.s(f.id)], ["tags", Y.a(["farm-lab/finca"])]
  ]) + `# 🏡 ${nombre}

> [!finca] Resumen de la finca
> ${bloque([f.productor, [f.municipio, f.region, f.pais].filter(Boolean).join(", "), (U.num(f.altitud_min) || U.num(f.altitud_max)) ? `${f.altitud_min || "?"}–${f.altitud_max || "?"} m` : "", U.num(f.area_cafe_ha) ? `${f.area_cafe_ha} ha de café` : ""].filter(Boolean).join(" · "))}

## 📍 Ubicación y entorno

- **Coordenadas / polígonos**: ${bloque(f.coordenadas)} → [[EUDR]]
- **Variedades**: ${bloque(U.lista(f.variedades).join(", "))}
- **Procesos**: ${bloque(U.lista(f.procesos).join(", "))}
- **Certificaciones**: ${bloque(U.lista(f.certificaciones).join(", "))}
- **Mercado actual**: ${bloque(f.mercado)}

## 🗺️ Lotes / parcelas

| Parcela | Área (ha) | Variedad | Año de siembra | Densidad | Sombra % | Altitud |
|---|---|---|---|---|---|---|
${parcelas.length ? parcelas.map(x => `| ${td(x.id)} | ${td(x.area)} | ${td(x.variedad)} | ${td(x.anio)} | ${td(x.densidad)} | ${td(x.sombra)} | ${td(x.altitud)} |`).join("\n") : "| | | | | | | |"}

## 🏭 Infraestructura

${bloque(f.infraestructura)}

## 🩺 Visitas

${BASE_FINCA}

## 🎯 Plan de acción vigente

${bloque(f.plan)}
`;
  return { ruta: `${FINCAS}/${nombre}/${nombre}.md`, md };
};

Notas.visitas = v => {
  const finca = Store.buscar("fincas", v.finca_id) || { nombre: v.finca_nombre || "Finca" };
  const fn = Nom.finca(finca);
  const nombre = U.nombreNota(`${v.fecha || U.hoy()} · Visita ${v.tipo_visita || "diagnóstico"}`);
  const idx = Calc.indice(v);
  const h = v.hallazgos || {};
  const md = fm([
    ["tipo", Y.s("visita")], ["fecha", Y.d(v.fecha)], ["finca", Y.l(fn)], ["tipo_visita", Y.s(v.tipo_visita || "diagnóstico")],
    ...B.areas.map(a => ["s_" + a.key, Y.n(v["s_" + a.key])]),
    ...B.metas.map(m => [m.key, Y.n(v[m.key])]),
    ["indice", Y.n(idx)], ["brewer_app_id", Y.s(v.id)], ["tags", Y.a(["farm-lab/visita"])]
  ]) + `# 🩺 ${nombre}

> [!finca] Índice Farm Lab
> **${idx === null ? "—" : idx + " / 100"}**${idx !== null ? ` · ${Calc.semaforo(idx).t}` : ""} · ${Calc.nEval(v)} de 13 áreas evaluadas · Finca: [[${fn}]]

## 📏 Mediciones de campo

| Medición | Valor | Meta de referencia |
|---|---|---|
${B.metas.map(m => `| ${m.nombre} | ${U.num(v[m.key]) === null ? "—" : v[m.key] + " " + m.unidad} | ${m.meta} |`).join("\n")}

## 📝 Observaciones por área

| # | Área | Puntaje 1–5 | Hallazgos |
|---|---|---|---|
${B.areas.map((a, i) => `| ${i + 1} | ${a.nombre} | ${U.num(v["s_" + a.key]) === null ? "—" : v["s_" + a.key] + " · " + B.niveles[v["s_" + a.key]]} | ${td(h[a.key])} |`).join("\n")}

## 🎯 Prioridades detectadas

${bloque(v.prioridades)}

## 📦 Muestras tomadas

${U.lista(v.muestras).length ? U.lista(v.muestras).map(x => `- [x] ${x}`).join("\n") : "- Ninguna registrada"}
`;
  return { ruta: `${FINCAS}/${fn}/${nombre}.md`, md };
};

Notas.lotes = l => {
  const finca = Store.buscar("fincas", l.finca_id) || { nombre: "Finca" };
  const fn = Nom.finca(finca);
  const nombre = U.nombreNota(l.codigo || "Lote");
  const md = fm([
    ["tipo", Y.s("lote")], ["finca", Y.l(fn)], ["parcela", Y.s(l.parcela)], ["variedad", Y.a(l.variedad)], ["proceso", Y.s(l.proceso)],
    ["fecha_cosecha", Y.d(l.fecha_cosecha)], ["kg_cereza", Y.n(l.kg_cereza)], ["madurez_pct", Y.n(l.madurez_pct)], ["brix", Y.n(l.brix)],
    ["fermentacion_h", Y.n(l.fermentacion_h)], ["ph_inicial", Y.n(l.ph_inicial)], ["ph_final", Y.n(l.ph_final)], ["temp_fermentacion_c", Y.n(l.temp_fermentacion_c)],
    ["secado_sistema", Y.s(l.secado_sistema)], ["secado_inicio", Y.d(l.secado_inicio)], ["secado_fin", Y.d(l.secado_fin)], ["humedad_final", Y.n(l.humedad_final)],
    ["aw", Y.n(l.aw)], ["kg_pergamino", Y.n(l.kg_pergamino)], ["kg_verde", Y.n(l.kg_verde)], ["puntaje_cva", Y.n(l.puntaje_cva)],
    ["comprador", Y.s(l.comprador)], ["precio", Y.n(l.precio)], ["marca_oic", Y.s(l.marca_oic)], ["estado", Y.s(l.estado || "en proceso")],
    ["brewer_app_id", Y.s(l.id)], ["tags", Y.a(["farm-lab/lote"])]
  ]) + `# 📦 ${nombre}

> [!tip] Código de lote
> **${nombre}** · Finca [[${fn}]] · Parcela ${bloque(l.parcela)} · ${bloque(l.proceso)}

## 🍒 Cosecha

- Fecha: ${bloque(l.fecha_cosecha)} · Cereza: ${bloque(l.kg_cereza)} kg · Madurez: ${bloque(l.madurez_pct)} % · Brix: ${bloque(l.brix)}

## 🧫 Beneficio

- Fermentación: ${bloque(l.fermentacion_h)} h · pH ${bloque(l.ph_inicial)} → ${bloque(l.ph_final)} · ${bloque(l.temp_fermentacion_c)} °C

## ☀️ Secado

- ${bloque(l.secado_sistema)} · del ${bloque(l.secado_inicio)} al ${bloque(l.secado_fin)} · humedad final ${bloque(l.humedad_final)} % · aw ${bloque(l.aw)}

## 🏷️ Calidad

- Pergamino: ${bloque(l.kg_pergamino)} kg · Verde: ${bloque(l.kg_verde)} kg · Puntaje CVA: ${bloque(l.puntaje_cva)}

## 🚚 Venta

- Comprador: ${bloque(l.comprador)} · Precio: ${bloque(l.precio)} · Marca OIC: ${bloque(l.marca_oic)}

## Notas

${bloque(l.notas)}
`;
  return { ruta: `${FINCAS}/${fn}/Lotes/${nombre}.md`, md };
};

Notas.informes = inf => {
  const finca = Store.buscar("fincas", inf.finca_id) || { nombre: "Finca" };
  const visita = Store.buscar("visitas", inf.visita_id) || {};
  const fn = Nom.finca(finca);
  const nombre = U.nombreNota(`${inf.fecha || U.hoy()} · Informe de diagnóstico`);
  const md = fm([
    ["tipo", Y.s("informe")], ["fecha", Y.d(inf.fecha)], ["finca", Y.l(fn)],
    ["visita", visita.id ? Y.l(U.nombreNota(`${visita.fecha} · Visita ${visita.tipo_visita || "diagnóstico"}`)) : ""],
    ["indice", Y.n(Calc.indice(visita))], ["brewer_app_id", Y.s(inf.id)], ["tags", Y.a(["farm-lab/informe"])]
  ]) + Informe.md(inf, { finca, visita });
  return { ruta: `${FINCAS}/${fn}/${nombre}.md`, md };
};

Notas.manuales = m => {
  const nombre = U.nombreNota(m.titulo || "Manual");
  const md = fm([["tipo", Y.s("manual")], ["brewer_app_id", Y.s(m.id)], ["tags", Y.a(["brewer-lab/manual"])]]) + "\n" + String(m.contenido || "").trim() + "\n";
  return { ruta: `${BASE}/11 Manuales/${nombre}.md`, md };
};

Notas.diagnosticos = g => {
  const tipo = (B.tiposDiagnostico || []).find(t => t.id === g.tipo) || { nombre: g.tipo || "Diagnóstico" };
  const finca = g.finca_id ? Store.buscar("fincas", g.finca_id) : null;
  const cafe = g.cafe_id ? Store.buscar("cafes", g.cafe_id) : null;
  const nombre = U.nombreNota(`${g.fecha || U.hoy()} · ${tipo.nombre} · ${g.titulo || "foto"}`);
  const r = g.resultado || null;
  const fotos = g.fotos || [];
  const md = fm([
    ["tipo", Y.s("diagnostico")], ["fecha", Y.d(g.fecha)], ["tipo_diagnostico", Y.s(tipo.nombre)],
    ["finca", finca ? Y.l(Nom.finca(finca)) : ""], ["lote", Y.s(g.lote)], ["cafe", cafe ? Y.l(Nom.cafe(cafe)) : ""],
    ["diagnostico_principal", Y.s(r && r.diagnostico_principal)], ["confianza", Y.s(r && r.confianza)], ["urgencia", Y.s(r && r.urgencia)],
    ["analizado_con", Y.s(g.modelo)], ["brewer_app_id", Y.s(g.id)], ["tags", Y.a(["farm-lab/diagnostico-foto"])]
  ]) + `# 📷 ${nombre}

${fotos.length ? fotos.map(f => `![[${f}.jpg|420]]`).join("\n") : "_Sin fotos._"}

> [!warning] Orientativo
> Diagnóstico hecho con IA a partir de fotos. Confírmalo en campo o en laboratorio antes de decidir, sobre todo si implica agroquímicos.

## Notas de campo

${bloque(g.notas)}

${r ? `## Resultado · confianza ${r.confianza || "—"} · urgencia ${r.urgencia || "—"}

**Diagnóstico principal**: ${bloque(r.diagnostico_principal)}

**Qué se ve**: ${bloque(r.que_veo)}

| Hallazgo | Severidad | Evidencia |
|---|---|---|
${(r.hallazgos || []).length ? r.hallazgos.map(h => `| ${td(h.nombre)} | ${td(h.severidad)} | ${td(h.evidencia)} |`).join("\n") : "| | | |"}

**Otras posibilidades**: ${bloque((r.diferenciales || []).join("; "))}

## Recomendaciones

${(r.recomendaciones || []).map(x => `- ${x}`).join("\n") || "—"}

## Qué confirmar

${(r.confirmar || []).map(x => `- [ ] ${x}`).join("\n") || "—"}

**Calidad de la foto**: ${bloque(r.calidad_foto)} · **Advertencias**: ${bloque(r.advertencias)}
` : `## Resultado

Pendiente de análisis.`}
`;
  const carpeta = finca ? `${FINCAS}/${Nom.finca(finca)}/Diagnósticos con foto` : `${BASE}/Diagnósticos con foto`;
  return { ruta: `${carpeta}/${nombre}.md`, md };
};

/* ------------------------------ Markdown → HTML (para manuales) ------------------------------ */
B.slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
B.md2html = (md, opts = {}) => {
  const lines = String(md).replace(/\r/g, "").split("\n");
  const inline = s => U.esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const shift = opts.shift || 0;
  let html = "", i = 0;
  const esLista = l => /^\s*(-|\d+\.)\s+/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) { const n = Math.min(6, m[1].length + shift); html += `<h${n} id="${B.slug(m[2])}">${inline(m[2])}</h${n}>`; i++; continue; }
    if (/^-{3,}\s*$/.test(l.trim())) { html += "<hr>"; i++; continue; }
    if (l.startsWith(">")) { const buf = []; while (i < lines.length && lines[i].startsWith(">")) { buf.push(lines[i].replace(/^>\s?/, "")); i++; } html += `<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`; continue; }
    if (l.trim().startsWith("|")) {
      const rows = []; while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i].trim()); i++; }
      const cells = r => r.replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map(c => c.replace(/\\\|/g, "|").trim());
      const body = rows.filter(r => !(/^[|\-:\s]+$/.test(r) && r.includes("-")));
      const head = cells(body[0] || "");
      html += `<div class="tabla"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }
    if (esLista(l)) {
      const items = [];
      while (i < lines.length && (esLista(lines[i]) || (lines[i].startsWith("  ") && lines[i].trim() && items.length))) {
        const ln = lines[i];
        const ind = ln.match(/^\s*/)[0].length;
        const mm = ln.match(/^\s*(-|\d+\.)\s+(.*)$/);
        if (mm) items.push({ ind, ord: mm[1] !== "-", txt: mm[2] });
        else if (items.length) items[items.length - 1].txt += " " + ln.trim();
        i++;
      }
      const base = items[0].ind;
      const top = []; items.forEach(it => { if (it.ind <= base + 1 || !top.length) top.push({ it, subs: [] }); else top[top.length - 1].subs.push(it); });
      const li = t => { const chk = t.match(/^\[( |x)\]\s+(.*)$/); return chk ? `<span class="chk">${chk[1] === "x" ? "☑" : "☐"}</span> ${inline(chk[2])}` : inline(t); };
      const ord = items[0].ord;
      html += `<${ord ? "ol" : "ul"}>${top.map(t => `<li>${li(t.it.txt)}${t.subs.length ? `<ul>${t.subs.map(s => `<li>${li(s.txt)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</${ord ? "ol" : "ul"}>`;
      continue;
    }
    const buf = []; while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\||-{3,}\s*$)/.test(lines[i].trim()) && !esLista(lines[i])) { buf.push(lines[i].trim()); i++; }
    html += `<p>${inline(buf.join(" "))}</p>`;
  }
  return html;
};

/* ------------------------------ Radar ------------------------------ */
const CORTOS = { genetica: "Genética", sanidad: "Sanidad", suelo: "Suelo", sombra: "Sombra", manejo: "Manejo", cosecha: "Cosecha", beneficio: "Beneficio", secado: "Secado", calidad: "Calidad", trazabilidad: "Trazabilidad", social: "Social", ambiente: "Ambiente", economia: "Economía" };
B.CORTOS = CORTOS;
B.radar = (v, opts = {}) => {
  const W = 520, H = 430, cx = 260, cy = 212, R = 150, n = B.areas.length;
  const col = opts.colores || { grid: "var(--line)", txt: "var(--muted)", area: "var(--accent)", eje: "var(--ink)" };
  const pt = (i, r) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)]; };
  let s = `<svg viewBox="0 0 ${W} ${H}" class="radar" role="img" aria-label="Radar de las 13 áreas del diagnóstico" xmlns="http://www.w3.org/2000/svg">`;
  for (let k = 1; k <= 5; k++) {
    const poly = B.areas.map((a, i) => pt(i, R * k / 5).map(x => x.toFixed(1)).join(",")).join(" ");
    s += `<polygon points="${poly}" fill="none" stroke="${col.grid}" stroke-width="1"/>`;
    const [lx, ly] = pt(0, R * k / 5);
    s += `<text x="${(lx + 6).toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-size="10" fill="${col.txt}" font-family="IBM Plex Mono, monospace">${k}</text>`;
  }
  B.areas.forEach((a, i) => {
    const [x, y] = pt(i, R);
    s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${col.grid}" stroke-width="1"/>`;
    const [lx, ly] = pt(i, R + 16);
    const c = Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n);
    const anchor = Math.abs(c) < 0.2 ? "middle" : c > 0 ? "start" : "end";
    const dy = ly < cy - R + 10 ? -2 : ly > cy + R - 10 ? 10 : 4;
    s += `<text x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}" font-size="12" fill="${col.eje}" font-family="Instrument Sans, Segoe UI, sans-serif">${CORTOS[a.key]}</text>`;
  });
  const vals = B.areas.map(a => U.num(v["s_" + a.key]));
  if (vals.some(x => x !== null)) {
    const poly = vals.map((x, i) => pt(i, R * (x || 0) / 5).map(z => z.toFixed(1)).join(",")).join(" ");
    s += `<polygon points="${poly}" fill="${col.area}" fill-opacity="0.22" stroke="${col.area}" stroke-width="2.5" stroke-linejoin="round"/>`;
    vals.forEach((x, i) => { if (x !== null) { const [px, py] = pt(i, R * x / 5); s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${col.area}"/>`; } });
  }
  return s + "</svg>";
};

/* ------------------------------ Informe de diagnóstico ------------------------------ */
const Informe = B.Informe = {};
Informe.analisis = visita => {
  const evaluadas = B.areas.map(a => ({ a, s: U.num(visita["s_" + a.key]) })).filter(x => x.s !== null);
  const ord = [...evaluadas].sort((x, y) => x.s - y.s);
  const fortalezas = [...evaluadas].sort((x, y) => y.s - x.s).filter(x => x.s >= 4).slice(0, 3);
  const prioridades = ord.filter(x => x.s <= 3).slice(0, 3);
  const recs = ord.filter(x => x.s <= 3).map(x => ({ key: x.a.key, area: x.a.nombre, s: x.s, items: x.s <= 2 ? x.a.critico : x.a.mejora }));
  const fueraMeta = B.metas.filter(m => m.eval && U.num(visita[m.key]) !== null && !m.eval(U.num(visita[m.key])));
  return { evaluadas, fortalezas, prioridades, recs, fueraMeta, indice: Calc.indice(visita) };
};
Informe.borrador = (visita, finca) => {
  const an = Informe.analisis(visita);
  const sem = Calc.semaforo(an.indice);
  const lista = arr => arr.length ? arr.map(x => x.a.nombre.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " y $1") : "";
  let resumen = `La finca ${finca.nombre || ""}${finca.productor ? ` (${finca.productor})` : ""} obtuvo un Índice de ${an.indice === null ? "—" : an.indice + "/100"}${sem ? ` (${sem.t.toLowerCase()})` : ""}, con ${an.evaluadas.length} de 13 áreas evaluadas en la visita del ${U.fechaLarga(visita.fecha)}.`;
  if (an.fortalezas.length) resumen += ` Sus principales fortalezas están en ${lista(an.fortalezas)}.`;
  if (an.prioridades.length) resumen += ` Las prioridades de mejora son ${lista(an.prioridades)}.`;
  if (an.fueraMeta.length) resumen += ` En campo, ${an.fueraMeta.map(m => `${m.nombre.toLowerCase()} (${visita[m.key]} ${m.unidad}; meta ${m.meta})`).join("; ")} está${an.fueraMeta.length > 1 ? "n" : ""} fuera de la referencia.`;
  resumen += " El plan propone empezar con acciones rápidas y de bajo costo en los próximos 90 días y consolidar los cambios estructurales en 1 a 3 años.";
  const plan = [];
  an.prioridades.forEach(x => {
    const items = x.s <= 2 ? x.a.critico : x.a.mejora;
    if (items[0]) plan.push({ plazo: "90 días", area: x.a.nombre, accion: items[0], responsable: "", indicador: "", revision: "" });
    if (items[1]) plan.push({ plazo: "1 año", area: x.a.nombre, accion: items[1], responsable: "", indicador: "", revision: "" });
    if (items[2]) plan.push({ plazo: "3 años", area: x.a.nombre, accion: items[2], responsable: "", indicador: "", revision: "" });
  });
  if (!plan.length) plan.push({ plazo: "90 días", area: "General", accion: "Mantener las buenas prácticas y documentarlas para compradores y certificaciones.", responsable: "", indicador: "", revision: "" });
  return { finca_id: finca.id, visita_id: visita.id, fecha: U.hoy(), resumen, plan, notas: "" };
};

Informe.css = `
.rep{--ri:#1D1A16;--rm:#5F625B;--rl:#D9DCD4;--ra:#2E6B5E;--rc:#A62639;--rs:#EEF2EC;font-family:"Instrument Sans","Segoe UI",Arial,sans-serif;color:var(--ri);background:#fff;line-height:1.5;font-size:13px;max-width:820px;margin:0 auto;padding:0}
.rep *{box-sizing:border-box}
.rep h1,.rep h2,.rep h3{font-family:"Bricolage Grotesque","Segoe UI",Arial,sans-serif;line-height:1.15;margin:0;color:var(--ri)}
.rep .portada{background:var(--ra);color:#fff;padding:28px 30px 24px;border-radius:14px}
.rep .portada h1{color:#fff;font-size:28px;letter-spacing:-.01em;margin-top:6px}
.rep .portada .marca{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85}
.rep .portada .meta{margin-top:12px;font-size:13px;opacity:.95}
.rep .sec{margin-top:22px;page-break-inside:avoid;break-inside:avoid}
.rep .sec h2{font-size:17px;border-bottom:2px solid var(--ra);padding-bottom:4px;margin-bottom:10px}
.rep .kpis{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
.rep .kpi{flex:1 1 150px;border:1px solid var(--rl);border-radius:12px;padding:12px 14px;background:#fff}
.rep .kpi b{display:block;font-family:"IBM Plex Mono",Consolas,monospace;font-size:26px;font-variant-numeric:tabular-nums;color:var(--ri)}
.rep .kpi span{font-size:11px;color:var(--rm);text-transform:uppercase;letter-spacing:.06em}
.rep .pill{display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700}
.rep .pill.ok{background:#DDEFE3;color:#1F5C38}.rep .pill.warn{background:#F8E9CC;color:#7A4E0B}.rep .pill.bad{background:#F6DCDC;color:#8E1B1B}
.rep table{width:100%;border-collapse:collapse;font-size:12px}
.rep th{background:var(--rs);text-align:left;font-weight:700;padding:7px 8px;border-bottom:1px solid var(--rl)}
.rep td{padding:7px 8px;border-bottom:1px solid var(--rl);vertical-align:top}
.rep .bar{display:inline-block;height:8px;border-radius:4px;background:var(--ra);vertical-align:middle}
.rep .bar.l1,.rep .bar.l2{background:var(--rc)}.rep .bar.l3{background:#C08A2B}
.rep .radar{width:100%;max-width:520px;display:block;margin:0 auto}
.rep .cols{display:flex;gap:16px;flex-wrap:wrap}.rep .cols>div{flex:1 1 240px}
.rep ul{margin:6px 0 0;padding-left:18px}.rep li{margin:3px 0}
.rep .resumen{font-size:14px;line-height:1.6;white-space:pre-line}
.rep .firma{margin-top:26px;padding-top:12px;border-top:1px solid var(--rl);font-size:12px;color:var(--rm)}
.rep .muted{color:var(--rm)}
`;

const barra = s => s === null ? "" : `<span class="bar l${s}" style="width:${s * 18}px"></span>`;
Informe.html = (inf, ctx) => {
  const { finca, visita } = ctx; const aj = Store.ajustes || {};
  const an = Informe.analisis(visita); const sem = Calc.semaforo(an.indice);
  const marca = aj.marca || "Consultoría de café";
  const lotes = Store.d.lotes.filter(l => l.finca_id === finca.id && U.num(l.puntaje_cva) !== null);
  const e = U.esc;
  return `<article class="rep">
<header class="portada"><div class="marca">${e(marca)}</div><h1>Informe de diagnóstico · ${e(finca.nombre || "")}</h1>
<div class="meta">${e([finca.productor, [finca.municipio, finca.region, finca.pais].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}<br>Visita del ${e(U.fechaLarga(visita.fecha))} · Informe del ${e(U.fechaLarga(inf.fecha))}</div></header>
<div class="kpis"><div class="kpi"><span>Índice de la finca</span><b>${an.indice === null ? "—" : an.indice}<small style="font-size:13px">/100</small></b>${sem ? `<span class="pill ${sem.c}">${e(sem.t)}</span>` : ""}</div>
<div class="kpi"><span>Áreas evaluadas</span><b>${an.evaluadas.length}<small style="font-size:13px">/13</small></b></div>
<div class="kpi"><span>Altitud</span><b style="font-size:20px">${(U.num(finca.altitud_min) || U.num(finca.altitud_max)) ? e(`${finca.altitud_min || "?"}–${finca.altitud_max || "?"}`) : "—"}</b><span>m s. n. m.</span></div>
<div class="kpi"><span>Café</span><b style="font-size:20px">${U.num(finca.area_cafe_ha) === null ? "—" : e(finca.area_cafe_ha)}</b><span>hectáreas</span></div></div>
<section class="sec"><h2>Resumen ejecutivo</h2><p class="resumen">${e(inf.resumen || "")}</p></section>
<section class="sec"><h2>Diagnóstico por área</h2>${B.radar(visita, { colores: { grid: "#D9DCD4", txt: "#5F625B", area: "#2E6B5E", eje: "#1D1A16" } })}
<table><thead><tr><th>Área</th><th>Puntaje</th><th>Nivel</th><th>Hallazgos</th></tr></thead><tbody>
${B.areas.map(a => { const s = U.num(visita["s_" + a.key]); return `<tr><td><strong>${e(a.nombre)}</strong></td><td style="white-space:nowrap">${s === null ? "—" : s + " " + barra(s)}</td><td>${s === null ? "—" : e(B.niveles[s])}</td><td>${e((visita.hallazgos || {})[a.key] || "")}</td></tr>`; }).join("")}
</tbody></table></section>
<section class="sec"><div class="cols"><div><h2>Fortalezas</h2>${an.fortalezas.length ? `<ul>${an.fortalezas.map(x => `<li><strong>${e(x.a.nombre)}</strong> (${x.s}/5)</li>`).join("")}</ul>` : `<p class="muted">Sin áreas en nivel 4 o 5 todavía.</p>`}</div>
<div><h2>Prioridades</h2>${an.prioridades.length ? `<ul>${an.prioridades.map(x => `<li><strong>${e(x.a.nombre)}</strong> (${x.s}/5)</li>`).join("")}</ul>` : `<p class="muted">Ninguna área por debajo de 4.</p>`}</div></div></section>
<section class="sec"><h2>Mediciones de campo</h2><table><thead><tr><th>Medición</th><th>Valor</th><th>Meta de referencia</th><th>Estado</th></tr></thead><tbody>
${B.metas.map(m => { const v = U.num(visita[m.key]); const ok = v === null || !m.eval ? null : m.eval(v); return `<tr><td>${e(m.nombre)}</td><td>${v === null ? "—" : e(v + " " + m.unidad)}</td><td>${e(m.meta)}</td><td>${ok === null ? '<span class="muted">—</span>' : ok ? '<span class="pill ok">En meta</span>' : '<span class="pill warn">Fuera de meta</span>'}</td></tr>`; }).join("")}
</tbody></table></section>
${an.recs.length ? `<section class="sec"><h2>Recomendaciones</h2>${an.recs.map(r => `<div style="margin-top:10px"><h3 style="font-size:14px">${e(r.area)} <span class="pill ${r.s <= 2 ? "bad" : "warn"}">${r.s}/5 · ${e(B.niveles[r.s])}</span></h3><ul>${r.items.map(t => `<li>${e(t)}</li>`).join("")}</ul></div>`).join("")}</section>` : ""}
<section class="sec"><h2>Plan de acción</h2><table><thead><tr><th>Plazo</th><th>Área</th><th>Acción</th><th>Responsable</th><th>Indicador</th><th>Revisión</th></tr></thead><tbody>
${(inf.plan || []).map(p => `<tr><td style="white-space:nowrap"><strong>${e(p.plazo)}</strong></td><td>${e(p.area)}</td><td>${e(p.accion)}</td><td>${e(p.responsable)}</td><td>${e(p.indicador)}</td><td>${e(p.revision)}</td></tr>`).join("")}
</tbody></table></section>
${lotes.length ? `<section class="sec"><h2>Calidad en taza</h2><table><thead><tr><th>Lote</th><th>Proceso</th><th>Puntaje CVA</th></tr></thead><tbody>${lotes.map(l => `<tr><td>${e(l.codigo)}</td><td>${e(l.proceso)}</td><td>${e(l.puntaje_cva)}</td></tr>`).join("")}</tbody></table></section>` : ""}
${inf.notas ? `<section class="sec"><h2>Notas</h2><p class="resumen">${e(inf.notas)}</p></section>` : ""}
<footer class="firma">${e(aj.consultor || "")}${aj.cargo ? " · " + e(aj.cargo) : ""}${aj.contacto ? " · " + e(aj.contacto) : ""}${aj.ubicacion ? " · " + e(aj.ubicacion) : ""}<br>${e(aj.nota_informe || "Las recomendaciones sobre agroquímicos deben validarse con la autoridad técnica local y la etiqueta del producto. Los valores de referencia son orientativos.")}<br>${e(marca)} · Metodología de diagnóstico en 13 áreas · Índice = promedio × 20</footer>
</article>`;
};

Informe.md = (inf, ctx) => {
  const { finca, visita } = ctx;
  const an = Informe.analisis(visita); const sem = Calc.semaforo(an.indice);
  const bloques = s => s === null ? "" : "█".repeat(s) + "░".repeat(5 - s);
  return `# 📑 Informe de diagnóstico · ${finca.nombre || ""}

> [!summary] Índice de la finca: ${an.indice === null ? "—" : an.indice + "/100"}${sem ? ` · ${sem.t}` : ""}
> ${an.evaluadas.length} de 13 áreas evaluadas · Visita del ${U.fechaLarga(visita.fecha)} · Informe del ${U.fechaLarga(inf.fecha)}

## 1. Resumen ejecutivo

${bloque(inf.resumen)}

## 2. Diagnóstico por área

| Área | Puntaje | Nivel | Hallazgos |
|---|---|---|---|
${B.areas.map(a => { const s = U.num(visita["s_" + a.key]); return `| ${a.nombre} | ${s === null ? "—" : `${s} ${bloques(s)}`} | ${s === null ? "—" : B.niveles[s]} | ${td((visita.hallazgos || {})[a.key])} |`; }).join("\n")}

## 3. Fortalezas y prioridades

- **Fortalezas**: ${an.fortalezas.length ? an.fortalezas.map(x => `${x.a.nombre} (${x.s}/5)`).join(", ") : "—"}
- **Prioridades**: ${an.prioridades.length ? an.prioridades.map(x => `${x.a.nombre} (${x.s}/5)`).join(", ") : "—"}

## 4. Mediciones de campo

| Medición | Valor | Meta de referencia |
|---|---|---|
${B.metas.map(m => `| ${m.nombre} | ${U.num(visita[m.key]) === null ? "—" : visita[m.key] + " " + m.unidad} | ${m.meta} |`).join("\n")}

## 5. Recomendaciones

${an.recs.length ? an.recs.map(r => `### ${r.area} · ${r.s}/5 (${B.niveles[r.s]})\n\n${r.items.map(t => `- ${t}`).join("\n")}`).join("\n\n") : "Ninguna área por debajo de 4."}

## 6. Plan de acción

| Plazo | Área | Acción | Responsable | Indicador | Revisión |
|---|---|---|---|---|---|
${(inf.plan || []).map(p => `| ${td(p.plazo)} | ${td(p.area)} | ${td(p.accion)} | ${td(p.responsable)} | ${td(p.indicador)} | ${td(p.revision)} |`).join("\n")}
${inf.notas ? `\n## 7. Notas\n\n${inf.notas}\n` : ""}`;
};

Informe.standalone = (inf, ctx) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe · ${U.esc(ctx.finca.nombre || "")}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400..700&family=IBM+Plex+Mono:wght@500;600&display=swap"><style>body{margin:0;background:#F3F4F1;padding:24px}@media print{body{background:#fff;padding:0}.rep .sec{page-break-inside:avoid}}${Informe.css}</style></head><body>${Informe.html(inf, ctx)}</body></html>`;

Informe.pdf = async (inf, ctx) => {
  if (typeof window.html2pdf !== "function") throw { code: "sin_libreria" };
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-12000px;top:0;width:794px;background:#ffffff;";
  host.innerHTML = `<style>${Informe.css}</style>` + Informe.html(inf, ctx);
  document.body.appendChild(host);
  try {
    const opt = { margin: [10, 10, 12, 10], image: { type: "jpeg", quality: 0.95 }, html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, pagebreak: { mode: ["css", "legacy"] } };
    return await window.html2pdf().set(opt).from(host.querySelector(".rep")).outputPdf("blob");
  } finally { host.remove(); }
};

/* ------------------------------ Documentos descargables ------------------------------ */
B.docHTML = (titulo, cuerpo) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${U.esc(titulo)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400..700&display=swap"><style>
body{margin:0;background:#F3F4F1;color:#1D1A16;font:15px/1.6 "Instrument Sans","Segoe UI",Arial,sans-serif;padding:32px 20px}
main{max-width:760px;margin:0 auto;background:#fff;padding:36px 40px;border-radius:14px}
h1,h2,h3{font-family:"Bricolage Grotesque","Segoe UI",Arial,sans-serif;line-height:1.2}h1{font-size:30px;margin:0 0 8px}h2{font-size:20px;margin-top:30px;border-bottom:2px solid #2E6B5E;padding-bottom:4px}h3{font-size:16px;margin-top:20px}
table{border-collapse:collapse;width:100%;font-size:13px;margin:10px 0}th{background:#EEF2EC;text-align:left}th,td{border:1px solid #D9DCD4;padding:6px 8px;vertical-align:top}
blockquote{margin:12px 0;padding:10px 14px;background:#EEF2EC;border-left:4px solid #2E6B5E;border-radius:6px}.chk{font-size:16px}
.linea{border-bottom:1px solid #9AA095;height:26px}.caja{border:1px solid #9AA095;border-radius:6px;padding:8px 10px;margin:8px 0}
@media print{body{background:#fff;padding:0}main{padding:0}h2{page-break-after:avoid}.area{page-break-inside:avoid}}
</style></head><body><main>${cuerpo}</main></body></html>`;

B.fichaCampo = () => {
  const e = U.esc;
  const areas = B.areas.map((a, i) => `<div class="area caja"><h3>${i + 1}. ${e(a.nombre)} &nbsp; ☐1 ☐2 ☐3 ☐4 ☐5</h3><p><strong>Observar:</strong> ${e(a.observar)}<br><strong>Medir:</strong> ${e(a.medir)}</p><p style="font-size:13px"><strong>1</strong> ${e(a.n1)}<br><strong>3</strong> ${e(a.n3)}<br><strong>5</strong> ${e(a.n5)}</p><div class="linea"></div><div class="linea"></div></div>`).join("");
  const med = B.metas.map(m => `<tr><td>${e(m.nombre)}</td><td style="width:30%"></td><td>${e(m.meta)}</td></tr>`).join("");
  return B.docHTML("Ficha de campo · Visita de diagnóstico", `<h1>Ficha de campo · Visita de diagnóstico</h1><p>Finca: ____________________ &nbsp; Productor: ____________________ &nbsp; Fecha: ___________</p>
<h2>Mediciones de campo</h2><table><thead><tr><th>Medición</th><th>Valor</th><th>Meta de referencia</th></tr></thead><tbody>${med}</tbody></table>
<h2>Conteo de madurez (100 frutos)</h2><table><thead><tr><th>Maduros</th><th>Pintones</th><th>Verdes</th><th>Sobremaduros</th><th>Secos</th></tr></thead><tbody><tr><td style="height:32px"></td><td></td><td></td><td></td><td></td></tr></tbody></table>
<h2>Las 13 áreas (puntúa de 1 a 5)</h2>${areas}
<h2>Prioridades detectadas</h2><div class="linea"></div><div class="linea"></div><div class="linea"></div>
<h2>Muestras tomadas</h2><p>☐ Café verde para evaluación física (350 g) &nbsp; ☐ Café para cupping &nbsp; ☐ Suelo</p>`);
};
})();
