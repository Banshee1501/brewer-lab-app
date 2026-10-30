/* Brewer Lab · app instalable: fotos con IA, GitHub, ajustes, exportar/importar, instalación y modo sin conexión */
(() => {
"use strict";
const B = window.BL, U = B.U, S = B.Store, AP = B.app, A = AP.A, R = AP.R;
B.VERSION = "2.0.0";
const { e, go, fld, inText, inDate, inSel, inArea, btn, goBtn, fila, vacio, lectura, pill, cabecera, texto, V, dot, ordenarFecha, fechaHora, toggle, accionesDet } = AP.h;
const toast = AP.toast;
const vistas = B.vistas = {};
const tipo = id => B.tiposDiagnostico.find(t => t.id === id) || B.tiposDiagnostico[0];
const urls = new Map();
const analizando = new Set();
let fotosForm = [], fotosNuevas = new Set(), formActual = null, instalarEvt = null, actualizando = false, recargando = false;

async function urlFoto(id) {
  if (urls.has(id)) return urls.get(id);
  const f = await S.foto(id); if (!f || !f.blob) return "";
  const u = URL.createObjectURL(f.blob); urls.set(id, u); return u;
}
function pintarFotos() { document.querySelectorAll("img[data-foto]").forEach(async img => { if (img.getAttribute("src")) return; const u = await urlFoto(img.dataset.foto); if (u) img.src = u; }); }

/* ============================== Diagnóstico con foto ============================== */
vistas.foto = () => {
  if (R.modo === "form") {
    const rec = R.id ? S.buscar("diagnosticos", R.id) : R.borrador;
    const clave = R.id || "nuevo";
    if (formActual !== clave) { formActual = clave; fotosForm = [...((rec && rec.fotos) || [])]; fotosNuevas = new Set(); }
    return fFoto(rec);
  }
  if (R.modo === "ver") { const g = S.buscar("diagnosticos", R.id); return g ? dFoto(g) : vacio("No encontré este diagnóstico", "Puede que se haya eliminado.", goBtn("Volver", { modo: "lista", id: null })); }
  const a = ordenarFecha(S.d.diagnosticos);
  const cola = a.filter(g => g.analisis_pendiente && !g.resultado).length;
  return `<div class="barra"><h2>Diagnóstico con foto</h2>${goBtn("+ Nueva foto", { modo: "form", id: null, borrador: null }, "pri")}</div>
<p class="lede">Fotografía hojas, frutos o granos. La IA sugiere qué ves (enfermedad, plaga, deficiencia, defecto o nivel de tueste) y qué hacer. Sin señal, la foto se guarda y se analiza al volver internet.</p>
${!B.IA.disponible() ? `<div class="aviso suave">El análisis con IA se está preparando. Mientras tanto, guarda tus fotos: quedan listas para analizarlas en cuanto se active.</div>` : ""}
${cola ? `<div class="sync-card"><p><b>${cola}</b> foto${cola === 1 ? "" : "s"} en cola de análisis.</p>${btn("Analizar ahora", "ia-cola", "pri sm", navigator.onLine && B.IA.disponible() ? "" : "disabled")}</div>` : ""}
<div class="tipos">${B.tiposDiagnostico.map(t => `<button type="button" class="tipo-card" data-go="${go({ modo: "form", id: null, borrador: { tipo: t.id } })}"><b>${e(t.nombre)}</b><small>${e(t.ayuda)}</small></button>`).join("")}</div>
${a.length ? `<section class="bloque"><h3>Historial</h3><div class="filas">${a.map(filaDiag).join("")}</div></section>` : ""}`;
};
function filaDiag(g) {
  const r = g.resultado;
  return fila({ titulo: `${g.fecha} · ${tipo(g.tipo).corto} · ${g.titulo || "Foto"}`, meta: r ? r.diagnostico_principal : (g.analisis_pendiente ? "En cola de análisis" : "Sin analizar"),
    der: (r ? pill("confianza " + (r.confianza || "—"), r.urgencia === "alta" ? "bad" : r.urgencia === "media" ? "warn" : "ok") : pill("pendiente", "warn")) + dot(g), obj: { tab: "foto", modo: "ver", id: g.id } });
}
const miniatura = id => `<figure class="mini" data-id="${e(id)}"><img data-foto="${e(id)}" alt="Foto"><button type="button" class="din-x" data-act="foto-quitar" data-id="${e(id)}" aria-label="Quitar foto">×</button></figure>`;
function fFoto(r) {
  r = Object.assign({ fecha: U.hoy(), tipo: "hoja" }, r || {});
  return `<form class="form" id="ffoto" novalidate><h2>${r.id ? "Editar diagnóstico" : "Nuevo diagnóstico con foto"}</h2>
<div class="grid">${fld("Qué vas a fotografiar", inSel("d-tipo", r.tipo, B.tiposDiagnostico.map(t => ({ v: t.id, t: t.nombre })), null), { for: "d-tipo" })}${fld("Fecha", inDate("d-fecha", r.fecha), { for: "d-fecha" })}${fld("Título corto", inText("d-titulo", r.titulo, "Lote 3, hojas bajeras"), { for: "d-titulo" })}</div>
<p class="help" id="d-ayuda">${e(tipo(r.tipo).ayuda)}</p>
<div class="fotos-zona">
<div class="fotos-btns"><label class="btn pri big"><input type="file" id="d-camara" class="vh" accept="image/*" capture="environment">Tomar foto</label><label class="btn big"><input type="file" id="d-galeria" class="vh" accept="image/*" multiple>Elegir de la galería</label></div>
<div class="miniaturas" id="d-mins">${fotosForm.map(miniatura).join("")}</div>
<p class="help">Hasta 3 fotos. Se guardan en este dispositivo aunque no haya señal.</p></div>
<div class="grid">${fld("Finca", inSel("d-finca", r.finca_id, S.d.fincas.map(f => ({ v: f.id, t: f.nombre })), "Ninguna"), { for: "d-finca" })}${fld("Lote o parcela", inText("d-lote", r.lote), { for: "d-lote" })}${fld("Café", inSel("d-cafe", r.cafe_id, S.d.cafes.map(c => ({ v: c.id, t: c.nombre })), "Ninguno"), { for: "d-cafe" })}</div>
${fld("Notas de campo", inArea("d-notas", r.notas, 3, "Altitud, variedad, síntomas, desde cuándo, clima…"), { for: "d-notas", help: "Este contexto ayuda a la IA a acertar." })}
<div class="form-acc">${btn("Guardar y analizar", "guardar-foto", "pri", 'data-analizar="1"')}${btn("Solo guardar", "guardar-foto")}${btn("Cancelar", "cancelar", "ghost")}</div></form>`;
}
function dFoto(g) {
  const t = tipo(g.tipo), r = g.resultado; const finca = g.finca_id && S.buscar("fincas", g.finca_id);
  const enProceso = analizando.has(g.id) || B.IA.analizando(g.id);
  const accion = enProceso ?`<div class="sync-card analizando"><div class="taza" aria-hidden="true"></div><p>Analizando con IA… suele tardar entre 10 y 60 segundos.</p></div>`
    : r ? resultadoHTML(r) : `<div class="sync-card"><p>${g.analisis_pendiente ? "En cola: se analizará automáticamente cuando haya internet." : "Aún sin analizar."}</p>${btn("Analizar con IA", "ia-uno", "pri", B.IA.disponible() && navigator.onLine ? "" : "disabled")}${!B.IA.disponible() ? `<p class="help">El análisis con IA se activará pronto.</p>` : ""}</div>`;
  return cabecera("Diagnóstico con foto · " + t.nombre, g.titulo || "Foto", [g.fecha, finca && finca.nombre, g.lote].filter(Boolean).join(" · "), g) +
    `<div class="galeria">${(g.fotos || []).map(id => `<img data-foto="${e(id)}" alt="Foto del diagnóstico">`).join("")}</div>${accion}${texto("Notas de campo", g.notas)}
<div class="aviso suave">Orientativo: confírmalo en campo o en laboratorio antes de decidir, sobre todo si implica agroquímicos.</div>${accionesDet(r && !enProceso ? btn("Volver a analizar", "ia-uno", "", B.IA.disponible() && navigator.onLine ? "" : "disabled") : "")}`;
}
function resultadoHTML(r) {
  const urg = r.urgencia === "alta" ? "bad" : r.urgencia === "media" ? "warn" : "ok";
  return `<section class="resultado"><div class="diag-principal"><p class="eyebrow">Diagnóstico principal</p><h3>${e(r.diagnostico_principal)}</h3><div class="chips-est">${pill("Confianza " + (r.confianza || "—"), r.confianza === "alta" ? "ok" : r.confianza === "media" ? "warn" : "bad")}${pill("Urgencia " + (r.urgencia || "—"), urg)}${pill("Foto " + (r.calidad_foto || "—"), r.calidad_foto === "insuficiente" ? "bad" : "")}</div></div>
<p>${e(r.que_veo)}</p>
${(r.hallazgos || []).length ? `<div class="tabla"><table><thead><tr><th>Hallazgo</th><th>Severidad</th><th>Evidencia</th></tr></thead><tbody>${r.hallazgos.map(h => `<tr><td><b>${e(h.nombre)}</b></td><td>${e(h.severidad)}</td><td>${e(h.evidencia)}</td></tr>`).join("")}</tbody></table></div>` : ""}
${(r.diferenciales || []).length ? `<p><b>Otras posibilidades:</b> ${e(r.diferenciales.join("; "))}</p>` : ""}
<div class="dos"><div><h3>Qué hacer</h3><ul>${(r.recomendaciones || []).map(x => `<li>${e(x)}</li>`).join("")}</ul></div><div><h3>Qué confirmar</h3><ul>${(r.confirmar || []).map(x => `<li>${e(x)}</li>`).join("")}</ul></div></div>
${r.advertencias ? `<p class="help">${e(r.advertencias)}</p>` : ""}</section>`;
}
async function agregarFotos(files) {
  const lista = Array.from(files || []).slice(0, Math.max(0, 3 - fotosForm.length));
  if (!lista.length) { if (fotosForm.length >= 3) toast("Máximo 3 fotos por diagnóstico.", "warn"); return; }
  for (const file of lista) {
    try {
      const c = await B.IA.comprimir(file); const id = U.nuevoId();
      await S.guardarFoto({ id, blob: c.blob, ancho: c.ancho, alto: c.alto, creado: new Date().toISOString() });
      fotosForm.push(id); fotosNuevas.add(id);
      const box = document.getElementById("d-mins"); if (box) box.insertAdjacentHTML("beforeend", miniatura(id));
    } catch (err) { console.error(err); toast("No se pudo leer esa foto.", "warn"); }
  }
  pintarFotos();
}
async function analizarYMostrar(id) {
  if (!B.IA.disponible()) { toast("Guardado ✔ Se analizará cuando se active la IA.", "ok"); return; }
  if (!navigator.onLine) { toast("Guardado sin conexión. Se analizará al volver internet."); return; }
  if (analizando.has(id) || B.IA.analizando(id)) return;
  analizando.add(id); AP.render();
  try { if (await B.IA.analizarRegistro(id)) toast("Análisis listo ✔"); }
  catch (x) { console.error(x); toast(B.IA.mensajeError(x), "warn"); }
  finally { analizando.delete(id); AP.render(); }
}
A["guardar-foto"] = async t => {
  const base = R.id ? Object.assign({}, S.buscar("diagnosticos", R.id)) : Object.assign({}, R.borrador || {});
  if (!R.id) delete base.id;
  const fotos = [...fotosForm];
  if (!fotos.length) { toast("Toma al menos una foto.", "warn"); return; }
  const cambiaron = (base.fotos || []).join() !== fotos.join() || (base.tipo && base.tipo !== V.t("d-tipo"));
  const analizar = t.dataset.analizar === "1";
  const rec = Object.assign(base, { tipo: V.t("d-tipo"), fecha: V.t("d-fecha") || U.hoy(), titulo: V.t("d-titulo"), finca_id: V.t("d-finca"), lote: V.t("d-lote"), cafe_id: V.t("d-cafe"), notas: V.t("d-notas"), fotos });
  if (cambiaron) rec.resultado = null;
  rec.analisis_pendiente = analizar || (!!base.analisis_pendiente && !rec.resultado);
  t.disabled = true;
  try {
    const id = await S.guardar("diagnosticos", rec);
    for (const f of fotos) await S.marcarFoto(f, { diag_id: id });
    for (const f of (base.fotos || [])) if (!fotos.includes(f)) { try { await S.borrarFoto(f); } catch (x) { /* sin foto */ } }
    fotosNuevas = new Set(); formActual = null; R.borrador = null;
    AP.ir({ modo: "ver", id });
    if (analizar) analizarYMostrar(id);
  } catch (x) { console.error(x); toast("No se pudo guardar.", "bad"); t.disabled = false; }
};
A["foto-quitar"] = async t => {
  const id = t.dataset.id; fotosForm = fotosForm.filter(x => x !== id);
  const fig = t.closest(".mini"); if (fig) fig.remove();
  if (fotosNuevas.has(id)) { fotosNuevas.delete(id); try { await S.borrarFoto(id); } catch (x) { /* nada */ } }
};
A["ia-uno"] = () => { if (R.id) analizarYMostrar(R.id); };
A["ia-cola"] = async t => { t.disabled = true; const n = await B.IA.procesarPendientes(); toast(n ? `${n} análisis listo${n === 1 ? "" : "s"} ✔` : "No se pudo analizar la cola ahora.", n ? "ok" : "warn"); AP.render(); };
const cancelarBase = A.cancelar;
A.cancelar = async t => {
  if (R.tab === "foto" && fotosNuevas.size) { for (const id of fotosNuevas) { try { await S.borrarFoto(id); } catch (x) { /* nada */ } } }
  fotosNuevas = new Set(); formActual = null;
  return cancelarBase(t);
};

/* ============================== Informe: IA, PDF e impresión ============================== */
A.ia = async t => {
  if (!B.IA.disponible()) { toast("La IA para resúmenes se activará pronto.", "warn"); return; }
  if (!navigator.onLine) { toast("Necesitas internet para usar la IA.", "warn"); return; }
  const c = AP.ctxInforme(); if (!c) return;
  const ta = document.getElementById("inf-resumen"); const previo = ta.value;
  const an = B.Informe.analisis(c.visita);
  const datos = { finca: { nombre: c.finca.nombre, productor: c.finca.productor, region: [c.finca.municipio, c.finca.region, c.finca.pais].filter(Boolean).join(", "), hectareas_cafe: c.finca.area_cafe_ha, variedades: U.lista(c.finca.variedades) }, fecha_visita: c.visita.fecha, indice_0_100: an.indice, areas: B.areas.map(a => ({ area: a.nombre, puntaje_1_5: U.num(c.visita["s_" + a.key]), hallazgo: (c.visita.hallazgos || {})[a.key] || "" })), mediciones: Object.fromEntries(B.metas.map(m => [m.nombre, U.num(c.visita[m.key]) === null ? null : `${c.visita[m.key]} ${m.unidad} (meta: ${m.meta})`])), borrador_actual: previo };
  const prompt = `Eres un consultor experto en café de especialidad y redactas informes para productores. Escribe en español un resumen ejecutivo de 130 a 180 palabras para el productor de esta finca. Reglas: usa solo los datos de abajo y no inventes cifras ni hechos; empieza reconociendo las fortalezas; luego explica las 3 prioridades principales con lenguaje claro, respetuoso y motivador; menciona el índice de la finca; termina con una frase sobre el plan de acción. Dos párrafos, sin títulos, sin viñetas y sin formato Markdown.\n\nDATOS DE LA VISITA (JSON):\n${JSON.stringify(datos)}`;
  t.disabled = true; ta.value = "Pensando…";
  try { ta.value = await B.IA.resumen(prompt); }
  catch (x) { ta.value = previo; toast(B.IA.mensajeError(x), "warn"); }
  finally { t.disabled = false; AP.actualizarPrev(); }
};
A["pdf-compartir"] = async t => {
  const c = AP.ctxInforme(); if (!c) return; const inf = AP.infDesdeForm(c.inf);
  const txt = t.textContent; t.disabled = true; t.textContent = "Generando PDF…";
  try { const blob = await B.Informe.pdf(inf, c); await AP.compartir(AP.nombreArchivo(c, "pdf"), blob, "Informe de diagnóstico"); }
  catch (x) { toast("No se pudo generar el PDF aquí. Usa “Imprimir” y elige “Guardar como PDF”.", "warn"); }
  finally { t.disabled = false; t.textContent = txt; }
};
A.imprimir = () => { try { window.print(); } catch (x) { toast("Este dispositivo no permite imprimir desde la app.", "warn"); } };

/* ============================== Tu nube ============================== */
vistas.sync = () => {
  const pend = S.COLS.flatMap(c => S.d[c].filter(x => x.sync === "pendiente"));
  const correo = B.Nube && B.Nube.correo ? B.Nube.correo() : "";
  const total = S.COLS.reduce((n, c) => n + S.d[c].length, 0);
  return `<section class="sync"><p class="eyebrow">Tu cuenta</p><h2>Tus datos en la nube</h2>
<p class="lede">Todo lo que guardas se sube solo a tu cuenta${correo ? ` (${e(correo)})` : ""}. Sin señal, queda en el teléfono y se sube al volver la conexión.</p>
<div class="sync-card"><div class="lecturas">${lectura("Conexión", navigator.onLine ? pill("En línea", "ok") : pill("Sin conexión", "warn"))}${lectura("Por subir", pend.length)}${lectura("Registros", total)}</div>
<p>${pend.length ? `${pend.length} cambio${pend.length === 1 ? "" : "s"} esperando conexión.` : "Todo está guardado en tu cuenta ✔"}</p></div></section>`;
};

/* ============================== Ajustes y cuenta ============================== */
vistas.ajustes = () => {
  const a = S.ajustes || {};
  const N = B.Nube; const perfil = (N && N.perfil) || {};
  const productor = perfil.rol === "productor";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const instalada = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  return `<h2>Ajustes</h2>
<section class="bloque cuenta"><div class="panel-h"><h3>Tu cuenta</h3>${N && N.usuario ? btn("Cerrar sesión", "salir", "sm") : ""}</div>
<div class="lecturas">${lectura("Correo", e(N && N.correo ? N.correo() || "—" : "—"))}${lectura("Entras con", e(N && N.proveedor && N.usuario ? N.proveedor() : "—"))}${lectura("Perfil", productor ? "Productor" : "Barista y consultor")}</div></section>
<form class="form" id="faj" novalidate><h3>Tu perfil</h3><p class="help">Tu nombre aparece en tus registros${productor ? "" : ". La marca y la firma aparecen en tus informes y reportes"}.</p>
<div class="grid">${fld("Tu nombre", inText("aj-consultor", a.consultor), { for: "aj-consultor" })}${productor ? "" : fld("Marca", inText("aj-marca", a.marca, "Ej. Selah Coffee"), { for: "aj-marca" }) + fld("Cargo o título", inText("aj-cargo", a.cargo, "Consultor de calidad"), { for: "aj-cargo" })}${fld("Contacto", inText("aj-contacto", a.contacto, "Correo o teléfono"), { for: "aj-contacto" })}${fld("Ciudad o país", inText("aj-ubicacion", a.ubicacion), { for: "aj-ubicacion" })}</div>
${productor ? "" : fld("Nota al pie de los informes", inArea("aj-nota", a.nota_informe, 2), { for: "aj-nota" })}
<div class="form-acc static">${btn("Guardar perfil", "guardar-perfil", "pri")}</div></form>
${productor ? "" : `<section class="bloque"><h3>Compartir datos</h3><p class="help">Pasa registros a otra persona en un archivo, o importa los que te envíen.</p>
<div class="grid">${fld("Qué exportar", inSel("exp-finca", "", S.d.fincas.map(f => ({ v: f.id, t: "Solo la finca " + f.nombre })), "Todo"), { for: "exp-finca" })}</div>
<div class="det-acc">${btn("Exportar y compartir", "exportar", "pri")}<label class="btn"><input type="file" id="imp-archivo" class="vh" accept=".json,application/json">Importar archivo</label></div></section>`}
<section class="bloque"><h3>Instalar la app</h3>${instalada ? `<p>${pill("Instalada", "ok")} Ya la estás usando como app.</p>` : instalarEvt ? `<p>Instálala para abrirla desde tu pantalla de inicio y usarla sin señal.</p>${btn("Instalar Brewer Lab", "instalar", "pri")}` : ios ? `<ol><li>Abre este link en <b>Safari</b>.</li><li>Toca <b>Compartir</b> (el cuadrado con flecha).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li></ol>` : `<ol><li>En Chrome toca el menú <b>⋮</b>.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</li></ol>`}</section>
<section class="bloque"><h3>Este dispositivo</h3><p class="help">Tus datos viven en tu cuenta. Este teléfono guarda una copia para que la app funcione sin señal.</p><p class="help">Brewer Lab · versión ${e(B.VERSION || "")}</p></section>`;
};
A["guardar-perfil"] = async t => {
  t.disabled = true;
  try { await S.guardarConfig("ajustes", Object.assign({}, S.ajustes, { consultor: V.t("aj-consultor"), marca: V.t("aj-marca") || (S.ajustes || {}).marca, cargo: V.t("aj-cargo") || (S.ajustes || {}).cargo, contacto: V.t("aj-contacto"), ubicacion: V.t("aj-ubicacion"), nota_informe: V.t("aj-nota") || (S.ajustes || {}).nota_informe })); toast("Perfil guardado ✔"); }
  catch (x) { toast("No se pudo guardar.", "bad"); }
  t.disabled = false;
};
A.salir = async t => { if (t) t.disabled = true; if (B.Nube && B.Nube.salir) await B.Nube.salir(); };
A.instalar = async () => { if (!instalarEvt) return; instalarEvt.prompt(); try { await instalarEvt.userChoice; } catch (x) { /* nada */ } instalarEvt = null; AP.render(); };
A["borrar-todo"] = t => {
  if (t.dataset.confirmar !== "1") { t.dataset.confirmar = "1"; t.textContent = "Toca otra vez: se borrará TODO lo que no hayas sincronizado"; setTimeout(() => { if (t.isConnected) { t.dataset.confirmar = ""; t.textContent = "Borrar todos los datos de este dispositivo"; } }, 5000); return; }
  try { if (B.IDB.db) B.IDB.db.close(); const rq = indexedDB.deleteDatabase("brewerlab"); rq.onsuccess = rq.onerror = rq.onblocked = () => location.reload(); } catch (x) { location.reload(); }
};

/* ============================== Exportar / importar ============================== */
const blobB64 = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });
const b64Blob = (b64, tipoMime) => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: tipoMime }); };
A.exportar = async t => {
  const fid = V.t("exp-finca");
  let regs = S.COLS.flatMap(c => S.d[c]);
  if (fid) regs = regs.filter(r => (r.col === "fincas" && r.id === fid) || r.finca_id === fid);
  t.disabled = true;
  try {
    const ids = new Set(regs.filter(r => r.col === "diagnosticos").flatMap(r => r.fotos || []));
    const fotos = [];
    for (const id of ids) { const f = await S.foto(id); if (f && f.blob) fotos.push({ id, b64: await blobB64(f.blob), ancho: f.ancho, alto: f.alto, diag_id: f.diag_id }); }
    const limpio = regs.map(r => { const x = Object.assign({}, r); delete x.gh_sha; delete x.obsidian; delete x.hash_sync; return x; });
    const datos = JSON.stringify({ app: "brewer-lab", version: 1, exportado: new Date().toISOString(), autor: (S.ajustes || {}).consultor || "", registros: limpio, fotos });
    const finca = fid && S.buscar("fincas", fid);
    await AP.compartir(`Brewer Lab ${finca ? U.nombreNota(finca.nombre) : "datos"} ${U.hoy()}.json`, datos, "Datos de Brewer Lab");
  } catch (x) { console.error(x); toast("No se pudo exportar.", "bad"); }
  t.disabled = false;
};
async function importarArchivo(file) {
  try {
    const d = JSON.parse(await file.text());
    if (!d || d.app !== "brewer-lab" || !Array.isArray(d.registros)) { toast("Ese archivo no es una exportación de Brewer Lab.", "warn"); return; }
    for (const f of (d.fotos || [])) { if (!(await S.foto(f.id))) await S.guardarFoto({ id: f.id, blob: b64Blob(f.b64, "image/jpeg"), ancho: f.ancho, alto: f.alto, diag_id: f.diag_id, creado: new Date().toISOString() }); }
    const n = await S.importar(d.registros);
    toast(`Importados ${n} registro${n === 1 ? "" : "s"}${d.autor ? " de " + d.autor : ""} ✔`);
    AP.render();
  } catch (x) { console.error(x); toast("No se pudo leer el archivo.", "bad"); }
}

/* ============================== Eventos propios ============================== */
document.addEventListener("change", ev => {
  const el = ev.target; if (!el || !el.id) return;
  if (el.id === "d-camara" || el.id === "d-galeria") { agregarFotos(el.files); el.value = ""; }
  if (el.id === "d-tipo") { const p = document.getElementById("d-ayuda"); if (p) p.textContent = tipo(el.value).ayuda; }
  if (el.id === "pref-auto") S.guardarConfig("prefs", Object.assign({}, S.prefs, { auto_sync: el.checked })).then(() => { if (el.checked) B.Sync.programar(500); });
  if (el.id === "imp-archivo" && el.files && el.files[0]) { importarArchivo(el.files[0]); el.value = ""; }
});
function pintarRed() {
  const el = document.getElementById("estado-red"); if (!el) return;
  const on = navigator.onLine;
  el.className = "red " + (on ? "on" : "off"); el.title = on ? "En línea" : "Sin conexión";
  const t = el.querySelector(".txt"); if (t) t.textContent = on ? "En línea" : "Sin conexión";
}
vistas.despues = r => {
  pintarFotos(); pintarRed();
  if (r.modo !== "form" || r.tab !== "foto") {
    /* Fotos tomadas en un formulario que se abandonó sin guardar */
    for (const id of fotosNuevas) S.borrarFoto(id).catch(() => {});
    fotosNuevas = new Set(); formActual = null;
  }
  if (r.tab === "sync") S.fotos().then(fs => { const el = document.getElementById("fotos-pend"); if (el) el.textContent = fs.filter(f => f.sync !== "sincronizado").length; });
  const bi = document.getElementById("btn-instalar"); if (bi) bi.hidden = !instalarEvt;
};
window.addEventListener("online", pintarRed);
window.addEventListener("offline", pintarRed);

/* El PDF se arma con html2pdf, que se carga solo cuando hace falta */
const HTML2PDF = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
const cargarScript = src => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous"; s.onload = res; s.onerror = () => { s.remove(); rej(new Error("sin " + src)); }; document.head.appendChild(s); });
const pdfBase = B.Informe.pdf;
B.Informe.pdf = async (inf, ctx) => { if (typeof window.html2pdf !== "function") await cargarScript(HTML2PDF); return pdfBase(inf, ctx); };

/* ============================== Instalación y modo sin conexión ============================== */
window.addEventListener("beforeinstallprompt", ev => { ev.preventDefault(); instalarEvt = ev; const bi = document.getElementById("btn-instalar"); if (bi) bi.hidden = false; });
window.addEventListener("appinstalled", () => { instalarEvt = null; toast("Brewer Lab instalada ✔"); AP.render(); });
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./sw.js");
      const avisar = sw => {
        const box = document.getElementById("toasts"); if (!box) return;
        const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status");
        t.innerHTML = 'Hay una versión nueva de Brewer Lab. <button type="button" class="btn sm">Actualizar</button>';
        t.querySelector("button").addEventListener("click", ev => { ev.currentTarget.disabled = true; actualizando = true; sw.postMessage({ tipo: "activar" }); });
        box.appendChild(t);
      };
      if (reg.waiting && navigator.serviceWorker.controller) avisar(reg.waiting);
      reg.addEventListener("updatefound", () => { const nw = reg.installing; if (nw) nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) avisar(nw); }); });
    } catch (x) { console.warn("Sin modo offline:", x); }
  });
  /* Recarga solo cuando la persona acepta una actualización, no la primera vez que se instala */
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (!actualizando || recargando) return; recargando = true; location.reload(); });
}
/* Al abrir con internet: análisis en cola y sincronización */
const alArrancar = () => { pintarRed(); if (navigator.onLine) { B.IA.procesarPendientes().catch(() => {}); B.Sync.programar(2500); } };
if (S.listo) { AP.render(); alArrancar(); }
else { let hecho = false; S.on(() => { if (hecho || !S.listo) return; hecho = true; alArrancar(); }); }
pintarRed();
})();
