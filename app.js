/* Brewer Lab · interfaz: pantallas, formularios y acciones */
(() => {
"use strict";
const B = window.BL, U = B.U, S = B.Store, C = B.Calc, L = B.listas;
const e = U.esc;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const R = { tab: "inicio", subs: { barista: "bitacora", aprende: "tutoriales" }, col: null, modo: "lista", id: null, padre: null, borrador: null, manual: null };
const SUB2COL = { bitacora: "preparaciones", cafes: "cafes", recetas: "recetas", experimentos: "experimentos" };
const PROC = { "Lavado": "LAV", "Natural": "NAT", "Honey": "HON", "Anaeróbico": "ANA", "Maceración carbónica": "MCA", "Doble fermentación": "DFE", "Semilavado": "SEM", "Experimental": "EXP" };

/* ------------------------------ Utilidades de interfaz ------------------------------ */
function toast(msg, tipo = "ok") {
  const box = document.getElementById("toasts"); if (!box) return;
  const t = document.createElement("div"); t.className = "toast " + tipo; t.setAttribute("role", "status"); t.textContent = msg;
  box.appendChild(t); setTimeout(() => t.classList.add("out"), 3600); setTimeout(() => t.remove(), 4200);
}
const go = obj => e(JSON.stringify(obj));
const pill = (t, c = "") => `<span class="pill ${c}">${e(t)}</span>`;
const syncPill = r => r.sync === "sincronizado" ? pill("En Obsidian", "ok") : pill("Pendiente", "warn");
const btn = (txt, act, cls = "", extra = "") => `<button type="button" class="btn ${cls}" data-act="${act}" ${extra}>${txt}</button>`;
const goBtn = (txt, obj, cls = "") => `<button type="button" class="btn ${cls}" data-go="${go(obj)}">${txt}</button>`;
const fila = ({ titulo, meta, der = "", obj }) => `<button type="button" class="fila" data-go="${go(obj)}"><span class="fila-txt"><b>${e(titulo)}</b><small>${e(meta || "")}</small></span><span class="fila-der">${der}</span></button>`;
const vacio = (titulo, texto, accion = "") => `<div class="vacio"><p class="vacio-t">${e(titulo)}</p><p>${e(texto)}</p>${accion}</div>`;
const lectura = (etq, valor, unidad = "", extra = "") => `<div class="lectura"><span class="lec-et">${etq}</span><b class="lec-v">${valor}</b>${unidad ? `<span class="lec-u">${unidad}</span>` : ""}${extra}</div>`;
const dato = (k, v) => (v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length)) ? "" : `<div><dt>${e(k)}</dt><dd>${e(Array.isArray(v) ? v.join(", ") : v)}</dd></div>`;
const syncInfo = r => `<div class="sync-info">${syncPill(r)}<small>${r.obsidian ? "📁 " + e(r.obsidian) : "Irá a: " + e(r.ruta || "")}</small></div>`;
const texto = (t, s) => (s && String(s).trim()) ? `<section class="bloque"><h3>${t}</h3><p class="pre">${e(s)}</p></section>` : "";

/* Campos de formulario */
const fld = (label, inner, o = {}) => `<div class="fld ${o.cls || ""}"><label${o.for ? ` for="${o.for}"` : ""}>${label}${o.unit ? ` <small>${o.unit}</small>` : ""}</label>${inner}${o.help ? `<p class="help">${o.help}</p>` : ""}</div>`;
const inText = (id, v, ph = "") => `<input id="${id}" type="text" value="${e(v ?? "")}" placeholder="${e(ph)}" autocomplete="off">`;
const inNum = (id, v, step = "any", ph = "") => `<input id="${id}" type="number" inputmode="decimal" step="${step}" value="${v ?? ""}" placeholder="${e(ph)}">`;
const inDate = (id, v) => `<input id="${id}" type="date" value="${e(v || "")}">`;
const opt = (o, v) => { const val = typeof o === "string" ? o : o.v; const t = typeof o === "string" ? o : o.t; return `<option value="${e(val)}"${val === v ? " selected" : ""}>${e(t)}</option>`; };
const inSel = (id, v, opts, vacia = "—") => `<select id="${id}">${vacia !== null ? `<option value="">${e(vacia)}</option>` : ""}${opts.map(o => opt(o, v)).join("")}</select>`;
const inSelG = (id, v, grupos, vacia = "—") => `<select id="${id}"><option value="">${e(vacia)}</option>${grupos.filter(g => g.o.length).map(g => `<optgroup label="${e(g.g)}">${g.o.map(o => opt(o, v)).join("")}</optgroup>`).join("")}</select>`;
const inArea = (id, v, rows = 3, ph = "") => `<textarea id="${id}" rows="${rows}" placeholder="${e(ph)}">${e(v || "")}</textarea>`;
const chips = (id, sel, opts, max = 0) => { const s = U.lista(sel); return `<div class="chips" id="${id}" data-max="${max}">${opts.map(o => `<button type="button" class="chip" aria-pressed="${s.includes(o)}" data-v="${e(o)}">${e(o)}</button>`).join("")}</div>`; };
const seg = (id, v, desde, hasta, etiquetas) => { const n = U.num(v); let h = `<div class="seg" id="${id}" role="group">`; for (let k = desde; k <= hasta; k++) h += `<button type="button" aria-pressed="${n === k}" data-v="${k}"${etiquetas ? ` title="${e(etiquetas[k - desde])}"` : ""}>${k}</button>`; return h + "</div>"; };
const fldSeg = (id, nombre, v, hasta, etiquetas) => `<div class="fld seg-fld"><label>${e(nombre)} <small class="seg-lbl" id="${id}-lbl">${U.num(v) !== null && etiquetas ? e(etiquetas[U.num(v) - 1] || "") : ""}</small></label>${seg(id, v, 1, hasta, etiquetas)}</div>`;
const rango = (id, v) => { const n = U.num(v); return `<div class="rng"><input id="${id}" type="range" min="0" max="15" step="0.5" value="${n ?? 7.5}" data-touched="${n !== null ? 1 : 0}" aria-label="Intensidad de 0 a 15"><output id="${id}-o">${n ?? "—"}</output></div>`; };
const toggle = (id, v, etq) => `<label class="tgl"><input id="${id}" type="checkbox"${v ? " checked" : ""}><span>${e(etq)}</span></label>`;
const V = {
  t: id => { const el = document.getElementById(id); return el ? String(el.value).trim() : ""; },
  n: id => U.num(V.t(id)),
  chips: id => { const box = document.getElementById(id); return box ? $$(".chip[aria-pressed=\"true\"]", box).map(b => b.dataset.v) : []; },
  seg: id => { const box = document.getElementById(id); const b = box && $("button[aria-pressed=\"true\"]", box); return b ? Number(b.dataset.v) : null; },
  rng: id => { const el = document.getElementById(id); return el && el.dataset.touched === "1" ? Number(el.value) : null; },
  chk: id => !!(document.getElementById(id) || {}).checked
};
/* Tablas dinámicas (pasos, parcelas, ensayos, plan) */
const filaDin = (cols, r) => `<div class="din-row">${cols.map(c => c.type === "checkbox" ? `<label class="din-chk"><input type="checkbox" data-k="${c.k}"${r[c.k] ? " checked" : ""}> ${e(c.t)}</label>` : `<input type="${c.type || "text"}" data-k="${c.k}" placeholder="${e(c.t)}" aria-label="${e(c.t)}" value="${e(r[c.k] ?? "")}" style="flex:${c.w || 1}">`).join("")}<button type="button" class="din-x" data-act="din-del" aria-label="Quitar fila">×</button></div>`;
const tablaDin = (id, cols, rows, etq = "Agregar fila") => `<div class="din" id="${id}" data-cols="${e(JSON.stringify(cols))}"><div class="din-rows">${(rows && rows.length ? rows : [{}]).map(r => filaDin(cols, r)).join("")}</div><button type="button" class="btn sm" data-act="din-add" data-din="${id}">+ ${etq}</button></div>`;
const leerDin = id => { const box = document.getElementById(id); if (!box) return []; return $$(".din-row", box).map(row => Object.fromEntries($$("input", row).map(i => [i.dataset.k, i.type === "checkbox" ? i.checked : i.value.trim()]))).filter(o => Object.values(o).some(v => v !== "" && v !== false)); };

const tipoMime = n => n.endsWith(".pdf") ? "application/pdf" : n.endsWith(".html") ? "text/html;charset=utf-8" : n.endsWith(".md") ? "text/markdown;charset=utf-8" : n.endsWith(".json") ? "application/json" : "application/octet-stream";
async function descargar(nombre, data) {
  try {
    const blob = data instanceof Blob ? data : new Blob([data], { type: tipoMime(nombre) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = nombre; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast("Archivo listo ✔");
    return true;
  } catch (err) { toast("No se pudo preparar la descarga.", "warn"); return false; }
}
/* En el celular abre el menú para compartir (WhatsApp, correo…); si no se puede, descarga */
async function compartir(nombre, data, titulo) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: tipoMime(nombre) });
  try {
    const file = new File([blob], nombre, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: titulo || nombre }); return true; }
  } catch (err) { if (err && err.name === "AbortError") return false; }
  return descargar(nombre, blob);
}
const errorGuardar = err => { const c = err && (err.name || err.code); return c === "QuotaExceededError" ? "El almacenamiento de este dispositivo está lleno: libera espacio o elimina registros antiguos." : "No se pudo guardar en este dispositivo. Inténtalo otra vez."; };

/* ------------------------------ Navegación ------------------------------ */
function colActual() { if (R.tab === "barista") return SUB2COL[R.subs.barista]; if (R.tab === "cata") return "catas"; if (R.tab === "fincas") return R.col || "fincas"; if (R.tab === "foto") return "diagnosticos"; return null; }
function ir(c) {
  if (c.tab && c.tab !== R.tab) { R.modo = "lista"; R.id = null; R.padre = null; R.borrador = null; R.manual = null; R.col = c.tab === "fincas" ? "fincas" : null; }
  Object.assign(R, c);
  if (!("borrador" in c) && R.modo !== "form") R.borrador = null;
  render();
  try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (x) { window.scrollTo(0, 0); }
}

/* ------------------------------ Cabecera ------------------------------ */
function pintarCabecera() {
  const p = S.pendientes();
  const b = document.getElementById("sync-n"); if (b) { b.textContent = p.total; b.hidden = !p.total; }
  const sb = document.getElementById("btn-sync"); if (sb) sb.setAttribute("aria-label", p.total ? `Sincronizar con Obsidian: ${p.total} pendientes` : "Sincronizar con Obsidian");
  $$("[data-tab]").forEach(t => t.setAttribute("aria-current", t.dataset.tab === R.tab ? "page" : "false"));
}

/* ------------------------------ Render ------------------------------ */
function render() {
  pintarCabecera();
  const m = document.getElementById("main"); if (!m) return;
  let h = "";
  if (!S.listo) h = `<div class="cargando"><div class="taza" aria-hidden="true"></div><p>Abriendo tu laboratorio…</p></div>`;
  else {
    try {
      const vistas = Object.assign({ inicio: vInicio, barista: vBarista, cata: vCata, fincas: vFincas, aprende: vAprende }, B.vistas || {});
      h = (vistas[R.tab] || vInicio)();
    } catch (err) { console.error(err); h = vacio("Algo salió mal al mostrar esta pantalla", "Vuelve al inicio e inténtalo de nuevo.", goBtn("Ir al inicio", { tab: "inicio" }, "pri")); }
  }
  const banner = (S.modo === "memoria" ? `<div class="aviso">${e(S.motivo)}</div>` : "") + (!navigator.onLine ? `<div class="aviso suave">Sin conexión: todo se guarda en este dispositivo y se subirá cuando vuelva internet.</div>` : "");
  m.innerHTML = banner + h;
  despuesRender();
}
function despuesRender() {
  if (R.modo === "form") liveActual();
  if (R.modo === "informe") actualizarPrev();
  if (B.vistas && typeof B.vistas.despues === "function") { try { B.vistas.despues(R); } catch (err) { console.error(err); } }
}

/* ------------------------------ Inicio ------------------------------ */
function vInicio() {
  const preps = ordenarFecha(S.d.preparaciones);
  const semana = preps.filter(p => { const d = U.diasDesde(p.fecha); return d !== null && d <= 6; }).length;
  const pbls = preps.map(C.pbl).filter(x => x !== null);
  const mejor = pbls.length ? Math.max(...pbls) : null;
  const abiertos = S.d.cafes.filter(c => (c.estado || "abierto") === "abierto");
  const activas = S.d.fincas.filter(f => !["cerrada", "prospecto"].includes(f.estado_consultoria));
  const pend = S.pendientes().total;
  const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const acciones = [
    [svg('<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/>'), "Registrar preparación", { tab: "barista", subs: { ...R.subs, barista: "bitacora" }, modo: "form", id: null }],
    [svg('<ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(30 12 12)"/><path d="M9 5c3 3 1 8 6 13"/>'), "Nuevo café", { tab: "barista", subs: { ...R.subs, barista: "cafes" }, modo: "form", id: null }],
    [svg('<ellipse cx="9" cy="8" rx="5" ry="3.5"/><path d="M13.5 9.5 21 19"/>'), "Nueva cata", { tab: "cata", modo: "form", id: null }],
    [svg('<path d="M12 21V11"/><path d="M12 11c0-4 3-7 8-7 0 5-3 7-8 7z"/><path d="M12 14c0-3-2.5-5-7-5 0 4 2.5 5 7 5z"/>'), "Nueva finca", { tab: "fincas", col: "fincas", modo: "form", id: null }],
    [svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'), "Foto con IA", { tab: "foto", modo: "form", id: null }]
  ];
  const faltan = [!(S.ajustes && S.ajustes.consultor) && ["Pon tu nombre", "Aparece en tus registros e informes."], !(B.Sync && B.Sync.configurado()) && ["Conecta GitHub", "Para respaldar todo y enviarlo a Obsidian."], !(B.IA && B.IA.disponible()) && ["Agrega tu clave de IA", "Para analizar fotos de hojas, frutos y granos."]].filter(Boolean);
  const bienvenida = faltan.length ? `<section class="panel guia-inicio"><div class="panel-h"><h2>Prepara tu app</h2>${goBtn("Ir a Ajustes", { tab: "ajustes" }, "pri sm")}</div><ol>${faltan.map(([t, d]) => `<li><b>${t}</b> · <span class="muted">${d}</span></li>`).join("")}</ol><p class="help">Todo es opcional: la app funciona sin conexión desde ya.</p></section>` : "";
  return `<section class="hero"><p class="eyebrow">${e(U.fechaLarga(U.hoy()))}</p><h1>Tu laboratorio de café</h1><p class="lede">Registra cada taza, cata con el sistema del SCA, diagnostica fincas y manda todo a tu Obsidian con un toque.</p></section>
<div class="rapidas">${acciones.map(([i, t, o]) => `<button type="button" class="rapida" data-go="${go(o)}">${i}${t}</button>`).join("")}</div>
${bienvenida}
<div class="stats">
${stat("Tazas esta semana", semana, "")}${stat("Mejor puntaje", mejor === null ? "—" : U.fmt(mejor, 1), "de 100")}${stat("Cafés abiertos", abiertos.length, "")}${stat("Fincas activas", activas.length, "")}
<button type="button" class="stat stat-sync" data-go="${go({ tab: "sync" })}"><span>Pendientes de Obsidian</span><b>${pend}</b><small>${pend ? "Toca para sincronizar" : "Todo sincronizado"}</small></button>
</div>
<div class="dos">
<section class="panel"><div class="panel-h"><h2>Últimas preparaciones</h2>${goBtn("Ver bitácora", { tab: "barista", subs: { ...R.subs, barista: "bitacora" } }, "link")}</div>
${preps.length ? `<div class="filas">${preps.slice(0, 5).map(filaPrep).join("")}</div>` : vacio("Aún no hay tazas registradas", "Registra tu próxima preparación: toma 2 minutos.", goBtn("Registrar preparación", { tab: "barista", subs: { ...R.subs, barista: "bitacora" }, modo: "form", id: null }, "pri"))}</section>
<section class="panel"><div class="panel-h"><h2>Cafés abiertos</h2>${goBtn("Ver cafés", { tab: "barista", subs: { ...R.subs, barista: "cafes" } }, "link")}</div>
${abiertos.length ? `<div class="filas">${abiertos.slice(0, 5).map(filaCafe).join("")}</div>` : vacio("No hay bolsas abiertas", "Registra la bolsa que estás tomando para seguir su reposo y sus mejores recetas.", goBtn("Nuevo café", { tab: "barista", subs: { ...R.subs, barista: "cafes" }, modo: "form", id: null }, "pri"))}</section>
</div>
${activas.length ? `<section class="panel"><div class="panel-h"><h2>Fincas en consultoría</h2>${goBtn("Ver fincas", { tab: "fincas", col: "fincas" }, "link")}</div><div class="filas">${activas.slice(0, 4).map(filaFinca).join("")}</div></section>` : ""}`;
}
const stat = (t, v, u) => `<div class="stat"><span>${t}</span><b>${v}</b><small>${u}</small></div>`;
const ordenarFecha = arr => [...arr].sort((a, b) => ((b.fecha || "") + (b.creado || "")).localeCompare((a.fecha || "") + (a.creado || "")));

/* ------------------------------ Barista ------------------------------ */
function subtabs(tab, items) {
  return `<div class="subtabs" role="tablist">${items.map(([k, t]) => `<button type="button" role="tab" aria-selected="${R.subs[tab] === k}" data-go="${go({ subs: { ...R.subs, [tab]: k }, modo: "lista", id: null, manual: null })}">${t}</button>`).join("")}</div>`;
}
function vBarista() {
  const sub = R.subs.barista, col = SUB2COL[sub];
  const tabs = subtabs("barista", [["bitacora", "Bitácora"], ["cafes", "Cafés"], ["recetas", "Recetas"], ["experimentos", "Experimentos"]]);
  if (R.modo === "form") return tabs + FORMS[{ preparaciones: "prep", cafes: "cafe", recetas: "receta", experimentos: "exp" }[col]].render(R.id ? S.buscar(col, R.id) : R.borrador);
  if (R.modo === "ver") { const r = S.buscar(col, R.id); return tabs + (r ? DET[col](r) : vacio("No encontré este registro", "Puede que se haya eliminado.", goBtn("Volver", { modo: "lista", id: null }))); }
  const nuevos = { preparaciones: "Registrar preparación", cafes: "Nuevo café", recetas: "Nueva receta", experimentos: "Nuevo experimento" };
  let lista = "";
  if (col === "preparaciones") { const a = ordenarFecha(S.d.preparaciones); lista = a.length ? `<div class="filas">${a.map(filaPrep).join("")}</div>` : vacio("Tu bitácora está vacía", "Cada taza registrada te enseña algo. Empieza con tu próxima preparación."); }
  if (col === "cafes") { const a = [...S.d.cafes].sort((x, y) => (x.estado === "terminado") - (y.estado === "terminado") || (y.fecha_tueste || "").localeCompare(x.fecha_tueste || "")); lista = a.length ? `<div class="filas">${a.map(filaCafe).join("")}</div>` : vacio("Aún no hay cafés", "Registra cada bolsa: tostador, proceso y fecha de tueste."); }
  if (col === "recetas") lista = vRecetas();
  if (col === "experimentos") { const a = ordenarFecha(S.d.experimentos); lista = a.length ? `<div class="filas">${a.map(x => { const n = (x.resultados || []).length, k = (x.resultados || []).filter(r => r.acierto).length; return fila({ titulo: `${x.fecha || ""} · ${x.titulo || "Experimento"}`, meta: [x.variable, x.estado].filter(Boolean).join(" · "), der: (n ? pill(`${k}/${n}`, n && C.triangular(n, k) < 0.05 ? "ok" : "") : "") + dot(x), obj: { modo: "ver", id: x.id } }); }).join("")}</div>` : vacio("Sin experimentos todavía", "Haz tu primera prueba a ciegas: una pregunta, una variable."); }
  return tabs + `<div class="barra"><h2>${{ preparaciones: "Bitácora", cafes: "Cafés", recetas: "Mis recetas", experimentos: "Experimentos" }[col]}</h2>${goBtn("+ " + nuevos[col], { modo: "form", id: null, borrador: null }, "pri")}</div>` + lista;
}
const dot = r => r.sync === "pendiente" ? `<span class="dot" title="Pendiente de sincronizar"></span>` : "";
function filaPrep(p) {
  const cafe = S.buscar("cafes", p.cafe_id); const pb = C.pbl(p);
  return fila({ titulo: `${p.fecha || ""} · ${p.metodo || "Preparación"}`, meta: [cafe ? cafe.nombre : p.cafe_txt, (p.dosis_g && p.agua_g) ? `${p.dosis_g} g / ${p.agua_g} g` : "", p.clicks ? `${p.clicks} clicks` : "", p.temp_c ? `${p.temp_c} °C` : ""].filter(Boolean).join(" · "), der: (pb !== null ? `<span class="score">${U.fmt(pb, 1)}</span>` : (U.num(p.estrellas) ? `<span class="estrellas">${"★".repeat(U.num(p.estrellas))}</span>` : "")) + dot(p), obj: { tab: "barista", subs: { ...R.subs, barista: "bitacora" }, modo: "ver", id: p.id } });
}
function filaCafe(c) {
  const d = U.diasDesde(c.fecha_tueste);
  return fila({ titulo: c.nombre || "Café", meta: [c.tostador, c.proceso, d !== null ? `tostado hace ${d} día${d === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · "), der: (c.estado && c.estado !== "abierto" ? pill(c.estado) : "") + (U.num(c.rating_cafe) ? `<span class="score">${U.fmt(c.rating_cafe, 1)}</span>` : "") + dot(c), obj: { tab: "barista", subs: { ...R.subs, barista: "cafes" }, modo: "ver", id: c.id } });
}
function vRecetas() {
  const mias = [...S.d.recetas].sort((a, b) => (a.metodo || "").localeCompare(b.metodo || "") || (a.nombre || "").localeCompare(b.nombre || ""));
  const lista = mias.length ? `<div class="filas">${mias.map(r => fila({ titulo: `${r.metodo || ""} · ${r.nombre || "Receta"}`, meta: [`v${r.version || 1}`, r.dosis_g && r.agua_g ? `${r.dosis_g} g / ${r.agua_g} g` : "", r.temp_c ? `${r.temp_c} °C` : ""].filter(Boolean).join(" · "), der: pill(r.estado || "en prueba", r.estado === "definitiva" ? "ok" : "") + dot(r), obj: { modo: "ver", id: r.id } })).join("")}</div>` : vacio("Tus recetas van aquí", "Crea tu primera receta propia: parámetros, pasos y versiones.");
  return lista + `<section class="panel ref"><div class="panel-h"><h2>Recetas de referencia</h2><small class="muted">Ya están en tu Obsidian</small></div><div class="refs">${L.recetasReferencia.map(x => `<div class="ref-card"><b>${e(x.nombre)}</b><small>${e(x.resumen)}</small><button type="button" class="btn sm" data-go="${go({ modo: "form", id: null, borrador: { receta: "ref:" + x.nombre, metodo: x.metodo, fecha: U.hoy() }, subs: { ...R.subs, barista: "bitacora" } })}">Preparar</button></div>`).join("")}</div></section>`;
}

/* ------------------------------ Formularios ------------------------------ */
function formAcciones(r, col) {
  return `<div class="form-acc">${btn(r && r.id ? "Guardar cambios" : "Guardar", "guardar", "pri")}${btn("Cancelar", "cancelar", "ghost")}</div>`;
}
const LIVE = {};
const FORMS = {};

FORMS.prep = {
  col: "preparaciones",
  render(r) {
    r = Object.assign({ fecha: U.hoy(), agua: "Agua Brewer Lab 68/40" }, r || {});
    const cafes = S.d.cafes.filter(c => c.estado !== "terminado" || c.id === r.cafe_id).sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    const recetas = [{ g: "Mis recetas", o: S.d.recetas.map(x => ({ v: "own:" + x.id, t: `${x.metodo} · ${x.nombre}` })) }, { g: "Recetas de referencia", o: L.recetasReferencia.map(x => ({ v: "ref:" + x.nombre, t: x.nombre })) }];
    return `<form class="form" id="f" data-form="prep" novalidate>
<h2>${r.id ? "Editar preparación" : "Nueva preparación"}</h2>
<div class="grid">${fld("Fecha", inDate("fecha", r.fecha), { for: "fecha" })}${fld("Método", inSel("metodo", r.metodo, L.metodos, "Elige el método"), { for: "metodo" })}
${fld("Café", inSelG("cafe_id", r.cafe_id, [{ g: "Mis cafés", o: cafes.map(c => ({ v: c.id, t: c.nombre })) }], cafes.length ? "Elige el café" : "Aún no registras cafés"), { for: "cafe_id" })}
${fld("Café sin registrar", inText("cafe_txt", r.cafe_txt, "Solo si no está en la lista"), { for: "cafe_txt" })}
${fld("Receta", inSelG("receta", r.receta, recetas, "Sin receta"), { for: "receta", cls: "span2" })}</div>
<fieldset><legend>Parámetros</legend><div class="grid g3">
${fld("Dosis", inNum("dosis_g", r.dosis_g, "0.1", "15"), { unit: "g", for: "dosis_g" })}${fld("Agua", inNum("agua_g", r.agua_g, "1", "250"), { unit: "g", for: "agua_g" })}${fld("Molienda", inNum("clicks", r.clicks, "1", "12"), { unit: "clicks C5", for: "clicks" })}
${fld("Temperatura", inNum("temp_c", r.temp_c, "1", "96"), { unit: "°C", for: "temp_c" })}${fld("Tiempo total", inText("tiempo", r.tiempo, "3:05"), { for: "tiempo" })}${fld("Filtro", inText("filtro", r.filtro, "Hario, Cafec, Sibarist…"), { for: "filtro" })}
${fld("Agua usada", inText("agua", r.agua), { for: "agua" })}${fld("TDS", inNum("tds", r.tds, "0.01", "1.35"), { unit: "%", for: "tds", help: "Opcional, con refractómetro" })}${fld("Bebida en la taza", inNum("bebida_g", r.bebida_g, "1", "220"), { unit: "g", for: "bebida_g" })}
</div></fieldset>
<div class="lecturas sticky-lec" id="lec"></div>
<fieldset><legend>Puntaje · impresión de calidad (1–9)</legend><p class="help">Empieza en 5 (ni alta ni baja) y sube o baja desde ahí. Si tienes prisa, usa solo las estrellas.</p>
<div class="segs">${L.atributos.map(a => fldSeg(a.key, a.nombre, r[a.key], 9, L.escala9)).join("")}</div></fieldset>
<div class="grid">${fld("Estrellas", seg("estrellas", r.estrellas, 1, 5))}${fld("¿La repetirías?", toggle("repetir", r.repetir, "Sí, quiero repetirla"))}</div>
${fld("Sabores percibidos", inText("notas_sabor", U.lista(r.notas_sabor).join(", "), "Separados por comas: panela, naranja, té negro"), { for: "notas_sabor" })}
${fld("Paso a paso real", inArea("pasos", r.pasos, 3, "0:00 bloom 50 g · 0:45 a 100 g · …"), { for: "pasos" })}
${fld("Cata", inArea("cata", r.cata, 3, "Caliente, tibio y frío: acidez, dulzor, cuerpo, retrogusto…"), { for: "cata" })}
${fld("La próxima vez cambio UNA cosa", inText("siguiente", r.siguiente), { for: "siguiente" })}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    fecha: V.t("fecha"), metodo: V.t("metodo"), cafe_id: V.t("cafe_id"), cafe_txt: V.t("cafe_txt"), receta: V.t("receta"),
    dosis_g: V.n("dosis_g"), agua_g: V.n("agua_g"), clicks: V.n("clicks"), temp_c: V.n("temp_c"), tiempo: V.t("tiempo"), filtro: V.t("filtro"), agua: V.t("agua"), tds: V.n("tds"), bebida_g: V.n("bebida_g"),
    ...Object.fromEntries(L.atributos.map(a => [a.key, V.seg(a.key)])), estrellas: V.seg("estrellas"), repetir: V.chk("repetir"),
    notas_sabor: U.lista(V.t("notas_sabor")), pasos: V.t("pasos"), cata: V.t("cata"), siguiente: V.t("siguiente")
  }),
  validar: r => !r.metodo ? "Elige el método." : !r.fecha ? "Pon la fecha." : null,
  nuevo: r => { r.hora = U.hora(); }
};
LIVE.prep = () => {
  const r = FORMS.prep.leer({}); const ratio = C.ratio(r), ey = C.ey(r), pbl = C.pbl(r), bd = C.banda(pbl);
  const box = document.getElementById("lec"); if (!box) return;
  const ok = ey !== null ? (ey >= 18 && ey <= 22 ? "ok" : "warn") : "";
  box.innerHTML = lectura("Ratio", ratio ? "1:" + U.fmt(ratio, 1) : "—") + lectura("Extracción", ey === null ? "—" : U.fmt(ey, 1), "%", ey !== null ? pill(ey < 18 ? "Baja" : ey > 22 ? "Alta" : "En rango", ok) : "") + lectura("Puntaje", pbl === null ? "—" : U.fmt(pbl, 2), "/100", bd ? pill(bd.t, bd.c) : `<small class="muted">${C.suma(r) === null ? "Faltan atributos" : ""}</small>`);
};

FORMS.cafe = {
  col: "cafes",
  render(r) {
    r = Object.assign({ fecha_apertura: U.hoy(), estado: "abierto" }, r || {});
    return `<form class="form" id="f" data-form="cafe" novalidate><h2>${r.id ? "Editar café" : "Nuevo café"}</h2>
<div class="grid">${fld("Nombre del café", inText("nombre", r.nombre, "Tostador · País · Finca"), { for: "nombre", cls: "span2" })}${fld("Tostador", inText("tostador", r.tostador), { for: "tostador" })}
${fld("País", inText("pais", r.pais), { for: "pais" })}${fld("Región", inText("region", r.region), { for: "region" })}${fld("Finca", inText("finca", r.finca), { for: "finca" })}${fld("Productor", inText("productor", r.productor), { for: "productor" })}
${fld("Proceso", inSel("proceso", r.proceso, L.procesos), { for: "proceso" })}${fld("Altitud", inNum("altitud_m", r.altitud_m, "1", "1750"), { unit: "m", for: "altitud_m" })}${fld("Cosecha", inText("cosecha", r.cosecha, "2026"), { for: "cosecha" })}
${fld("Fecha de tueste", inDate("fecha_tueste", r.fecha_tueste), { for: "fecha_tueste", help: "Clave para saber el reposo" })}${fld("Fecha de apertura", inDate("fecha_apertura", r.fecha_apertura), { for: "fecha_apertura" })}${fld("Nivel de tueste", inSel("nivel_tueste", r.nivel_tueste, L.tueste), { for: "nivel_tueste" })}
${fld("Peso", inNum("peso_g", r.peso_g, "1", "250"), { unit: "g", for: "peso_g" })}${fld("Precio", inNum("precio", r.precio, "0.01"), { for: "precio" })}${fld("Estado", inSel("estado", r.estado, L.estadosCafe, null), { for: "estado" })}</div>
${fld("Variedad", chips("variedad", r.variedad, L.variedades))}
${fld("Notas del tostador", inText("notas_tostador", U.lista(r.notas_tostador).join(", "), "Separadas por comas"), { for: "notas_tostador" })}
${fld("Primera impresión", inArea("impresion", r.impresion, 2, "Fragancia en seco, notas esperadas vs. reales"), { for: "impresion" })}
${fld("Mejor receta encontrada", inArea("mejor_receta", r.mejor_receta, 2), { for: "mejor_receta" })}
<div class="grid">${fld("Mejor puntaje con este café", inNum("rating_cafe", r.rating_cafe, "0.01"), { for: "rating_cafe", help: "Al cerrar la bolsa" })}</div>
${fld("Cierre de la bolsa", inArea("cierre", r.cierre, 2, "¿Lo volverías a comprar? ¿Qué aprendiste?"), { for: "cierre" })}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    nombre: V.t("nombre"), tostador: V.t("tostador"), pais: V.t("pais"), region: V.t("region"), finca: V.t("finca"), productor: V.t("productor"), proceso: V.t("proceso"),
    altitud_m: V.n("altitud_m"), cosecha: V.t("cosecha"), fecha_tueste: V.t("fecha_tueste"), fecha_apertura: V.t("fecha_apertura"), nivel_tueste: V.t("nivel_tueste"),
    peso_g: V.n("peso_g"), precio: V.n("precio"), estado: V.t("estado") || "abierto", variedad: V.chips("variedad"), notas_tostador: U.lista(V.t("notas_tostador")),
    impresion: V.t("impresion"), mejor_receta: V.t("mejor_receta"), rating_cafe: V.n("rating_cafe"), cierre: V.t("cierre")
  }),
  validar: r => !r.nombre ? "Ponle un nombre al café." : null
};

FORMS.receta = {
  col: "recetas",
  render(r) {
    r = Object.assign({ estado: "en prueba", version: 1 }, r || {});
    return `<form class="form" id="f" data-form="receta" novalidate><h2>${r.id ? "Editar receta" : "Nueva receta"}</h2>
<div class="grid">${fld("Nombre", inText("nombre", r.nombre, "Dulce de 3 vertidos"), { for: "nombre" })}${fld("Método", inSel("metodo", r.metodo, L.metodos, "Elige el método"), { for: "metodo" })}
${fld("Estado", inSel("estado", r.estado, L.estadosReceta, null), { for: "estado" })}${fld("Versión", inNum("version", r.version, "1"), { for: "version" })}</div>
<fieldset><legend>Parámetros</legend><div class="grid g3">${fld("Dosis", inNum("dosis_g", r.dosis_g, "0.1"), { unit: "g", for: "dosis_g" })}${fld("Agua", inNum("agua_g", r.agua_g, "1"), { unit: "g", for: "agua_g" })}${fld("Molienda", inText("clicks_rango", r.clicks_rango, "12–13"), { unit: "clicks C5", for: "clicks_rango" })}
${fld("Temperatura", inNum("temp_c", r.temp_c, "1"), { unit: "°C", for: "temp_c" })}${fld("Tiempo objetivo", inText("tiempo_objetivo", r.tiempo_objetivo, "3:00–3:15"), { for: "tiempo_objetivo" })}${fld("Filtro", inText("filtro", r.filtro), { for: "filtro" })}</div>
<div class="lecturas" id="lec"></div>
${fld("Fuente o inspiración", inText("fuente", r.fuente, "Propia, o el video o la receta en la que te basaste"), { for: "fuente" })}</fieldset>
<fieldset><legend>Pasos</legend>${tablaDin("pasos_r", [{ k: "t", t: "Tiempo", w: 1 }, { k: "accion", t: "Acción", w: 3 }, { k: "agua", t: "Agua acumulada (g)", w: 1.4 }], r.pasos, "Agregar paso")}</fieldset>
${fld("Por qué funciona", inArea("por_que", r.por_que, 3), { for: "por_que" })}
<fieldset><legend>Historial de versiones</legend>${tablaDin("hist_r", [{ k: "version", t: "Versión", w: 0.8 }, { k: "fecha", t: "Fecha", w: 1.2 }, { k: "cambio", t: "Cambio", w: 2.5 }, { k: "resultado", t: "Resultado", w: 2 }], r.historial, "Agregar versión")}</fieldset>
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    nombre: V.t("nombre"), metodo: V.t("metodo"), estado: V.t("estado") || "en prueba", version: V.n("version") || 1, dosis_g: V.n("dosis_g"), agua_g: V.n("agua_g"),
    clicks_rango: V.t("clicks_rango"), temp_c: V.n("temp_c"), tiempo_objetivo: V.t("tiempo_objetivo"), filtro: V.t("filtro"), fuente: V.t("fuente"),
    pasos: leerDin("pasos_r"), por_que: V.t("por_que"), historial: leerDin("hist_r")
  }),
  validar: r => !r.nombre ? "Ponle un nombre a la receta." : !r.metodo ? "Elige el método." : null
};
LIVE.receta = () => { const box = document.getElementById("lec"); if (!box) return; const r = { dosis_g: V.n("dosis_g"), agua_g: V.n("agua_g") }; const ra = C.ratio(r); box.innerHTML = lectura("Ratio", ra ? "1:" + U.fmt(ra, 1) : "—") + lectura("Concentración", ra ? U.fmt(1000 / ra, 0) : "—", "g/L"); };

FORMS.exp = {
  col: "experimentos",
  render(r) {
    r = Object.assign({ fecha: U.hoy(), tipo_prueba: "triangular", estado: "planeado" }, r || {});
    const cafes = S.d.cafes.map(c => ({ v: c.id, t: c.nombre }));
    return `<form class="form" id="f" data-form="exp" novalidate><h2>${r.id ? "Editar experimento" : "Nuevo experimento"}</h2>
<div class="grid">${fld("Título", inText("titulo", r.titulo, "94 °C vs 100 °C en V60"), { for: "titulo", cls: "span2" })}${fld("Fecha", inDate("fecha", r.fecha), { for: "fecha" })}${fld("Estado", inSel("estado", r.estado, L.estadosExperimento, null), { for: "estado" })}</div>
${fld("Pregunta", inText("pregunta", r.pregunta, "¿Se nota la diferencia entre…?"), { for: "pregunta" })}
${fld("Hipótesis", inText("hipotesis", r.hipotesis), { for: "hipotesis" })}
<div class="grid">${fld("Variable (una sola)", inText("variable", r.variable, "Temperatura"), { for: "variable" })}${fld("Valores", inText("valores", U.lista(r.valores).join(", "), "A, B"), { for: "valores", help: "Separados por comas" })}
${fld("Método", inSel("metodo", r.metodo, L.metodos), { for: "metodo" })}${fld("Café", inSel("cafe_id", r.cafe_id, cafes), { for: "cafe_id" })}${fld("Tipo de prueba", inSel("tipo_prueba", r.tipo_prueba, ["triangular", "pareada de preferencia"], null), { for: "tipo_prueba" })}</div>
${fld("Constantes (todo lo que no cambia)", inText("constantes", r.constantes, "Café, dosis, molienda, agua, filtro, taza"), { for: "constantes" })}
<fieldset><legend>Ensayos a ciegas</legend><p class="help">Prueba triangular: 2 tazas iguales y 1 distinta. Marca si acertaste cuál era la distinta.</p>
${tablaDin("res_e", [{ k: "acierto", t: "Acerté", type: "checkbox" }, { k: "preferencia", t: "Preferí", w: 1.4 }, { k: "notas", t: "Notas", w: 3 }], r.resultados, "Agregar ensayo")}
<div class="lecturas" id="lec"></div></fieldset>
<div class="grid">${fld("Ganador", inText("ganador", r.ganador), { for: "ganador" })}</div>
${fld("Conclusión", inArea("conclusion", r.conclusion, 3, "¿Cambia alguna receta?"), { for: "conclusion" })}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    titulo: V.t("titulo"), fecha: V.t("fecha"), estado: V.t("estado") || "planeado", pregunta: V.t("pregunta"), hipotesis: V.t("hipotesis"), variable: V.t("variable"),
    valores: U.lista(V.t("valores")), metodo: V.t("metodo"), cafe_id: V.t("cafe_id"), tipo_prueba: V.t("tipo_prueba") || "triangular", constantes: V.t("constantes"),
    resultados: leerDin("res_e"), ganador: V.t("ganador"), conclusion: V.t("conclusion")
  }),
  validar: r => !r.titulo ? "Ponle un título al experimento." : null
};
LIVE.exp = () => {
  const box = document.getElementById("lec"); if (!box) return;
  const res = leerDin("res_e"); const n = res.length, k = res.filter(x => x.acierto).length;
  if (!n) { box.innerHTML = lectura("Ensayos", "0") + `<p class="help">Agrega ensayos para ver si el resultado es significativo.</p>`; return; }
  const p = C.triangular(n, k), min = C.minAciertos(n);
  box.innerHTML = lectura("Aciertos", `${k}/${n}`) + lectura("p", U.fmt(p, 3), "", pill(p < 0.05 ? "Significativo" : "No significativo", p < 0.05 ? "ok" : "")) + lectura("Necesitas", min === null ? "—" : `${min}/${n}`, "para p < 0,05");
};

const cataChips = (id, sel) => { const s = U.lista(sel); return `<div class="chips cata" id="${id}" data-max="0">${L.cata.map(g => `<span class="cata-g"><button type="button" class="chip cat" aria-pressed="${s.includes(g.cat)}" data-v="${e(g.cat)}">${e(g.cat)}</button>${g.subs.map(x => `<button type="button" class="chip" aria-pressed="${s.includes(x)}" data-v="${e(x)}">${e(x)}</button>`).join("")}</span>`).join("")}</div>`; };
const INTENS = [["i_fragancia", "Fragancia"], ["i_aroma", "Aroma"], ["i_sabor", "Sabor"], ["i_retrogusto", "Sabor residual"], ["i_acidez", "Acidez"], ["i_dulzor", "Dulzor"], ["i_cuerpo", "Sensación en boca"]];
FORMS.cata = {
  col: "catas",
  render(r) {
    r = Object.assign({ fecha: U.hoy(), tazas_no_uniformes: 0, tazas_defectuosas: 0 }, r || {});
    return `<form class="form" id="f" data-form="cata" novalidate><h2>${r.id ? "Editar cata" : "Nueva cata · SCA CVA"}</h2>
<div class="grid">${fld("Muestra", inText("muestra", r.muestra, "Código o nombre de la muestra"), { for: "muestra" })}${fld("Fecha", inDate("fecha", r.fecha), { for: "fecha" })}${fld("Sesión", inText("sesion", r.sesion, "Cupping viernes"), { for: "sesion" })}
${fld("Café registrado", inSel("cafe_id", r.cafe_id, S.d.cafes.map(c => ({ v: c.id, t: c.nombre }))), { for: "cafe_id" })}${fld("Origen", inText("origen", r.origen, "País, región"), { for: "origen" })}${fld("Variedad", inText("variedad", U.lista(r.variedad).join(", ")), { for: "variedad" })}
${fld("Proceso", inSel("proceso", r.proceso, L.procesos), { for: "proceso" })}${fld("Nivel de tueste", inSel("nivel_tueste", r.nivel_tueste, L.tueste), { for: "nivel_tueste" })}${fld("Objetivo", inText("objetivo", r.objetivo, "Calibración, compra, control…"), { for: "objetivo" })}</div>
<fieldset><legend>Parte 1 · Descriptiva (intensidad 0–15)</legend><p class="help">Describe qué hay y cuánto, sin juzgar si te gusta.</p>
<div class="rngs">${INTENS.map(([k, t]) => fld(t, rango(k, r[k]))).join("")}</div>
${fld("Fragancia y aroma", cataChips("descriptores_aroma", r.descriptores_aroma))}
${fld("Sabor y sabor residual", cataChips("descriptores_sabor", r.descriptores_sabor))}
<div class="grid">${fld("Gustos predominantes (2)", chips("gustos_predominantes", r.gustos_predominantes, L.gustos, 2))}${fld("Sensación en boca", chips("sensacion_boca", r.sensacion_boca, L.boca))}</div></fieldset>
<fieldset><legend>Parte 2 · Afectiva (impresión de calidad 1–9)</legend>
<div class="segs">${L.atributos.map(a => fldSeg(a.key, a.nombre, r[a.key], 9, L.escala9)).join("")}</div>
<div class="grid">${fld("Tazas no uniformes", seg("tazas_no_uniformes", r.tazas_no_uniformes, 0, 5), { help: "−2 puntos cada una" })}${fld("Tazas defectuosas", seg("tazas_defectuosas", r.tazas_defectuosas, 0, 5), { help: "−4 puntos cada una" })}${fld("Defecto", inSel("defecto", r.defecto, L.defectos, "Ninguno"), { for: "defecto" })}</div>
<div class="lecturas" id="lec"></div></fieldset>
<fieldset><legend>Parte 3 · Extrínseca</legend>
${fld("Cultivo", inArea("ext_cultivo", r.ext_cultivo, 2, "País, región, finca, productor, especie, variedad, cosecha"), { for: "ext_cultivo" })}
${fld("Procesamiento", inArea("ext_proceso", r.ext_proceso, 2, "Beneficiador, tipo de proceso, descripción"), { for: "ext_proceso" })}
${fld("Comercio", inArea("ext_comercio", r.ext_comercio, 2, "Clasificación, número OIC, importador, exportador, precio al productor, tamaño del lote"), { for: "ext_comercio" })}
${fld("Certificaciones", chips("ext_certificaciones", r.ext_certificaciones, [...L.certificaciones, "Inocuidad alimentaria"]))}
${fld("Premios o reconocimientos", inText("ext_premios", r.ext_premios), { for: "ext_premios" })}</fieldset>
${fld("Conclusión en una frase", inText("conclusion", r.conclusion), { for: "conclusion" })}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    muestra: V.t("muestra"), fecha: V.t("fecha"), sesion: V.t("sesion"), cafe_id: V.t("cafe_id"), origen: V.t("origen"), variedad: U.lista(V.t("variedad")), proceso: V.t("proceso"),
    nivel_tueste: V.t("nivel_tueste"), objetivo: V.t("objetivo"), ...Object.fromEntries(INTENS.map(([k]) => [k, V.rng(k)])),
    descriptores_aroma: V.chips("descriptores_aroma"), descriptores_sabor: V.chips("descriptores_sabor"), gustos_predominantes: V.chips("gustos_predominantes"), sensacion_boca: V.chips("sensacion_boca"),
    ...Object.fromEntries(L.atributos.map(a => [a.key, V.seg(a.key)])), tazas_no_uniformes: V.seg("tazas_no_uniformes") || 0, tazas_defectuosas: V.seg("tazas_defectuosas") || 0, defecto: V.t("defecto"),
    ext_cultivo: V.t("ext_cultivo"), ext_proceso: V.t("ext_proceso"), ext_comercio: V.t("ext_comercio"), ext_certificaciones: V.chips("ext_certificaciones"), ext_premios: V.t("ext_premios"), conclusion: V.t("conclusion")
  }),
  validar: r => !r.muestra ? "Ponle nombre o código a la muestra." : null
};
LIVE.cata = () => {
  const box = document.getElementById("lec"); if (!box) return;
  const r = FORMS.cata.leer({}); const s = C.suma(r), cva = C.cva(r);
  box.innerHTML = lectura("Suma afectiva", s === null ? "—" : s, "/72") + lectura("Puntaje CVA", cva === null ? "—" : U.fmt(cva, 2), "/100", s === null ? `<small class="muted">Faltan atributos</small>` : "");
};

FORMS.finca = {
  col: "fincas",
  render(r) {
    r = Object.assign({ estado_consultoria: "diagnóstico", fecha_primera_visita: U.hoy() }, r || {});
    return `<form class="form" id="f" data-form="finca" novalidate><h2>${r.id ? "Editar finca" : "Nueva finca"}</h2>
<div class="grid">${fld("Nombre de la finca", inText("nombre", r.nombre, "Finca El Mirador"), { for: "nombre", cls: "span2" })}${fld("Código corto", inText("codigo", r.codigo, "FEM"), { for: "codigo", help: "Para los códigos de lote (2–4 letras)" })}
${fld("Productor", inText("productor", r.productor), { for: "productor" })}${fld("Contacto", inText("contacto", r.contacto, "Teléfono o correo"), { for: "contacto" })}${fld("Estado de la consultoría", inSel("estado_consultoria", r.estado_consultoria, L.estadosConsultoria, null), { for: "estado_consultoria" })}
${fld("País", inText("pais", r.pais), { for: "pais" })}${fld("Región", inText("region", r.region), { for: "region" })}${fld("Municipio", inText("municipio", r.municipio), { for: "municipio" })}
${fld("Coordenadas o polígono", inText("coordenadas", r.coordenadas, "Lat, Lon (6 decimales) o archivo GeoJSON"), { for: "coordenadas", cls: "span2" })}${fld("Primera visita", inDate("fecha_primera_visita", r.fecha_primera_visita), { for: "fecha_primera_visita" })}
${fld("Altitud mínima", inNum("altitud_min", r.altitud_min, "1"), { unit: "m", for: "altitud_min" })}${fld("Altitud máxima", inNum("altitud_max", r.altitud_max, "1"), { unit: "m", for: "altitud_max" })}${fld("Mercado actual", inText("mercado", r.mercado, "Cooperativa, exportador, especialidad…"), { for: "mercado" })}
${fld("Área total", inNum("area_total_ha", r.area_total_ha, "0.1"), { unit: "ha", for: "area_total_ha" })}${fld("Área de café", inNum("area_cafe_ha", r.area_cafe_ha, "0.1"), { unit: "ha", for: "area_cafe_ha" })}</div>
${fld("Variedades", chips("variedades", r.variedades, L.variedades))}
${fld("Procesos", chips("procesos", r.procesos, L.procesos))}
${fld("Certificaciones", chips("certificaciones", r.certificaciones, L.certificaciones))}
<fieldset><legend>Parcelas</legend>${tablaDin("parcelas_f", [{ k: "id", t: "Parcela (P01)", w: 1 }, { k: "area", t: "Área ha", w: 0.8 }, { k: "variedad", t: "Variedad", w: 1.4 }, { k: "anio", t: "Año siembra", w: 1 }, { k: "densidad", t: "Plantas/ha", w: 1 }, { k: "sombra", t: "Sombra %", w: 0.9 }, { k: "altitud", t: "Altitud m", w: 1 }], r.parcelas, "Agregar parcela")}</fieldset>
${fld("Infraestructura", inArea("infraestructura", r.infraestructura, 2, "Beneficio húmedo, secado, bodega"), { for: "infraestructura" })}
${fld("Plan de acción vigente", inArea("plan", r.plan, 3), { for: "plan" })}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    nombre: V.t("nombre"), codigo: (V.t("codigo") || U.iniciales(V.t("nombre"))).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4), productor: V.t("productor"), contacto: V.t("contacto"),
    estado_consultoria: V.t("estado_consultoria"), pais: V.t("pais"), region: V.t("region"), municipio: V.t("municipio"), coordenadas: V.t("coordenadas"), fecha_primera_visita: V.t("fecha_primera_visita"),
    altitud_min: V.n("altitud_min"), altitud_max: V.n("altitud_max"), mercado: V.t("mercado"), area_total_ha: V.n("area_total_ha"), area_cafe_ha: V.n("area_cafe_ha"),
    variedades: V.chips("variedades"), procesos: V.chips("procesos"), certificaciones: V.chips("certificaciones"), parcelas: leerDin("parcelas_f"), infraestructura: V.t("infraestructura"), plan: V.t("plan")
  }),
  validar: r => !r.nombre ? "Ponle nombre a la finca." : null
};

FORMS.visita = {
  col: "visitas",
  render(r) {
    const finca = S.buscar("fincas", (r && r.finca_id) || R.padre) || {};
    r = Object.assign({ fecha: U.hoy(), tipo_visita: "diagnóstico", hallazgos: {} }, r || {});
    const h = r.hallazgos || {};
    return `<form class="form visita" id="f" data-form="visita" novalidate><h2>${r.id ? "Editar visita" : "Nueva visita"} · ${e(finca.nombre || "")}</h2>
<div class="grid">${fld("Fecha", inDate("fecha", r.fecha), { for: "fecha" })}${fld("Tipo de visita", inSel("tipo_visita", r.tipo_visita, L.tiposVisita, null), { for: "tipo_visita" })}</div>
<div class="visita-cols"><div class="areas">
${B.areas.map((a, i) => `<section class="area-card"><div class="area-h"><h3><span class="num">${i + 1}</span>${e(a.nombre)}</h3><small class="seg-lbl" id="s_${a.key}-lbl">${U.num(r["s_" + a.key]) ? e(B.niveles[r["s_" + a.key]]) : "Sin puntuar"}</small></div>
${seg("s_" + a.key, r["s_" + a.key], 1, 5, B.niveles.slice(1))}
<details><summary>Qué observar y cómo puntuar</summary><p><b>Observar:</b> ${e(a.observar)}</p><p><b>Medir:</b> ${e(a.medir)}</p><ul class="rub"><li><b>1</b> ${e(a.n1)}</li><li><b>3</b> ${e(a.n3)}</li><li><b>5</b> ${e(a.n5)}</li></ul></details>
${inArea("h_" + a.key, h[a.key], 2, "Hallazgos y evidencia")}</section>`).join("")}
</div><aside class="resumen-vivo" id="lec"></aside></div>
<fieldset><legend>Mediciones de campo</legend><div class="grid g3">${B.metas.map(m => fld(m.nombre, inNum(m.key, r[m.key], "any"), { unit: m.unidad, for: m.key, help: "Meta: " + m.meta })).join("")}</div></fieldset>
${fld("Prioridades detectadas", inArea("prioridades", r.prioridades, 3), { for: "prioridades" })}
${fld("Muestras tomadas", chips("muestras", r.muestras, ["Café verde (350 g)", "Café para cupping", "Suelo", "Hojas (foliar)"]))}
${formAcciones(r)}</form>`;
  },
  leer: b => Object.assign({}, b, {
    finca_id: b.finca_id || R.padre, fecha: V.t("fecha"), tipo_visita: V.t("tipo_visita"),
    ...Object.fromEntries(B.areas.map(a => ["s_" + a.key, V.seg("s_" + a.key)])),
    hallazgos: Object.fromEntries(B.areas.map(a => [a.key, V.t("h_" + a.key)])),
    ...Object.fromEntries(B.metas.map(m => [m.key, V.n(m.key)])), prioridades: V.t("prioridades"), muestras: V.chips("muestras")
  }),
  validar: r => !r.finca_id ? "Esta visita no tiene finca." : !r.fecha ? "Pon la fecha." : null,
  despues: async r => { const f = S.buscar("fincas", r.finca_id); const idx = C.indice(r); if (f && idx !== null && f.indice_ultimo !== idx) { try { await S.guardar("fincas", Object.assign({}, f, { indice_ultimo: idx }), { sinDependientes: true }); } catch (x) { /* no crítico */ } } }
};
LIVE.visita = () => {
  const box = document.getElementById("lec"); if (!box) return;
  const r = FORMS.visita.leer({ finca_id: R.padre }); const idx = C.indice(r), sem = C.semaforo(idx);
  box.innerHTML = `<div class="lecturas">${lectura("Índice", idx === null ? "—" : idx, "/100", sem ? pill(sem.t, sem.c) : "")}${lectura("Áreas", C.nEval(r), "/13")}</div>${B.radar(r)}`;
};

FORMS.lote = {
  col: "lotes",
  render(r) {
    const finca = S.buscar("fincas", (r && r.finca_id) || R.padre) || {};
    r = Object.assign({ fecha_cosecha: U.hoy(), estado: "en proceso" }, r || {});
    const parcelas = (finca.parcelas || []).map(p => p.id).filter(Boolean);
    return `<form class="form" id="f" data-form="lote" novalidate><h2>${r.id ? "Editar lote" : "Nuevo lote"} · ${e(finca.nombre || "")}</h2>
<div class="codigo" id="lec"></div>
<div class="grid">${fld("Parcela", inText("parcela", r.parcela, parcelas[0] || "P01") + (parcelas.length ? `<small class="help">Parcelas: ${e(parcelas.join(", "))}</small>` : ""), { for: "parcela" })}${fld("Fecha de cosecha", inDate("fecha_cosecha", r.fecha_cosecha), { for: "fecha_cosecha" })}${fld("Proceso", inSel("proceso", r.proceso, L.procesos), { for: "proceso" })}
${fld("N.º del día", inNum("n", r.n, "1", "1"), { for: "n", help: "Si hay varios lotes ese día" })}${fld("Estado", inSel("estado", r.estado, L.estadosLote, null), { for: "estado" })}</div>
${fld("Variedad", chips("variedad", r.variedad, (finca.variedades && finca.variedades.length) ? finca.variedades : L.variedades))}
<fieldset><legend>Cosecha</legend><div class="grid g3">${fld("Cereza", inNum("kg_cereza", r.kg_cereza), { unit: "kg", for: "kg_cereza" })}${fld("Madurez", inNum("madurez_pct", r.madurez_pct), { unit: "%", for: "madurez_pct" })}${fld("Brix", inNum("brix", r.brix), { unit: "°Bx", for: "brix" })}</div></fieldset>
<fieldset><legend>Beneficio</legend><div class="grid g4">${fld("Fermentación", inNum("fermentacion_h", r.fermentacion_h), { unit: "h", for: "fermentacion_h" })}${fld("pH inicial", inNum("ph_inicial", r.ph_inicial, "0.01"), { for: "ph_inicial" })}${fld("pH final", inNum("ph_final", r.ph_final, "0.01"), { for: "ph_final" })}${fld("Temperatura", inNum("temp_fermentacion_c", r.temp_fermentacion_c), { unit: "°C", for: "temp_fermentacion_c" })}</div></fieldset>
<fieldset><legend>Secado</legend><div class="grid g3">${fld("Sistema", inSel("secado_sistema", r.secado_sistema, L.secado), { for: "secado_sistema" })}${fld("Inicio", inDate("secado_inicio", r.secado_inicio), { for: "secado_inicio" })}${fld("Fin", inDate("secado_fin", r.secado_fin), { for: "secado_fin" })}
${fld("Humedad final", inNum("humedad_final", r.humedad_final, "0.1"), { unit: "%", for: "humedad_final", help: "Meta 10–12 %" })}${fld("Actividad de agua", inNum("aw", r.aw, "0.01"), { for: "aw" })}</div></fieldset>
<fieldset><legend>Trilla, calidad y venta</legend><div class="grid g3">${fld("Pergamino", inNum("kg_pergamino", r.kg_pergamino), { unit: "kg", for: "kg_pergamino" })}${fld("Verde", inNum("kg_verde", r.kg_verde), { unit: "kg", for: "kg_verde" })}${fld("Puntaje CVA", inNum("puntaje_cva", r.puntaje_cva, "0.01"), { for: "puntaje_cva" })}
${fld("Comprador", inText("comprador", r.comprador), { for: "comprador" })}${fld("Precio", inNum("precio", r.precio, "0.01"), { for: "precio" })}${fld("Marca OIC", inText("marca_oic", r.marca_oic), { for: "marca_oic" })}</div></fieldset>
${fld("Notas", inArea("notas", r.notas, 2), { for: "notas" })}
${formAcciones(r)}</form>`;
  },
  leer: b => {
    const r = Object.assign({}, b, {
      finca_id: b.finca_id || R.padre, parcela: V.t("parcela").toUpperCase(), fecha_cosecha: V.t("fecha_cosecha"), proceso: V.t("proceso"), n: V.n("n"), estado: V.t("estado"),
      variedad: V.chips("variedad"), kg_cereza: V.n("kg_cereza"), madurez_pct: V.n("madurez_pct"), brix: V.n("brix"), fermentacion_h: V.n("fermentacion_h"), ph_inicial: V.n("ph_inicial"),
      ph_final: V.n("ph_final"), temp_fermentacion_c: V.n("temp_fermentacion_c"), secado_sistema: V.t("secado_sistema"), secado_inicio: V.t("secado_inicio"), secado_fin: V.t("secado_fin"),
      humedad_final: V.n("humedad_final"), aw: V.n("aw"), kg_pergamino: V.n("kg_pergamino"), kg_verde: V.n("kg_verde"), puntaje_cva: V.n("puntaje_cva"), comprador: V.t("comprador"),
      precio: V.n("precio"), marca_oic: V.t("marca_oic"), notas: V.t("notas")
    });
    r.codigo = codigoLote(r);
    return r;
  },
  validar: r => !r.finca_id ? "Este lote no tiene finca." : !r.fecha_cosecha ? "Pon la fecha de cosecha." : null
};
function codigoLote(r) {
  const f = S.buscar("fincas", r.finca_id) || {};
  const mismos = S.d.lotes.filter(x => x.id !== r.id && x.finca_id === r.finca_id && x.fecha_cosecha === r.fecha_cosecha && (x.parcela || "") === (r.parcela || "")).length;
  const n = r.n || mismos + 1;
  return `${f.codigo || U.iniciales(f.nombre)}-${r.parcela || "P00"}-${(r.fecha_cosecha || U.hoy()).replace(/-/g, "")}-${PROC[r.proceso] || "SIN"}-${U.z2(n)}`;
}
LIVE.lote = () => { const box = document.getElementById("lec"); if (!box) return; const r = FORMS.lote.leer({ finca_id: R.padre }); box.innerHTML = `<span class="lec-et">Código de lote</span><b>${e(r.codigo)}</b>`; };
function liveActual() { const f = document.getElementById("f"); if (f && LIVE[f.dataset.form]) LIVE[f.dataset.form](); }

/* ------------------------------ Detalles ------------------------------ */
const DET = {};
const cabecera = (eyebrow, titulo, sub, r) => `<div class="det-h"><div><p class="eyebrow">${e(eyebrow)}</p><h2>${e(titulo)}</h2>${sub ? `<p class="muted">${e(sub)}</p>` : ""}</div>${r ? syncInfo(r) : ""}</div>`;
const accionesDet = (extra = "") => `<div class="det-acc">${btn("Editar", "editar", "pri")}${extra}${btn("Eliminar", "eliminar", "danger")}</div>`;
const barras15 = r => `<div class="barras">${INTENS.map(([k, t]) => { const v = U.num(r[k]); return `<div class="b-row"><span>${t}</span><span class="b-track"><span class="b-fill" style="width:${v === null ? 0 : v / 15 * 100}%"></span></span><b>${v === null ? "—" : v}</b></div>`; }).join("")}</div>`;
const barras9 = r => `<div class="barras">${L.atributos.map(a => { const v = U.num(r[a.key]); return `<div class="b-row"><span>${a.nombre}</span><span class="b-track"><span class="b-fill alt" style="width:${v === null ? 0 : v / 9 * 100}%"></span></span><b>${v === null ? "—" : v}</b></div>`; }).join("")}</div>`;

DET.preparaciones = p => {
  const cafe = S.buscar("cafes", p.cafe_id); const pbl = C.pbl(p), bd = C.banda(pbl), ra = C.ratio(p), ey = C.ey(p);
  return cabecera("Preparación", `${p.fecha || ""} · ${p.metodo || ""}`, [cafe ? cafe.nombre : p.cafe_txt, B.Nom.recetaTexto(p.receta)].filter(Boolean).join(" · "), p) +
    `<div class="lecturas">${lectura("Ratio", ra ? "1:" + U.fmt(ra, 1) : "—")}${lectura("Extracción", ey === null ? "—" : U.fmt(ey, 1), "%")}${lectura("Puntaje", pbl === null ? "—" : U.fmt(pbl, 2), "/100", bd ? pill(bd.t, bd.c) : "")}${U.num(p.estrellas) ? lectura("Estrellas", `<span class="estrellas">${"★".repeat(U.num(p.estrellas))}</span>`) : ""}</div>
<dl class="datos">${dato("Dosis", p.dosis_g && p.dosis_g + " g")}${dato("Agua", p.agua_g && p.agua_g + " g")}${dato("Molienda", p.clicks && p.clicks + " clicks")}${dato("Temperatura", p.temp_c && p.temp_c + " °C")}${dato("Tiempo", p.tiempo)}${dato("Filtro", p.filtro)}${dato("Agua", p.agua)}${dato("TDS", p.tds && p.tds + " %")}${dato("Bebida", p.bebida_g && p.bebida_g + " g")}${dato("Sabores", U.lista(p.notas_sabor))}${dato("Repetir", p.repetir ? "Sí" : "")}</dl>
${C.suma(p) !== null ? `<section class="bloque"><h3>Atributos</h3>${barras9(p)}</section>` : ""}${texto("Paso a paso", p.pasos)}${texto("Cata", p.cata)}${texto("Siguiente paso", p.siguiente)}
${accionesDet(btn("Repetir con estos parámetros", "repetir"))}`;
};
DET.cafes = c => {
  const preps = ordenarFecha(S.d.preparaciones.filter(p => p.cafe_id === c.id)); const pbls = preps.map(C.pbl).filter(x => x !== null); const d = U.diasDesde(c.fecha_tueste);
  return cabecera("Café", c.nombre, [c.tostador, [c.region, c.pais].filter(Boolean).join(", ")].filter(Boolean).join(" · "), c) +
    `<div class="lecturas">${lectura("Días desde el tueste", d === null ? "—" : d)}${lectura("Preparaciones", preps.length)}${lectura("Mejor puntaje", pbls.length ? U.fmt(Math.max(...pbls), 2) : "—")}</div>
<dl class="datos">${dato("Finca", c.finca)}${dato("Productor", c.productor)}${dato("Variedad", U.lista(c.variedad))}${dato("Proceso", c.proceso)}${dato("Altitud", c.altitud_m && c.altitud_m + " m")}${dato("Tueste", [c.nivel_tueste, c.fecha_tueste].filter(Boolean).join(" · "))}${dato("Notas del tostador", U.lista(c.notas_tostador))}${dato("Estado", c.estado)}${dato("Peso", c.peso_g && c.peso_g + " g")}</dl>
${texto("Primera impresión", c.impresion)}${texto("Mejor receta", c.mejor_receta)}${texto("Cierre", c.cierre)}
<section class="bloque"><h3>Preparaciones con este café</h3>${preps.length ? `<div class="filas">${preps.map(filaPrep).join("")}</div>` : `<p class="muted">Todavía ninguna.</p>`}</section>
${accionesDet(btn("Preparar este café", "preparar-cafe"))}`;
};
DET.recetas = r => {
  const preps = ordenarFecha(S.d.preparaciones.filter(p => p.receta === "own:" + r.id)); const pbls = preps.map(C.pbl).filter(x => x !== null); const altos = pbls.filter(x => x >= 86).length;
  return cabecera("Receta propia", `${r.metodo} · ${r.nombre}`, `Versión ${r.version || 1} · ${r.estado || "en prueba"}`, r) +
    `<div class="lecturas">${lectura("Ratio", C.ratio(r) ? "1:" + U.fmt(C.ratio(r), 1) : "—")}${lectura("Preparaciones", preps.length)}${lectura("Con 86 o más", `${altos}/3`, "", altos >= 3 && r.estado !== "definitiva" ? pill("Lista para definitiva", "ok") : "")}</div>
<dl class="datos">${dato("Dosis", r.dosis_g && r.dosis_g + " g")}${dato("Agua", r.agua_g && r.agua_g + " g")}${dato("Molienda", r.clicks_rango && r.clicks_rango + " clicks")}${dato("Temperatura", r.temp_c && r.temp_c + " °C")}${dato("Tiempo objetivo", r.tiempo_objetivo)}${dato("Filtro", r.filtro)}${dato("Fuente", r.fuente)}</dl>
${(r.pasos || []).length ? `<section class="bloque"><h3>Pasos</h3><div class="tabla"><table><thead><tr><th>Tiempo</th><th>Acción</th><th>Agua (g)</th></tr></thead><tbody>${r.pasos.map(x => `<tr><td>${e(x.t)}</td><td>${e(x.accion)}</td><td>${e(x.agua)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}
${texto("Por qué funciona", r.por_que)}
${(r.historial || []).length ? `<section class="bloque"><h3>Historial</h3><div class="tabla"><table><thead><tr><th>Versión</th><th>Fecha</th><th>Cambio</th><th>Resultado</th></tr></thead><tbody>${r.historial.map(x => `<tr><td>${e(x.version)}</td><td>${e(x.fecha)}</td><td>${e(x.cambio)}</td><td>${e(x.resultado)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}
<section class="bloque"><h3>Preparaciones con esta receta</h3>${preps.length ? `<div class="filas">${preps.map(filaPrep).join("")}</div>` : `<p class="muted">Todavía ninguna.</p>`}</section>
${accionesDet(btn("Preparar ahora", "preparar-receta"))}`;
};
DET.experimentos = x => {
  const res = x.resultados || []; const n = res.length, k = res.filter(r => r.acierto).length; const p = n ? C.triangular(n, k) : null;
  return cabecera("Experimento", x.titulo, `${x.fecha || ""} · ${x.estado || ""}`, x) +
    `<div class="lecturas">${lectura("Aciertos", n ? `${k}/${n}` : "—")}${lectura("p", p === null ? "—" : U.fmt(p, 3), "", p === null ? "" : pill(p < 0.05 ? "Significativo" : "No significativo", p < 0.05 ? "ok" : ""))}</div>
<dl class="datos">${dato("Pregunta", x.pregunta)}${dato("Hipótesis", x.hipotesis)}${dato("Variable", x.variable)}${dato("Valores", U.lista(x.valores))}${dato("Constantes", x.constantes)}${dato("Método", x.metodo)}${dato("Tipo de prueba", x.tipo_prueba)}${dato("Ganador", x.ganador)}</dl>
${n ? `<section class="bloque"><h3>Ensayos</h3><div class="tabla"><table><thead><tr><th>#</th><th>¿Acerté?</th><th>Preferí</th><th>Notas</th></tr></thead><tbody>${res.map((r, i) => `<tr><td>${i + 1}</td><td>${r.acierto ? "✅" : "❌"}</td><td>${e(r.preferencia)}</td><td>${e(r.notas)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}
${texto("Conclusión", x.conclusion)}${accionesDet()}`;
};
DET.catas = c => {
  const cva = C.cva(c);
  return cabecera("Cata · SCA CVA", c.muestra, [c.fecha, c.origen, c.proceso].filter(Boolean).join(" · "), c) +
    `<div class="lecturas">${lectura("Puntaje CVA", cva === null ? "—" : U.fmt(cva, 2), "/100")}${lectura("No uniformes", c.tazas_no_uniformes || 0)}${lectura("Defectuosas", c.tazas_defectuosas || 0, "", c.defecto ? pill(c.defecto, "bad") : "")}</div>
<div class="dos"><section class="bloque"><h3>Descriptiva (0–15)</h3>${barras15(c)}</section><section class="bloque"><h3>Afectiva (1–9)</h3>${barras9(c)}</section></div>
<dl class="datos">${dato("Fragancia y aroma", U.lista(c.descriptores_aroma))}${dato("Sabor", U.lista(c.descriptores_sabor))}${dato("Gustos predominantes", U.lista(c.gustos_predominantes))}${dato("Sensación en boca", U.lista(c.sensacion_boca))}${dato("Certificaciones", U.lista(c.ext_certificaciones))}${dato("Premios", c.ext_premios)}</dl>
${texto("Cultivo", c.ext_cultivo)}${texto("Procesamiento", c.ext_proceso)}${texto("Comercio", c.ext_comercio)}${texto("Conclusión", c.conclusion)}${accionesDet()}`;
};

/* ------------------------------ Cata ------------------------------ */
function vCata() {
  if (R.modo === "form") return FORMS.cata.render(R.id ? S.buscar("catas", R.id) : R.borrador);
  if (R.modo === "ver") { const c = S.buscar("catas", R.id); return c ? DET.catas(c) : vacio("No encontré esta cata", "", goBtn("Volver", { modo: "lista", id: null })); }
  const a = ordenarFecha(S.d.catas);
  return `<div class="barra"><h2>Catas · SCA CVA</h2>${goBtn("+ Nueva cata", { modo: "form", id: null }, "pri")}</div>
<div class="nota-proto"><b>Protocolo SCA 102:</b> 8,25 g por cada 150 mL · agua a 93 ± 3 °C · costra de 3–5 min · catar desde ~70 °C · 5 tazas por muestra.</div>
${a.length ? `<div class="filas">${a.map(c => { const v = C.cva(c); return fila({ titulo: `${c.fecha || ""} · ${c.muestra || "Muestra"}`, meta: [c.origen, c.proceso, c.sesion].filter(Boolean).join(" · "), der: (v !== null ? `<span class="score">${U.fmt(v, 2)}</span>` : "") + dot(c), obj: { modo: "ver", id: c.id } }); }).join("")}</div>` : vacio("Aún no hay catas", "Haz tu primer cupping con el protocolo del SCA y registra cada muestra aquí.")}`;
}

/* ------------------------------ Fincas ------------------------------ */
function filaFinca(f) {
  const vis = ordenarFecha(S.d.visitas.filter(v => v.finca_id === f.id)); const idx = vis.length ? C.indice(vis[0]) : null; const sem = C.semaforo(idx);
  return fila({ titulo: f.nombre || "Finca", meta: [f.productor, [f.municipio, f.region, f.pais].filter(Boolean).join(", "), f.estado_consultoria].filter(Boolean).join(" · "), der: (idx !== null ? `<span class="score ${sem.c}">${idx}</span>` : "") + dot(f), obj: { tab: "fincas", col: "fincas", modo: "ver", id: f.id, padre: null } });
}
function vFincas() {
  const col = R.col || "fincas";
  if (R.modo === "informe") return vInforme();
  if (R.modo === "form") {
    const k = { fincas: "finca", visitas: "visita", lotes: "lote" }[col];
    return volverFinca() + FORMS[k].render(R.id ? S.buscar(col, R.id) : R.borrador);
  }
  if (R.modo === "ver") {
    const r = S.buscar(col, R.id);
    if (!r) return vacio("No encontré este registro", "Puede que se haya eliminado.", goBtn("Volver a fincas", { col: "fincas", modo: "lista", id: null }));
    return (col === "fincas" ? "" : volverFinca()) + ({ fincas: dFinca, visitas: dVisita, lotes: dLote }[col])(r);
  }
  const a = [...S.d.fincas].sort((x, y) => (x.nombre || "").localeCompare(y.nombre || ""));
  return `<div class="barra"><h2>Coffee Farm Lab</h2><div class="barra-acc">${btn("Ficha de campo imprimible", "ficha-campo", "ghost")}${goBtn("+ Nueva finca", { col: "fincas", modo: "form", id: null }, "pri")}</div></div>
${a.length ? `<div class="filas">${a.map(filaFinca).join("")}</div>` : vacio("Tu primera finca", "Crea la ficha de la finca y luego registra la visita de diagnóstico con las 13 áreas.")}`;
}
function volverFinca() { const fid = R.padre || (R.col === "fincas" ? R.id : null); const f = fid && S.buscar("fincas", fid); return f ? `<button type="button" class="volver" data-go="${go({ col: "fincas", modo: "ver", id: f.id, padre: null })}">← ${e(f.nombre)}</button>` : `<button type="button" class="volver" data-go="${go({ col: "fincas", modo: "lista", id: null })}">← Fincas</button>`; }
function dFinca(f) {
  const vis = ordenarFecha(S.d.visitas.filter(v => v.finca_id === f.id)); const lotes = S.d.lotes.filter(l => l.finca_id === f.id).sort((a, b) => (b.codigo || "").localeCompare(a.codigo || "")); const infs = ordenarFecha(S.d.informes.filter(i => i.finca_id === f.id));
  const idx = vis.length ? C.indice(vis[0]) : null; const sem = C.semaforo(idx);
  return cabecera("Finca · " + (f.estado_consultoria || ""), f.nombre, [f.productor, [f.municipio, f.region, f.pais].filter(Boolean).join(", ")].filter(Boolean).join(" · "), f) +
    `<div class="lecturas">${lectura("Último índice", idx === null ? "—" : idx, "/100", sem ? pill(sem.t, sem.c) : "")}${lectura("Altitud", (f.altitud_min || f.altitud_max) ? `${f.altitud_min || "?"}–${f.altitud_max || "?"}` : "—", "m")}${lectura("Café", f.area_cafe_ha ?? "—", "ha")}${lectura("Visitas", vis.length)}</div>
<dl class="datos">${dato("Código", f.codigo)}${dato("Contacto", f.contacto)}${dato("Variedades", U.lista(f.variedades))}${dato("Procesos", U.lista(f.procesos))}${dato("Certificaciones", U.lista(f.certificaciones))}${dato("Mercado", f.mercado)}${dato("Coordenadas", f.coordenadas)}</dl>
${(f.parcelas || []).length ? `<section class="bloque"><h3>Parcelas</h3><div class="tabla"><table><thead><tr><th>Parcela</th><th>Área ha</th><th>Variedad</th><th>Año</th><th>Plantas/ha</th><th>Sombra %</th><th>Altitud</th></tr></thead><tbody>${f.parcelas.map(p => `<tr><td>${e(p.id)}</td><td>${e(p.area)}</td><td>${e(p.variedad)}</td><td>${e(p.anio)}</td><td>${e(p.densidad)}</td><td>${e(p.sombra)}</td><td>${e(p.altitud)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}
<section class="bloque"><div class="panel-h"><h3>Visitas</h3>${goBtn("+ Nueva visita", { col: "visitas", modo: "form", id: null, padre: f.id }, "pri sm")}</div>${vis.length ? `<div class="filas">${vis.map(v => { const i = C.indice(v), s = C.semaforo(i); return fila({ titulo: `${v.fecha} · Visita ${v.tipo_visita || ""}`, meta: `${C.nEval(v)} de 13 áreas`, der: (i !== null ? `<span class="score ${s.c}">${i}</span>` : "") + dot(v), obj: { col: "visitas", modo: "ver", id: v.id, padre: f.id } }); }).join("")}</div>` : `<p class="muted">Aún no hay visitas. La primera es el diagnóstico de las 13 áreas.</p>`}</section>
<section class="bloque"><div class="panel-h"><h3>Lotes</h3>${goBtn("+ Nuevo lote", { col: "lotes", modo: "form", id: null, padre: f.id }, "sm")}</div>${lotes.length ? `<div class="filas">${lotes.map(l => fila({ titulo: l.codigo, meta: [l.proceso, U.lista(l.variedad).join(", "), l.estado].filter(Boolean).join(" · "), der: (U.num(l.puntaje_cva) !== null ? `<span class="score">${U.fmt(l.puntaje_cva, 2)}</span>` : "") + dot(l), obj: { col: "lotes", modo: "ver", id: l.id, padre: f.id } })).join("")}</div>` : `<p class="muted">Registra cada lote con su código para tener trazabilidad.</p>`}</section>
<section class="bloque"><h3>Informes</h3>${infs.length ? `<div class="filas">${infs.map(i => fila({ titulo: `${i.fecha} · Informe de diagnóstico`, meta: "Toca para abrir, editar o descargar", der: dot(i), obj: { col: "informes", modo: "informe", id: i.id, padre: f.id } })).join("")}</div>` : `<p class="muted">Genera el informe desde una visita.</p>`}</section>
<section class="bloque"><div class="panel-h"><h3>Diagnósticos con foto</h3>${goBtn("+ Foto con IA", { tab: "foto", modo: "form", id: null, borrador: { finca_id: f.id } }, "sm")}</div>${(() => { const ds = ordenarFecha(S.d.diagnosticos.filter(g => g.finca_id === f.id)); return ds.length ? `<div class="filas">${ds.map(g => fila({ titulo: `${g.fecha} · ${g.titulo || "Foto"}`, meta: g.resultado ? g.resultado.diagnostico_principal : "Pendiente de análisis", der: dot(g), obj: { tab: "foto", modo: "ver", id: g.id } })).join("")}</div>` : `<p class="muted">Toma fotos de hojas, frutos o granos y analízalas con IA.</p>`; })()}</section>
${texto("Infraestructura", f.infraestructura)}${texto("Plan de acción vigente", f.plan)}${accionesDet()}`;
}
function dVisita(v) {
  const idx = C.indice(v), sem = C.semaforo(idx); const h = v.hallazgos || {};
  return cabecera("Visita · " + (v.tipo_visita || ""), `Visita del ${U.fechaLarga(v.fecha)}`, `${C.nEval(v)} de 13 áreas evaluadas`, v) +
    `<div class="visita-res"><div class="lecturas">${lectura("Índice", idx === null ? "—" : idx, "/100", sem ? pill(sem.t, sem.c) : "")}</div>${B.radar(v)}</div>
<div class="det-acc arriba">${btn("Generar informe", "informe", "pri")}</div>
<section class="bloque"><h3>Áreas</h3><div class="tabla"><table><thead><tr><th>Área</th><th>Puntaje</th><th>Hallazgos</th></tr></thead><tbody>${B.areas.map(a => { const s = U.num(v["s_" + a.key]); return `<tr><td><b>${e(a.nombre)}</b></td><td style="white-space:nowrap">${s === null ? "—" : `${s} · ${e(B.niveles[s])}`}</td><td>${e(h[a.key] || "")}</td></tr>`; }).join("")}</tbody></table></div></section>
<section class="bloque"><h3>Mediciones de campo</h3><div class="tabla"><table><thead><tr><th>Medición</th><th>Valor</th><th>Meta</th></tr></thead><tbody>${B.metas.map(m => { const x = U.num(v[m.key]); const ok = x === null || !m.eval ? null : m.eval(x); return `<tr><td>${e(m.nombre)}</td><td>${x === null ? "—" : e(x + " " + m.unidad)} ${ok === null ? "" : ok ? pill("En meta", "ok") : pill("Fuera de meta", "warn")}</td><td>${e(m.meta)}</td></tr>`; }).join("")}</tbody></table></div></section>
${texto("Prioridades", v.prioridades)}${U.lista(v.muestras).length ? `<dl class="datos">${dato("Muestras", U.lista(v.muestras))}</dl>` : ""}${accionesDet()}`;
}
function dLote(l) {
  return cabecera("Lote", l.codigo, [l.proceso, U.lista(l.variedad).join(", "), l.estado].filter(Boolean).join(" · "), l) +
    `<div class="lecturas">${lectura("Cereza", l.kg_cereza ?? "—", "kg")}${lectura("Madurez", l.madurez_pct ?? "—", "%")}${lectura("Humedad final", l.humedad_final ?? "—", "%")}${lectura("Puntaje CVA", l.puntaje_cva ?? "—")}</div>
<dl class="datos">${dato("Parcela", l.parcela)}${dato("Fecha de cosecha", l.fecha_cosecha)}${dato("Brix", l.brix)}${dato("Fermentación", l.fermentacion_h && l.fermentacion_h + " h")}${dato("pH", (l.ph_inicial || l.ph_final) ? `${l.ph_inicial || "?"} → ${l.ph_final || "?"}` : "")}${dato("Temperatura", l.temp_fermentacion_c && l.temp_fermentacion_c + " °C")}${dato("Secado", [l.secado_sistema, l.secado_inicio && l.secado_fin ? `${l.secado_inicio} → ${l.secado_fin}` : ""].filter(Boolean).join(" · "))}${dato("Actividad de agua", l.aw)}${dato("Pergamino", l.kg_pergamino && l.kg_pergamino + " kg")}${dato("Verde", l.kg_verde && l.kg_verde + " kg")}${dato("Comprador", l.comprador)}${dato("Precio", l.precio)}${dato("Marca OIC", l.marca_oic)}</dl>
${texto("Notas", l.notas)}${accionesDet()}`;
}

/* ------------------------------ Informe ------------------------------ */
let prevTimer = null;
function ctxInforme() {
  const inf = R.id ? S.buscar("informes", R.id) : R.borrador;
  if (!inf) return null;
  const finca = S.buscar("fincas", inf.finca_id), visita = S.buscar("visitas", inf.visita_id);
  return finca && visita ? { inf, finca, visita } : null;
}
function infDesdeForm(base) { return Object.assign({}, base, { fecha: V.t("inf-fecha") || base.fecha, resumen: V.t("inf-resumen"), plan: leerDin("inf-plan"), notas: V.t("inf-notas") }); }
function vInforme() {
  const c = ctxInforme();
  if (!c) return vacio("No pude armar el informe", "Falta la finca o la visita.", goBtn("Volver a fincas", { col: "fincas", modo: "lista", id: null }));
  const { inf, finca } = c;
  return `<button type="button" class="volver" data-go="${go({ col: "fincas", modo: "ver", id: finca.id, padre: null })}">← ${e(finca.nombre)}</button>
<div class="inf-layout"><form class="form inf-tools" id="finf" novalidate><h2>Informe de diagnóstico</h2>
${fld("Fecha del informe", inDate("inf-fecha", inf.fecha), { for: "inf-fecha" })}
${fld("Resumen ejecutivo", inArea("inf-resumen", inf.resumen, 8), { for: "inf-resumen", help: "Generado con los datos de la visita. Edítalo a tu gusto." })}
<div class="ia">${btn("Mejorar resumen con IA", "ia")}</div>
<fieldset><legend>Plan de acción</legend>${tablaDin("inf-plan", [{ k: "plazo", t: "Plazo", w: 0.9 }, { k: "area", t: "Área", w: 1.2 }, { k: "accion", t: "Acción", w: 3 }, { k: "responsable", t: "Responsable", w: 1.2 }, { k: "indicador", t: "Indicador", w: 1.4 }, { k: "revision", t: "Revisión", w: 1 }], inf.plan, "Agregar acción")}</fieldset>
${fld("Notas adicionales", inArea("inf-notas", inf.notas, 3), { for: "inf-notas" })}
<div class="form-acc col">${btn("Descargar PDF", "pdf", "pri")}${btn("Compartir PDF", "pdf-compartir")}${btn("Imprimir", "imprimir")}${btn("Descargar HTML", "html")}${btn(inf.id ? "Guardar cambios" : "Guardar para Obsidian", "guardar-informe")}${inf.id ? btn("Eliminar", "eliminar-informe", "danger") : ""}</div>
${inf.id ? syncInfo(inf) : `<p class="help">Al guardar, el informe queda pendiente para tu próxima sincronización con Obsidian.</p>`}
</form><div class="papel" id="inf-prev"></div></div>`;
}
function actualizarPrev() {
  const c = ctxInforme(); const box = document.getElementById("inf-prev"); if (!c || !box) return;
  box.innerHTML = B.Informe.html(infDesdeForm(c.inf), c);
}

/* ------------------------------ Aprende ------------------------------ */
function vAprende() {
  const tabs = subtabs("aprende", [["tutoriales", "Tutoriales"], ["manuales", "Manuales"], ["rubricas", "Rúbricas"], ["referencias", "Referencias"]]);
  const sub = R.subs.aprende;
  if (sub === "manuales" && R.manual) return tabs + vManual(R.manual);
  if (sub === "tutoriales") return tabs + `<div class="tuts">${B.tutoriales.map((t, i) => `<article class="tut"><p class="eyebrow">Tutorial ${i + 1} · ${e(t.tiempo)}</p><h3>${e(t.titulo)}</h3><ol>${t.pasos.map(p => `<li>${B.md2html(p).replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ol></article>`).join("")}</div>`;
  if (sub === "manuales") return tabs + `<div class="manuales">${B.manuales.map(m => `<button type="button" class="manual-card" data-go="${go({ manual: m.id })}"><span class="eyebrow">Manual</span><b>${e(m.titulo)}</b><small>${e(m.subtitulo)}</small></button>`).join("")}</div>`;
  if (sub === "rubricas") return tabs + `<p class="lede">Las 13 áreas del diagnóstico de finca: qué observar, qué medir y cómo se ve cada nivel.</p><div class="rubricas">${B.areas.map((a, i) => `<article class="rubrica"><h3><span class="num">${i + 1}</span>${e(a.nombre)}</h3><p><b>Observar:</b> ${e(a.observar)}</p><p><b>Medir:</b> ${e(a.medir)}</p><ul class="rub"><li><b>1</b> ${e(a.n1)}</li><li><b>3</b> ${e(a.n3)}</li><li><b>5</b> ${e(a.n5)}</li></ul><details><summary>Recomendaciones por nivel</summary><p class="eyebrow">Niveles 1–2</p><ul>${a.critico.map(x => `<li>${e(x)}</li>`).join("")}</ul><p class="eyebrow">Nivel 3</p><ul>${a.mejora.map(x => `<li>${e(x)}</li>`).join("")}</ul><p class="eyebrow">Niveles 4–5</p><ul>${a.mantener.map(x => `<li>${e(x)}</li>`).join("")}</ul></details></article>`).join("")}</div>`;
  return tabs + vReferencias();
}
function vReferencias() {
  const tri = [3, 4, 5, 6, 8, 10, 12].map(n => `<tr><td>${n}</td><td>${C.minAciertos(n)}</td></tr>`).join("");
  return `<div class="refs-grid">
<section class="bloque"><h3>Impresión de calidad (1–9)</h3><div class="tabla"><table><tbody>${L.escala9.map((t, i) => `<tr><td class="mono">${i + 1}</td><td>${e(t)}</td></tr>`).join("")}</tbody></table></div></section>
<section class="bloque"><h3>Fórmulas</h3><p><b>Puntaje</b> = 0,65625 × (suma de los 8 atributos) + 52,75</p><p><b>CVA</b> = puntaje − 2 × tazas no uniformes − 4 × tazas defectuosas</p><p><b>Ratio</b> = agua ÷ dosis</p><p><b>Extracción</b> = TDS × bebida ÷ dosis</p><p><b>Índice de finca</b> = promedio de las 13 áreas × 20</p></section>
<section class="bloque"><h3>Protocolo de cupping (SCA 102)</h3><ul><li>Tueste medio: Agtron "Gourmet" 63, reposo de 8–24 h</li><li>8,25 g por cada 150 mL de taza (200 mL → 11 g)</li><li>Molienda: 70–75 % pasa el tamiz US n.º 20</li><li>Agua a 93 ± 3 °C hasta el borde</li><li>Costra de 3–5 min, romper con 3 movimientos</li><li>Catar desde ~70 °C, al menos 3 rondas</li><li>5 tazas por muestra (afectiva)</li></ul></section>
<section class="bloque"><h3>Carta de control clásica</h3><ul><li>Extracción ideal: 18–22 %</li><li>TDS ideal (filtrado): 1,15–1,35 %</li><li>Referencia del SCA: ~55 g/L</li></ul><h3>Puntaje Brewer Lab</h3><ul><li>&lt; 80 algo falla</li><li>80–83,9 buena</li><li>84–87,9 muy buena</li><li>88–91,9 excelente</li><li>≥ 92 memorable</li></ul></section>
<section class="bloque"><h3>Prueba triangular (p &lt; 0,05)</h3><div class="tabla"><table><thead><tr><th>Ensayos</th><th>Aciertos mínimos</th></tr></thead><tbody>${tri}</tbody></table></div></section>
<section class="bloque"><h3>Metas de campo</h3><div class="tabla"><table><tbody>${B.metas.map(m => `<tr><td>${e(m.nombre)}</td><td>${e(m.meta)}</td></tr>`).join("")}</tbody></table></div><p class="help">Código de lote: CÓDIGO-PARCELA-AAAAMMDD-PROCESO-N</p></section>
</div>`;
}
function vManual(id) {
  const m = B.manuales.find(x => x.id === id); if (!m) return "";
  const html = B.md2html(m.md, { shift: 1 });
  const toc = (m.md.match(/^## .+$/gm) || []).map(h => h.slice(3)).map(t => `<a href="#${B.slug(t)}">${e(t)}</a>`).join("");
  const guardado = S.d.manuales.find(x => x.titulo === m.titulo);
  return `<button type="button" class="volver" data-go="${go({ manual: null })}">← Manuales</button>
<div class="manual-layout"><nav class="toc" aria-label="Contenido"><p class="eyebrow">Contenido</p>${toc}</nav><article class="manual">${html}
<div class="det-acc">${btn("Descargar (HTML)", "manual-html", "pri", `data-id="${m.id}"`)}${btn("Descargar (.md)", "manual-md", "", `data-id="${m.id}"`)}${btn(guardado ? "Actualizar en Obsidian" : "Guardar en Obsidian", "manual-obsidian", "", `data-id="${m.id}"`)}</div>
${guardado ? syncInfo(guardado) : ""}</article></div>`;
}

/* Ajustes, sincronización e IA viven en extras.js */
const fechaHora = iso => { if (!iso) return ""; const d = new Date(iso); if (!Number.isFinite(d.getTime())) return ""; return `${U.fechaLarga(`${d.getFullYear()}-${U.z2(d.getMonth() + 1)}-${U.z2(d.getDate())}`)}, ${U.z2(d.getHours())}:${U.z2(d.getMinutes())}`; };

/* ------------------------------ Acciones ------------------------------ */
const A = {};
A.guardar = async t => {
  const f = document.getElementById("f"); if (!f) return;
  const cfg = FORMS[f.dataset.form];
  const base = R.id ? S.buscar(cfg.col, R.id) : Object.assign({}, R.borrador || {});
  if (!R.id) { delete base.id; if (cfg.col === "visitas" || cfg.col === "lotes") base.finca_id = base.finca_id || R.padre; }
  const rec = cfg.leer(base || {});
  const err = cfg.validar && cfg.validar(rec); if (err) { toast(err, "warn"); return; }
  if (!rec.id && cfg.nuevo) cfg.nuevo(rec);
  t.disabled = true; t.textContent = "Guardando…";
  try {
    const id = await S.guardar(cfg.col, rec);
    if (cfg.despues) await cfg.despues(Object.assign({}, rec, { id }));
    toast("Guardado ✔ Queda pendiente para Obsidian.");
    R.borrador = null; ir({ modo: "ver", id });
  } catch (x) { console.error(x); toast(errorGuardar(x), "bad"); t.disabled = false; t.textContent = "Guardar"; }
};
A.cancelar = () => { const col = colActual(); if (R.id) ir({ modo: "ver" }); else if (R.tab === "fincas" && col !== "fincas" && R.padre) ir({ col: "fincas", modo: "ver", id: R.padre, padre: null }); else ir({ modo: "lista", id: null }); };
A.editar = () => ir({ modo: "form" });
A.eliminar = async t => {
  const col = colActual(); const r = S.buscar(col, R.id); if (!r) return;
  if (col === "fincas" && [S.d.visitas, S.d.lotes, S.d.informes].some(arr => arr.some(x => x.finca_id === r.id))) { toast("Primero elimina las visitas, lotes e informes de esta finca.", "warn"); return; }
  if (t.dataset.confirmar !== "1") { t.dataset.confirmar = "1"; t.textContent = "Toca otra vez para eliminar"; setTimeout(() => { if (t.isConnected) { t.dataset.confirmar = ""; t.textContent = "Eliminar"; } }, 4000); return; }
  try { await S.eliminar(col, r.id); toast("Eliminado de la app. Su nota en Obsidian no se borra."); if (R.tab === "fincas" && col !== "fincas") ir({ col: "fincas", modo: "ver", id: r.finca_id, padre: null }); else ir({ modo: "lista", id: null }); }
  catch (x) { toast("No se pudo eliminar.", "bad"); }
};
A.repetir = () => { const p = S.buscar("preparaciones", R.id); if (!p) return; const b = {}; ["cafe_id", "cafe_txt", "metodo", "receta", "dosis_g", "agua_g", "clicks", "temp_c", "filtro", "agua", "tiempo"].forEach(k => b[k] = p[k]); b.fecha = U.hoy(); ir({ modo: "form", id: null, borrador: b }); };
A["preparar-cafe"] = () => ir({ subs: { ...R.subs, barista: "bitacora" }, modo: "form", id: null, borrador: { cafe_id: R.id, fecha: U.hoy() } });
A["preparar-receta"] = () => { const r = S.buscar("recetas", R.id); if (!r) return; ir({ subs: { ...R.subs, barista: "bitacora" }, modo: "form", id: null, borrador: { receta: "own:" + r.id, metodo: r.metodo, dosis_g: r.dosis_g, agua_g: r.agua_g, temp_c: r.temp_c, filtro: r.filtro, fecha: U.hoy() } }); };
A["din-add"] = t => { const box = document.getElementById(t.dataset.din); if (!box) return; const cols = JSON.parse(box.dataset.cols); $(".din-rows", box).insertAdjacentHTML("beforeend", filaDin(cols, {})); liveActual(); };
A["din-del"] = t => { const row = t.closest(".din-row"); const rows = row && row.parentElement; if (!row) return; if (rows.children.length > 1) row.remove(); else $$("input", row).forEach(i => { if (i.type === "checkbox") i.checked = false; else i.value = ""; }); liveActual(); if (R.modo === "informe") actualizarPrev(); };
A.informe = () => { const v = S.buscar("visitas", R.id); if (!v) return; const f = S.buscar("fincas", v.finca_id); if (!f) { toast("La visita no tiene finca.", "warn"); return; } ir({ col: "informes", modo: "informe", id: null, padre: f.id, borrador: B.Informe.borrador(v, f) }); };
A["guardar-informe"] = async t => {
  const c = ctxInforme(); if (!c) return;
  const rec = infDesdeForm(c.inf);
  t.disabled = true;
  try { const id = await S.guardar("informes", rec); toast("Informe guardado ✔ Queda pendiente para Obsidian."); R.borrador = null; R.id = id; render(); }
  catch (x) { toast(errorGuardar(x), "bad"); t.disabled = false; }
};
A["eliminar-informe"] = async t => {
  if (t.dataset.confirmar !== "1") { t.dataset.confirmar = "1"; t.textContent = "Toca otra vez para eliminar"; setTimeout(() => { if (t.isConnected) { t.dataset.confirmar = ""; t.textContent = "Eliminar"; } }, 4000); return; }
  const inf = S.buscar("informes", R.id); if (!inf) return;
  try { await S.eliminar("informes", inf.id); toast("Informe eliminado de la app."); ir({ col: "fincas", modo: "ver", id: inf.finca_id, padre: null }); } catch (x) { toast("No se pudo eliminar.", "bad"); }
};
const nombreArchivo = (c, ext) => `Informe ${U.nombreNota(c.finca.nombre)} ${V.t("inf-fecha") || c.inf.fecha}.${ext}`;
A.html = async () => { const c = ctxInforme(); if (!c) return; const inf = infDesdeForm(c.inf); await descargar(nombreArchivo(c, "html"), B.Informe.standalone(inf, c)); };
A.pdf = async t => {
  const c = ctxInforme(); if (!c) return; const inf = infDesdeForm(c.inf);
  const txt = t.textContent; t.disabled = true; t.textContent = "Generando PDF…";
  try { const blob = await B.Informe.pdf(inf, c); await descargar(nombreArchivo(c, "pdf"), blob); }
  catch (x) { console.error(x); toast("No se pudo generar el PDF aquí. Usa “Descargar HTML” y guárdalo como PDF desde tu navegador.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
};
A["ficha-campo"] = () => descargar("Ficha de campo - visita de diagnostico.html", B.fichaCampo());
A["manual-html"] = t => { const m = B.manuales.find(x => x.id === t.dataset.id); if (m) descargar(`${m.titulo}.html`, B.docHTML(m.titulo, B.md2html(m.md))); };
A["manual-md"] = t => { const m = B.manuales.find(x => x.id === t.dataset.id); if (m) descargar(`${m.titulo}.md`, m.md.trim() + "\n"); };
A["manual-obsidian"] = async t => {
  const m = B.manuales.find(x => x.id === t.dataset.id); if (!m) return;
  const prev = S.d.manuales.find(x => x.titulo === m.titulo);
  t.disabled = true;
  try { await S.guardar("manuales", Object.assign({}, prev || {}, { titulo: m.titulo, contenido: m.md })); toast("Manual listo para tu próxima sincronización ✔"); render(); }
  catch (x) { toast(errorGuardar(x), "bad"); t.disabled = false; }
};
/* ------------------------------ Eventos ------------------------------ */
function segClick(b) {
  const box = b.parentElement; const ya = b.getAttribute("aria-pressed") === "true";
  $$("button", box).forEach(x => x.setAttribute("aria-pressed", "false"));
  if (!ya) b.setAttribute("aria-pressed", "true");
  const lbl = document.getElementById(box.id + "-lbl"); if (lbl) lbl.textContent = !ya ? (b.title || "") : (box.id.startsWith("s_") ? "Sin puntuar" : "");
  liveActual();
}
function chipClick(b) {
  const box = b.closest(".chips"); const max = Number(box && box.dataset.max) || 0; const on = b.getAttribute("aria-pressed") === "true";
  if (!on && max && $$(".chip[aria-pressed=\"true\"]", box).length >= max) { toast(`Elige como máximo ${max}.`, "warn"); return; }
  b.setAttribute("aria-pressed", on ? "false" : "true"); liveActual();
}
document.addEventListener("click", ev => {
  const t = ev.target.closest(".seg button, .chip, [data-tab], [data-go], [data-act]");
  if (!t || t.disabled) return;
  if (t.matches(".seg button")) { ev.preventDefault(); segClick(t); return; }
  if (t.matches(".chip")) { ev.preventDefault(); chipClick(t); return; }
  if (t.dataset.tab) { ev.preventDefault(); ir({ tab: t.dataset.tab, modo: "lista", id: null, manual: null }); return; }
  if (t.dataset.go) { ev.preventDefault(); try { ir(JSON.parse(t.dataset.go)); } catch (x) { console.error(x); } return; }
  if (t.dataset.act && A[t.dataset.act]) { ev.preventDefault(); A[t.dataset.act](t, ev); }
});
document.addEventListener("input", ev => {
  const el = ev.target;
  if (el.type === "range") { el.dataset.touched = "1"; const o = document.getElementById(el.id + "-o"); if (o) o.textContent = el.value; }
  if (R.modo === "form") liveActual();
  if (R.modo === "informe") { clearTimeout(prevTimer); prevTimer = setTimeout(actualizarPrev, 250); }
});
document.addEventListener("change", () => { if (R.modo === "form") liveActual(); });
document.addEventListener("submit", ev => ev.preventDefault());

/* ------------------------------ Interfaz compartida con extras.js ------------------------------ */
B.app = { R, ir, render, toast, A, FORMS, LIVE, DET, descargar, compartir, liveActual, pintarCabecera, actualizarPrev, ctxInforme, infDesdeForm, nombreArchivo,
  h: { e, go, fld, inText, inNum, inDate, inSel, inSelG, inArea, chips, seg, fldSeg, toggle, btn, goBtn, fila, vacio, lectura, pill, syncPill, syncInfo, cabecera, accionesDet, dato, texto, V, dot, ordenarFecha, fechaHora, subtabs, formAcciones } };

/* ------------------------------ Arranque ------------------------------ */
S.on(() => { if (R.modo === "form" || R.modo === "informe") { pintarCabecera(); return; } render(); });
try { const h = (location.hash || "").replace("#", ""); if (["inicio", "barista", "cata", "foto", "fincas", "aprende", "ajustes", "sync"].includes(h)) R.tab = h; } catch (x) { /* sin hash */ }
render();
S.init();
})();
