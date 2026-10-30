/* Brewer Lab · los dos laboratorios (Brewer Lab 8-bit y Farmer Lab natural), el portal del productor,
   reportes, ficha del café en prueba, dato del día, luxómetro e inspecciones con fotos */
(() => {
"use strict";
const B = window.BL, U = B.U, S = B.Store, C = B.Calc, AP = B.app, A = AP.A, R = AP.R;
const { e, go, fld, inText, inNum, inDate, inSel, inArea, btn, goBtn, fila, vacio, lectura, pill, cabecera, texto, V, dot, ordenarFecha, fechaHora, subtabs, filaPrep, filaCafe, filaFinca, stat, accionesDet, dato } = AP.h;
const toast = AP.toast;
const vistas = B.vistas;
const L = B.labs = {};
B.det = B.det || {};

/* ============================== Utilidades ============================== */
const diaDelAnio = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000); };
const nombreCorto = () => ((S.ajustes && S.ajustes.consultor) || (B.Nube && B.Nube.perfil && B.Nube.perfil.nombre) || "").split(" ")[0];
const saludo = () => { const h = new Date().getHours(); return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"; };
const soyProductor = () => document.body.dataset.rol === "productor";
const misFincas = () => S.d.fincas.filter(f => soyProductor() ? true : f.mi_rol !== "productor");
const fincaProductor = () => S.d.fincas[0] || null;
const hace = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

L.datoDelDia = () => {
  const h = B.hechos || []; if (!h.length) return "";
  const x = h[diaDelAnio() % h.length];
  return `<section class="dato-dia ${x.t}"><div class="dato-ic" aria-hidden="true">${x.t === "util" ? "💡" : "☕"}</div><div><p class="eyebrow">${x.t === "util" ? "Dato útil del día" : "Dato curioso del día"} · ${e(x.tema)}</p><p>${e(x.x)}</p></div></section>`;
};

/* Taza pixelada (8-bit) con vapor animado */
const PIX = (x, y, c, w = 1, h = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
L.tazaPixel = () => {
  const t = "var(--px-tinta)", cr = "var(--px-crema)", az = "var(--px-azul)", ar = "var(--px-arena)";
  let s = `<svg class="sprite-taza" viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">`;
  s += `<g class="vapor v1">${PIX(11, 2, ar)}${PIX(12, 3, ar)}${PIX(11, 4, ar)}${PIX(12, 5, ar)}</g><g class="vapor v2">${PIX(16, 1, ar)}${PIX(15, 2, ar)}${PIX(16, 3, ar)}${PIX(15, 4, ar)}${PIX(16, 5, ar)}</g><g class="vapor v3">${PIX(20, 2, ar)}${PIX(21, 3, ar)}${PIX(20, 4, ar)}${PIX(21, 5, ar)}</g>`;
  s += PIX(6, 9, t, 20, 1) + PIX(5, 10, t, 1, 12) + PIX(26, 10, t, 1, 12) + PIX(6, 22, t, 1, 1) + PIX(25, 22, t, 1, 1) + PIX(7, 23, t, 18, 1);
  s += PIX(6, 10, "#5B3A24", 20, 2) + PIX(6, 12, cr, 20, 10) + PIX(7, 22, cr, 18, 1);
  s += PIX(10, 15, az, 12, 2) + PIX(12, 17, az, 8, 1);
  s += PIX(27, 12, t, 3, 1) + PIX(29, 13, t, 1, 5) + PIX(27, 18, t, 3, 1);
  s += PIX(3, 25, t, 26, 1) + PIX(4, 26, ar, 24, 1) + PIX(5, 27, t, 22, 1);
  return s + `</svg>`;
};

/* Granito: el granito de café que acompaña al productor */
L.granito = (cls = "") => `<svg class="granito ${cls}" viewBox="0 0 120 120" aria-hidden="true">
<ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(0,0,0,.12)"/>
<g class="granito-cuerpo"><ellipse cx="60" cy="58" rx="38" ry="46" fill="#6B4226"/><ellipse cx="60" cy="58" rx="38" ry="46" fill="url(#gBrillo)"/>
<path d="M60 14c-10 18 10 30 0 44s10 28 0 44" stroke="#3E2414" stroke-width="5" fill="none" stroke-linecap="round"/>
<g class="granito-ojos"><ellipse cx="44" cy="54" rx="6" ry="7.5" fill="#FFF"/><ellipse cx="76" cy="54" rx="6" ry="7.5" fill="#FFF"/><circle cx="45" cy="56" r="3.4" fill="#20232A"/><circle cx="77" cy="56" r="3.4" fill="#20232A"/></g>
<path d="M48 72q12 10 24 0" stroke="#FBEBC9" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="36" cy="68" r="5" fill="#E8907A" opacity=".55"/><circle cx="84" cy="68" r="5" fill="#E8907A" opacity=".55"/>
<path class="granito-hoja" d="M60 12c4-10 18-12 22-6-6 6-14 9-22 6z" fill="#6E8F4E"/></g>
<defs><radialGradient id="gBrillo" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs></svg>`;

/* Hojas decorativas (Farmer Lab) */
L.hojas = () => `<svg class="hojas-deco" viewBox="0 0 200 160" aria-hidden="true"><g class="h1"><path d="M40 150C30 90 70 40 140 20c-10 60-50 110-100 130z" fill="var(--f-hoja)" opacity=".85"/><path d="M40 150C70 100 100 60 140 20" stroke="var(--f-musgo)" stroke-width="3" fill="none"/></g><g class="h2"><path d="M120 155c-5-40 20-70 70-80-5 40-30 70-70 80z" fill="var(--f-brote)" opacity=".9"/><path d="M120 155c20-30 40-55 70-80" stroke="var(--f-musgo)" stroke-width="2.5" fill="none"/></g><circle class="cereza" cx="70" cy="128" r="9" fill="var(--f-cereza)"/><circle class="cereza c2" cx="86" cy="134" r="8" fill="var(--f-cereza)"/></svg>`;

/* Barra de 8 bloques tipo videojuego */
const barra8 = (valor, max, etq) => { const n = Math.max(0, Math.min(8, Math.round((valor || 0) / max * 8))); return `<span class="barra8" role="img" aria-label="${e(etq || "")}: ${valor ?? "—"}">${Array.from({ length: 8 }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`; };

/* ============================== Brewer Lab: inicio ============================== */
const NIVELES_TUESTE = ["muy claro", "claro", "medio claro", "medio", "medio oscuro", "oscuro"];
function cafeEnPrueba() {
  const abiertos = S.d.cafes.filter(c => (c.estado || "abierto") === "abierto");
  if (!abiertos.length) return "";
  const c = [...abiertos].sort((a, b) => (b.fecha_apertura || b.fecha_tueste || "").localeCompare(a.fecha_apertura || a.fecha_tueste || ""))[0];
  return fichaCafe(c, true);
}
function fichaCafe(c, enInicio) {
  const preps = S.d.preparaciones.filter(p => p.cafe_id === c.id);
  const pbls = preps.map(p => ({ p, v: C.pbl(p) })).filter(x => x.v !== null).sort((a, b) => b.v - a.v);
  const mejor = pbls[0];
  const dias = U.diasDesde(c.fecha_tueste);
  const nivelIdx = NIVELES_TUESTE.findIndex(n => (c.nivel_tueste || "").toLowerCase().includes(n));
  const prom = pbls.length ? pbls.reduce((s, x) => s + x.v, 0) / pbls.length : null;
  return `<section class="ficha8">
<div class="ficha8-h"><div><p class="eyebrow">${enInicio ? "Café en prueba" : "Ficha técnica"}</p><h2>${e(c.nombre || "Café")}</h2><p class="muted">${e([c.tostador, [c.region, c.pais].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</p></div>
<div class="ficha8-score"><span>Mejor taza</span><b>${mejor ? U.fmt(mejor.v, 1) : "—"}</b></div></div>
<div class="ficha8-grid">
${[["Finca", c.finca], ["Productor", c.productor], ["Variedad", U.lista(c.variedad).join(", ")], ["Proceso", c.proceso], ["Altitud", U.num(c.altitud_m) ? `${c.altitud_m} m` : ""], ["Cosecha", c.cosecha], ["Tueste", c.nivel_tueste], ["Peso", U.num(c.peso_g) ? `${c.peso_g} g` : ""]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${e(v)}</dd></div>`).join("") || `<p class="muted">Completa la ficha del café para ver aquí su origen y proceso.</p>`}
</div>
<div class="ficha8-stats">
<div><span>Altitud</span>${barra8(U.num(c.altitud_m), 2200, "Altitud")}</div>
<div><span>Tueste</span>${barra8(nivelIdx < 0 ? null : nivelIdx + 1, 6, "Nivel de tueste")}</div>
<div><span>Reposo ${dias !== null ? `· ${dias} días` : ""}</span>${barra8(dias, 30, "Días desde el tueste")}</div>
<div><span>Promedio ${prom !== null ? `· ${U.fmt(prom, 1)}` : ""}</span>${barra8(prom === null ? null : prom - 58, 42, "Puntaje promedio")}</div>
</div>
${U.lista(c.notas_tostador).length ? `<div class="chips8">${U.lista(c.notas_tostador).map(n => `<span>${e(n)}</span>`).join("")}</div>` : ""}
${mejor ? `<p class="ficha8-receta"><b>Mejor receta:</b> ${e([mejor.p.metodo, (mejor.p.dosis_g && mejor.p.agua_g) ? `${mejor.p.dosis_g} g / ${mejor.p.agua_g} g` : "", mejor.p.clicks ? `${mejor.p.clicks} clicks` : "", mejor.p.temp_c ? `${mejor.p.temp_c} °C` : "", mejor.p.tiempo].filter(Boolean).join(" · "))}</p>` : `<p class="muted">Aún no hay tazas puntuadas con este café.</p>`}
<div class="det-acc">${goBtn("Preparar este café", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "bitacora" }), modo: "form", id: null, borrador: { cafe_id: c.id, fecha: U.hoy() } }, "pri")}${enInicio ? goBtn("Ver ficha completa", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "cafes" }), modo: "ver", id: c.id }) : ""}</div>
</section>`;
}
L.fichaCafe = fichaCafe;

function panelCuenta() {
  if (S.ajustes && S.ajustes.consultor) return "";
  return `<section class="panel"><div class="panel-h"><h2>Completa tu perfil</h2>${goBtn("Ir a Ajustes", { tab: "ajustes" }, "pri sm")}</div><p class="muted">Tu nombre y tu marca aparecen en tus informes y reportes.</p></section>`;
}

vistas.inicio = () => {
  const preps = ordenarFecha(S.d.preparaciones);
  const semana = preps.filter(p => { const d = U.diasDesde(p.fecha); return d !== null && d <= 6; }).length;
  const pbls = preps.map(C.pbl).filter(x => x !== null);
  const mejor = pbls.length ? Math.max(...pbls) : null;
  const abiertos = S.d.cafes.filter(c => (c.estado || "abierto") === "abierto");
  const sv = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${d}</svg>`;
  const acciones = [
    [sv('<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/>'), "Registrar taza", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "bitacora" }), modo: "form", id: null }],
    [sv('<ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(30 12 12)"/><path d="M9 5c3 3 1 8 6 13"/>'), "Nuevo café", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "cafes" }), modo: "form", id: null }],
    [sv('<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>'), "Nueva receta", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "recetas" }), modo: "form", id: null }],
    [sv('<ellipse cx="9" cy="8" rx="5" ry="3.5"/><path d="M13.5 9.5 21 19"/>'), "Nueva cata", { tab: "cata", modo: "form", id: null }]
  ];
  return `<section class="hero hero8"><div class="hero8-txt"><p class="eyebrow">${e(U.fechaLarga(U.hoy()))} · Brewer Lab</p><h1>${e(saludo())}${nombreCorto() ? `, ${e(nombreCorto())}` : ""}<span class="cursor" aria-hidden="true">_</span></h1><p class="lede">Tu laboratorio de café: cada taza registrada te acerca a la receta perfecta.</p></div><div class="hero8-sprite">${L.tazaPixel()}</div></section>
${L.datoDelDia()}
<div class="rapidas">${acciones.map(([i, t, o]) => `<button type="button" class="rapida" data-go="${go(o)}">${i}${t}</button>`).join("")}</div>
${cafeEnPrueba()}
${panelCuenta()}
<div class="stats">${stat("Tazas esta semana", semana, "")}${stat("Mejor puntaje", mejor === null ? "—" : U.fmt(mejor, 1), "de 100")}${stat("Cafés abiertos", abiertos.length, "")}${stat("Recetas propias", S.d.recetas.length, "")}</div>
<div class="dos">
<section class="panel"><div class="panel-h"><h2>Últimas tazas</h2>${goBtn("Ver bitácora", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "bitacora" }) }, "link")}</div>
${preps.length ? `<div class="filas">${preps.slice(0, 5).map(filaPrep).join("")}</div>` : vacio("Aún no hay tazas", "Registra tu próxima preparación: toma 2 minutos.", goBtn("Registrar taza", acciones[0][2], "pri"))}</section>
<section class="panel"><div class="panel-h"><h2>Cafés abiertos</h2>${goBtn("Ver cafés", { tab: "barista", subs: Object.assign({}, R.subs, { barista: "cafes" }) }, "link")}</div>
${abiertos.length ? `<div class="filas">${abiertos.slice(0, 5).map(filaCafe).join("")}</div>` : vacio("Ninguna bolsa abierta", "Registra el café que estás tomando para seguir su reposo y su mejor receta.", goBtn("Nuevo café", acciones[1][2], "pri"))}</section>
</div>`;
};

/* ============================== Farmer Lab: inicio del consultor ============================== */
vistas.farm = () => {
  const fincas = misFincas();
  const activas = fincas.filter(f => !["cerrada"].includes(f.estado_consultoria));
  const visitas30 = S.d.visitas.filter(v => (v.fecha || "") >= hace(30)).length;
  const porRevisar = ordenarFecha(S.d.inspecciones.filter(x => (x.estado || "por revisar") === "por revisar"));
  const sv = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const acciones = [
    [sv('<path d="M12 21V11"/><path d="M12 11c0-4 3-7 8-7 0 5-3 7-8 7z"/><path d="M12 14c0-3-2.5-5-7-5 0 4 2.5 5 7 5z"/>'), "Nueva finca", { tab: "fincas", col: "fincas", modo: "form", id: null }],
    [sv('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'), "Foto de campo", { tab: "foto", modo: "form", id: null }],
    [sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>'), "Medir sombra", { tab: "lux" }],
    [sv('<path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 13h6M9 17h4"/>'), "Defectos del café", { tab: "fescuela", subs: Object.assign({}, R.subs, { fescuela: "visual" }) }]
  ];
  return `<section class="hero heroF"><div class="heroF-txt"><p class="eyebrow">${e(U.fechaLarga(U.hoy()))} · Farmer Lab</p><h1>Tu laboratorio de campo</h1><p class="lede">Diagnostica fincas, acompaña a cada productor y entrega informes que se entienden.</p></div>${L.hojas()}</section>
${L.datoDelDia()}
<div class="rapidas">${acciones.map(([i, t, o]) => `<button type="button" class="rapida" data-go="${go(o)}">${i}${t}</button>`).join("")}</div>
<div class="stats">${stat("Fincas activas", activas.length, "")}${stat("Visitas en 30 días", visitas30, "")}${stat("Fotos por revisar", porRevisar.length, porRevisar.length ? "de tus productores" : "")}${stat("Lotes", S.d.lotes.length, "")}</div>
<div class="dos">
<section class="panel"><div class="panel-h"><h2>Fincas</h2>${goBtn("Ver todas", { tab: "fincas", col: "fincas" }, "link")}</div>
${activas.length ? `<div class="filas">${activas.slice(0, 6).map(filaFinca).join("")}</div>` : vacio("Tu primera finca", "Crea la ficha y comparte el código con el productor para que vea su diagnóstico.", goBtn("Nueva finca", acciones[0][2], "pri"))}</section>
<section class="panel"><div class="panel-h"><h2>Fotos de tus productores</h2></div>
${porRevisar.length ? `<div class="filas">${porRevisar.slice(0, 6).map(filaInspeccion).join("")}</div>` : `<p class="muted">Cuando un productor suba fotos de su finca, aparecerán aquí para que las revises.</p>`}</section>
</div>`;
};

/* ============================== Inspecciones con fotos ============================== */
const TEMAS = ["Plagas o enfermedades", "Hojas o nutrición", "Sombra", "Cosecha y madurez", "Beneficio", "Secado", "Otro"];
function filaInspeccion(x) {
  const f = S.buscar("fincas", x.finca_id);
  return fila({ titulo: `${x.fecha || ""} · ${x.tema || "Inspección"}`, meta: [f && f.nombre, x.zona, x.autor].filter(Boolean).join(" · "), der: pill(x.estado || "por revisar", (x.estado || "por revisar") === "por revisar" ? "warn" : "ok") + dot(x), obj: soyProductor() ? { tab: "pfotos", modo: "ver", id: x.id } : { tab: "fincas", col: "inspecciones", modo: "ver", id: x.id, padre: x.finca_id } });
}
const imgsFotos = (ids, fid) => `<div class="galeria">${(ids || []).map(id => `<img data-foto="${e(id)}" data-finca="${e(fid || "")}" alt="Foto de la inspección" loading="lazy">`).join("")}</div>`;
B.det.inspecciones = x => {
  const f = S.buscar("fincas", x.finca_id);
  const puedoResponder = !soyProductor();
  return cabecera("Inspección con fotos · " + (x.tema || ""), x.zona || "Fotos de la finca", [x.fecha, f && f.nombre, x.autor].filter(Boolean).join(" · "), x) +
    imgsFotos(x.fotos, x.finca_id) + texto("Lo que reporta el productor", x.notas) +
    (puedoResponder ? `<form class="form" novalidate><h3>Tu respuesta</h3>${fld("Respuesta para el productor", inArea("insp-resp", x.respuesta, 4, "Qué ves, qué hacer y qué vigilar"), { for: "insp-resp" })}
<div class="form-acc static">${btn("Enviar respuesta", "insp-responder", "pri", `data-id="${e(x.id)}"`)}</div></form>` : texto("Respuesta de tu consultor", x.respuesta || "") || `<p class="muted">Tu consultor todavía no ha respondido.</p>`) +
    (soyProductor() ? `<div class="det-acc">${btn("Eliminar", "eliminar", "danger")}</div>` : "");
};
A["insp-responder"] = async t => {
  const x = S.buscar("inspecciones", t.dataset.id); if (!x) return;
  const respuesta = V.t("insp-resp"); if (!respuesta) { toast("Escribe tu respuesta.", "warn"); return; }
  t.disabled = true;
  await S.guardar("inspecciones", Object.assign({}, x, { respuesta, estado: "revisada", respondido: new Date().toISOString() }));
  toast("Respuesta enviada al productor ✔"); AP.render();
};

/* Formulario de fotos del productor (y del consultor) */
let fotosInsp = [], nuevasInsp = new Set();
vistas.pfotos = () => {
  if (R.modo === "ver") { const x = S.buscar("inspecciones", R.id); return x ? B.det.inspecciones(x) : vacio("No encontré esta inspección", "", goBtn("Volver", { modo: "lista", id: null })); }
  if (R.modo === "form") return formInspeccion();
  const fid = (fincaProductor() || {}).id;
  const a = ordenarFecha(S.d.inspecciones.filter(x => !fid || x.finca_id === fid));
  return `<div class="barra"><h2>Fotos de mi finca</h2>${goBtn("+ Subir fotos", { modo: "form", id: null }, "pri")}</div>
<p class="lede">Toma fotos de lo que te preocupa (hojas, frutos, plantas, secado). Tu consultor las revisa y te responde aquí.</p>
${a.length ? `<div class="filas">${a.map(filaInspeccion).join("")}</div>` : vacio("Aún no has subido fotos", "Sube tu primera inspección: toma 1 minuto.", goBtn("Subir fotos", { modo: "form", id: null }, "pri"))}`;
};
function formInspeccion() {
  const fincas = S.d.fincas;
  return `<form class="form" id="finsp" novalidate><h2>Nueva inspección con fotos</h2>
<div class="fotos-zona"><div class="fotos-btns"><label class="btn pri big"><input type="file" id="insp-camara" class="vh" accept="image/*" capture="environment">Tomar foto</label><label class="btn big"><input type="file" id="insp-galeria" class="vh" accept="image/*" multiple>Elegir de la galería</label></div>
<div class="miniaturas" id="insp-mins">${fotosInsp.map(id => `<figure class="mini"><img data-foto="${e(id)}" alt="Foto"><button type="button" class="din-x" data-act="insp-quitar" data-id="${e(id)}" aria-label="Quitar foto">×</button></figure>`).join("")}</div>
<p class="help">Hasta 4 fotos, con buena luz y de cerca. Se guardan aunque no haya señal.</p></div>
<div class="grid">${fincas.length > 1 ? fld("Finca", inSel("insp-finca", (fincaProductor() || {}).id, fincas.map(f => ({ v: f.id, t: f.nombre })), null), { for: "insp-finca" }) : ""}${fld("Tema", inSel("insp-tema", "", TEMAS, "Elige un tema"), { for: "insp-tema" })}${fld("Zona, lote o parcela", inText("insp-zona", "", "Ej. Lote El Mirador"), { for: "insp-zona" })}${fld("Fecha", inDate("insp-fecha", U.hoy()), { for: "insp-fecha" })}</div>
${fld("¿Qué observas?", inArea("insp-notas", "", 4, "Desde cuándo, cuántas plantas, qué cambió…"), { for: "insp-notas" })}
<div class="form-acc">${btn("Enviar a mi consultor", "insp-guardar", "pri")}${btn("Cancelar", "insp-cancelar", "ghost")}</div></form>`;
}
async function agregarFotosInsp(files) {
  const lista = Array.from(files || []).slice(0, Math.max(0, 4 - fotosInsp.length));
  for (const file of lista) {
    try {
      const c = await B.IA.comprimir(file); const id = U.nuevoId();
      await S.guardarFoto({ id, blob: c.blob, ancho: c.ancho, alto: c.alto, creado: new Date().toISOString() });
      fotosInsp.push(id); nuevasInsp.add(id);
      const box = document.getElementById("insp-mins"); if (box) box.insertAdjacentHTML("beforeend", `<figure class="mini"><img data-foto="${e(id)}" alt="Foto"><button type="button" class="din-x" data-act="insp-quitar" data-id="${e(id)}" aria-label="Quitar foto">×</button></figure>`);
    } catch (x) { toast("No se pudo leer esa foto.", "warn"); }
  }
  L.pintarFotos();
}
A["insp-quitar"] = async t => { const id = t.dataset.id; fotosInsp = fotosInsp.filter(x => x !== id); const f = t.closest(".mini"); if (f) f.remove(); if (nuevasInsp.has(id)) { nuevasInsp.delete(id); try { await S.borrarFoto(id); } catch (x) { /* nada */ } } };
A["insp-cancelar"] = async () => { for (const id of nuevasInsp) { try { await S.borrarFoto(id); } catch (x) { /* nada */ } } fotosInsp = []; nuevasInsp = new Set(); AP.ir({ modo: "lista", id: null }); };
A["insp-guardar"] = async t => {
  if (!fotosInsp.length) { toast("Toma al menos una foto.", "warn"); return; }
  const fid = V.t("insp-finca") || (fincaProductor() || {}).id;
  if (!fid) { toast("Primero conecta tu finca.", "warn"); return; }
  t.disabled = true;
  const id = await S.guardar("inspecciones", { finca_id: fid, fotos: [...fotosInsp], tema: V.t("insp-tema"), zona: V.t("insp-zona"), fecha: V.t("insp-fecha") || U.hoy(), notas: V.t("insp-notas"), estado: "por revisar" });
  fotosInsp = []; nuevasInsp = new Set();
  toast("Fotos enviadas a tu consultor ✔");
  AP.ir({ modo: "ver", id });
};
document.addEventListener("change", ev => { const el = ev.target; if (el && (el.id === "insp-camara" || el.id === "insp-galeria")) { agregarFotosInsp(el.files); el.value = ""; } });

/* Fotos guardadas en la nube: si no están en el dispositivo, se traen */
const urlsNube = new Map();
L.pintarFotos = () => {
  document.querySelectorAll("img[data-foto]").forEach(async img => {
    if (img.getAttribute("src")) return;
    const id = img.dataset.foto;
    if (urlsNube.has(id)) { img.src = urlsNube.get(id); return; }
    let f = await S.foto(id);
    if ((!f || !f.blob) && B.Nube && B.Nube.traerFoto) f = await B.Nube.traerFoto(id, img.dataset.finca || null);
    if (f && f.blob && !img.getAttribute("src")) { const u = URL.createObjectURL(f.blob); urlsNube.set(id, u); img.src = u; }
  });
};

/* ============================== Extra en la ficha de la finca (consultor) ============================== */
L.extraFinca = f => {
  const insp = ordenarFecha(S.d.inspecciones.filter(x => x.finca_id === f.id));
  const luz = ordenarFecha(S.d.luz.filter(x => x.finca_id === f.id));
  const campo = ordenarFecha(S.d.campo.filter(x => x.finca_id === f.id));
  const nProd = (f.productores || []).length;
  return `<section class="bloque acceso-finca"><div class="panel-h"><h3>Acceso del productor</h3>${f.codigo_productor ? `<span class="codigo-inv">${e(f.codigo_productor)}</span>` : btn("Crear código", "codigo-finca", "pri sm", `data-id="${e(f.id)}"`)}</div>
<p class="muted">${nProd ? `${nProd} productor${nProd === 1 ? "" : "es"} conectado${nProd === 1 ? "" : "s"}.` : "Nadie conectado todavía."} El productor descarga la app, crea su cuenta con Google o su correo, elige «Productor» y escribe este código. Solo verá esta finca.</p>
${f.codigo_productor ? `<div class="det-acc">${btn("Compartir código", "codigo-compartir", "sm", `data-id="${e(f.id)}"`)}</div>` : ""}</section>
<section class="bloque"><div class="panel-h"><h3>Fotos del productor</h3></div>${insp.length ? `<div class="filas">${insp.slice(0, 8).map(filaInspeccion).join("")}</div>` : `<p class="muted">Aquí llegan las fotos que suba el productor.</p>`}</section>
<section class="bloque"><div class="panel-h"><h3>Sombra medida</h3>${goBtn("Medir sombra", { tab: "lux", borrador: { finca_id: f.id } }, "sm")}</div>${luz.length ? `<div class="filas">${luz.slice(0, 6).map(filaLuz).join("")}</div>` : `<p class="muted">Mide la luz bajo la copa con el luxómetro del celular.</p>`}</section>
${campo.length ? `<section class="bloque"><h3>Registros de campo del productor</h3><div class="filas">${campo.slice(0, 8).map(x => `<div class="fila estatica"><span class="fila-txt"><b>${e(x.fecha)} · ${e(x.actividad || "")}</b><small>${e([x.lote, x.cantidad, x.notas].filter(Boolean).join(" · "))}</small></span></div>`).join("")}</div></section>` : ""}`;
};
A["codigo-finca"] = async t => {
  if (!B.Nube) { toast("Inicia sesión para crear códigos.", "warn"); return; }
  t.disabled = true;
  try { const c = await B.Nube.codigoFinca(t.dataset.id, "productor"); toast(`Código creado: ${c}`); AP.render(); }
  catch (x) { console.error(x); toast("No se pudo crear el código. Revisa tu conexión.", "warn"); t.disabled = false; }
};
A["codigo-compartir"] = async t => {
  const f = S.buscar("fincas", t.dataset.id); if (!f || !f.codigo_productor) return;
  const texto = `Te invito a ver el diagnóstico de ${f.nombre} en Brewer Lab. Entra a ${location.origin}${location.pathname}, crea tu cuenta, elige «Productor» y escribe el código ${f.codigo_productor}.`;
  try { if (navigator.share) { await navigator.share({ title: "Brewer Lab", text: texto }); return; } } catch (x) { if (x && x.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(texto); toast("Invitación copiada ✔"); } catch (x) { toast(texto); }
};

/* ============================== Luxómetro (sombra) ============================== */
const Lux = { stream: null, track: null, timer: null, sensor: null, modo: null, actual: null, sol: null, sombras: [], bloqueado: false, frontal: true };
function filaLuz(x) { return fila({ titulo: `${x.fecha || ""} · ${x.lugar || "Medición"}`, meta: [x.sombra_pct !== undefined && x.sombra_pct !== null ? `${x.sombra_pct} % de sombra` : "", x.autor].filter(Boolean).join(" · "), der: x.sombra_pct !== null && x.sombra_pct !== undefined ? pill(evaluarSombra(x.sombra_pct).t, evaluarSombra(x.sombra_pct).c) : "", obj: soyProductor() ? { tab: "pluz", modo: "ver", id: x.id } : { tab: "lux", modo: "ver", id: x.id } }); }
const evaluarSombra = p => p < 20 ? { t: "Poca sombra", c: "warn" } : p <= 55 ? { t: "En rango", c: "ok" } : p <= 70 ? { t: "Sombra alta", c: "warn" } : { t: "Sombra excesiva", c: "bad" };
function vLux(tabNombre) {
  if (R.modo === "ver") {
    const x = S.buscar("luz", R.id);
    if (!x) return vacio("No encontré esta medición", "", goBtn("Volver", { modo: "lista", id: null }));
    const ev = x.sombra_pct !== null && x.sombra_pct !== undefined ? evaluarSombra(x.sombra_pct) : null;
    return cabecera("Medición de sombra", x.lugar || "Medición", [x.fecha, (S.buscar("fincas", x.finca_id) || {}).nombre].filter(Boolean).join(" · "), x) +
      `<div class="lecturas">${lectura("A pleno sol", x.lux_sol ?? "—", "lux aprox.")}${lectura("Bajo la copa", x.lux_sombra ?? "—", "lux aprox.")}${lectura("Sombra", x.sombra_pct ?? "—", "%", ev ? pill(ev.t, ev.c) : "")}</div>${texto("Notas", x.notas)}<div class="det-acc">${btn("Eliminar", "eliminar", "danger")}</div>`;
  }
  const fid = (R.borrador && R.borrador.finca_id) || (soyProductor() ? (fincaProductor() || {}).id : "");
  const hist = ordenarFecha(S.d.luz.filter(x => !fid || x.finca_id === fid));
  const prom = Lux.sombras.length ? Lux.sombras.reduce((s, v) => s + v, 0) / Lux.sombras.length : null;
  const pct = Lux.sol && prom !== null ? Math.max(0, Math.min(100, Math.round((1 - prom / Lux.sol) * 100))) : null;
  const ev = pct !== null ? evaluarSombra(pct) : null;
  return `<div class="barra"><h2>Luxómetro de sombra</h2></div>
<p class="lede">Mide cuánta luz pasa bajo los árboles de sombra. Compara una lectura a pleno sol con varias bajo la copa y la app calcula el porcentaje de sombra.</p>
<details class="bloque"><summary>Cómo medir bien (léelo una vez)</summary><ol>
<li>Pon el celular boca arriba sobre la palma, a la altura de las hojas del café. Usa la cámara de adelante (la de las selfies) apuntando al cielo.</li>
<li>Cubre esa cámara con un pedacito de papel blanco delgado: así mide la luz que llega, no lo que ve.</li>
<li>Primero mide en un claro a pleno sol y toca <b>Guardar como sol</b>.</li>
<li>Luego camina por el lote y toca <b>Agregar punto de sombra</b> en 5 a 10 lugares distintos, bajo la copa.</li>
<li>Mide a media mañana o media tarde, con el cielo parejo (todo sol o todo nublado), y en pocos minutos para que la luz no cambie.</li>
</ol><p class="help">La cámara del celular no es un luxómetro de laboratorio: los lux son aproximados, pero el porcentaje de sombra entre sol y sombra sí es útil para comparar.</p></details>
<section class="lux-panel">
<div class="lux-visor"><video id="lux-video" playsinline muted></video><div class="lux-lectura"><span id="lux-modo">${Lux.stream || Lux.sensor ? "Midiendo…" : "Luxómetro apagado"}</span><b id="lux-valor">${Lux.actual !== null && Lux.actual !== undefined ? fmtLux(Lux.actual) : "—"}</b><small id="lux-unidad">${Lux.modo === "relativo" ? "% de brillo" : "lux aprox."}</small></div></div>
<div class="det-acc">${Lux.stream || Lux.sensor ? btn("Apagar", "lux-apagar") : btn("Encender luxómetro", "lux-encender", "pri big")}${btn(Lux.frontal ? "Usar cámara trasera" : "Usar cámara frontal", "lux-cambiar", "ghost sm")}</div>
<div class="lux-pasos">
<div class="lux-paso ${Lux.sol ? "listo" : ""}"><span class="num">1</span><div><b>A pleno sol</b><small>${Lux.sol ? `${fmtLux(Lux.sol)} ${Lux.modo === "relativo" ? "% brillo" : "lux"}` : "Sin medir"}</small></div>${btn("Guardar como sol", "lux-sol", "sm", Lux.stream || Lux.sensor ? "" : "disabled")}</div>
<div class="lux-paso ${Lux.sombras.length ? "listo" : ""}"><span class="num">2</span><div><b>Bajo la copa</b><small>${Lux.sombras.length ? `${Lux.sombras.length} punto${Lux.sombras.length === 1 ? "" : "s"} · promedio ${fmtLux(prom)}` : "Sin medir"}</small></div>${btn("Agregar punto de sombra", "lux-sombra", "sm", (Lux.stream || Lux.sensor) && Lux.sol ? "" : "disabled")}</div>
</div>
${pct !== null ? `<div class="lux-resultado"><p class="eyebrow">Resultado</p><b>${pct} % de sombra</b>${pill(ev.t, ev.c)}<p class="muted">Entra ${100 - pct} % de la luz del sol. Como referencia, muchas guías recomiendan entre 30 y 50 % de sombra para el café; a menor altitud suele convenir algo más. Consulta la recomendación de tu zona.</p></div>` : ""}
</section>
<form class="form" novalidate><h3>Guardar la medición</h3>
<div class="grid">${soyProductor() ? "" : fld("Finca", inSel("lux-finca", fid, S.d.fincas.map(f => ({ v: f.id, t: f.nombre })), "Elige la finca"), { for: "lux-finca" })}${fld("Lugar o lote", inText("lux-lugar", "", "Ej. Lote 3, bajo guama"), { for: "lux-lugar" })}${fld("Sombra (%)", inNum("lux-pct", pct ?? "", "1", "Calculada o estimada"), { for: "lux-pct" })}</div>
${fld("Notas", inArea("lux-notas", "", 2, "Árboles de sombra, poda pendiente, hora…"), { for: "lux-notas" })}
<div class="form-acc static">${btn("Guardar medición", "lux-guardar", "pri")}${btn("Empezar de nuevo", "lux-reset", "ghost")}</div></form>
${hist.length ? `<section class="bloque"><h3>Mediciones anteriores</h3><div class="filas">${hist.slice(0, 10).map(filaLuz).join("")}</div></section>` : ""}`;
}
vistas.pluz = () => vLux("pluz");
vistas.lux = () => vLux("lux");
const fmtLux = v => v === null || v === undefined ? "—" : Lux.modo === "relativo" ? U.fmt(v * 100, 1) : v >= 1000 ? Math.round(v).toLocaleString("es") : U.fmt(v, 0);
function pintarLux() { const v = document.getElementById("lux-valor"); if (v) v.textContent = fmtLux(Lux.actual); const m = document.getElementById("lux-modo"); if (m) m.textContent = Lux.modo === "sensor" ? "Sensor de luz del celular" : Lux.modo === "camara" ? "Cámara (exposición automática)" : Lux.modo === "relativo" ? "Cámara (brillo relativo, exposición fija)" : "Midiendo…"; const u = document.getElementById("lux-unidad"); if (u) u.textContent = Lux.modo === "relativo" ? "% de brillo" : "lux aprox."; }
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
async function encenderLux() {
  apagarLux(false);
  if ("AmbientLightSensor" in window) {
    try { const s = new window.AmbientLightSensor({ frequency: 2 }); s.addEventListener("reading", () => { Lux.actual = s.illuminance; Lux.modo = "sensor"; pintarLux(); }); s.addEventListener("error", () => {}); s.start(); Lux.sensor = s; Lux.modo = "sensor"; AP.render(); return; } catch (x) { /* sin sensor */ }
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast("Este navegador no deja usar la cámara.", "warn"); return; }
  try {
    Lux.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: Lux.frontal ? "user" : "environment" }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
  } catch (x) { toast("No se pudo abrir la cámara. Revisa el permiso del navegador.", "warn"); return; }
  Lux.track = Lux.stream.getVideoTracks()[0];
  AP.render();
  const video = document.getElementById("lux-video"); if (video) { video.srcObject = Lux.stream; try { await video.play(); } catch (x) { /* autoplay */ } }
  const cv = document.createElement("canvas"); cv.width = 64; cv.height = 48; const ctx = cv.getContext("2d", { willReadFrequently: true });
  Lux.timer = setInterval(() => {
    const v = document.getElementById("lux-video"); if (!v || !v.videoWidth) return;
    ctx.drawImage(v, 0, 0, 64, 48);
    const d = ctx.getImageData(0, 0, 64, 48).data; let suma = 0;
    for (let i = 0; i < d.length; i += 4) suma += 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
    const media = suma / (d.length / 4);
    const st = Lux.track && Lux.track.getSettings ? Lux.track.getSettings() : {};
    if (!Lux.bloqueado && st.exposureTime && st.iso) {
      const t = st.exposureTime / 10000; const N = 1.8;
      const ev100 = Math.log2(N * N / t) - Math.log2(st.iso / 100);
      Lux.actual = Math.max(0, 2.5 * Math.pow(2, ev100) * (media / 0.18)); Lux.modo = "camara";
    } else { Lux.actual = media; Lux.modo = "relativo"; }
    pintarLux();
  }, 500);
}
function apagarLux(rerender = true) {
  if (Lux.timer) clearInterval(Lux.timer); Lux.timer = null;
  if (Lux.sensor) { try { Lux.sensor.stop(); } catch (x) { /* nada */ } Lux.sensor = null; }
  if (Lux.stream) { Lux.stream.getTracks().forEach(t => t.stop()); Lux.stream = null; Lux.track = null; }
  Lux.bloqueado = false;
  if (rerender) AP.render();
}
/* Sin datos de exposición: fija la exposición al medir el sol para comparar brillos con la misma cámara */
async function fijarExposicion() {
  const tr = Lux.track; if (!tr || !tr.getCapabilities) return false;
  const caps = tr.getCapabilities();
  if (!caps.exposureMode || !caps.exposureMode.includes("manual")) return false;
  try { await tr.applyConstraints({ advanced: [{ exposureMode: "manual" }] }); Lux.bloqueado = true; return true; } catch (x) { return false; }
}
A["lux-encender"] = () => encenderLux();
A["lux-apagar"] = () => apagarLux();
A["lux-cambiar"] = () => { Lux.frontal = !Lux.frontal; if (Lux.stream) encenderLux(); else AP.render(); };
A["lux-sol"] = async () => {
  if (Lux.actual === null || Lux.actual === undefined) { toast("Espera a que aparezca una lectura.", "warn"); return; }
  if (Lux.modo === "relativo") {
    const ok = await fijarExposicion();
    if (!ok) toast("Tu cámara no deja fijar la exposición: el resultado puede no ser preciso.", "warn");
    await new Promise(r => setTimeout(r, 700));
  }
  Lux.sol = Lux.actual; Lux.sombras = []; AP.render(); const v = document.getElementById("lux-video"); if (v && Lux.stream) { v.srcObject = Lux.stream; v.play().catch(() => {}); }
  toast("Lectura de sol guardada ✔ Ahora mide bajo la copa.");
};
A["lux-sombra"] = () => {
  if (!Lux.sol) { toast("Primero mide a pleno sol.", "warn"); return; }
  Lux.sombras.push(Lux.actual); AP.render(); const v = document.getElementById("lux-video"); if (v && Lux.stream) { v.srcObject = Lux.stream; v.play().catch(() => {}); }
};
A["lux-reset"] = () => { Lux.sol = null; Lux.sombras = []; Lux.bloqueado = false; if (Lux.stream) encenderLux(); else AP.render(); };
A["lux-guardar"] = async t => {
  const fid = V.t("lux-finca") || (fincaProductor() || {}).id || (R.borrador && R.borrador.finca_id);
  if (!fid) { toast("Elige la finca.", "warn"); return; }
  const prom = Lux.sombras.length ? Lux.sombras.reduce((s, v) => s + v, 0) / Lux.sombras.length : null;
  const relativo = Lux.modo === "relativo";
  t.disabled = true;
  await S.guardar("luz", { finca_id: fid, fecha: U.hoy(), lugar: V.t("lux-lugar"), sombra_pct: V.n("lux-pct"), lux_sol: Lux.sol && !relativo ? Math.round(Lux.sol) : null, lux_sombra: prom !== null && !relativo ? Math.round(prom) : null, puntos: Lux.sombras.length, modo: Lux.modo || "manual", notas: V.t("lux-notas") });
  toast("Medición guardada ✔"); apagarLux(false); Lux.sol = null; Lux.sombras = []; AP.ir({ modo: "lista", id: null, borrador: null });
};

/* ============================== Portal del productor ============================== */
function ultimaVisita(fid) { return ordenarFecha(S.d.visitas.filter(v => v.finca_id === fid))[0] || null; }
function ultimoInforme(fid) { return ordenarFecha(S.d.informes.filter(i => i.finca_id === fid))[0] || null; }
vistas.pinicio = () => {
  const f = fincaProductor();
  const nombre = nombreCorto();
  if (!f) return `<section class="hero heroF"><div class="heroF-txt"><p class="eyebrow">Farmer Lab</p><h1>¡Hola${nombre ? `, ${e(nombre)}` : ""}!</h1><p class="lede">Conecta tu finca para ver su diagnóstico, subir fotos y medir la sombra.</p>${btn("Conectar mi finca", "conectar-finca", "pri big")}</div>${L.granito("saluda")}</section>${L.datoDelDia()}`;
  const v = ultimaVisita(f.id); const idx = v ? C.indice(v) : null; const sem = C.semaforo(idx);
  const inf = ultimoInforme(f.id);
  const an = v ? B.Informe.analisis(v) : null;
  const pasos = inf && (inf.plan || []).length ? inf.plan.slice(0, 3).map(p => `${p.plazo ? `<b>${e(p.plazo)}:</b> ` : ""}${e(p.accion || "")}`) : an ? an.recs.slice(0, 3).map(r => `<b>${e(r.area)}:</b> ${e(r.items[0] || "")}`) : [];
  const sv = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  return `<section class="hero heroF"><div class="heroF-txt"><p class="eyebrow">${e(f.nombre)} · Farmer Lab</p><h1>¡Hola${nombre ? `, ${e(nombre)}` : ""}! Soy Granito</h1><p class="lede">Te acompaño con los datos de tu finca. Pregúntame lo que quieras.</p>${goBtn("Preguntarle a Granito", { tab: "granito" }, "pri")}</div>${L.granito("saluda")}</section>
${L.datoDelDia()}
<section class="panel mi-finca"><div class="panel-h"><h2>Así va tu finca</h2>${goBtn("Ver todo", { tab: "pfinca" }, "link")}</div>
<div class="lecturas">${lectura("Índice de la finca", idx === null ? "—" : idx, "/100", sem ? pill(sem.t, sem.c) : "")}${lectura("Última visita", v ? U.fechaLarga(v.fecha) : "—")}${lectura("Lotes", S.d.lotes.filter(l => l.finca_id === f.id).length)}</div>
${pasos.length ? `<h3>Próximos pasos</h3><ol class="pasos-lista">${pasos.map(p => `<li>${p}</li>`).join("")}</ol>` : `<p class="muted">Cuando tu consultor registre la visita de diagnóstico, aquí verás tus próximos pasos.</p>`}</section>
<div class="rapidas">
<button type="button" class="rapida" data-go="${go({ tab: "pfotos", modo: "form", id: null })}">${sv('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>')}Subir fotos</button>
<button type="button" class="rapida" data-go="${go({ tab: "pluz" })}">${sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>')}Medir sombra</button>
<button type="button" class="rapida" data-go="${go({ tab: "granito" })}">${sv('<ellipse cx="12" cy="12" rx="7" ry="9"/><path d="M12 3c-2 4 2 6 0 9s2 6 0 9"/>')}Hablar con Granito</button>
<button type="button" class="rapida" data-go="${go({ tab: "pfinca", modo: "campo" })}">${sv('<path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>')}Anotar actividad</button>
</div>`;
};
A["conectar-finca"] = () => { if (B.Nube && B.Nube.unirseUI) B.Nube.unirseUI(); };

vistas.pfinca = () => {
  const f = fincaProductor();
  if (!f) return vacio("Aún no tienes una finca conectada", "Escribe el código de tu consultor o registra tu finca.", btn("Conectar mi finca", "conectar-finca", "pri"));
  if (R.modo === "campo") return formCampo(f);
  if (R.modo === "informe" && R.id) {
    const inf = S.buscar("informes", R.id); const v = inf && S.buscar("visitas", inf.visita_id);
    if (!inf || !v) return vacio("No encontré el informe", "", goBtn("Volver", { modo: "lista", id: null }));
    return `<button type="button" class="volver" data-go="${go({ modo: "lista", id: null })}">← Mi finca</button><div class="det-acc">${btn("Descargar PDF", "p-inf-pdf", "pri", `data-id="${e(inf.id)}"`)}</div><div class="papel">${B.Informe.html(inf, { finca: f, visita: v })}</div>`;
  }
  const v = ultimaVisita(f.id); const idx = v ? C.indice(v) : null; const sem = C.semaforo(idx);
  const an = v ? B.Informe.analisis(v) : null;
  const infs = ordenarFecha(S.d.informes.filter(i => i.finca_id === f.id));
  const lotes = S.d.lotes.filter(l => l.finca_id === f.id);
  const campo = ordenarFecha(S.d.campo.filter(x => x.finca_id === f.id));
  const sinConsultor = !(f.consultores || []).length;
  return `<div class="barra"><h2>${e(f.nombre)}</h2></div>
<div class="lecturas">${lectura("Índice", idx === null ? "—" : idx, "/100", sem ? pill(sem.t, sem.c) : "")}${lectura("Altitud", (f.altitud_min || f.altitud_max) ? `${f.altitud_min || "?"}–${f.altitud_max || "?"}` : "—", "m")}${lectura("Café", f.area_cafe_ha ?? "—", "ha")}</div>
${v ? `<section class="visita-res">${B.radar(v)}<div><h3>Tu diagnóstico</h3>${an.fortalezas.length ? `<p><b>Fortalezas:</b> ${e(an.fortalezas.map(x => x.a.nombre).join(", "))}</p>` : ""}${an.prioridades.length ? `<p><b>Para mejorar:</b> ${e(an.prioridades.map(x => x.a.nombre).join(", "))}</p>` : ""}<p class="help">Visita del ${e(U.fechaLarga(v.fecha))}.</p></div></section>` : `<p class="muted">Tu consultor todavía no registra la visita de diagnóstico.</p>`}
<section class="bloque"><h3>Informes de tu consultor</h3>${infs.length ? `<div class="filas">${infs.map(i => fila({ titulo: `${i.fecha} · Informe de diagnóstico`, meta: "Toca para leerlo o descargarlo", obj: { tab: "pfinca", modo: "informe", id: i.id } })).join("")}</div>` : `<p class="muted">Aquí aparecerán tus informes.</p>`}</section>
${lotes.length ? `<section class="bloque"><h3>Tus lotes</h3><div class="filas">${lotes.map(l => `<div class="fila estatica"><span class="fila-txt"><b>${e(l.codigo || "Lote")}</b><small>${e([l.proceso, U.lista(l.variedad).join(", "), l.estado].filter(Boolean).join(" · "))}</small></span><span class="fila-der">${U.num(l.puntaje_cva) !== null ? `<span class="score">${U.fmt(l.puntaje_cva, 2)}</span>` : ""}</span></div>`).join("")}</div></section>` : ""}
<section class="bloque"><div class="panel-h"><h3>Mis actividades</h3>${goBtn("+ Anotar actividad", { modo: "campo" }, "sm")}</div>${campo.length ? `<div class="filas">${campo.slice(0, 10).map(x => `<div class="fila estatica"><span class="fila-txt"><b>${e(x.fecha)} · ${e(x.actividad || "")}</b><small>${e([x.lote, x.cantidad, x.notas].filter(Boolean).join(" · "))}</small></span>${dot(x)}</div>`).join("")}</div>` : `<p class="muted">Anota fertilizaciones, podas, cosechas, lluvias… Tu consultor lo verá.</p>`}</section>
${sinConsultor ? `<section class="bloque"><h3>Invita a tu consultor</h3><p class="muted">Comparte este código con tu consultor para que pueda ver y trabajar tu finca.</p>${f.codigo_consultor ? `<span class="codigo-inv">${e(f.codigo_consultor)}</span>` : btn("Crear código", "codigo-consultor", "pri sm", `data-id="${e(f.id)}"`)}</section>` : ""}`;
};
A["p-inf-pdf"] = async t => {
  const inf = S.buscar("informes", t.dataset.id); const f = fincaProductor(); const v = inf && S.buscar("visitas", inf.visita_id);
  if (!inf || !f || !v) return;
  t.disabled = true; const txt = t.textContent; t.textContent = "Generando PDF…";
  try { const blob = await B.Informe.pdf(inf, { finca: f, visita: v }); await AP.compartir(`Informe ${U.nombreNota(f.nombre)} ${inf.fecha}.pdf`, blob, "Informe de diagnóstico"); }
  catch (x) { toast("No se pudo generar el PDF aquí.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
};
A["codigo-consultor"] = async t => { t.disabled = true; try { await B.Nube.codigoFinca(t.dataset.id, "consultor"); AP.render(); } catch (x) { toast("No se pudo crear el código.", "warn"); t.disabled = false; } };
const ACTIVIDADES = ["Fertilización", "Control de malezas", "Poda", "Manejo de sombra", "Control de broca", "Control de roya", "Floración", "Cosecha", "Beneficio", "Secado", "Venta", "Lluvia", "Otra"];
function formCampo(f) {
  return `<button type="button" class="volver" data-go="${go({ modo: "lista" })}">← Mi finca</button>
<form class="form" novalidate><h2>Anotar actividad</h2>
<div class="grid">${fld("Actividad", inSel("campo-act", "", ACTIVIDADES, "Elige"), { for: "campo-act" })}${fld("Fecha", inDate("campo-fecha", U.hoy()), { for: "campo-fecha" })}${fld("Lote o parcela", inText("campo-lote", ""), { for: "campo-lote" })}${fld("Cantidad", inText("campo-cant", "", "Ej. 12 sacos, 40 mm de lluvia"), { for: "campo-cant" })}</div>
${fld("Notas", inArea("campo-notas", "", 3), { for: "campo-notas" })}
<div class="form-acc">${btn("Guardar", "campo-guardar", "pri", `data-finca="${e(f.id)}"`)}</div></form>`;
}
A["campo-guardar"] = async t => {
  if (!V.t("campo-act")) { toast("Elige la actividad.", "warn"); return; }
  t.disabled = true;
  await S.guardar("campo", { finca_id: t.dataset.finca, actividad: V.t("campo-act"), fecha: V.t("campo-fecha") || U.hoy(), lote: V.t("campo-lote"), cantidad: V.t("campo-cant"), notas: V.t("campo-notas") });
  toast("Actividad guardada ✔"); AP.ir({ modo: "lista" });
};

/* ============================== Granito: responde con los datos de la finca ============================== */
const chat = [];
const SUGERENCIAS = ["¿Cómo está mi finca?", "¿Qué hago primero?", "¿Cuánta sombra tengo?", "¿Cómo van mis lotes?", "¿Qué dijo mi consultor?"];
vistas.granito = () => {
  const f = fincaProductor();
  if (!chat.length) chat.push({ de: "granito", t: f ? `¡Hola! Soy Granito ☕ Conozco los datos de ${f.nombre}. Pregúntame por tu diagnóstico, tus próximos pasos, la sombra o tus lotes.` : "¡Hola! Soy Granito ☕ Conecta tu finca y te cuento cómo va." });
  return `<section class="chat-granito"><div class="chat-cab">${L.granito("mini")}<div><b>Granito</b><small>${B.Nube && B.Nube.iaLista ? "Asistente con IA" : "Responde con los datos de tu finca"}</small></div></div>
<div class="chat-lista" id="chat-lista">${chat.map(m => `<div class="msg ${m.de}">${m.de === "granito" ? m.t : e(m.t)}</div>`).join("")}</div>
<div class="chips chat-sug">${SUGERENCIAS.map(s => `<button type="button" class="chipf" data-act="granito-sug" data-q="${e(s)}">${e(s)}</button>`).join("")}</div>
<form class="chat-form" id="chat-form" novalidate><input id="chat-q" type="text" autocomplete="off" placeholder="Escribe tu pregunta…"><button type="submit" class="btn pri">Enviar</button></form>
${B.Nube && B.Nube.iaLista ? "" : `<p class="help">Granito todavía no usa IA: responde con lo que tu consultor registró. Para dudas técnicas, consulta siempre a tu consultor.</p>`}</section>`;
};
A["granito-sug"] = t => preguntarGranito(t.dataset.q);
document.addEventListener("submit", ev => { if (ev.target && ev.target.id === "chat-form") { ev.preventDefault(); const q = V.t("chat-q"); if (q) preguntarGranito(q); } });
function preguntarGranito(q) {
  chat.push({ de: "yo", t: q });
  chat.push({ de: "granito", t: responder(q) });
  AP.render();
  const l = document.getElementById("chat-lista"); if (l) l.scrollTop = l.scrollHeight;
}
function responder(q) {
  const t = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const f = fincaProductor();
  if (!f) return "Primero conecta tu finca con el código de tu consultor. Toca <b>Conectar mi finca</b> en el inicio.";
  const v = ultimaVisita(f.id); const an = v ? B.Informe.analisis(v) : null; const idx = v ? C.indice(v) : null;
  const inf = ultimoInforme(f.id);
  const hay = (...ps) => ps.some(p => t.includes(p));
  if (hay("hola", "buenas", "buenos")) return `¡Hola! ¿Qué quieres saber de <b>${e(f.nombre)}</b>? Puedo contarte tu diagnóstico, tus próximos pasos, la sombra o tus lotes.`;
  if (hay("sombra", "luz", "lux", "arbol")) {
    const luz = ordenarFecha(S.d.luz.filter(x => x.finca_id === f.id));
    if (!luz.length) return "Todavía no hay mediciones de sombra. Usa el <b>luxómetro</b>: mide a pleno sol y luego bajo la copa en varios puntos. Como referencia, muchas guías recomiendan entre 30 y 50 % de sombra.";
    const u = luz[0]; const ev = u.sombra_pct !== null && u.sombra_pct !== undefined ? evaluarSombra(u.sombra_pct) : null;
    return `Tu última medición (${e(u.fecha)}${u.lugar ? `, ${e(u.lugar)}` : ""}) dio <b>${u.sombra_pct ?? "—"} % de sombra</b>${ev ? ` (${ev.t.toLowerCase()})` : ""}. ${ev && ev.t === "Poca sombra" ? "Con poca sombra la planta se estresa: considera sembrar árboles de sombra." : ev && ev.c === "bad" ? "Con tanta sombra puede bajar la producción y subir la humedad: conversa con tu consultor sobre una poda de los árboles de sombra." : "Vas bien: mantén la regulación de la sombra antes de las lluvias."}`;
  }
  if (hay("lote", "cosecha", "taza", "puntaje", "cva", "catacion", "cata")) {
    const lotes = S.d.lotes.filter(l => l.finca_id === f.id);
    if (!lotes.length) return "Aún no hay lotes registrados. Tu consultor los anota con su código para seguir su trazabilidad y su puntaje en taza.";
    const conP = lotes.filter(l => U.num(l.puntaje_cva) !== null).sort((a, b) => U.num(b.puntaje_cva) - U.num(a.puntaje_cva));
    return `Tienes <b>${lotes.length} lote${lotes.length === 1 ? "" : "s"}</b> registrados.${conP.length ? ` El mejor en taza es <b>${e(conP[0].codigo || "")}</b> con <b>${U.fmt(conP[0].puntaje_cva, 2)} puntos</b>${conP[0].proceso ? ` (${e(conP[0].proceso)})` : ""}.` : " Todavía no tienen puntaje de cata."}`;
  }
  if (hay("informe", "consultor", "dijo", "recomend")) {
    if (inf) return `Tu último informe es del <b>${e(U.fechaLarga(inf.fecha))}</b>. ${inf.resumen ? e(inf.resumen.slice(0, 380)) + (inf.resumen.length > 380 ? "…" : "") : ""} Puedes leerlo completo en <b>Mi finca</b>.`;
    const resp = ordenarFecha(S.d.inspecciones.filter(x => x.finca_id === f.id && x.respuesta))[0];
    if (resp) return `Tu consultor respondió tu inspección del ${e(resp.fecha)}: “${e(resp.respuesta.slice(0, 300))}”.`;
    return "Tu consultor todavía no ha subido un informe. Puedes enviarle fotos desde <b>Fotos</b>.";
  }
  if (hay("primero", "hacer", "mejorar", "prioridad", "pasos", "plan", "consejo")) {
    if (inf && (inf.plan || []).length) return `Según tu plan de acción, empieza por:<ol>${inf.plan.slice(0, 3).map(p => `<li><b>${e(p.area || "")}</b>${p.plazo ? ` (${e(p.plazo)})` : ""}: ${e(p.accion || "")}</li>`).join("")}</ol>`;
    if (an && an.recs.length) return `Lo que más puede mejorar tu finca ahora:<ol>${an.recs.slice(0, 3).map(r => `<li><b>${e(r.area)}</b> (nivel ${r.s} de 5): ${e(r.items[0] || "")}</li>`).join("")}</ol>Confírmalo con tu consultor antes de invertir.`;
    return "Todavía no tengo tu diagnóstico. Cuando tu consultor registre la visita, te diré por dónde empezar.";
  }
  if (hay("roya", "broca", "plaga", "enfermedad", "hongo", "ojo de gallo")) {
    const s = v ? U.num(v.s_sanidad) : null;
    const h = v && (v.hallazgos || {}).sanidad;
    return `${s !== null ? `En sanidad tu finca está en <b>${s} de 5</b>. ` : ""}${h ? `Tu consultor anotó: “${e(h)}”. ` : ""}Revisa las hojas bajeras cada 15 días y no dejes frutos en el suelo después de cosechar. Si ves algo raro, súbelo en <b>Fotos</b> para que tu consultor lo revise.`;
  }
  if (hay("como esta", "como va", "indice", "diagnostico", "finca", "estado", "nota")) {
    if (!v) return "Aún no hay visita de diagnóstico registrada. Cuando tu consultor la haga, te cuento cómo va tu finca.";
    const sem = C.semaforo(idx);
    return `Tu finca tiene un índice de <b>${idx}/100</b> (${sem ? sem.t.toLowerCase() : ""}) en la visita del ${e(U.fechaLarga(v.fecha))}.${an.fortalezas.length ? ` Lo mejor: <b>${e(an.fortalezas.map(x => x.a.nombre.toLowerCase()).join(", "))}</b>.` : ""}${an.prioridades.length ? ` Para mejorar: <b>${e(an.prioridades.map(x => x.a.nombre.toLowerCase()).join(", "))}</b>.` : ""}`;
  }
  if (hay("gracias")) return "¡Con gusto! Aquí estoy cuando quieras ☕";
  return "Todavía estoy aprendiendo 🌱 Puedo contarte cómo está tu finca, qué hacer primero, cuánta sombra tienes, cómo van tus lotes o qué dijo tu consultor. Prueba con una de las preguntas de abajo.";
}

/* ============================== Reportes ============================== */
const html2pdfURL = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
L.cargarPDF = () => typeof window.html2pdf === "function" ? Promise.resolve() : new Promise((res, rej) => { const s = document.createElement("script"); s.src = html2pdfURL; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
L.pdfDesdeHTML = async (html, nombre, titulo) => {
  await L.cargarPDF();
  const host = document.createElement("div"); host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-12000px;top:0;width:794px;background:#ffffff;";
  host.innerHTML = `<style>${B.Informe.css}${L.cssDoc}</style>` + html;
  document.body.appendChild(host);
  try {
    const opt = { margin: [12, 12, 14, 12], image: { type: "jpeg", quality: 0.92 }, html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, pagebreak: { mode: ["css", "legacy"], avoid: ["tr", ".kpi", "h2", "h3", ".evitar"] } };
    const blob = await window.html2pdf().set(opt).from(host.firstElementChild.nextElementSibling).outputPdf("blob");
    await AP.compartir(nombre, blob, titulo);
  } finally { host.remove(); }
};
L.cssDoc = `.rep .doc-portada{background:#FBEBC9;border-radius:18px;padding:34px 34px 30px;margin-bottom:18px}.rep .doc-portada h1{font-size:30px;margin:8px 0 6px}.rep .doc-portada p{color:#4A4D55}
.rep .md h2{font-size:20px;margin:22px 0 8px;border-bottom:1px solid #D4C8AE;padding-bottom:5px}.rep .md h3{font-size:15px;margin:16px 0 6px}.rep .md p,.rep .md li{font-size:12px;line-height:1.6}.rep .md ul,.rep .md ol{padding-left:18px}.rep .md blockquote{margin:10px 0;padding:10px 14px;background:#F8F6F1;border-left:3px solid #20232A;border-radius:8px}.rep .md table{margin:8px 0}.rep .salto{page-break-before:always}`;
const portadaDoc = (eyebrow, titulo, sub) => `<div class="doc-portada"><div class="marca">${e(eyebrow)}</div><h1>${e(titulo)}</h1>${sub ? `<p>${e(sub)}</p>` : ""}<p style="font-size:11px;margin-top:10px">${e((S.ajustes && S.ajustes.marca) || "Brewer Lab")} · ${e(U.fechaLarga(U.hoy()))}</p></div>`;
L.portadaDoc = portadaDoc;

const PERIODOS = [["30", "30 días"], ["90", "90 días"], ["365", "Un año"], ["todo", "Todo"]];
const ATR = (B.listas && B.listas.atributos) || [];
function sparkline(vals, alto = 60) {
  if (vals.length < 2) return `<p class="muted">Registra más tazas para ver la tendencia.</p>`;
  const w = 600, min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1) * w).toFixed(1)},${(alto - (v - min) / (max - min) * alto).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${alto}" preserveAspectRatio="none" role="img" aria-label="Tendencia de puntajes"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
}
function datosBrewer() {
  const per = R.subs.breportes;
  const desde = per === "todo" ? "" : hace(Number(per) || 30);
  const preps = S.d.preparaciones.filter(p => !desde || (p.fecha || "") >= desde).sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
  const conP = preps.map(p => ({ p, v: C.pbl(p) })).filter(x => x.v !== null);
  const catas = S.d.catas.filter(c => !desde || (c.fecha || "") >= desde);
  const porMetodo = {};
  conP.forEach(({ p, v }) => { const k = p.metodo || "Sin método"; (porMetodo[k] = porMetodo[k] || []).push(v); });
  const porCafe = {};
  conP.forEach(({ p, v }) => { const c = S.buscar("cafes", p.cafe_id); const k = c ? c.nombre : (p.cafe_txt || "Sin café"); (porCafe[k] = porCafe[k] || []).push(v); });
  const prom = arr => arr.reduce((s, x) => s + x, 0) / arr.length;
  const atr = ATR.map(a => { const vs = preps.map(p => U.num(p[a.key])).filter(x => x !== null); return { n: a.nombre || a.key, v: vs.length ? prom(vs) : null }; }).filter(x => x.v !== null);
  return { preps, conP, catas, porMetodo, porCafe, prom, atr, etiqueta: (PERIODOS.find(([k]) => k === per) || PERIODOS[0])[1] };
}
vistas.breportes = () => {
  const d = datosBrewer();
  const metodos = Object.entries(d.porMetodo).map(([k, vs]) => ({ k, n: vs.length, p: d.prom(vs), m: Math.max(...vs) })).sort((a, b) => b.p - a.p);
  const cafes = Object.entries(d.porCafe).map(([k, vs]) => ({ k, n: vs.length, p: d.prom(vs) })).sort((a, b) => b.p - a.p).slice(0, 6);
  return `<div class="barra"><h2>Reportes del laboratorio</h2><div class="barra-acc">${btn("Descargar PDF", "breporte-pdf", "pri")}</div></div>
${subtabs("breportes", PERIODOS)}
<div class="stats">${stat("Tazas", d.preps.length, d.etiqueta)}${stat("Puntaje promedio", d.conP.length ? U.fmt(d.prom(d.conP.map(x => x.v)), 1) : "—", "de 100")}${stat("Mejor taza", d.conP.length ? U.fmt(Math.max(...d.conP.map(x => x.v)), 1) : "—", "")}${stat("Catas", d.catas.length, "")}</div>
<section class="panel"><div class="panel-h"><h2>Tendencia de tus puntajes</h2></div>${sparkline(d.conP.map(x => x.v))}</section>
<div class="dos">
<section class="panel"><h2>Por método</h2>${metodos.length ? `<div class="tabla"><table><thead><tr><th>Método</th><th>Tazas</th><th>Promedio</th><th>Mejor</th></tr></thead><tbody>${metodos.map(m => `<tr><td>${e(m.k)}</td><td>${m.n}</td><td>${U.fmt(m.p, 1)}</td><td>${U.fmt(m.m, 1)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">Sin tazas puntuadas en este periodo.</p>`}</section>
<section class="panel"><h2>Tus mejores cafés</h2>${cafes.length ? `<div class="barras">${cafes.map(c => `<div class="b-row"><span>${e(c.k)}</span><span class="b-track"><span class="b-fill" style="width:${Math.max(4, (c.p - 58) / 42 * 100)}%"></span></span><b>${U.fmt(c.p, 1)}</b></div>`).join("")}</div>` : `<p class="muted">Sin datos todavía.</p>`}</section>
</div>
${d.atr.length ? `<section class="panel"><h2>Atributos promedio (1–9)</h2><div class="barras">${d.atr.map(a => `<div class="b-row"><span>${e(a.n)}</span><span class="b-track"><span class="b-fill alt" style="width:${a.v / 9 * 100}%"></span></span><b>${U.fmt(a.v, 1)}</b></div>`).join("")}</div></section>` : ""}`;
};
A["breporte-pdf"] = async t => {
  const d = datosBrewer();
  const metodos = Object.entries(d.porMetodo).map(([k, vs]) => ({ k, n: vs.length, p: d.prom(vs), m: Math.max(...vs) })).sort((a, b) => b.p - a.p);
  const html = `<article class="rep">${portadaDoc("Reporte del laboratorio", "Brewer Lab · " + d.etiqueta, (S.ajustes && S.ajustes.consultor) || "")}
<div class="kpis"><div class="kpi"><span>Tazas</span><b>${d.preps.length}</b></div><div class="kpi"><span>Promedio</span><b>${d.conP.length ? U.fmt(d.prom(d.conP.map(x => x.v)), 1) : "—"}</b></div><div class="kpi"><span>Mejor taza</span><b>${d.conP.length ? U.fmt(Math.max(...d.conP.map(x => x.v)), 1) : "—"}</b></div><div class="kpi"><span>Catas</span><b>${d.catas.length}</b></div></div>
<section class="sec"><h2>Por método</h2><table><thead><tr><th>Método</th><th>Tazas</th><th>Promedio</th><th>Mejor</th></tr></thead><tbody>${metodos.map(m => `<tr><td>${e(m.k)}</td><td>${m.n}</td><td>${U.fmt(m.p, 1)}</td><td>${U.fmt(m.m, 1)}</td></tr>`).join("") || `<tr><td colspan="4">Sin datos</td></tr>`}</tbody></table></section>
<section class="sec"><h2>Tazas del periodo</h2><table><thead><tr><th>Fecha</th><th>Método</th><th>Café</th><th>Receta</th><th>Puntaje</th></tr></thead><tbody>${d.preps.slice(-40).reverse().map(p => { const c = S.buscar("cafes", p.cafe_id); const v = C.pbl(p); return `<tr><td>${e(p.fecha || "")}</td><td>${e(p.metodo || "")}</td><td>${e(c ? c.nombre : (p.cafe_txt || ""))}</td><td>${e([(p.dosis_g && p.agua_g) ? `${p.dosis_g}/${p.agua_g} g` : "", p.clicks ? `${p.clicks} clicks` : "", p.temp_c ? `${p.temp_c} °C` : ""].filter(Boolean).join(" · "))}</td><td>${v === null ? "—" : U.fmt(v, 1)}</td></tr>`; }).join("") || `<tr><td colspan="5">Sin tazas</td></tr>`}</tbody></table></section></article>`;
  t.disabled = true; const txt = t.textContent; t.textContent = "Generando PDF…";
  try { await L.pdfDesdeHTML(html, `Reporte Brewer Lab ${U.hoy()}.pdf`, "Reporte del laboratorio"); } catch (x) { console.error(x); toast("No se pudo generar el PDF.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
};

function filasFincas() {
  return misFincas().map(f => {
    const vis = ordenarFecha(S.d.visitas.filter(v => v.finca_id === f.id));
    const idxs = vis.map(v => C.indice(v)).filter(x => x !== null).reverse();
    const lotes = S.d.lotes.filter(l => l.finca_id === f.id);
    const cvas = lotes.map(l => U.num(l.puntaje_cva)).filter(x => x !== null);
    const urg = S.d.diagnosticos.filter(g => g.finca_id === f.id && g.resultado && g.resultado.urgencia === "alta").length;
    return { f, idx: idxs.length ? idxs[idxs.length - 1] : null, idxs, nVis: vis.length, nLotes: lotes.length, cva: cvas.length ? cvas.reduce((s, x) => s + x, 0) / cvas.length : null, urg, insp: S.d.inspecciones.filter(x => x.finca_id === f.id && (x.estado || "por revisar") === "por revisar").length };
  });
}
vistas.freportes = () => {
  const sub = R.subs.freportes;
  const tabs = subtabs("freportes", [["fincas", "Fincas"], ["informes", "Informes"], ["lotes", "Lotes"]]);
  if (sub === "informes") {
    const infs = ordenarFecha(S.d.informes);
    return `<div class="barra"><h2>Reportes</h2></div>${tabs}${infs.length ? `<div class="filas">${infs.map(i => { const f = S.buscar("fincas", i.finca_id); return fila({ titulo: `${i.fecha} · ${f ? f.nombre : "Finca"}`, meta: "Informe de diagnóstico", der: dot(i), obj: { tab: "fincas", col: "informes", modo: "informe", id: i.id, padre: i.finca_id } }); }).join("")}</div>` : vacio("Sin informes", "Genera el informe desde una visita de diagnóstico.")}`;
  }
  if (sub === "lotes") {
    const lotes = [...S.d.lotes].sort((a, b) => (U.num(b.puntaje_cva) || 0) - (U.num(a.puntaje_cva) || 0));
    return `<div class="barra"><h2>Reportes</h2></div>${tabs}${lotes.length ? `<div class="tabla"><table><thead><tr><th>Lote</th><th>Finca</th><th>Proceso</th><th>Kg verde</th><th>CVA</th></tr></thead><tbody>${lotes.map(l => `<tr><td>${e(l.codigo || "")}</td><td>${e((S.buscar("fincas", l.finca_id) || {}).nombre || "")}</td><td>${e(l.proceso || "")}</td><td>${e(l.kg_verde ?? "")}</td><td>${U.num(l.puntaje_cva) === null ? "—" : U.fmt(l.puntaje_cva, 2)}</td></tr>`).join("")}</tbody></table></div>` : vacio("Sin lotes", "Registra lotes desde la ficha de cada finca.")}`;
  }
  const filas = filasFincas();
  return `<div class="barra"><h2>Reportes</h2><div class="barra-acc">${btn("Descargar PDF", "freporte-pdf", "pri")}</div></div>${tabs}
<div class="stats">${stat("Fincas", filas.length, "")}${stat("Índice promedio", filas.filter(x => x.idx !== null).length ? Math.round(filas.filter(x => x.idx !== null).reduce((s, x) => s + x.idx, 0) / filas.filter(x => x.idx !== null).length) : "—", "de 100")}${stat("Lotes", S.d.lotes.length, "")}${stat("Fotos por revisar", filas.reduce((s, x) => s + x.insp, 0), "")}</div>
${filas.length ? `<div class="reporte-fincas">${filas.map(x => { const sem = C.semaforo(x.idx); return `<section class="panel"><div class="panel-h"><h3>${e(x.f.nombre)}</h3>${x.idx !== null ? `<span class="score ${sem.c}">${x.idx}</span>` : ""}</div>${x.idxs.length > 1 ? sparkline(x.idxs, 40) : ""}<p class="muted">${x.nVis} visita${x.nVis === 1 ? "" : "s"} · ${x.nLotes} lote${x.nLotes === 1 ? "" : "s"}${x.cva !== null ? ` · CVA promedio ${U.fmt(x.cva, 2)}` : ""}${x.urg ? ` · ${x.urg} diagnóstico${x.urg === 1 ? "" : "s"} urgente${x.urg === 1 ? "" : "s"}` : ""}</p>${goBtn("Abrir finca", { tab: "fincas", col: "fincas", modo: "ver", id: x.f.id }, "link")}</section>`; }).join("")}</div>` : vacio("Sin fincas", "Crea tu primera finca en Fincas.")}`;
};
A["freporte-pdf"] = async t => {
  const filas = filasFincas();
  const html = `<article class="rep">${portadaDoc("Reporte de fincas", "Farmer Lab", (S.ajustes && S.ajustes.consultor) || "")}
<section class="sec"><h2>Resumen por finca</h2><table><thead><tr><th>Finca</th><th>Índice</th><th>Visitas</th><th>Lotes</th><th>CVA promedio</th></tr></thead><tbody>${filas.map(x => `<tr><td>${e(x.f.nombre)}</td><td>${x.idx ?? "—"}</td><td>${x.nVis}</td><td>${x.nLotes}</td><td>${x.cva === null ? "—" : U.fmt(x.cva, 2)}</td></tr>`).join("") || `<tr><td colspan="5">Sin fincas</td></tr>`}</tbody></table></section>
<section class="sec"><h2>Lotes</h2><table><thead><tr><th>Lote</th><th>Finca</th><th>Proceso</th><th>CVA</th></tr></thead><tbody>${S.d.lotes.map(l => `<tr><td>${e(l.codigo || "")}</td><td>${e((S.buscar("fincas", l.finca_id) || {}).nombre || "")}</td><td>${e(l.proceso || "")}</td><td>${U.num(l.puntaje_cva) === null ? "—" : U.fmt(l.puntaje_cva, 2)}</td></tr>`).join("") || `<tr><td colspan="4">Sin lotes</td></tr>`}</tbody></table></section></article>`;
  t.disabled = true; const txt = t.textContent; t.textContent = "Generando PDF…";
  try { await L.pdfDesdeHTML(html, `Reporte Farmer Lab ${U.hoy()}.pdf`, "Reporte de fincas"); } catch (x) { console.error(x); toast("No se pudo generar el PDF.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
};

/* ============================== Cambio de laboratorio y sesión ============================== */
A.lab = t => {
  const lab = t.dataset.lab;
  AP.ir({ tab: lab === "farmer" ? "farm" : "inicio" });
  if (S.backend) S.guardarConfig("prefs", Object.assign({}, S.prefs, { lab }));
};
L.alEntrar = perfil => {
  document.body.dataset.rol = perfil.rol || "consultor";
  if (perfil.rol === "productor") { R.tab = "pinicio"; R.lab = "productor"; }
  else if (!AP.labDe(R.tab) || AP.labDe(R.tab) === "productor") { const lab = (perfil.prefs && perfil.prefs.lab) || "brewer"; R.tab = lab === "farmer" ? "farm" : "inicio"; R.lab = lab; }
};

const despuesBase = vistas.despues;
vistas.despues = r => {
  if (despuesBase) despuesBase(r);
  L.pintarFotos();
  document.body.dataset.navlab = r.lab === "productor" ? "productor" : r.lab === "farmer" ? "farmer" : "brewer";
  document.querySelectorAll(".labs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.lab === (r.lab === "brewer" ? "brewer" : "farmer"))));
  const av = document.getElementById("avatar"); if (av) av.textContent = (nombreCorto() || "?").charAt(0).toUpperCase();
  const m = document.getElementById("main"); if (m) { m.classList.remove("entra"); void m.offsetWidth; m.classList.add("entra"); }
  if ((r.tab === "lux" || r.tab === "pluz") && Lux.stream) { const v = document.getElementById("lux-video"); if (v && v.srcObject !== Lux.stream) { v.srcObject = Lux.stream; v.play().catch(() => {}); } }
  if (r.tab !== "lux" && r.tab !== "pluz" && (Lux.stream || Lux.sensor)) apagarLux(false);
};
})();
