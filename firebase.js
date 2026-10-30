/* Brewer Lab · cuentas y nube (Firebase): inicio de sesión, perfiles, fincas compartidas y datos sin conexión */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const B = window.BL, S = B.Store, U = B.U;
const app = initializeApp(B.firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "es";
const db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }), ignoreUndefinedProperties: true });

const Nube = B.Nube = { usuario: null, perfil: null, listo: false, iaLista: !!B.iaNube };
const e = U.esc;
const SOLO_LOCAL = ["sync", "gh_sha", "obsidian", "hash_sync", "_ruta", "mi_rol"];
const guardarPerfilLocal = (uid, p) => { try { localStorage.setItem("bl_perfil_" + uid, JSON.stringify(p)); } catch (x) { /* opcional */ } };
const perfilLocal = uid => { try { return JSON.parse(localStorage.getItem("bl_perfil_" + uid) || "null"); } catch (x) { return null; } };
const BREWER = ["cafes", "preparaciones", "recetas", "experimentos", "catas", "manuales"];
let desuscribir = [];
const subsFinca = new Map();
const datos = { propios: new Map(), fincas: new Map(), deFinca: new Map() };

/* ============================== Pantalla de acceso ============================== */
const caja = () => document.getElementById("acceso");
const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="10" ry="14" transform="rotate(30 16 16)" fill="#20232A"/><path d="M11 6.5c5 4 1 11 9 19" stroke="#FBEBC9" stroke-width="2.4" fill="none" stroke-linecap="round" transform="rotate(30 16 16) translate(1 0)"/></svg>`;
const G = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;
let modoAcceso = "entrar";
function mostrarAcceso(html) { const c = caja(); if (!c) return; c.innerHTML = html; c.hidden = false; document.body.classList.add("con-acceso"); }
function ocultarAcceso() { const c = caja(); if (c) { c.hidden = true; c.innerHTML = ""; } document.body.classList.remove("con-acceso"); }
const errorAuth = err => ({
  "auth/invalid-credential": "Correo o contraseña incorrectos.", "auth/wrong-password": "Correo o contraseña incorrectos.", "auth/user-not-found": "No hay una cuenta con ese correo.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Entra con tu contraseña o con Google.", "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email": "Ese correo no es válido.", "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.", "auth/network-request-failed": "Sin conexión. Conéctate para entrar la primera vez.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.", "auth/cancelled-popup-request": "Cerraste la ventana de Google antes de terminar."
}[err && err.code] || "No se pudo completar. Inténtalo otra vez.");

function vistaEntrar(msg = "", tipo = "") {
  const reg = modoAcceso === "registro";
  mostrarAcceso(`<div class="acc-card">
<div class="acc-marca">${LOGO}<b>Brewer Lab</b></div>
<p class="eyebrow">Café de especialidad · Honduras</p>
<h1>${reg ? "Crea tu cuenta" : "Bienvenido de vuelta"}</h1>
<p class="lede">${reg ? "Tu laboratorio de café y de fincas, en todos tus dispositivos." : "Entra para ver tu laboratorio, tus fincas y tus informes."}</p>
<button type="button" class="btn big acc-google" data-acc="google">${G}<span>Continuar con Google</span></button>
<div class="acc-o"><span>o con tu correo</span></div>
<form class="acc-form" id="acc-form" novalidate>
${reg ? `<label class="fld"><span>Tu nombre</span><input id="acc-nombre" type="text" autocomplete="name" required></label>` : ""}
<label class="fld"><span>Correo</span><input id="acc-email" type="email" autocomplete="email" inputmode="email" required></label>
<label class="fld"><span>Contraseña</span><input id="acc-pass" type="password" autocomplete="${reg ? "new-password" : "current-password"}" minlength="6" required></label>
<button type="submit" class="btn pri big">${reg ? "Crear cuenta" : "Entrar"}</button>
</form>
${msg ? `<p class="acc-msg ${tipo}" role="status">${e(msg)}</p>` : ""}
<div class="acc-links">${reg ? `<button type="button" class="btn link" data-acc="modo-entrar">Ya tengo cuenta</button>` : `<button type="button" class="btn link" data-acc="modo-registro">Crear una cuenta</button><button type="button" class="btn link" data-acc="olvido">Olvidé mi contraseña</button>`}</div>
</div>`);
}

function vistaRol(user) {
  mostrarAcceso(`<div class="acc-card ancho">
<div class="acc-marca">${LOGO}<b>Brewer Lab</b></div>
<p class="eyebrow">Hola, ${e((user.displayName || user.email || "").split(" ")[0])}</p>
<h1>¿Cómo vas a usar la app?</h1>
<div class="acc-roles">
<button type="button" class="rol-card brewer" data-acc="rol-consultor"><span class="rol-ic">☕</span><b>Barista o consultor</b><small>Brewer Lab para tus cafés, recetas y catas, y Farmer Lab para asesorar fincas.</small></button>
<button type="button" class="rol-card farmer" data-acc="rol-productor"><span class="rol-ic">🌱</span><b>Productor de café</b><small>Ve el diagnóstico de tu finca, sube fotos, mide la sombra y pregúntale a Granito.</small></button>
</div></div>`);
}

function vistaUnirse(msg = "", tipo = "") {
  mostrarAcceso(`<div class="acc-card">
<div class="acc-marca">${LOGO}<b>Farmer Lab</b></div>
<h1>Conecta tu finca</h1>
<p class="lede">Si tu consultor te dio un código, escríbelo aquí. Si no, registra tu finca y compártele tu código después.</p>
<form class="acc-form" id="acc-codigo" novalidate>
<label class="fld"><span>Código de invitación</span><input id="acc-cod" type="text" autocomplete="off" autocapitalize="characters" maxlength="8" placeholder="Ej. K7Q2MX"></label>
<button type="submit" class="btn pri big">Unirme a la finca</button>
</form>
<div class="acc-o"><span>o</span></div>
<form class="acc-form" id="acc-nueva" novalidate>
<label class="fld"><span>Nombre de tu finca</span><input id="acc-finca" type="text" autocomplete="off" placeholder="Ej. Finca La Esperanza"></label>
<button type="submit" class="btn big">Registrar mi finca</button>
</form>
${msg ? `<p class="acc-msg ${tipo}" role="status">${e(msg)}</p>` : ""}
<div class="acc-links"><button type="button" class="btn link" data-acc="salir">Cerrar sesión</button></div>
</div>`);
}

async function entrarGoogle() {
  const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
  try { await signInWithPopup(auth, p); }
  catch (err) {
    if (err && (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment")) { await signInWithRedirect(auth, p); return; }
    vistaEntrar(errorAuth(err), "bad");
  }
}

document.addEventListener("click", async ev => {
  const t = ev.target.closest("[data-acc]"); if (!t) return;
  const a = t.dataset.acc;
  if (a === "google") entrarGoogle();
  if (a === "modo-registro") { modoAcceso = "registro"; vistaEntrar(); }
  if (a === "modo-entrar") { modoAcceso = "entrar"; vistaEntrar(); }
  if (a === "olvido") {
    const correo = (document.getElementById("acc-email") || {}).value || "";
    if (!correo.trim()) { vistaEntrar("Escribe tu correo arriba y vuelve a tocar «Olvidé mi contraseña».", "warn"); return; }
    try { await sendPasswordResetEmail(auth, correo.trim()); vistaEntrar("Te enviamos un correo para crear una contraseña nueva.", "ok"); } catch (err) { vistaEntrar(errorAuth(err), "bad"); }
  }
  if (a === "rol-consultor" || a === "rol-productor") {
    t.disabled = true;
    await crearPerfil(a === "rol-consultor" ? "consultor" : "productor");
  }
  if (a === "salir") Nube.salir();
});
document.addEventListener("submit", async ev => {
  const f = ev.target;
  if (f.id === "acc-form") {
    ev.preventDefault();
    const correo = document.getElementById("acc-email").value.trim(), pass = document.getElementById("acc-pass").value;
    const nombreEl = document.getElementById("acc-nombre");
    const btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Un momento…";
    try {
      if (modoAcceso === "registro") {
        const cred = await createUserWithEmailAndPassword(auth, correo, pass);
        if (nombreEl && nombreEl.value.trim()) await updateProfile(cred.user, { displayName: nombreEl.value.trim() });
        try { await sendEmailVerification(cred.user); } catch (x) { /* opcional */ }
      } else await signInWithEmailAndPassword(auth, correo, pass);
    } catch (err) { vistaEntrar(errorAuth(err), "bad"); }
  }
  if (f.id === "acc-codigo") {
    ev.preventDefault();
    const cod = document.getElementById("acc-cod").value.trim().toUpperCase();
    if (!cod) { vistaUnirse("Escribe el código que te dio tu consultor.", "warn"); return; }
    try { await Nube.unirse(cod); ocultarAcceso(); B.app && B.app.toast("¡Listo! Ya estás conectado a tu finca ✔"); }
    catch (err) { vistaUnirse(err && err.message ? err.message : "No se pudo usar ese código.", "bad"); }
  }
  if (f.id === "acc-nueva") {
    ev.preventDefault();
    const nombre = document.getElementById("acc-finca").value.trim();
    if (!nombre) { vistaUnirse("Escribe el nombre de tu finca.", "warn"); return; }
    try { await S.guardar("fincas", { nombre, productor: (Nube.perfil && Nube.perfil.nombre) || "", estado_consultoria: "prospecto" }); ocultarAcceso(); }
    catch (err) { vistaUnirse("No se pudo registrar la finca. Revisa tu conexión.", "bad"); }
  }
});

/* ============================== Perfil ============================== */
async function crearPerfil(rol) {
  const u = Nube.usuario; if (!u) return;
  const perfil = { nombre: u.displayName || (u.email || "").split("@")[0], email: u.email || "", rol, creado: new Date().toISOString(), ajustes: { consultor: u.displayName || "" }, prefs: {} };
  setDoc(doc(db, "usuarios", u.uid), perfil, { merge: true }).catch(err => { console.error(err); B.app && B.app.toast("No se pudo guardar tu perfil en la nube. Se reintentará.", "warn"); });
  guardarPerfilLocal(u.uid, perfil);
  await abrirSesion(u, perfil);
}

async function abrirSesion(u, perfil) {
  Nube.perfil = perfil;
  S.ajustes = Object.assign({ consultor: perfil.nombre }, perfil.ajustes || {});
  S.prefs = Object.assign({}, perfil.prefs || {});
  S.backend = backend;
  S.nube = true;
  try { await B.IDB.abrir(); S.modo = "local"; } catch (x) { S.modo = "memoria"; }
  escuchar(u.uid);
  ocultarAcceso();
  document.body.dataset.rol = perfil.rol;
  if (B.labs && B.labs.alEntrar) B.labs.alEntrar(perfil);
  S.listo = true; S.emit();
  migrarLocal();
  if (perfil.rol === "productor") setTimeout(() => { if (!datos.fincas.size) vistaUnirse(); }, 1800);
}

/* ============================== Datos en la nube ============================== */
function limpiar(r) { const x = {}; for (const [k, v] of Object.entries(r)) { if (!SOLO_LOCAL.includes(k) && v !== undefined) x[k] = v; } return x; }
function rutaDe(col, r) {
  const uid = Nube.usuario.uid;
  if (col === "fincas") return ["fincas", r.id];
  if (B.COLS_FINCA.includes(col) && r.finca_id) return ["fincas", r.finca_id, "registros", r.id];
  return ["usuarios", uid, "registros", r.id];
}
const fallo = err => { console.error(err); if (B.app) B.app.toast(err && err.code === "permission-denied" ? "No tienes permiso para guardar eso." : "No se pudo guardar en la nube. Se reintentará.", "warn"); };
const backend = {
  guardar(col, r) {
    const u = Nube.usuario; if (!u) return;
    const ruta = rutaDe(col, r);
    const previa = r._ruta;
    const dataDoc = limpiar(Object.assign({}, r, { autor_uid: r.autor_uid || u.uid, autor: r.autor || (Nube.perfil && Nube.perfil.nombre) || "" }));
    if (col === "fincas") {
      if (!datos.fincas.has(r.id)) {
        const soyProductor = Nube.perfil && Nube.perfil.rol === "productor";
        dataDoc.consultores = soyProductor ? [] : [u.uid];
        dataDoc.productores = soyProductor ? [u.uid] : [];
      } else { delete dataDoc.consultores; delete dataDoc.productores; delete dataDoc.ultimo_codigo; }
    }
    setDoc(doc(db, ...ruta), dataDoc, { merge: col === "fincas" }).catch(fallo);
    if (previa && previa !== ruta.join("/")) deleteDoc(doc(db, ...previa.split("/"))).catch(() => {});
    if (r.fotos && r.fotos.length) subirFotos(r.fotos, B.COLS_FINCA.includes(col) ? r.finca_id : null);
  },
  borrar(col, r) { if (!Nube.usuario) return; deleteDoc(doc(db, ...(r._ruta ? r._ruta.split("/") : rutaDe(col, r)))).catch(fallo); },
  config(k, v) { if (!Nube.usuario) return; setDoc(doc(db, "usuarios", Nube.usuario.uid), { [k]: v }, { merge: true }).catch(fallo); }
};

let tEmit = null;
function volcar() {
  clearTimeout(tEmit);
  tEmit = setTimeout(() => {
    const porCol = Object.fromEntries(S.COLS.map(c => [c, []]));
    for (const x of datos.propios.values()) if (porCol[x.col]) porCol[x.col].push(x);
    for (const f of datos.fincas.values()) porCol.fincas.push(f);
    for (const m of datos.deFinca.values()) for (const x of m.values()) if (porCol[x.col]) porCol[x.col].push(x);
    S.COLS.forEach(c => { S.d[c] = porCol[c]; });
    S.emit();
  }, 60);
}
const conMeta = (d, ruta) => Object.assign(d.data(), { id: d.id, _ruta: ruta, sync: d.metadata.hasPendingWrites ? "pendiente" : "sincronizado" });

function escuchar(uid) {
  parar();
  desuscribir.push(onSnapshot(collection(db, "usuarios", uid, "registros"), { includeMetadataChanges: true }, snap => {
    datos.propios = new Map(snap.docs.map(d => [d.id, conMeta(d, `usuarios/${uid}/registros/${d.id}`)])); volcar();
  }, err => console.warn("registros", err)));
  const porRol = { consultores: new Map(), productores: new Map() };
  const unir = () => {
    datos.fincas = new Map([...porRol.consultores, ...porRol.productores]);
    for (const [fid, un] of subsFinca) if (!datos.fincas.has(fid)) { un(); subsFinca.delete(fid); datos.deFinca.delete(fid); }
    for (const fid of datos.fincas.keys()) if (!subsFinca.has(fid)) {
      subsFinca.set(fid, onSnapshot(collection(db, "fincas", fid, "registros"), { includeMetadataChanges: true }, snap => {
        datos.deFinca.set(fid, new Map(snap.docs.map(d => [d.id, conMeta(d, `fincas/${fid}/registros/${d.id}`)]))); volcar();
      }, err => console.warn("finca", fid, err)));
    }
    volcar();
  };
  for (const campo of ["consultores", "productores"]) {
    desuscribir.push(onSnapshot(query(collection(db, "fincas"), where(campo, "array-contains", uid)), { includeMetadataChanges: true }, snap => {
      porRol[campo] = new Map(snap.docs.map(d => [d.id, Object.assign(conMeta(d, `fincas/${d.id}`), { col: "fincas", mi_rol: campo === "consultores" ? "consultor" : "productor" })])); unir();
    }, err => console.warn("fincas", err)));
  }
  desuscribir.push(onSnapshot(doc(db, "usuarios", uid), snap => {
    if (!snap.exists()) return;
    const p = snap.data(); Nube.perfil = Object.assign({}, Nube.perfil, p);
    S.ajustes = Object.assign({ consultor: p.nombre }, p.ajustes || {}); S.prefs = Object.assign({}, p.prefs || {});
  }));
}
function parar() {
  desuscribir.forEach(f => { try { f(); } catch (x) { /* nada */ } }); desuscribir = [];
  for (const un of subsFinca.values()) { try { un(); } catch (x) { /* nada */ } }
  subsFinca.clear(); datos.propios.clear(); datos.fincas.clear(); datos.deFinca.clear();
}

/* ============================== Fotos en la nube ============================== */
const blobB64 = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });
const b64Blob = b64 => { const bin = atob(b64); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return new Blob([u8], { type: "image/jpeg" }); };
async function subirFotos(ids, fincaId) {
  const u = Nube.usuario; if (!u) return;
  for (const id of ids) {
    try {
      const f = await S.foto(id);
      if (!f || !f.blob || f.nube) continue;
      const data = await blobB64(f.blob);
      if (data.length > 950000) { console.warn("Foto muy grande para la nube", id); continue; }
      const ruta = fincaId ? ["fincas", fincaId, "fotos", id] : ["usuarios", u.uid, "fotos", id];
      setDoc(doc(db, ...ruta), { data, ancho: f.ancho || null, alto: f.alto || null, creado: f.creado || new Date().toISOString(), autor_uid: u.uid }).catch(fallo);
      await S.marcarFoto(id, { nube: ruta.join("/") });
    } catch (err) { console.warn("foto", id, err); }
  }
}
Nube.traerFoto = async (id, fincaId) => {
  const u = Nube.usuario; if (!u) return null;
  const rutas = [];
  if (fincaId) rutas.push(["fincas", fincaId, "fotos", id]);
  rutas.push(["usuarios", u.uid, "fotos", id]);
  for (const fid of datos.fincas.keys()) if (fid !== fincaId) rutas.push(["fincas", fid, "fotos", id]);
  for (const r of rutas) {
    try {
      const s = await getDoc(doc(db, ...r));
      if (s.exists()) { const d = s.data(); const blob = b64Blob(d.data); await S.guardarFoto({ id, blob, ancho: d.ancho, alto: d.alto, creado: d.creado, nube: r.join("/"), sync: "sincronizado" }); return S.foto(id); }
    } catch (x) { /* sin permiso en esa finca */ }
  }
  return null;
};

/* ============================== Invitaciones ============================== */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nuevoCodigo = () => { const a = new Uint32Array(6); crypto.getRandomValues(a); return Array.from(a, n => ALFABETO[n % ALFABETO.length]).join(""); };
Nube.codigoFinca = async (fincaId, rol = "productor") => {
  const f = datos.fincas.get(fincaId); if (!f) throw new Error("No encuentro la finca.");
  const campo = rol === "productor" ? "codigo_productor" : "codigo_consultor";
  if (f[campo]) return f[campo];
  const codigo = nuevoCodigo();
  await setDoc(doc(db, "invitaciones", codigo), { finca_id: fincaId, rol, creado_por: Nube.usuario.uid, creado: new Date().toISOString() });
  await setDoc(doc(db, "fincas", fincaId), { [campo]: codigo }, { merge: true });
  return codigo;
};
Nube.unirse = async codigo => {
  if (!navigator.onLine) throw new Error("Necesitas internet para usar el código.");
  const s = await getDoc(doc(db, "invitaciones", codigo)).catch(() => null);
  if (!s || !s.exists()) throw new Error("Ese código no existe. Revísalo con tu consultor.");
  const inv = s.data(); const campo = inv.rol === "consultor" ? "consultores" : "productores";
  await updateDoc(doc(db, "fincas", inv.finca_id), { [campo]: arrayUnion(Nube.usuario.uid), ultimo_codigo: codigo });
  return inv.finca_id;
};

/* ============================== IA en el servidor (Cloud Functions) ============================== */
Nube.llamar = async (nombre, datosIA) => {
  if (!Nube.iaLista) throw { code: "ia_no_lista" };
  const { getFunctions, httpsCallable } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js");
  const fn = httpsCallable(getFunctions(app, "us-central1"), nombre, { timeout: 120000 });
  const r = await fn(datosIA);
  return r.data;
};

/* ============================== Sesión ============================== */
Nube.salir = async () => { parar(); S.backend = null; S.listo = false; S.vaciar(); await signOut(auth); };
Nube.unirseUI = () => vistaUnirse();
Nube.cerrarAcceso = () => ocultarAcceso();
Nube.correo = () => (Nube.usuario && Nube.usuario.email) || "";
Nube.proveedor = () => { const p = Nube.usuario && Nube.usuario.providerData && Nube.usuario.providerData[0]; return p && p.providerId === "google.com" ? "Google" : "Correo y contraseña"; };

/* Datos que quedaron en este dispositivo antes de tener cuenta */
async function migrarLocal() {
  try {
    const regs = await B.IDB.todos("registros");
    if (!regs.length) return;
    const toast = document.getElementById("toasts"); if (!toast) return;
    const t = document.createElement("div"); t.className = "toast";
    t.innerHTML = `Hay ${regs.length} registro${regs.length === 1 ? "" : "s"} guardado${regs.length === 1 ? "" : "s"} solo en este dispositivo. <button type="button" class="btn sm">Subir a mi cuenta</button>`;
    t.querySelector("button").addEventListener("click", async () => {
      t.remove();
      const n = await S.importar(regs.map(r => Object.assign({}, r, { actualizado: new Date().toISOString() })));
      for (const r of regs) await B.IDB.del("registros", r.id);
      B.app && B.app.toast(`${n} registro${n === 1 ? "" : "s"} subido${n === 1 ? "" : "s"} a tu cuenta ✔`);
    });
    toast.appendChild(t);
  } catch (x) { /* sin datos locales */ }
}

getRedirectResult(auth).catch(err => { if (err && err.code !== "auth/no-auth-event") vistaEntrar(errorAuth(err), "bad"); });
onAuthStateChanged(auth, async u => {
  Nube.usuario = u;
  if (!u) { parar(); S.backend = null; S.listo = false; S.vaciar(); modoAcceso = "entrar"; vistaEntrar(); return; }
  let perfil = null, leido = false;
  try { const s = await getDoc(doc(db, "usuarios", u.uid)); leido = true; if (s.exists()) perfil = s.data(); }
  catch (err) { console.warn("perfil", err); perfil = perfilLocal(u.uid); }
  if (!perfil && !leido) perfil = perfilLocal(u.uid);
  if (!perfil) { vistaRol(u); return; }
  guardarPerfilLocal(u.uid, perfil);
  await abrirSesion(u, perfil);
});
Nube.listo = true;
