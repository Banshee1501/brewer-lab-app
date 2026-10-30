/* Brewer Lab · IA con fotos: análisis con la API de Claude usando la clave de cada persona */
(() => {
"use strict";
const B = window.BL, U = B.U, S = B.Store;
const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.135.0/+esm";
const MODELO = "claude-opus-5-5";
let cliente = null, claveCliente = null, procesando = false;

const IA = B.IA = { MODELO };
/* La IA corre en el servidor (Firebase Functions); se activa cuando esté desplegada */
IA.disponible = () => !!(B.Nube && B.Nube.iaLista);

IA.cliente = async () => {
  const clave = S.ia && S.ia.api_key;
  if (!clave) throw { code: "sin_clave" };
  if (!navigator.onLine) throw { code: "sin_red" };
  if (cliente && claveCliente === clave) return cliente;
  const mod = await import(SDK_URL);
  const Anthropic = mod.default || mod.Anthropic;
  cliente = new Anthropic({ apiKey: clave, dangerouslyAllowBrowser: true });
  claveCliente = clave;
  return cliente;
};

/* Verifica la clave sin gastar tokens (Models API) */
IA.probar = async () => { const c = await IA.cliente(); const m = await c.models.retrieve(MODELO); return m && m.id; };

IA.mensajeError = err => {
  const c = err && err.code; const st = err && err.status;
  if (c === "sin_clave") return "Falta tu clave de API: agrégala en Ajustes.";
  if (c === "sin_red" || (err && err.name === "APIConnectionError")) return "Sin conexión: el análisis quedó en cola y se hará al volver internet.";
  if (c === "rechazo") return "Claude no pudo analizar esta imagen por sus políticas de seguridad. Prueba con otra foto.";
  if (c === "formato" || c === "corte") return "La respuesta llegó incompleta. Intenta de nuevo.";
  if (c === "sin_fotos") return "Este diagnóstico no tiene fotos en este dispositivo.";
  if (err instanceof TypeError) return "No pude conectar con el servicio de IA. Revisa tu conexión e intenta de nuevo.";
  if (st === 401) return "La clave de API no es válida. Revísala en Ajustes.";
  if (st === 403) return "Tu clave no tiene permiso para este modelo.";
  if (st === 429) return "Llegaste al límite de uso de tu cuenta de API. Espera un momento o revisa tu saldo.";
  if (st === 400) return "La solicitud fue rechazada: " + ((err && err.message) || "revisa la foto.");
  if (st >= 500) return "El servicio de Claude no respondió. Intenta en unos minutos.";
  return "No se pudo completar el análisis.";
};

const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: ["calidad_foto", "que_veo", "diagnostico_principal", "confianza", "hallazgos", "diferenciales", "recomendaciones", "confirmar", "urgencia", "advertencias"],
  properties: {
    calidad_foto: { type: "string", enum: ["buena", "aceptable", "insuficiente"] },
    que_veo: { type: "string" },
    diagnostico_principal: { type: "string" },
    confianza: { type: "string", enum: ["alta", "media", "baja"] },
    hallazgos: { type: "array", items: { type: "object", additionalProperties: false, required: ["nombre", "evidencia", "severidad"], properties: { nombre: { type: "string" }, evidencia: { type: "string" }, severidad: { type: "string", enum: ["leve", "moderada", "severa", "no aplica"] } } } },
    diferenciales: { type: "array", items: { type: "string" } },
    recomendaciones: { type: "array", items: { type: "string" } },
    confirmar: { type: "array", items: { type: "string" } },
    urgencia: { type: "string", enum: ["ninguna", "baja", "media", "alta"] },
    advertencias: { type: "string" }
  }
};

const SISTEMA = `Eres un agrónomo especialista en café arábica y un evaluador de calidad formado en el sistema de evaluación del SCA (CVA). Ayudas a consultores, productores y baristas a interpretar fotos tomadas en campo, en el beneficio o en la mesa de cata.

Responde siempre en español, con lenguaje claro para un productor.

Basa tu análisis solo en lo que se ve en las fotos y en el contexto que te den. Si algo no se puede determinar con certeza por foto, dilo y baja la confianza. No inventes conteos exactos: da estimaciones con rangos. Si la foto no sirve para el análisis pedido, marca la calidad como "insuficiente" y explica cómo repetirla.

Para enfermedades y plagas, usa los síntomas característicos: roya (manchas amarillas en el haz y polvo anaranjado en el envés), ojo de gallo (manchas circulares claras), mancha de hierro (manchas pardas con halo amarillo, también en frutos), antracnosis, mal rosado (costra rosada en ramas), minador (galerías secas), broca (orificio en la corona del fruto). Para deficiencias, considera la edad de la hoja afectada y el patrón (N en hojas viejas; Mg internerval en hojas viejas; K en bordes; Fe, Mn y Zn en hojas jóvenes; B en brotes deformes).

Las recomendaciones deben ser prácticas y seguras. No indiques productos comerciales ni dosis de agroquímicos: remite a la recomendación técnica local y a la etiqueta. Nunca afirmes la variedad de una planta o grano como un hecho: la variedad solo se confirma con prueba genética.`;

const blobB64 = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });

/* Analiza las fotos de un diagnóstico y devuelve el resultado estructurado */
IA.analizar = async (tipoId, blobs, contexto) => {
  const tipo = (B.tiposDiagnostico || []).find(t => t.id === tipoId) || B.tiposDiagnostico[0];
  const c = await IA.cliente();
  const imgs = await Promise.all(blobs.map(blobB64));
  const texto = `Análisis pedido: ${tipo.nombre}.\nEn qué fijarte: ${tipo.foco}\n\nContexto del usuario (puede estar vacío): ${contexto || "sin contexto"}\n\nAnaliza ${imgs.length === 1 ? "la foto" : `las ${imgs.length} fotos`} y llena todos los campos del formato.`;
  const resp = await c.beta.messages.create({
    model: MODELO,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema: ESQUEMA } },
    system: SISTEMA,
    messages: [{ role: "user", content: [...imgs.map(data => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data } })), { type: "text", text: texto }] }]
  });
  if (resp.stop_reason === "refusal") throw { code: "rechazo" };
  if (resp.stop_reason === "max_tokens") throw { code: "corte" };
  const txt = (resp.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  let resultado; try { resultado = JSON.parse(txt); } catch (e) { throw { code: "formato" }; }
  return { resultado, modelo: resp.model || MODELO };
};

/* Resumen ejecutivo del informe de finca */
IA.resumen = async prompt => {
  const c = await IA.cliente();
  const resp = await c.beta.messages.create({
    model: MODELO,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    messages: [{ role: "user", content: prompt }]
  });
  if (resp.stop_reason === "refusal") throw { code: "rechazo" };
  return (resp.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
};

/* Contexto de campo que acompaña a las fotos */
const contextoDe = g => {
  const f = g.finca_id && S.buscar("fincas", g.finca_id);
  const alt = f && [f.altitud_min, f.altitud_max].filter(x => U.num(x) !== null).join("–");
  return [
    g.notas,
    f && `Finca: ${f.nombre || ""}${alt ? `, altitud ${alt} m` : ""}${U.lista(f && f.variedades).length ? `, variedades sembradas: ${U.lista(f.variedades).join(", ")}` : ""}${[f.municipio, f.region, f.pais].filter(Boolean).length ? `, ${[f.municipio, f.region, f.pais].filter(Boolean).join(", ")}` : ""}`,
    g.lote && `Lote o parcela: ${g.lote}`
  ].filter(Boolean).join("\n");
};

/* Analiza un diagnóstico guardado y lo actualiza. Devuelve true si lo analizó. */
const enCurso = new Set();
IA.analizando = id => enCurso.has(id);
IA.analizarRegistro = async id => {
  const g = S.buscar("diagnosticos", id); if (!g || enCurso.has(id)) return false;
  enCurso.add(id);
  try {
    const blobs = [];
    for (const f of (g.fotos || [])) { const ft = await S.foto(f); if (ft && ft.blob) blobs.push(ft.blob); }
    if (!blobs.length) throw { code: "sin_fotos" };
    const out = await IA.analizar(g.tipo, blobs, contextoDe(g));
    const actual = S.buscar("diagnosticos", id); if (!actual) return false;
    await S.guardar("diagnosticos", Object.assign({}, actual, { resultado: out.resultado, modelo: out.modelo, analizado_en: new Date().toISOString(), analisis_pendiente: false }));
    return true;
  } finally { enCurso.delete(id); }
};

/* Al volver la conexión: analiza los diagnósticos que quedaron en cola */
IA.procesarPendientes = async () => {
  if (procesando || !IA.disponible() || !navigator.onLine) return 0;
  const cola = S.d.diagnosticos.filter(g => g.analisis_pendiente && !g.resultado && !enCurso.has(g.id));
  if (!cola.length) return 0;
  procesando = true; let n = 0;
  try {
    for (const g of cola) {
      try { if (await IA.analizarRegistro(g.id)) n++; }
      catch (e) { if (e && ([401, 403, 429].includes(e.status) || ["sin_clave", "sin_red"].includes(e.code) || e.name === "APIConnectionError" || e instanceof TypeError)) break; }
    }
  } finally { procesando = false; }
  return n;
};

/* Comprime una foto de la cámara: lado mayor de 1568 px, JPEG */
IA.comprimir = async file => {
  const MAX = 1568;
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch (e) { bmp = await new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file); }); }
  const w = bmp.width, h = bmp.height, k = Math.min(1, MAX / Math.max(w, h));
  const cv = document.createElement("canvas"); cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
  const blob = await new Promise(res => cv.toBlob(res, "image/jpeg", 0.85));
  return { blob, ancho: cv.width, alto: cv.height };
};
})();
