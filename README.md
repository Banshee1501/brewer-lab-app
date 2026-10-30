# Brewer Lab

Laboratorio de café de especialidad en el bolsillo. Funciona sin conexión y se instala en el celular como una app.

**Abrir la app:** https://banshee1501.github.io/brewer-lab-app/

## Qué hace

- **Barista**: bitácora de preparaciones con ratio, extracción y puntaje, cafés, recetas propias con versiones y experimentos a ciegas (prueba triangular).
- **Cata SCA CVA**: fichas descriptiva y afectiva con el cálculo del puntaje.
- **Fincas**: consultoría con diagnóstico en 13 áreas, índice 0–100, radar, lotes con trazabilidad e informe automático en PDF.
- **Foto con IA**: analiza fotos de hojas, frutos, café verde, café tostado o la planta para sugerir enfermedades, plagas, deficiencias o defectos. El resultado es orientativo.
- **Aprende**: tutoriales, manuales y rúbricas.

## Instalar

- **Android (Chrome)**: abre el link → menú ⋮ → **Instalar app**.
- **iPhone (Safari)**: abre el link → **Compartir** → **Agregar a pantalla de inicio**.

Ábrela una vez con internet. Desde ahí funciona sin señal.

## Tus datos

- Todo se guarda en tu dispositivo (IndexedDB). Sin conexión no se pierde nada.
- **Opcional, GitHub**: con un repositorio **privado** y un token fine-grained (solo ese repositorio, permiso *Contents: Read and write*), la app sube cada registro como nota Markdown con el formato de Obsidian, más las fotos. Lo hace sola al guardar y al volver la conexión.
- **Opcional, IA**: con tu propia clave de API de Anthropic. Las fotos salen del teléfono solo cuando pides un análisis. Se paga por uso en tu cuenta.
- El token y la clave se guardan solo en tu dispositivo y nunca están en este repositorio.

## Varias personas

Cada persona instala la app con el mismo link y sus datos quedan en su teléfono. Para compartir registros: **Ajustes → Exportar y compartir**, y quien los recibe usa **Importar archivo**.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página y estilos |
| `contenido.js` | Listas, áreas de diagnóstico, tutoriales y manuales |
| `nucleo.js` | Base de datos local, cálculos, notas de Obsidian e informes |
| `app.js` | Pantallas y formularios |
| `ia.js` | Análisis de fotos con la API de Claude |
| `sync.js` | Subida a GitHub |
| `extras.js` | Fotos, sincronización, ajustes, instalación |
| `sw.js` | Modo sin conexión |
