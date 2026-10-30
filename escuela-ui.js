/* Brewer Lab · Escuela de café: módulos con manual, guía de estudio, bebidas y menús, guías visuales y PDF */
(() => {
"use strict";
const B = window.BL, U = B.U, S = B.Store, AP = B.app, A = AP.A, R = AP.R, L = B.labs;
const { e, go, btn, goBtn, vacio, pill, subtabs, fila } = AP.h;
const toast = AP.toast;
const vistas = B.vistas;
const ESC = () => B.escuela || null;
const md = (t, shift = 1) => B.md2html(String(t || ""), { shift });
const ICONO_FUENTE = { video: "▶", articulo: "📄", libro: "📚", estandar: "📐", curso: "🎓" };

/* Progreso guardado en tu cuenta */
const prog = () => (S.prefs && S.prefs.escuela) || {};
const progMod = id => prog()[id] || { leidas: [], check: [], quiz: null };
function guardarProg(id, cambios) {
  const todo = Object.assign({}, prog(), { [id]: Object.assign({}, progMod(id), cambios) });
  S.guardarConfig("prefs", Object.assign({}, S.prefs, { escuela: todo }));
}
const pctMod = m => { const p = progMod(m.id); const n = (m.lecciones || []).length; return n ? Math.round(p.leidas.filter(x => m.lecciones.some(l => l.id === x)).length / n * 100) : 0; };

/* ============================== Vista principal ============================== */
function vEscuela(ruta, tab) {
  const esc = ESC();
  const items = ruta === "brewer"
    ? [["modulos", "Módulos"], ["guia", "Mi guía"], ["bebidas", "Bebidas y menús"], ["visual", "Tueste"], ["app", "Manuales"]]
    : [["modulos", "Módulos"], ["guia", "Mi guía"], ["visual", "Defectos"], ["rubricas", "Rúbricas"], ["app", "Manuales"]];
  const sub = R.subs[tab] || "modulos";
  const cab = `<div class="barra"><h2>Escuela ${ruta === "brewer" ? "Barista" : "de Finca"}</h2></div>${subtabs(tab, items)}`;
  if (R.manual && R.manual.startsWith("mod:")) return cab + vModulo(R.manual.slice(4), tab);
  if (R.manual && R.manual.startsWith("app:")) return cab + `<div class="det-acc">${btn("Descargar PDF", "manual-app-pdf", "pri", `data-id="${e(R.manual.slice(4))}"`)}</div>` + AP.vManual(R.manual.slice(4));
  if (sub === "visual") return cab + (ruta === "brewer" ? vTueste() : vDefectos());
  if (sub === "rubricas") return cab + vRubricas();
  if (sub === "app") return cab + vManualesApp(tab);
  if (!esc) return cab + `<section class="bloque"><h3>La escuela se está escribiendo</h3><p class="muted">Estamos preparando los módulos con fuentes de primer nivel (James Hoffmann, Lance Hedrick, Morgan Eckroth, SCA, World Coffee Research y más). Mientras tanto, tienes los manuales y las guías visuales.</p></section>` + vManualesApp(tab);
  if (sub === "guia") return cab + vGuia(ruta);
  if (sub === "bebidas") return cab + vBebidas();
  return cab + vModulos(ruta, tab);
}
vistas.escuela = () => vEscuela("brewer", "escuela");
vistas.fescuela = () => vEscuela("farmer", "fescuela");

function vModulos(ruta, tab) {
  const esc = ESC();
  const r = (esc.rutas || []).find(x => x.id === ruta) || {};
  const mods = (esc.modulos || []).filter(m => m.ruta === ruta).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const niveles = ["Básico", "Intermedio", "Avanzado"];
  if (!mods.length) return `<section class="bloque"><h3>Esta ruta se está escribiendo</h3><p class="muted">Los módulos llegan en los próximos días, con fuentes de primer nivel. Mientras tanto, revisa las guías visuales y los manuales.</p></section>` + vManualesApp(tab);
  const total = mods.length ? Math.round(mods.reduce((s, m) => s + pctMod(m), 0) / mods.length) : 0;
  return `<section class="hero"><p class="eyebrow">${e(r.nombre || "")}</p><h1>${e(r.lema || "Aprende de lo básico a lo avanzado")}</h1><p class="lede">${e(r.descripcion || "")}</p>
<div style="max-width:420px"><p class="help">Tu avance: ${total} %</p><div class="progreso"><span style="width:${total}%"></span></div></div>
<div class="det-acc">${btn("Descargar manual de la ruta (PDF)", "ruta-pdf", "pri", `data-ruta="${ruta}"`)}</div></section>
${niveles.map(n => { const ms = mods.filter(m => (m.nivel || "Básico") === n); return ms.length ? `<section><p class="eyebrow">${n}</p><div class="modulos">${ms.map(m => `<button type="button" class="modulo" data-go="${go({ manual: "mod:" + m.id })}"><span class="ic">${e(m.icono || "☕")}</span><b>${e(m.titulo)}</b><small>${e(m.resumen || "")}</small><small>${e(m.duracion || "")} · ${(m.lecciones || []).length} lecciones</small><div class="progreso"><span style="width:${pctMod(m)}%"></span></div></button>`).join("")}</div></section>` : ""; }).join("")}`;
}

function vModulo(id, tab) {
  const esc = ESC(); if (!esc) return "";
  const m = (esc.modulos || []).find(x => x.id === id);
  if (!m) return vacio("No encontré ese módulo", "", goBtn("Volver", { manual: null }));
  const p = progMod(m.id);
  const mods = (esc.modulos || []).filter(x => x.ruta === m.ruta).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const i = mods.findIndex(x => x.id === m.id); const sig = mods[i + 1];
  return `<button type="button" class="volver" data-go="${go({ manual: null })}">← Módulos</button>
<section class="hero"><p class="eyebrow">${e(m.icono || "")} ${e(m.nivel || "")} · ${e(m.duracion || "")}</p><h1>${e(m.titulo)}</h1><p class="lede">${e(m.resumen || "")}</p>
<div style="max-width:420px"><div class="progreso"><span style="width:${pctMod(m)}%"></span></div></div>
<div class="det-acc">${btn("Descargar manual (PDF)", "modulo-pdf", "pri", `data-id="${e(m.id)}"`)}${sig ? goBtn("Siguiente módulo →", { manual: "mod:" + sig.id }, "ghost") : ""}</div></section>
${(m.objetivos || []).length ? `<section class="bloque"><h3>Al terminar podrás</h3><ul>${m.objetivos.map(o => `<li>${e(o)}</li>`).join("")}</ul></section>` : ""}
${(m.lecciones || []).map((l, n) => `<details class="leccion"${n === 0 && !p.leidas.length ? " open" : ""}><summary><span>${n + 1}. ${e(l.titulo)}</span>${p.leidas.includes(l.id) ? pill("Leída", "ok") : ""}</summary><div class="cuerpo manual">${md(l.md)}<div class="det-acc">${p.leidas.includes(l.id) ? "" : btn("Marcar como leída", "leccion-leida", "sm", `data-mod="${e(m.id)}" data-lec="${e(l.id)}"`)}</div></div></details>`).join("")}
${(m.practica || []).length ? `<section class="bloque"><h3>Práctica</h3><ol>${m.practica.map(x => `<li>${e(x)}</li>`).join("")}</ol></section>` : ""}
${(m.checklist || []).length ? `<section class="bloque"><h3>Checklist de campo</h3>${m.checklist.map((x, k) => `<label class="tgl"><input type="checkbox" data-check-mod="${e(m.id)}" data-k="${k}"${p.check.includes(k) ? " checked" : ""}><span>${e(x)}</span></label>`).join("")}</section>` : ""}
${(m.quiz || []).length ? `<section class="bloque quiz" data-mod="${e(m.id)}"><div class="panel-h"><h3>Ponte a prueba</h3>${p.quiz !== null && p.quiz !== undefined ? pill(`Tu mejor resultado: ${p.quiz}/${m.quiz.length}`, "ok") : ""}</div>${m.quiz.map((q, k) => `<div class="pregunta" data-k="${k}"><p><b>${k + 1}.</b> ${e(q.p)}</p>${(q.opciones || []).map((o, j) => `<button type="button" class="quiz-op" data-act="quiz" data-mod="${e(m.id)}" data-k="${k}" data-j="${j}">${e(o)}</button>`).join("")}<p class="help explicacion" hidden>${e(q.explicacion || "")}</p></div>`).join("")}</section>` : ""}
${(m.fuentes || []).length ? `<section class="bloque"><h3>Fuentes y para seguir aprendiendo</h3>${m.fuentes.map(f => `<p class="fuente"><span>${ICONO_FUENTE[f.tipo] || "🔗"}</span><span><a href="${e(f.url)}" target="_blank" rel="noopener">${e(f.titulo)}</a> <small>${e([f.autor, f.tipo].filter(Boolean).join(" · "))}</small></span></p>`).join("")}</section>` : ""}`;
}
A["leccion-leida"] = t => { const p = progMod(t.dataset.mod); if (!p.leidas.includes(t.dataset.lec)) guardarProg(t.dataset.mod, { leidas: [...p.leidas, t.dataset.lec] }); toast("¡Bien! Lección completada ✔"); AP.render(); };
document.addEventListener("change", ev => {
  const el = ev.target; if (!el || !el.dataset || !el.dataset.checkMod) return;
  const p = progMod(el.dataset.checkMod); const k = Number(el.dataset.k);
  guardarProg(el.dataset.checkMod, { check: el.checked ? [...new Set([...p.check, k])] : p.check.filter(x => x !== k) });
});
const respuestas = new Map();
A.quiz = t => {
  const esc = ESC(); const m = esc && esc.modulos.find(x => x.id === t.dataset.mod); if (!m) return;
  const k = Number(t.dataset.k), j = Number(t.dataset.j); const q = m.quiz[k];
  const caja = t.closest(".pregunta"); if (caja.dataset.listo) return; caja.dataset.listo = "1";
  caja.querySelectorAll(".quiz-op").forEach((b, idx) => { if (idx === q.correcta) b.classList.add("bien"); else if (idx === j) b.classList.add("mal"); b.disabled = true; });
  const ex = caja.querySelector(".explicacion"); if (ex) ex.hidden = false;
  const r = respuestas.get(m.id) || {}; r[k] = j === q.correcta; respuestas.set(m.id, r);
  if (Object.keys(r).length === m.quiz.length) {
    const ok = Object.values(r).filter(Boolean).length;
    const mejor = Math.max(ok, progMod(m.id).quiz || 0);
    guardarProg(m.id, { quiz: mejor });
    toast(ok === m.quiz.length ? `¡Perfecto! ${ok}/${m.quiz.length} ☕` : `Resultado: ${ok}/${m.quiz.length}. Repasa las lecciones y vuelve a intentarlo.`);
    respuestas.delete(m.id);
  }
};

/* ============================== Mi guía de estudio ============================== */
function vGuia(ruta) {
  const esc = ESC(); const g = esc.guiaPersonal;
  if (!g) return vacio("Tu guía de estudio está en preparación", "Mientras tanto, avanza por los módulos.");
  const mods = esc.modulos || [];
  const q = (R.borrador && R.borrador.glosario) || "";
  return `<section class="hero"><p class="eyebrow">Tu guía de estudio</p><h1>${e(g.titulo || "Mi guía de estudio")}</h1><div class="lede">${md(g.intro_md, 2)}</div>
<div class="det-acc">${btn("Descargar mi guía (PDF)", "guia-pdf", "pri")}${btn("Manual completo: todas las rutas (PDF)", "completo-pdf")}</div></section>
<section class="bloque"><h3>Plan semana a semana</h3><div class="filas">${(g.plan || []).map(s => { const ms = (s.modulos || []).map(id => mods.find(m => m.id === id)).filter(Boolean); const pct = ms.length ? Math.round(ms.reduce((a, m) => a + pctMod(m), 0) / ms.length) : 0; return `<div class="fila estatica" style="flex-direction:column;align-items:stretch"><span class="fila-txt"><b>Semana ${e(s.semana)} · ${e(s.objetivo || "")}</b><small>${ms.map(m => `<button type="button" class="btn link" data-go="${go({ tab: m.ruta === "brewer" ? "escuela" : "fescuela", manual: "mod:" + m.id })}">${e(m.titulo)}</button>`).join(" · ")}</small><small>${e(s.practica || "")}</small></span><div class="progreso"><span style="width:${pct}%"></span></div></div>`; }).join("")}</div></section>
<section class="bloque"><div class="panel-h"><h3>Glosario</h3><input type="text" id="glosario-q" placeholder="Buscar término…" value="${e(q)}" style="max-width:260px"></div><dl class="glosario" id="glosario">${glosarioHTML(q)}</dl></section>
${g.recursos_md ? `<section class="bloque manual">${md(g.recursos_md, 1)}</section>` : ""}`;
}
const glosarioHTML = q => { const g = (ESC() || {}).guiaPersonal || {}; const n = String(q || "").toLowerCase(); return (g.glosario || []).filter(x => !n || (x.termino + " " + x.definicion).toLowerCase().includes(n)).map(x => `<dt>${e(x.termino)}</dt><dd>${e(x.definicion)}</dd>`).join("") || `<p class="muted">Sin resultados.</p>`; };
document.addEventListener("input", ev => { if (ev.target && ev.target.id === "glosario-q") { const box = document.getElementById("glosario"); if (box) box.innerHTML = glosarioHTML(ev.target.value); } });

/* ============================== Bebidas y menús ============================== */
const CATS = { espresso: "Espresso", leche: "Con leche", filtrado: "Filtrados", frio: "Fríos", autor: "De autor" };
function vBebidas() {
  const esc = ESC(); const bs = esc.bebidas || []; const menus = esc.menus || [];
  if (!bs.length) return vacio("Las bebidas y los menús se están escribiendo", "Pronto tendrás recetas de espresso, bebidas con leche, filtrados, fríos, bebidas de autor y menús de ejemplo para descargar.");
  const cat = (R.borrador && R.borrador.cat) || "";
  const lista = bs.filter(b => !cat || b.categoria === cat);
  const r = b => b.receta || {};
  return `<div class="chips">${[["", "Todas"], ...Object.entries(CATS)].map(([k, t]) => `<button type="button" class="chipf" aria-pressed="${cat === k}" data-go="${go({ borrador: { cat: k } })}">${e(t)}</button>`).join("")}</div>
${lista.length ? `<div class="bebidas">${lista.map(b => `<article class="bebida"><b>${e(b.nombre)}</b>${pill(CATS[b.categoria] || b.categoria || "", "")}
<div class="receta-mini">${[["Café", r(b).dosis_g && `${r(b).dosis_g} g`], ["Bebida", r(b).rendimiento_g && `${r(b).rendimiento_g} g`], ["Tiempo", r(b).tiempo_s && `${r(b).tiempo_s} s`], ["Leche", r(b).leche_ml && `${r(b).leche_ml} mL`], ["Taza", b.taza_ml && `${b.taza_ml} mL`]].filter(([, v]) => v).map(([k, v]) => `<span>${k}</span><b>${e(v)}</b>`).join("")}</div>
${r(b).otros ? `<p class="help">${e(r(b).otros)}</p>` : ""}<p>${e(b.descripcion || "")}</p>${b.consejo ? `<p class="help"><b>Consejo:</b> ${e(b.consejo)}</p>` : ""}</article>`).join("")}</div>` : vacio("Sin bebidas en esta categoría", "")}
${menus.length ? `<section class="bloque"><h3>Menús de ejemplo</h3><div class="filas">${menus.map(mn => `<div class="fila estatica"><span class="fila-txt"><b>${e(mn.nombre)}</b><small>${e(mn.para || "")} · ${(mn.secciones || []).map(s => s.titulo).join(", ")}</small></span><span class="fila-der">${btn("Menú en PDF", "menu-pdf", "sm", `data-id="${e(mn.id)}"`)}</span></div>`).join("")}</div></section>` : ""}`;
}
A["menu-pdf"] = async t => {
  const esc = ESC(); const mn = (esc.menus || []).find(x => x.id === t.dataset.id); if (!mn) return;
  const bs = esc.bebidas || [];
  const html = `<article class="rep">${L.portadaDoc("Menú", mn.nombre, mn.para || "")}<div class="md">${(mn.secciones || []).map(s => `<h2>${e(s.titulo)}</h2><table><tbody>${(s.bebidas || []).map(id => bs.find(b => b.id === id)).filter(Boolean).map(b => `<tr><td><strong>${e(b.nombre)}</strong><br><span style="color:#6B6E75">${e(b.descripcion || "")}</span></td><td style="white-space:nowrap">${b.taza_ml ? `${e(b.taza_ml)} mL` : ""}</td></tr>`).join("")}</tbody></table>`).join("")}</div></article>`;
  await pdf(t, html, `Menú ${U.nombreNota(mn.nombre)}.pdf`, mn.nombre);
};

/* ============================== Guías visuales ============================== */
const IMG = k => (B.imagenesGuia || {})[k];
const figura = (k, pie, conCors) => { const i = IMG(k); if (!i) return ""; return `<figure><img src="${e(i.url)}" alt="${e(pie || "")}" loading="lazy"${conCors ? ' crossorigin="anonymous"' : ""}><figcaption>${pie ? e(pie) + " · " : ""}Foto: ${e(i.autor)} · ${e(i.licencia)} · <a href="${e(i.pagina)}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`; };
function vTueste() {
  const ts = B.tuestes || [];
  return `<section class="hero"><p class="eyebrow">Guía visual</p><h1>Perfiles de tueste</h1><p class="lede">Del verde al tueste más oscuro: cómo se ve cada nivel, a qué sabe y cómo ajustar tu receta.</p><div class="det-acc">${btn("Descargar guía (PDF)", "tueste-pdf", "pri")}</div></section>
<section class="guia-card">${figura("progresion", "Etapas del tueste y pérdida de peso")}<div class="txt"><b>Las etapas</b><p>Verde (0 % de pérdida) → amarillo (≈3 %) → canela al primer crack (≈10–11 %) → segundo crack (15–19 %). El café pierde sobre todo agua; el color y el aroma vienen de la reacción de Maillard y la caramelización.</p></div></section>
<div class="guia-grid">${ts.map(x => `<article class="guia-card">${figura(x.img, `${x.nombre} · ${x.c} °C`)}<div class="txt"><b>${e(x.nombre)}</b><p class="help">${e(x.clasico)} · grano a ≈${x.c} °C (${x.f} °F)</p><p><strong>Se ve:</strong> ${e(x.seVe)}</p><p><strong>Taza:</strong> ${e(x.taza)}</p>${x.preparar !== "—" ? `<p><strong>Prepáralo:</strong> ${e(x.preparar)}</p>` : ""}</div></article>`).join("")}</div>
<section class="guia-card">${figura("claroMedioOscuro", "Claro, medio y oscuro")}<div class="txt"><b>Compáralos lado a lado</b><p>El tueste de cata del SCA es medio (≈63 en la escala Agtron «Gourmet»). Los tuestes claros resaltan el origen; los oscuros, el tueste.</p></div></section>
<section class="bloque"><h3>Defectos de tueste</h3><div class="tabla"><table><thead><tr><th>Defecto</th><th>Cómo se ve</th><th>Causa</th><th>En taza</th></tr></thead><tbody>${(B.defectosTueste || []).map(d => `<tr><td><b>${e(d.nombre)}</b></td><td>${e(d.seVe)}</td><td>${e(d.causa)}</td><td>${e(d.taza)}${d.ref ? `<br><small class="muted">${e(d.ref)}</small>` : ""}</td></tr>`).join("")}</tbody></table></div></section>
<section class="guia-card">${figura("brocaTostado", "Granos tostados con daño de broca")}<div class="txt"><b>La broca también se ve en el tostado</b><p>Los orificios del insecto quedan en el grano tostado. Si los ves en tu bolsa, espera sabores sucios o agrios.</p></div></section>`;
}
function vDefectos() {
  const ds = B.defectos || [];
  const tarjeta = d => `<article class="guia-card">${d.img ? figura(d.img, d.pie || d.nombre) : `<div class="sin-foto">Sin foto libre de este defecto. Consulta el manual de defectos del café verde arábica del SCA.</div>`}<div class="txt"><b>${e(d.nombre)}</b><p>${pill(`Categoría ${d.cat}`, d.cat === 1 ? "bad" : "warn")} ${pill(`${d.eq} = 1 defecto completo`, "")}</p><p><strong>Se ve:</strong> ${e(d.seVe)}</p><p><strong>Causa:</strong> ${e(d.causa)}</p><p><strong>En taza:</strong> ${e(d.taza)}</p><p><strong>Prevenir:</strong> ${e(d.prevenir)}</p></div></article>`;
  return `<section class="hero"><p class="eyebrow">Guía visual</p><h1>Defectos del café verde</h1><p class="lede">Los 16 defectos de la clasificación SCA (muestra de 350 g): cómo reconocerlos, de dónde vienen y cómo evitarlos en la finca.</p><div class="det-acc">${btn("Descargar guía (PDF)", "defectos-pdf", "pri")}</div></section>
<section class="guia-card">${figura("comparacion", "Grano sano y grano rechazado")}<div class="txt"><b>Grado especialidad</b><p>Cero defectos de categoría 1 y como máximo 5 defectos completos en 350 g. Cuenta los granos defectuosos y conviértelos con su equivalencia: por ejemplo, 5 inmaduros = 1 defecto completo.</p></div></section>
<p class="eyebrow">Categoría 1 · primarios</p><div class="guia-grid">${ds.filter(d => d.cat === 1).map(tarjeta).join("")}</div>
<p class="eyebrow">Categoría 2 · secundarios</p><div class="guia-grid">${ds.filter(d => d.cat === 2).map(tarjeta).join("")}</div>
<section class="guia-card">${figura("mesas", "Mesas de clasificación en una finca")}<div class="txt"><b>Clasifica antes de vender</b><p>Repasar a mano el café verde quita los defectos que más bajan el puntaje en taza.</p></div></section>`;
}
function vRubricas() {
  return `<p class="lede">Las 13 áreas del diagnóstico de finca: qué observar, qué medir y cómo se ve cada nivel.</p><div class="rubricas">${B.areas.map((a, i) => `<article class="rubrica"><h3><span class="num">${i + 1}</span>${e(a.nombre)}</h3><p><b>Observar:</b> ${e(a.observar)}</p><p><b>Medir:</b> ${e(a.medir)}</p><ul class="rub"><li><b>1</b> ${e(a.n1)}</li><li><b>3</b> ${e(a.n3)}</li><li><b>5</b> ${e(a.n5)}</li></ul></article>`).join("")}</div>`;
}
function vManualesApp(tab) {
  return `<section><p class="eyebrow">Manuales</p><div class="manuales">${B.manuales.map(m => `<button type="button" class="manual-card" data-go="${go({ manual: "app:" + m.id })}"><span class="eyebrow">Manual</span><b>${e(m.titulo)}</b><small>${e(m.subtitulo)}</small></button>`).join("")}</div></section>
<section><p class="eyebrow">Tutoriales de la app</p><div class="tuts">${B.tutoriales.map((t, i) => `<article class="tut"><p class="eyebrow">Tutorial ${i + 1} · ${e(t.tiempo)}</p><h3>${e(t.titulo)}</h3><ol>${t.pasos.map(p => `<li>${B.md2html(p).replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ol></article>`).join("")}</div></section>`;
}

/* ============================== PDF ============================== */
async function pdf(t, html, nombre, titulo) {
  const txt = t.textContent; t.disabled = true; t.textContent = "Preparando PDF…";
  try { await L.pdfDesdeHTML(html, nombre, titulo); }
  catch (x) { console.error(x); toast("No se pudo generar el PDF aquí. Intenta desde una computadora.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
}
const moduloHTML = (m, salto) => `<div class="md${salto ? " salto" : ""}"><h2>${e(m.icono || "")} ${e(m.titulo)}</h2><p><em>${e(m.nivel || "")} · ${e(m.duracion || "")}</em></p><p>${e(m.resumen || "")}</p>
${(m.objetivos || []).length ? `<h3>Al terminar podrás</h3><ul>${m.objetivos.map(o => `<li>${e(o)}</li>`).join("")}</ul>` : ""}
${(m.lecciones || []).map((l, n) => `<h2>${n + 1}. ${e(l.titulo)}</h2>${md(l.md, 1)}`).join("")}
${(m.practica || []).length ? `<h2>Práctica</h2><ol>${m.practica.map(x => `<li>${e(x)}</li>`).join("")}</ol>` : ""}
${(m.checklist || []).length ? `<h2>Checklist de campo</h2><ul>${m.checklist.map(x => `<li>☐ ${e(x)}</li>`).join("")}</ul>` : ""}
${(m.quiz || []).length ? `<h2>Autoevaluación</h2><ol>${m.quiz.map(q => `<li>${e(q.p)}<br>${(q.opciones || []).map((o, j) => `${String.fromCharCode(97 + j)}) ${e(o)}`).join("<br>")}</li>`).join("")}</ol><p><strong>Respuestas:</strong> ${m.quiz.map((q, k) => `${k + 1}-${String.fromCharCode(97 + (q.correcta || 0))}`).join(" · ")}</p>` : ""}
${(m.fuentes || []).length ? `<h2>Fuentes</h2><ul>${m.fuentes.map(f => `<li>${e(f.titulo)} — ${e(f.autor || "")}. ${e(f.url || "")}</li>`).join("")}</ul>` : ""}</div>`;
A["modulo-pdf"] = t => { const m = ((ESC() || {}).modulos || []).find(x => x.id === t.dataset.id); if (!m) return; pdf(t, `<article class="rep">${L.portadaDoc("Escuela · manual del módulo", m.titulo, `${m.nivel || ""} · ${m.duracion || ""}`)}${moduloHTML(m)}</article>`, `${U.nombreNota(m.titulo)}.pdf`, m.titulo); };
A["ruta-pdf"] = t => {
  const esc = ESC(); if (!esc) return; const ruta = t.dataset.ruta; const r = (esc.rutas || []).find(x => x.id === ruta) || {};
  const mods = esc.modulos.filter(m => m.ruta === ruta).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  pdf(t, `<article class="rep">${L.portadaDoc("Escuela de café", r.nombre || "", r.lema || "")}<div class="md"><h2>Contenido</h2><ol>${mods.map(m => `<li>${e(m.titulo)} (${e(m.nivel || "")})</li>`).join("")}</ol></div>${mods.map(m => moduloHTML(m, true)).join("")}</article>`, `Manual ${U.nombreNota(r.nombre || ruta)}.pdf`, r.nombre || "Manual");
};
A["guia-pdf"] = t => {
  const esc = ESC(); const g = esc && esc.guiaPersonal; if (!g) return; const mods = esc.modulos || [];
  pdf(t, `<article class="rep">${L.portadaDoc("Mi guía de estudio", g.titulo || "Guía de estudio", (S.ajustes && S.ajustes.consultor) || "")}<div class="md">${md(g.intro_md, 1)}<h2>Plan de estudio</h2><table><thead><tr><th>Semana</th><th>Objetivo</th><th>Módulos</th><th>Práctica</th></tr></thead><tbody>${(g.plan || []).map(s => `<tr><td>${e(s.semana)}</td><td>${e(s.objetivo || "")}</td><td>${(s.modulos || []).map(id => (mods.find(m => m.id === id) || {}).titulo).filter(Boolean).map(e).join(", ")}</td><td>${e(s.practica || "")}</td></tr>`).join("")}</tbody></table><h2 class="salto">Glosario</h2><dl>${(g.glosario || []).map(x => `<dt><strong>${e(x.termino)}</strong></dt><dd>${e(x.definicion)}</dd>`).join("")}</dl>${g.recursos_md ? md(g.recursos_md, 1) : ""}</div></article>`, "Mi guia de estudio.pdf", "Mi guía de estudio");
};
A["completo-pdf"] = t => {
  const esc = ESC(); if (!esc) return; const g = esc.guiaPersonal || {};
  const rutas = ["brewer", "farmer"].map(id => ({ r: (esc.rutas || []).find(x => x.id === id) || {}, mods: esc.modulos.filter(m => m.ruta === id).sort((a, b) => (a.orden || 0) - (b.orden || 0)) }));
  toast("El manual completo es largo: puede tardar un minuto.");
  pdf(t, `<article class="rep">${L.portadaDoc("Manual completo", g.titulo || "Escuela de café Brewer Lab", "Ruta Barista y Ruta Finca, de lo básico a lo avanzado")}${g.intro_md ? `<div class="md">${md(g.intro_md, 1)}</div>` : ""}${rutas.map(x => `<div class="md salto"><h2>${e(x.r.nombre || "")}</h2><p>${e(x.r.descripcion || "")}</p></div>${x.mods.map(m => moduloHTML(m, true)).join("")}`).join("")}${(g.glosario || []).length ? `<div class="md salto"><h2>Glosario</h2><dl>${g.glosario.map(x => `<dt><strong>${e(x.termino)}</strong></dt><dd>${e(x.definicion)}</dd>`).join("")}</dl></div>` : ""}</article>`, "Manual completo Brewer Lab.pdf", "Manual completo");
};
A["manual-app-pdf"] = t => { const m = B.manuales.find(x => x.id === t.dataset.id); if (!m) return; pdf(t, `<article class="rep">${L.portadaDoc("Manual", m.titulo, m.subtitulo || "")}<div class="md">${md(m.md, 1)}</div></article>`, `${U.nombreNota(m.titulo)}.pdf`, m.titulo); };
const figuraPDF = (k, pie) => { const i = IMG(k); return i ? `<div class="evitar" style="margin:10px 0"><img src="${e(i.url)}" crossorigin="anonymous" style="width:100%;max-height:320px;object-fit:cover;border-radius:12px"><p style="font-size:9px;color:#6B6E75">${e(pie || "")} · Foto: ${e(i.autor)} · ${e(i.licencia)} · Wikimedia Commons</p></div>` : ""; };
A["tueste-pdf"] = t => pdf(t, `<article class="rep">${L.portadaDoc("Guía visual", "Perfiles de tueste", "Del verde al tueste más oscuro")}<div class="md">${figuraPDF("progresion", "Etapas del tueste")}${(B.tuestes || []).map(x => `<div class="evitar"><h3>${e(x.nombre)} · ${e(x.clasico)} · ≈${x.c} °C</h3>${figuraPDF(x.img, x.nombre)}<p><strong>Se ve:</strong> ${e(x.seVe)} <strong>Taza:</strong> ${e(x.taza)} ${x.preparar !== "—" ? `<strong>Prepáralo:</strong> ${e(x.preparar)}` : ""}</p></div>`).join("")}<h2>Defectos de tueste</h2><table><thead><tr><th>Defecto</th><th>Cómo se ve</th><th>Causa</th><th>En taza</th></tr></thead><tbody>${(B.defectosTueste || []).map(d => `<tr><td>${e(d.nombre)}</td><td>${e(d.seVe)}</td><td>${e(d.causa)}</td><td>${e(d.taza)}</td></tr>`).join("")}</tbody></table></div></article>`, "Guia de perfiles de tueste.pdf", "Perfiles de tueste");
A["defectos-pdf"] = t => pdf(t, `<article class="rep">${L.portadaDoc("Guía visual", "Defectos del café verde", "Clasificación SCA · muestra de 350 g")}<div class="md">${figuraPDF("comparacion", "Grano sano y rechazado")}<p>Grado especialidad: cero defectos de categoría 1 y como máximo 5 defectos completos en 350 g.</p>${(B.defectos || []).map(d => `<div class="evitar"><h3>${e(d.nombre)} · Categoría ${d.cat} · ${e(d.eq)}</h3>${d.img ? figuraPDF(d.img, d.pie || d.nombre) : ""}<p><strong>Se ve:</strong> ${e(d.seVe)}</p><p><strong>Causa:</strong> ${e(d.causa)}</p><p><strong>En taza:</strong> ${e(d.taza)}</p><p><strong>Prevenir:</strong> ${e(d.prevenir)}</p></div>`).join("")}</div></article>`, "Guia de defectos del cafe verde.pdf", "Defectos del café verde");
})();
