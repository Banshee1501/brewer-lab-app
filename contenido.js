/* Brewer Lab · contenidos: listas, rúbricas, tutoriales y manuales */
window.BL = window.BL || {};

BL.listas = {
  metodos: ["V60", "Orea Big Boy", "AeroPress", "Ceado Hoop", "Moka", "Prensa francesa", "Chemex", "Espresso", "Cold brew", "Otro"],
  procesos: ["Lavado", "Natural", "Honey", "Anaeróbico", "Maceración carbónica", "Doble fermentación", "Semilavado", "Experimental"],
  variedades: ["Typica", "Bourbon", "Caturra", "Catuaí", "Geisha", "Pacamara", "Pacas", "Maragogipe", "SL28", "SL34", "Mundo Novo", "Villa Sarchi", "Java", "Castillo", "Marsellesa", "Centroamericano H1", "Parainema", "Obatã", "Batian", "Landrace etíope", "Sidra", "Pink Bourbon", "Otra"],
  tueste: ["Claro", "Claro-medio", "Medio", "Medio-oscuro", "Oscuro"],
  estadosCafe: ["abierto", "en espera", "terminado"],
  estadosReceta: ["en prueba", "definitiva", "archivada"],
  estadosExperimento: ["planeado", "en curso", "concluido"],
  estadosConsultoria: ["prospecto", "diagnóstico", "plan de acción", "seguimiento", "cerrada"],
  tiposVisita: ["diagnóstico", "seguimiento", "cosecha", "poscosecha"],
  estadosLote: ["en proceso", "en bodega", "vendido"],
  secado: ["Patio", "Camas africanas", "Marquesina", "Secador mecánico", "Mixto"],
  certificaciones: ["Rainforest Alliance", "Fairtrade", "Orgánico", "Bird Friendly", "4C", "C.A.F.E. Practices", "Regenerative Organic", "Demeter", "Denominación de origen"],
  // Recetas que ya viven en Obsidian (03 Recetas/Recetas de referencia)
  recetasReferencia: [
    { nombre: "V60 - Hoffmann 1 taza", metodo: "V60", resumen: "15 g · 250 g · ~3:00" },
    { nombre: "V60 - Hoffmann Ultimate 2 tazas", metodo: "V60", resumen: "30 g · 500 g · ~3:30" },
    { nombre: "V60 - 4-6 Tetsu Kasuya", metodo: "V60", resumen: "20 g · 300 g · 5 × 60 g" },
    { nombre: "Orea Big Boy - Base 3 tazas", metodo: "Orea Big Boy", resumen: "45 g · 750 g · 4:00–4:45" },
    { nombre: "AeroPress - Hoffmann", metodo: "AeroPress", resumen: "11 g · 200 g · ~3:00" },
    { nombre: "Ceado Hoop - Base", metodo: "Ceado Hoop", resumen: "18 g · 288 g · 4:00–5:30" },
    { nombre: "Moka - Hoffmann", metodo: "Moka", resumen: "canasta llena · cortar al burbujear" },
    { nombre: "Prensa francesa - Hoffmann", metodo: "Prensa francesa", resumen: "30 g · 500 g · 4 + 5–8 min" }
  ],
  // Descriptores oficiales del formato descriptivo CVA (versión en español)
  cata: [
    { cat: "Floral", subs: [] },
    { cat: "Afrutado", subs: ["Bayas", "Frutas deshidratadas", "Cítricos"] },
    { cat: "Ácido/Fermentado", subs: ["Ácido", "Fermentado"] },
    { cat: "Verde/Vegetal", subs: [] },
    { cat: "Otra", subs: ["Químico", "Humedad/Tierra", "Madera"] },
    { cat: "Tostado", subs: ["Cereal", "Quemado", "Tabaco"] },
    { cat: "Nueces/Cacao", subs: ["Nueces", "Cacao"] },
    { cat: "Especias", subs: [] },
    { cat: "Dulce", subs: ["Vainilla", "Azúcar morena"] }
  ],
  gustos: ["Salado", "Ácido", "Dulce", "Amargo", "Umami"],
  boca: ["Áspero", "Aceitoso", "Suave", "Deja seca la boca", "Metálico"],
  defectos: ["Mohoso", "Fenólico", "Papa"],
  escala9: ["Extremadamente baja", "Muy baja", "Moderadamente baja", "Ligeramente baja", "Ni alta ni baja", "Ligeramente alta", "Moderadamente alta", "Muy alta", "Extremadamente alta"],
  atributos: [
    { key: "fragancia", nombre: "Fragancia" },
    { key: "aroma", nombre: "Aroma" },
    { key: "sabor", nombre: "Sabor" },
    { key: "retrogusto", nombre: "Sabor residual" },
    { key: "acidez", nombre: "Acidez" },
    { key: "dulzor", nombre: "Dulzor" },
    { key: "cuerpo", nombre: "Sensación en boca" },
    { key: "general", nombre: "Impresión global" }
  ]
};

/* Las 13 áreas del diagnóstico de finca: qué mirar, qué medir, cómo puntuar y qué recomendar */
BL.areas = [
  { key: "genetica", nombre: "Material genético", observar: "Variedades por lote, pureza (plantas fuera de tipo), edad del cafetal, origen de la semilla y adaptación a la altitud y al mercado.", medir: "% de plantas fuera de tipo en 50 plantas por lote; edad promedio.",
    n1: "Variedades mezcladas sin identificar, semilla de origen desconocido, variedades susceptibles donde la roya presiona fuerte.",
    n3: "Variedades identificadas por lote, con algo de mezcla; semilla propia sin selección.",
    n5: "Variedades adecuadas a la altitud y al mercado, semilla certificada o con prueba genética, lotes separados por variedad.",
    critico: ["Identificar y mapear la variedad de cada lote y marcar las plantas fuera de tipo.", "Comprar semilla o plántulas solo en viveros certificados; pedir prueba genética para variedades premium.", "Planificar la renovación con variedades resistentes a la roya en los lotes de mayor presión (por ejemplo Castillo, Marsellesa, Parainema o Centroamericano H1, según el país)."],
    mejora: ["Separar la cosecha y el beneficio por variedad para venderlas diferenciadas.", "Establecer un lote experimental pequeño con una variedad de alto valor adaptada a la altitud."],
    mantener: ["Mantener actualizado el mapa varietal de la finca."] },
  { key: "sanidad", nombre: "Sanidad", observar: "Roya, broca, ojo de gallo, antracnosis, mal rosado, nematodos y minador.", medir: "% de hojas con roya y % de frutos brocados, con muestreo en zigzag por lote.",
    n1: "Incidencia alta sin monitoreo; aplicaciones sin criterio ni registro.",
    n3: "Monitoreo ocasional; control reactivo cuando el problema ya es visible.",
    n5: "Monitoreo periódico registrado, manejo integrado e incidencia por debajo de los umbrales locales.",
    critico: ["Implementar un monitoreo mensual de roya y broca por lote, con formato de registro.", "Hacer cosecha sanitaria (\"re-re\"): recoger frutos maduros, sobremaduros, secos y del suelo.", "Definir con el técnico local un plan de control según umbrales (broca: referencia de ~2 % de frutos brocados usada en Colombia)."],
    mejora: ["Incorporar control biológico (Beauveria bassiana) y trampas de monitoreo de broca.", "Revisar la nutrición: las plantas bien nutridas toleran mejor la roya."],
    mantener: ["Mantener el calendario de monitoreo y revisar los datos en cada visita."] },
  { key: "suelo", nombre: "Suelo y nutrición", observar: "Vigor y color del follaje, síntomas de deficiencias, erosión y materia orgánica.", medir: "Análisis de suelo de menos de 2 años (pH, materia orgánica, P, K, Ca, Mg, Al y micronutrientes).",
    n1: "Sin análisis de suelo; fertilización sin criterio o nula; deficiencias visibles.",
    n3: "Análisis antiguo; fertilización general sin ajustar por lote.",
    n5: "Plan de nutrición por lote basado en el análisis, encalado cuando hace falta, pulpa compostada y registros.",
    critico: ["Tomar un análisis de suelo por lote homogéneo (15–20 submuestras de 0–20 cm).", "Corregir la acidez con encalado según el análisis.", "Iniciar el compostaje de la pulpa para devolver materia orgánica al suelo."],
    mejora: ["Ajustar las dosis por lote según el análisis y la producción esperada, fraccionadas en época de lluvias.", "Confirmar las deficiencias con análisis foliar."],
    mantener: ["Repetir el análisis cada 1–2 años y comparar la tendencia."] },
  { key: "sombra", nombre: "Sombra y biodiversidad", observar: "Estratos, especies de sombra, podas, fauna y conexión con el bosque.", medir: "% de cobertura del dosel con densiómetro en 5–10 puntos por lote.",
    n1: "Pleno sol sin protección en zona cálida, o sombra excesiva (más de 60 %) sin regular; poca diversidad.",
    n3: "Sombra presente pero irregular o con pocas especies.",
    n5: "Sombra regulada según altitud y radiación (referencia 25–45 %), especies diversas y nativas, corredores biológicos.",
    critico: ["Medir la sombra por lote y definir la meta según la zona (referencia Cenicafé: 25–45 %).", "Regular la sombra excesiva con podas antes de la época de más lluvia.", "En lotes a pleno sol en zonas cálidas, establecer sombra temporal (plátano o banano) y permanente (Inga, Erythrina, maderables)."],
    mejora: ["Diversificar las especies de sombra con nativas y maderables de valor.", "Planificar podas de mantenimiento anuales."],
    mantener: ["Documentar la sombra para certificaciones (Bird Friendly exige al menos 40 % de cobertura y certificación orgánica)."] },
  { key: "manejo", nombre: "Manejo agronómico", observar: "Podas y renovación, manejo de arvenses, conservación de suelos y densidad real.", medir: "Plantas en una parcela de 10 × 10 m (× 100 = plantas/ha) y edad promedio por lote.",
    n1: "Cafetales envejecidos sin renovar, suelo desnudo y erosión visible.",
    n3: "Renovación irregular; arvenses manejadas sin criterio de cobertura.",
    n5: "Ciclo de renovación planificado (~20 % del área por año), coberturas nobles y curvas de nivel.",
    critico: ["Elaborar un plan de renovación por lote (zoca o siembra), empezando por los lotes agotados.", "Proteger el suelo con manejo selectivo de arvenses y barreras vivas en las pendientes."],
    mejora: ["Ajustar la densidad a la variedad (altas: 3.000–4.000; compactas: 5.000–6.000 plantas/ha, referencia WCR).", "Programar las podas después de la cosecha principal."],
    mantener: ["Mantener el calendario de renovación para estabilizar la producción."] },
  { key: "cosecha", nombre: "Cosecha", observar: "Selectividad, número de pases, capacitación de recolectores y tiempo hasta el beneficio.", medir: "En 100 frutos cosechados: % maduros, pintones, verdes, sobremaduros y secos; Brix de 10 cerezas maduras.",
    n1: "Menos de 70 % de frutos maduros; se cosechan verdes; la cereza espera más de un día.",
    n3: "Entre 80 % y 90 % de maduros; pases irregulares.",
    n5: "95 % o más de maduros, pases frecuentes, flotación, beneficio el mismo día y registro por lote.",
    critico: ["Capacitar a los recolectores con muestras de color y pagar un diferencial por calidad.", "Aumentar la frecuencia de pases en el pico de cosecha (cada 2–4 semanas).", "Beneficiar el mismo día y mantener la cereza a la sombra."],
    mejora: ["Hacer flotación y separar los flotes del lote principal.", "Registrar el Brix por lote para comparar pases."],
    mantener: ["Seguir midiendo la madurez en cada pase y compartirla con el equipo."] },
  { key: "beneficio", nombre: "Beneficio y fermentación", observar: "Despulpadora, tanques, agua, limpieza y control de la fermentación.", medir: "pH, temperatura y horas de fermentación; granos mordidos en 100 g.",
    n1: "Sin control de tiempos, tanques sucios, granos mordidos y aguas mieles al río.",
    n3: "Tiempos aproximados, limpieza irregular, sin registros.",
    n5: "Protocolo escrito por proceso, registro de pH, °Brix, temperatura y tiempo, equipos calibrados.",
    critico: ["Calibrar la despulpadora (cero granos mordidos, cero cerezas enteras).", "Lavar los tanques después de cada uso y usar agua limpia.", "Registrar la hora de inicio y fin de cada fermentación, con pH y temperatura."],
    mejora: ["Construir la curva de fermentación de la finca con microlotes catados (CVA).", "Escribir un protocolo estándar para cada proceso (lavado, honey, natural)."],
    mantener: ["Explorar procesos diferenciados en microlotes, con registro completo."] },
  { key: "secado", nombre: "Secado y almacenamiento", observar: "Sistema de secado, grosor de la capa, volteos, protección y bodega.", medir: "Humedad final (meta 10–12 %), temperatura de secado y humedad de la bodega.",
    n1: "Secado en el suelo o sin protección, humedad sin medir, bodega húmeda o con químicos.",
    n3: "Secado aceptable pero desigual; la humedad se mide a veces.",
    n5: "Secado lento y controlado, humedad homogénea de 10–12 %, bodega limpia y ventilada, sacos sobre estibas y empaque hermético.",
    critico: ["Conseguir (o compartir) un medidor de humedad y medir cada lote.", "Secar en capas delgadas, con volteos frecuentes, protegiendo de la lluvia y el rocío.", "Guardar los sacos sobre estibas, lejos de paredes, químicos y combustibles."],
    mejora: ["Usar camas africanas o marquesina para naturales y honeys.", "Usar bolsas herméticas para los lotes de especialidad."],
    mantener: ["Registrar los días de secado y la humedad final de cada lote."] },
  { key: "calidad", nombre: "Calidad", observar: "Defectos del café verde y perfil en taza.", medir: "Evaluación física (350 g) y cupping CVA de cada lote.",
    n1: "Defectos de Categoría 1 frecuentes; el café no se cata.",
    n3: "Cata ocasional; algunos defectos de Categoría 2.",
    n5: "Perfil y puntaje documentados por lote, sin defectos de Categoría 1.",
    critico: ["Hacer el análisis físico (350 g) de cada lote para ubicar el origen de los defectos.", "Catar los lotes con el protocolo SCA CVA antes de venderlos."],
    mejora: ["Separar los lotes por calidad y vender los mejores de forma diferenciada.", "Enviar muestras a compradores de especialidad o a concursos."],
    mantener: ["Mantener un perfil sensorial por lote y por proceso para los compradores."] },
  { key: "trazabilidad", nombre: "Trazabilidad y registros", observar: "Códigos de lote, cuadernos o software, mapas y polígonos.", medir: "¿Se puede rastrear un saco hasta su parcela y su fecha de cosecha en menos de 10 minutos?",
    n1: "Sin registros ni códigos de lote; lotes mezclados.",
    n3: "Cuaderno básico con códigos inconsistentes.",
    n5: "Parcelas georreferenciadas, código único por lote y registros de cosecha, beneficio, bodega y venta.",
    critico: ["Adoptar un código de lote (FINCA-PARCELA-AAAAMMDD-PROCESO-N) y etiquetar cada saco.", "Llevar un cuaderno de cosecha y beneficio por lote.", "Georreferenciar cada parcela con 6 decimales (polígono si mide más de 4 ha) para cumplir la EUDR."],
    mejora: ["Pasar los registros a una hoja de cálculo o a un software.", "Preparar un archivo de parcelas (GeoJSON) para los compradores."],
    mantener: ["Hacer la prueba de los 10 minutos en cada visita."] },
  { key: "social", nombre: "Social y laboral", observar: "Vivienda, agua potable, equipo de protección, pagos, edades y capacitación.", medir: "Registros laborales, EPP disponible y plan de capacitación.",
    n1: "Riesgo de trabajo infantil o condiciones inseguras; sin equipo de protección.",
    n3: "Cumplimiento básico, sin registros.",
    n5: "Cumple o supera los estándares de certificación, con registros y capacitación periódica.",
    critico: ["Garantizar cero trabajo infantil y llevar un registro de edades.", "Entregar equipo de protección y capacitar a quienes aplican agroquímicos.", "Asegurar agua potable y servicios sanitarios para los trabajadores."],
    mejora: ["Registrar pagos y contratos; hacer un plan de capacitación anual."],
    mantener: ["Documentar las buenas prácticas para las certificaciones."] },
  { key: "ambiente", nombre: "Ambiente y agua", observar: "Aguas mieles, pulpa, consumo de agua, agroquímicos y fuentes de agua.", medir: "Destino de aguas y pulpa, bodega de agroquímicos y franjas de protección.",
    n1: "Aguas mieles y pulpa a las fuentes de agua; agroquímicos mal guardados; deforestación.",
    n3: "Manejo parcial de los residuos.",
    n5: "Aguas residuales tratadas, pulpa compostada, agroquímicos mínimos y registrados, sin deforestación desde 2020.",
    critico: ["Dejar de verter aguas mieles y pulpa a las quebradas; instalar sedimentación o filtros.", "Construir una bodega segura para agroquímicos y hacer triple lavado de los envases.", "Proteger nacimientos y quebradas con franjas sin cultivo."],
    mejora: ["Reducir el consumo de agua del beneficio (recirculación, desmucilaginado).", "Documentar que no hubo deforestación después de 2020 (EUDR)."],
    mantener: ["Medir y comunicar los avances ambientales a compradores y certificadoras."] },
  { key: "economia", nombre: "Economía", observar: "Costos, productividad, precio de venta y diferencial por calidad.", medir: "Costo por kg de pergamino o verde, kg/ha y precio obtenido.",
    n1: "No conoce sus costos y vende todo como café estándar.",
    n3: "Conoce sus costos de forma aproximada; alguna venta diferenciada.",
    n5: "Contabilidad por lote, conoce su punto de equilibrio y vende diferenciado por calidad.",
    critico: ["Llevar un registro mensual de costos (mano de obra, insumos, beneficio).", "Calcular el costo por kg de pergamino o de verde."],
    mejora: ["Separar y vender microlotes de mayor puntaje a compradores de especialidad.", "Evaluar certificaciones solo si hay compradores dispuestos a pagar el premio."],
    mantener: ["Revisar los márgenes por lote en cada cosecha."] }
];

BL.niveles = ["", "Crítico", "Deficiente", "Aceptable", "Bueno", "Referente"];

/* Tipos de diagnóstico con foto e IA */
BL.tiposDiagnostico = [
  { id: "hoja", nombre: "Hojas y planta", corto: "Hojas",
    ayuda: "Fotografía el haz y el envés de 2–3 hojas afectadas, con luz natural y sin sombra dura. Incluye una hoja sana para comparar.",
    foco: "Enfermedades (roya, ojo de gallo, mancha de hierro, antracnosis, mal rosado, llaga macana, fumagina), plagas (minador, cochinillas, ácaros) y deficiencias nutricionales (N, P, K, Mg, Ca, S, B, Zn, Fe, Mn). Indica si los síntomas están en hojas viejas o jóvenes, el patrón (internerval, bordes, manchas circulares) y el envés." },
  { id: "frutos", nombre: "Frutos y cosecha", corto: "Frutos",
    ayuda: "Extiende 50–100 frutos cosechados sobre una superficie clara, en una sola capa, y toma la foto desde arriba.",
    foco: "Madurez (estima % de maduros, pintones, verdes, sobremaduros y secos), daño de broca (orificio en la corona), frutos enfermos o momificados, y uniformidad del lote." },
  { id: "grano_verde", nombre: "Café verde (oro)", corto: "Grano verde",
    ayuda: "Extiende una capa de granos verdes sobre fondo claro y uniforme, con buena luz, a unos 20–30 cm. Si puedes, separa una muestra de 350 g.",
    foco: "Defectos físicos según el sistema del SCA. Categoría 1: grano negro, agrio, cereza seca, daño por hongos, materia extraña, daño por insecto grave. Categoría 2: negro o agrio parcial, pergamino, flotador, inmaduro, averanado, concha, partido/mordido/cortado, cascarilla, daño por insecto leve. También color, uniformidad de tamaño y forma, y señales de mal secado o almacenamiento." },
  { id: "grano_tostado", nombre: "Café tostado", corto: "Tostado",
    ayuda: "Granos enteros sobre fondo blanco, con luz natural indirecta. Incluye algunos granos partidos para ver el interior si puedes.",
    foco: "Nivel de tueste aproximado (claro, medio, oscuro), uniformidad del color, quakers (granos pálidos que no tostaron), aceite en la superficie, granos rotos o quemados y defectos visibles." },
  { id: "planta", nombre: "Planta completa · variedad orientativa", corto: "Planta",
    ayuda: "Foto de la planta entera (porte), un acercamiento a la punta de una rama (color del brote) y otro a frutos o granos.",
    foco: "Rasgos morfológicos: porte (alto o compacto, largo de entrenudos), color de los brotes (verde o bronce), forma y tamaño de hojas y frutos, color del fruto maduro. Sugiere el grupo de variedades probable SOLO como orientación y aclara que la variedad solo se confirma con prueba genética." }
];

/* Metas de referencia para las mediciones de campo */
BL.metas = [
  { key: "roya_incidencia_pct", nombre: "Incidencia de roya", unidad: "%", meta: "Por debajo del umbral local", eval: null },
  { key: "broca_incidencia_pct", nombre: "Frutos brocados", unidad: "%", meta: "≤ 2 % (referencia Cenicafé)", eval: v => v <= 2 },
  { key: "sombra_pct", nombre: "Sombra", unidad: "%", meta: "25–45 % (referencia Cenicafé)", eval: v => v >= 25 && v <= 45 },
  { key: "madurez_pct", nombre: "Frutos maduros en la cosecha", unidad: "%", meta: "≥ 95 %", eval: v => v >= 95 },
  { key: "humedad_pergamino", nombre: "Humedad del pergamino seco", unidad: "%", meta: "10–12 %", eval: v => v >= 10 && v <= 12 },
  { key: "brix", nombre: "Brix de cereza madura", unidad: "°Bx", meta: "Referencia propia de la finca", eval: null },
  { key: "densidad_real_ha", nombre: "Densidad real", unidad: "plantas/ha", meta: "Según la variedad", eval: null }
];

/* Tutoriales cortos de la app */
BL.tutoriales = [
  { id: "t-inicio", titulo: "Empieza aquí", tiempo: "3 min", pasos: [
    "Instala la app en tu celular (ver el tutorial **Instalar la app**). Funciona sin internet.",
    "Abre **Ajustes** (el engranaje arriba a la derecha) y escribe tu nombre, tu marca y tu contacto. Aparecerán en los informes.",
    "Todo lo que guardas queda en este dispositivo. Cada registro nuevo queda **pendiente** hasta que se sube a GitHub y de ahí a Obsidian.",
    "Opcional: conecta tu GitHub (respaldo y Obsidian) y tu clave de IA (análisis de fotos) en **Ajustes**."
  ]},
  { id: "t-instalar", titulo: "Instalar la app en el celular", tiempo: "1 min", pasos: [
    "Abre el link de Brewer Lab en **Chrome** (Android) o **Safari** (iPhone).",
    "Android: toca **Instalar** en Ajustes, o el menú **⋮ → Instalar app**.",
    "iPhone: toca **Compartir** (cuadrado con flecha) → **Agregar a pantalla de inicio**.",
    "Ábrela una vez con internet: desde ahí funciona también sin señal."
  ]},
  { id: "t-foto", titulo: "Diagnóstico con foto e IA", tiempo: "2 min", pasos: [
    "Toca **Foto** y elige qué vas a fotografiar: hojas, frutos, café verde, café tostado o la planta completa.",
    "Toma hasta 3 fotos con buena luz natural, sin sombras duras y de cerca. Cada tipo trae su guía.",
    "Asocia la foto a una finca o a un lote y escribe el contexto (altitud, variedad, desde cuándo).",
    "Toca **Guardar y analizar**. Sin señal, la foto queda en cola y se analiza sola al volver internet.",
    "El resultado es **orientativo**: confírmalo en campo o en laboratorio antes de decidir."
  ]},
  { id: "t-cafe", titulo: "Registrar un café", tiempo: "2 min", pasos: [
    "Ve a **Barista → Cafés** y toca **Nuevo café**.",
    "Escribe el nombre (tostador · país · finca), el proceso, la variedad y, sobre todo, la **fecha de tueste**.",
    "Guarda. El café aparece en la lista y ya puedes elegirlo al registrar una preparación.",
    "Cuando se acabe la bolsa, cambia el estado a **terminado** y anota tu mejor puntaje."
  ]},
  { id: "t-prep", titulo: "Registrar una preparación", tiempo: "2 min por taza", pasos: [
    "Ve a **Barista → Bitácora** y toca **Nueva preparación**.",
    "Elige el café, el método y la receta (tuya o de referencia).",
    "Anota dosis, agua, clicks del Timemore, temperatura y tiempo. El **ratio** se calcula solo.",
    "Si mides TDS, anota el TDS y el peso de la bebida: la **extracción** aparece sola.",
    "Puntúa los 8 atributos del 1 al 9. El **puntaje (58–100)** se calcula al instante. Si tienes prisa, usa solo las estrellas.",
    "Escribe una sola cosa que cambiarías la próxima vez y guarda."
  ]},
  { id: "t-receta", titulo: "Crear una receta propia", tiempo: "4 min", pasos: [
    "Ve a **Barista → Recetas** y toca **Nueva receta**.",
    "Ponle nombre y método, y escribe los parámetros y los pasos (tiempo, acción, agua acumulada).",
    "Cada vez que la cambies, sube la **versión** y anota el cambio en el historial.",
    "Cuando logres 3 preparaciones con puntaje de 86 o más con los mismos parámetros, márcala como **definitiva**."
  ]},
  { id: "t-exp", titulo: "Hacer un experimento a ciegas", tiempo: "20–30 min", pasos: [
    "Ve a **Barista → Experimentos → Nuevo**. Escribe una pregunta con **una sola variable** (ej. 94 °C vs 100 °C).",
    "Prepara 3 tazas: 2 iguales y 1 distinta. Que alguien las mezcle.",
    "En cada ensayo anota cuál elegiste y si acertaste. La app te dice si el resultado es **significativo**.",
    "Si la diferencia es real, decide cuál prefieres y actualiza tu receta."
  ]},
  { id: "t-cata", titulo: "Catar con el sistema SCA CVA", tiempo: "10 min por muestra", pasos: [
    "Prepara el cupping con el protocolo SCA 102 (8,25 g por cada 150 mL, agua a 93 °C, 5 tazas por muestra).",
    "Ve a **Cata** y toca **Nueva cata**. Una ficha por muestra.",
    "Parte descriptiva: intensidades de 0 a 15 y los descriptores que percibes.",
    "Parte afectiva: los 8 atributos de 1 a 9, las tazas no uniformes y las defectuosas. El **puntaje CVA** se calcula solo."
  ]},
  { id: "t-visita", titulo: "Diagnóstico de una finca", tiempo: "1 visita", pasos: [
    "Ve a **Fincas** y crea la finca (productor, ubicación, altitud, variedades).",
    "En la ficha de la finca toca **Nueva visita**.",
    "Recorre las **13 áreas**. Toca el 1–5 de cada una: abajo verás qué significa cada nivel.",
    "Anota los hallazgos y las mediciones (roya, broca, sombra, madurez, humedad).",
    "El **Índice (0–100)** y el gráfico de radar se actualizan mientras llenas la visita."
  ]},
  { id: "t-lote", titulo: "Registrar un lote", tiempo: "5 min", pasos: [
    "En la ficha de la finca toca **Nuevo lote**.",
    "Elige parcela, fecha de cosecha y proceso: el **código de lote** se arma solo.",
    "Completa cada etapa cuando ocurra: cosecha, fermentación, secado, trilla y venta."
  ]},
  { id: "t-informe", titulo: "Generar el informe de la finca", tiempo: "5 min", pasos: [
    "Abre una visita y toca **Generar informe**.",
    "La app arma el resumen, el radar, las fortalezas, las prioridades, las recomendaciones y un plan de acción en 3 plazos.",
    "Edita lo que quieras. Si quieres, toca **Mejorar resumen con IA**.",
    "Toca **Descargar PDF** para enviarlo al productor, y **Guardar** para que también llegue a Obsidian."
  ]},
  { id: "t-sync", titulo: "Sincronizar con Obsidian", tiempo: "5 min (una vez)", pasos: [
    "En **Ajustes → GitHub** escribe tu usuario, el repositorio privado de datos y un token con permiso **Contents: Read and write**.",
    "Toca **Guardar y probar**. Si dice **Conectado ✔**, ya está.",
    "Desde ahí, cada vez que guardas algo con internet, la app lo sube sola. Sin señal, espera y lo sube al volver la conexión.",
    "También puedes tocar **Sincronizar** (arriba) para subir todo al momento y ver qué falta.",
    "Desde GitHub, las notas llegan a tu bóveda de Obsidian en la PC."
  ]},
  { id: "t-compartir", titulo: "Trabajar con otras personas", tiempo: "2 min", pasos: [
    "Cualquier persona puede instalar la app con el mismo link. Sus datos quedan en su propio teléfono.",
    "Para enviarte sus registros: **Ajustes → Exportar y compartir** (por WhatsApp o correo).",
    "Tú lo recibes y tocas **Ajustes → Importar archivo**. Los registros quedan en tu app y se suben a tu GitHub.",
    "Cada persona puede conectar su propio GitHub y su propia clave de IA. Nunca compartas tu token ni tu clave."
  ]}
];

/* =========================== MANUALES (Markdown) =========================== */
BL.manuales = [
{ id: "manual-app", titulo: "Manual de uso de la app", subtitulo: "Cómo funciona cada sección, de principio a fin", md: `
# Manual de uso de la app Brewer Lab

## 1. Qué es y cómo se conecta con Obsidian

Brewer Lab es tu laboratorio de bolsillo: registras preparaciones, recetas, catas, consultorías y diagnósticos con foto desde el celular o la PC, **con o sin internet**. Los datos se guardan en tu dispositivo.

Tu bóveda de Obsidian es el archivo permanente. La conexión funciona así:

1. Guardas un registro en la app. Queda marcado como **pendiente**.
2. Cuando hay internet, la app lo sube como nota (y sus fotos) a tu repositorio **privado** de GitHub, en la carpeta correcta y con el formato de tus plantillas.
3. Desde GitHub, las notas llegan a tu bóveda en la PC y las tablas de Obsidian se actualizan solas.
4. El registro pasa a **sincronizado**.

> Sin señal no se pierde nada: los registros siguen pendientes y se suben solos al volver la conexión.

## 2. Primeros pasos

1. **Instala la app**: en Android, Chrome → menú ⋮ → **Instalar app**. En iPhone, Safari → **Compartir → Agregar a pantalla de inicio**. Ábrela una vez con internet y desde ahí funciona sin señal.
2. **Ajustes → Tu perfil**: tu nombre, tu marca, tu contacto y tu ciudad. Aparecen en la portada de los informes.
3. **Ajustes → GitHub** (opcional): usuario, repositorio de datos y token. Es el respaldo y el puente con Obsidian.
4. **Ajustes → IA** (opcional): tu clave de API de Claude para analizar fotos y mejorar resúmenes. Se paga por uso en tu cuenta de Anthropic.
5. **Navegación**: Inicio, Barista, Cata, Foto, Fincas y Aprende. En el celular están abajo; en la PC, a la izquierda.

> El token y la clave se guardan solo en tu dispositivo. No los compartas con nadie.

## 3. Barista

### Cafés
Una ficha por bolsa. Lo más importante es la **fecha de tueste**: la app te muestra cuántos días lleva tostado. Al terminar la bolsa, cambia el estado a **terminado** y anota tu mejor puntaje.

### Bitácora (preparaciones)
Es la herramienta n.º 1 para mejorar. Cada taza registra:

| Campo | Para qué |
|---|---|
| Café, método, receta | contexto y enlaces en Obsidian |
| Dosis, agua, clicks, temperatura, tiempo | los parámetros que vas a ajustar |
| TDS y bebida (opcional) | calcular la extracción |
| 8 atributos (1–9) | puntaje de 58 a 100 |
| Estrellas y "repetir" | registro rápido |

**Lecturas automáticas**: ratio (agua ÷ dosis), extracción (TDS × bebida ÷ dosis) y puntaje (0,65625 × suma de los 8 atributos + 52,75).

### Recetas
Tus recetas propias, con pasos, versiones e historial. Regla de promoción: **3 preparaciones con puntaje de 86 o más** con los mismos parámetros → **definitiva**.

### Experimentos
Pruebas triangulares a ciegas. La app calcula si tus aciertos superan lo que lograrías por azar (p < 0,05).

## 4. Cata SCA CVA

Una ficha por muestra, con las dos partes del sistema oficial del SCA:

- **Descriptiva**: intensidad de 0 a 15 de fragancia, aroma, sabor, sabor residual, acidez, dulzor y sensación en boca, más los descriptores oficiales.
- **Afectiva**: impresión de calidad de 1 a 9 en los 8 atributos, más las tazas no uniformes (−2 cada una) y las defectuosas (−4 cada una).

El puntaje sigue la fórmula del estándar SCA 104. Para el puntaje oficial redondeado usa la calculadora del SCA.

## 5. Fincas (consultoría)

### Ficha de la finca
Productor, ubicación, altitud, áreas, variedades, procesos, certificaciones, parcelas y un **código corto** (ej. FEM) que se usa en los códigos de lote.

### Visita de diagnóstico
Las **13 áreas** se puntúan de 1 a 5. Debajo de cada área verás qué observar, qué medir y cómo se ve el nivel 1, el 3 y el 5. El **Índice (0–100)** = promedio × 20.

| Índice | Lectura |
|---|---|
| 85–100 | Referente |
| 70–84 | Bueno |
| 50–69 | En desarrollo |
| menos de 50 | Crítico |

### Lotes
El código se arma solo: **CÓDIGO-PARCELA-AAAAMMDD-PROCESO-N**. Completa cada etapa a medida que ocurre.

## 6. Informe automático

Desde una visita, **Generar informe** arma:

1. Portada con tu marca.
2. Resumen ejecutivo (editable, con opción de mejorarlo con IA).
3. Índice, semáforo y radar de las 13 áreas.
4. Fortalezas y prioridades.
5. Mediciones de campo contra sus metas.
6. Recomendaciones por área, según el nivel.
7. Plan de acción en 3 plazos (90 días, 1 año, 3 años), editable.

**Descargar PDF** genera el archivo para el productor. **Compartir PDF** lo manda directo por WhatsApp o correo desde el celular. **Imprimir** es la alternativa si el PDF falla: elige "Guardar como PDF". **Guardar** lo deja listo para Obsidian.

## 7. Diagnóstico con foto e IA

1. Toca **Foto** y elige qué vas a fotografiar: **hojas y planta**, **frutos y cosecha**, **café verde**, **café tostado** o **planta completa**.
2. Sigue la guía de cada tipo: luz natural pareja, sin flash, de cerca y con el síntoma enfocado. Hasta 3 fotos.
3. Asocia la foto a una finca o a un lote y escribe el contexto: altitud, variedad, clima, desde cuándo.
4. **Guardar y analizar**. La IA devuelve el diagnóstico principal, la confianza, la urgencia, los hallazgos con su severidad, otras posibilidades, qué hacer y qué confirmar.

> El análisis es **orientativo**. Confírmalo en campo o en laboratorio antes de decidir, sobre todo si implica agroquímicos. La IA no recomienda productos ni dosis, y nunca afirma la variedad: eso solo lo confirma una prueba genética.

Sin señal, la foto queda **en cola** y se analiza sola al volver internet. Cada análisis cuesta unos centavos de dólar en tu cuenta de Anthropic.

## 8. Sincronización: requisitos y conflictos

- **GitHub conectado** en Ajustes, con un token que pueda escribir en tu repositorio de datos.
- **Automática**: con internet, la app sube lo pendiente al guardar y al volver la conexión. Puedes apagarlo en **Sincronizar**.
- **Conflictos**: si en el repositorio ya hay una nota con el mismo nombre que pertenece a otro registro, la app **no la sobrescribe** y te avisa.
- **Borrar en la app no borra en Obsidian**: la nota se queda en tu bóveda.

## 9. En la finca, sin señal

La app funciona sin internet: registra la visita, los lotes y las fotos como siempre. Todo se guarda en el teléfono y se sube al volver la señal. Si prefieres papel, descarga la **ficha de campo imprimible** (Fincas → Ficha de campo).

## 10. Trabajar con otras personas

- Cualquier persona puede instalar la app con el mismo link. Sus datos quedan en su propio teléfono.
- Para pasarte sus registros: **Ajustes → Exportar y compartir**. Tú los recibes con **Ajustes → Importar archivo**.
- Cada persona puede conectar su propio GitHub y su propia clave de IA.

## 11. Preguntas frecuentes

**¿Puedo usarla en el celular?** Sí. Instálala desde el navegador y funciona como una app, también sin señal.

**¿Mis clientes ven mis datos?** No. Los datos están en tu dispositivo y en tu repositorio privado. A los clientes les entregas el informe en PDF.

**¿Qué pasa si se me pierde el teléfono?** Lo que ya se sincronizó está en GitHub y en Obsidian. Lo pendiente se pierde: sincroniza seguido.

**Sincronizar dice que el token no sirve.** Crea uno nuevo en GitHub (Contents: Read and write, solo tu repositorio de datos) y pégalo en Ajustes.

**Un número no se calcula.** Revisa que los campos numéricos tengan solo números (15, no "15 g").
` },

{ id: "manual-barista", titulo: "Manual del barista", subtitulo: "Tu método de entrenamiento: preparar, medir, catar, mejorar", md: `
# Manual del barista · Brewer Lab

## 1. El método

1. **Mide todo**: dosis, agua, molienda, temperatura, tiempo.
2. **Una variable a la vez**: si cambias dos cosas, no sabrás cuál funcionó.
3. **Registra siempre**: aunque sea con estrellas.
4. **Cata seguido**: el paladar se entrena con repetición y referencias.
5. **Decide con datos**: tus mejores tazas te dicen qué repetir.

## 2. Tu equipo

### Timemore Chestnut C5 Pro
Fresas cónicas S2C de 42 mm, **31 µm por click**, 48 clicks por vuelta. Calibra el **cero** (fresas tocándose, sin forzar) y cuenta desde ahí.

| Método | Clicks de partida |
|---|---|
| Espresso / Moka | 5–8 |
| AeroPress | 8–12 |
| V60 (1 taza) | 10–14 |
| Orea Big Boy (40–60 g) | 14–18 |
| Ceado Hoop | 15–20 |
| Prensa francesa | 14–17 (hasta ~20) |
| Cold brew | 18–24 |

### Fellow Stagg EKG
0,9 L, control de temperatura. **Mide tu caudal**: vierte 10 s sobre la báscula y divide los gramos entre 10. Lo importante es que el caudal sea **constante**.

| Café | Temperatura de partida |
|---|---|
| Tueste muy claro, alta densidad | 96–100 °C |
| Claro-medio | 93–96 °C |
| Medio-oscuro | 88–92 °C |

## 3. Las palancas de la extracción

| Palanca | Más extracción si… |
|---|---|
| Molienda | más fina |
| Temperatura | más caliente |
| Tiempo | más largo |
| Agitación | más turbulencia |
| Ratio | más agua por gramo |
| Agua | dureza adecuada |

**Carta de control clásica (SCA)**: extracción de 18–22 % y TDS de 1,15–1,35 %. Es un mapa, no una ley: manda tu paladar.

**Extracción** = TDS × bebida ÷ dosis. Ejemplo: 1,38 × 220 ÷ 15 = 20,2 %.

## 4. Diagnóstico de sabor

| Síntoma | Causa probable | Primer ajuste |
|---|---|---|
| Agrio, salado, corto | subextracción | 2 clicks más fino |
| Amargo, seco, astringente | sobreextracción | 2 clicks más grueso |
| Agrio y amargo a la vez | extracción desigual | mejor bloom, swirl, vertido centrado |
| Aguado pero equilibrado | ratio largo | +1 g de dosis |
| Pesado, saturado | ratio corto | +20–30 g de agua |
| Plano, sin acidez | agua muy alcalina o café viejo | menos buffer, revisa el tueste |

## 5. Tus métodos

| Método | Receta base | Claves |
|---|---|---|
| **V60** | 15 g · 250 g · bloom 50 g · 4 vertidos de 50 g · ~3:00 | swirl final, lecho plano |
| **Orea Big Boy** | 45 g · 750 g · bloom 100 g · 3 vertidos grandes · 4:00–4:45 | vertidos de 200 ml o más; lotes chicos, más fino |
| **AeroPress** | 11 g · 200 g · émbolo para vacío · 2:00 + swirl + 30 s · presión de 30 s | papel = limpieza, metal = cuerpo |
| **Ceado Hoop** | 18 g · 288 g de una vez · 4:00–5:30 | molienda gruesa; papel de alto flujo para moler más fino |
| **Moka** | canasta llena sin compactar · agua caliente · fuego bajo | cortar al primer burbujeo, enfriar la base |
| **Prensa francesa** | 30 g · 500 g · 4 min + 5–8 min de reposo | romper la costra, quitar espuma, no presionar al fondo |

## 6. Agua

Objetivo del SCA: TDS de ~150 mg/L, dureza cálcica de ~68 mg/L, alcalinidad de ~40 mg/L y pH de ~7.

**Agua Brewer Lab 68/40** con agua destilada:
- Concentrado de dureza: 2,46 g de sal de Epsom en 1 L.
- Concentrado buffer: 1,68 g de bicarbonato de sodio en 1 L.
- Para 1 L de agua de café: 68 g de dureza + 40 g de buffer + 892 g de agua destilada.

## 7. Tueste y reposo

| Uso | Reposo orientativo |
|---|---|
| Filtrado, tueste claro | ~7–21 días |
| Filtrado, tueste medio | ~4–14 días |
| Espresso | ~10–30 días |

Congelar en porciones herméticas funciona muy bien.

## 8. Puntuar y catar

- **Estrellas (1–5)** para el día a día.
- **Puntaje Brewer Lab (58–100)**: los 8 atributos del CVA de 1 a 9. Empieza en 5 y sube o baja desde ahí. Guarda el 9 para lo excepcional.
- **Cupping CVA**: 8,25 g por cada 150 mL, agua a 93 ± 3 °C, costra de 3–5 min, catar desde ~70 °C, mínimo 3 rondas.

## 9. Entrenamiento del paladar

| Día | Ejercicio |
|---|---|
| Lunes | olfato: 6 frascos a ciegas |
| Martes | gustos básicos en 3 intensidades |
| Miércoles | prueba triangular |
| Jueves | ácidos orgánicos (cítrico, málico, acético, láctico) |
| Viernes | cupping de 3–4 cafés |
| Sábado | una categoría de la rueda de sabores |

## 10. Plan de 12 semanas

| Semanas | Foco |
|---|---|
| 1–2 | una receta definitiva por método |
| 3–4 | escaleras de molienda y temperatura; agua 68/40 |
| 5–6 | rueda de sabores, gustos básicos, primer cupping |
| 7–8 | fichas descriptiva y afectiva cada semana |
| 9–10 | lavado vs. natural vs. honey a ciegas |
| 11–12 | variedades, poscosecha y una visita de práctica |
` },

{ id: "manual-productor", titulo: "Manual para el productor", subtitulo: "Guía práctica para entregar a tus clientes", md: `
# Manual para el productor · Buenas prácticas para un café de calidad

> Esta guía resume las prácticas que más influyen en la calidad y el precio de tu café. Úsala con tu equipo en la finca.

## 1. Por qué la calidad paga

Los compradores de café de especialidad pagan más por cafés **limpios, dulces y consistentes**, y por lotes con **información completa**: quién lo produjo, en qué parcela, con qué proceso. Casi todos los defectos que bajan el precio se originan en la **cosecha**, el **beneficio** y el **secado**, y se pueden evitar.

## 2. Cosecha selectiva

| Estado del fruto | Qué pasa en la taza |
|---|---|
| Verde | astringencia, sabores vegetales |
| Pintón | menos dulzor |
| **Maduro** | **dulzor y acidez en su punto** |
| Sobremaduro | sabores a fermento o vinagre |
| Seco | granos negros y agrios |

- Meta: **95 % o más de frutos maduros** en cada costal.
- Hacer **pases frecuentes** (cada 2–4 semanas en el pico).
- Mantener la cereza **a la sombra** y **beneficiarla el mismo día**.
- **Flotación**: separar los frutos que flotan y procesarlos aparte.

**Cómo medir**: cuenta 100 frutos de un costal y anota cuántos están maduros, pintones, verdes, sobremaduros y secos.

## 3. Beneficio y fermentación

1. **Despulpadora calibrada**: sin granos mordidos ni cerezas enteras.
2. **Agua limpia** y **tanques lavados** después de cada uso.
3. **Registrar cada fermentación**: hora de inicio, hora de fin, temperatura y, si es posible, pH.
4. **Saber cuándo terminó**: el grano se siente áspero al frotarlo y no resbaloso.
5. **Nunca mezclar** lotes de días o procesos distintos.

### Hoja de registro de fermentación

| Lote | Inicio (hora) | Temperatura | pH inicial | Fin (hora) | pH final | Observaciones |
|---|---|---|---|---|---|---|
| | | | | | | |

## 4. Procesos

| Proceso | Qué es | Cuidado principal |
|---|---|---|
| Lavado | se despulpa, se fermenta el mucílago y se lava | controlar el tiempo de fermentación |
| Honey | se despulpa y se seca con parte del mucílago | secado parejo y con volteos frecuentes |
| Natural | se seca la cereza entera | capas delgadas y volteos para evitar moho y sobrefermentación |

## 5. Secado

- Meta: **humedad de 10–12 %**, pareja en todo el lote.
- Capas **delgadas** al inicio y **volteos frecuentes**.
- Proteger de la **lluvia** y del **rocío** de la noche.
- Medir la humedad con un **medidor**: el diente o la mordida no son suficientes.
- En secadores mecánicos, temperaturas moderadas: el exceso de calor daña la taza.

## 6. Almacenamiento

- Bodega **limpia, seca, fresca y ventilada**.
- Sacos **sobre estibas**, separados de las paredes.
- **Nunca** junto a combustibles, abonos, agroquímicos ni olores fuertes.
- Para lotes especiales, **bolsas herméticas**.
- Cada saco con su **código de lote**.

## 7. Sanidad del cafetal

- **Roya**: polvo anaranjado debajo de las hojas. Ayudan las variedades resistentes, una buena nutrición y una sombra regulada.
- **Broca**: un agujero en la punta del fruto. La práctica más importante es la **cosecha sanitaria** ("re-re"): recoger frutos maduros, sobremaduros, secos y los del suelo.
- **Agroquímicos**: solo con recomendación técnica, siguiendo la etiqueta y con equipo de protección.

## 8. Sombra, suelo y agua

- **Sombra**: en muchas zonas se recomienda entre 25 % y 45 %. Demasiada sombra baja la producción; nada de sombra estresa la planta.
- **Suelo**: hacer un **análisis de suelo** cada 1–2 años y fertilizar según el resultado.
- **Pulpa**: compostarla y devolverla al cultivo. **Nunca** tirarla a la quebrada.
- **Aguas mieles**: tratarlas (sedimentación, filtros) antes de devolver el agua.

## 9. Registros y trazabilidad

Un **código de lote** acompaña al café desde la parcela hasta la venta:

**FINCA-PARCELA-AAAAMMDD-PROCESO-N** (ejemplo: FEM-P01-20261105-LAV-01)

Anota para cada lote: fecha y kilos de cereza, % de maduros, horas de fermentación, días de secado, humedad final, kilos de pergamino y venta.

> **Para exportar a Europa (EUDR)**: cada parcela necesita sus coordenadas GPS con 6 decimales (un polígono si mide más de 4 ha) y la evidencia de que no hubo deforestación después del 31 de diciembre de 2020.

### Hoja de registro de cosecha

| Fecha | Parcela | Kg de cereza | % maduros | Código de lote | Responsable |
|---|---|---|---|---|---|
| | | | | | |

## 10. Personas y seguridad

- **Cero trabajo infantil.**
- Equipo de protección para quien aplica agroquímicos.
- Agua potable, servicios sanitarios y botiquín.
- Capacitación del equipo en cosecha selectiva y en beneficio.

## 11. Lista rápida antes de cada cosecha

- [ ] Recolectores capacitados con muestras de color
- [ ] Despulpadora calibrada y tanques limpios
- [ ] Medidor de humedad funcionando
- [ ] Cuaderno de registros listo
- [ ] Bodega limpia, con estibas
- [ ] Plan para la pulpa y las aguas mieles
` },

{ id: "manual-consultoria", titulo: "Manual de consultoría", subtitulo: "Tu metodología Coffee Farm Lab, paso a paso", md: `
# Manual de consultoría · Metodología de diagnóstico de fincas

## 1. El servicio

Tu consultoría ayuda a una finca a **mejorar la calidad, la productividad, la sostenibilidad y la trazabilidad**, con un diagnóstico medible y un plan de acción priorizado.

| Servicio | Incluye | Entregable |
|---|---|---|
| Diagnóstico | visita de 1 día, 13 áreas, mediciones y muestras | informe con índice, radar y plan |
| Plan de acción | priorización y acompañamiento al arranque | plan en 3 plazos con indicadores |
| Seguimiento | visitas periódicas | evolución del índice y de los indicadores |

## 2. El proceso completo

1. **Primer contacto**: necesidades, tamaño de la finca, metas del productor.
2. **Pre-visita**: pedir información y preparar el kit.
3. **Visita de diagnóstico**: recorrido, entrevistas, mediciones y muestras.
4. **Análisis**: evaluación física y cupping CVA de las muestras.
5. **Informe**: hallazgos, prioridades y plan de acción.
6. **Presentación**: explicar el informe al productor y acordar el plan.
7. **Seguimiento**: nuevas visitas para medir el avance.

## 3. Pre-visita

### Información que pides al productor
- Producción por lote de los últimos 3 años.
- Análisis de suelo (si existe).
- Registros de cosecha, beneficio y ventas.
- Costos de producción.
- Mapa o croquis de la finca y certificaciones vigentes.

> Lo que no existe también es un hallazgo: anótalo.

### Kit de campo
- [ ] Celular con GPS (polígonos) y la app Brewer Lab
- [ ] Densiómetro esférico (o app de cobertura del dosel)
- [ ] Refractómetro Brix
- [ ] pH-metro y termómetro
- [ ] Medidor de humedad de grano
- [ ] Báscula, bolsas y etiquetas para muestras
- [ ] Cinta métrica, lupa y cámara
- [ ] Ficha de campo impresa (por si no hay señal)

## 4. Agenda tipo de la visita

| Hora | Actividad |
|---|---|
| 7:30 | reunión con el productor: metas, historia, problemas |
| 8:30 | recorrido de lotes: genética, sanidad, sombra, manejo, suelo |
| 11:30 | cosecha: conteo de madurez y Brix |
| 13:00 | almuerzo y conversación sobre economía y personas |
| 14:00 | beneficio, secado y bodega |
| 15:30 | registros, trazabilidad y ambiente |
| 16:30 | toma de muestras y cierre con el productor |

## 5. Las 13 áreas y cómo puntuarlas

Cada área se puntúa de 1 a 5:

| Puntaje | Nivel | Significado |
|---|---|---|
| 1 | Crítico | riesgo grave para la calidad, la producción o el cumplimiento |
| 2 | Deficiente | prácticas inconsistentes, pérdidas evidentes |
| 3 | Aceptable | cumple lo básico, con margen de mejora |
| 4 | Bueno | prácticas sólidas y registradas |
| 5 | Referente | nivel de especialidad, medido y documentado |

Las rúbricas detalladas (qué observar, qué medir y cómo se ve cada nivel) están en **Aprende → Rúbricas** y en el formulario de visita.

**Índice de la finca** = promedio de las áreas × 20 (de 0 a 100).

## 6. Mediciones de campo

| Medición | Cómo | Referencia |
|---|---|---|
| Roya | zigzag por lote; % de hojas con lesión | umbral de la autoridad local |
| Broca | % de frutos perforados en una muestra por lote | ~2 % (referencia usada en Colombia) |
| Sombra | densiómetro en 5–10 puntos por lote | 25–45 % (referencia Cenicafé) |
| Madurez | conteo de 100 frutos cosechados | ≥ 95 % maduros |
| Brix | refractómetro, 10 cerezas maduras | referencia propia de la finca |
| Densidad | parcela de 10 × 10 m × 100 | según la variedad |
| Humedad | medidor calibrado | 10–12 % |

## 7. Muestras de café

1. Toma una muestra representativa por lote (de varios sacos).
2. Etiqueta con el **código de lote**, la fecha y la finca.
3. **Evaluación física**: 350 g, color, humedad, defectos (Categorías 1 y 2) y zarandas.
4. **Cupping CVA**: tueste medio (Agtron ~63), reposo de 8–24 h, 5 tazas por muestra, ficha descriptiva y afectiva.
5. Relaciona cada defecto con su causa en la finca (ver la tabla de la evaluación física).

## 8. Cómo priorizar

Ordena las áreas de menor a mayor puntaje y aplica la matriz **impacto × costo × rapidez**:

| Plazo | Tipo de acción | Ejemplos |
|---|---|---|
| ≤ 90 días | victorias rápidas, de bajo costo | selectividad de cosecha, limpieza del beneficio, registros |
| 1 año | inversión moderada | nutrición por análisis, regulación de sombra, secado mejorado |
| 3 años | estructurales | renovación varietal, certificaciones, infraestructura |

## 9. Cómo escribir recomendaciones

Cada recomendación debe ser **concreta, medible y con responsable**:

- ❌ "Mejorar la cosecha."
- ✅ "Lograr ≥ 95 % de frutos maduros en el pase 2, medido con conteo de 100 frutos por costal. Responsable: mayordomo. Revisión: próxima visita."

## 10. El informe

Estructura (la app la genera sola):
1. Resumen ejecutivo: estado general en 5 líneas.
2. Índice, semáforo y radar.
3. Fortalezas (para reconocer lo que se hace bien).
4. Prioridades y recomendaciones por área.
5. Mediciones de campo contra metas.
6. Plan de acción con plazos e indicadores.

**Tono**: respetuoso, claro, sin tecnicismos innecesarios. Empieza por las fortalezas.

## 11. Ética profesional

- **Confidencialidad**: los datos de la finca son del productor. No los compartas sin su permiso.
- **No prometas precios** ni puntajes.
- **Declara conflictos de interés** (por ejemplo, si recomiendas insumos que vendes).
- **Agroquímicos**: remite siempre a la recomendación técnica local y a la etiqueta.

## 12. Seguimiento

| Indicador | Frecuencia |
|---|---|
| Índice de la finca | en cada visita |
| % de madurez en la cosecha | cada pase |
| Incidencia de roya y broca | mensual |
| Humedad final por lote | cada lote |
| Puntaje CVA por lote | cada lote |
| Costo por kg | cada cosecha |

## 13. Aspectos comerciales

- Define tu tarifa por **día de campo** más el **informe**, y aparte las visitas de seguimiento.
- Deja por escrito el **alcance**, los **entregables**, las **fechas** y la **confidencialidad**.
- Pide al productor que firme la recepción del informe y del plan.
` }
];
