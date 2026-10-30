/* Brewer Lab · Escuela de café: módulos, manuales, prácticas, quizzes y fuentes */
window.BL = window.BL || {};
BL.escuela = {
  actualizado: "2026-10-30",
  rutas: [
    { id: "brewer", nombre: "Ruta Barista", lema: "Del grano a la taza, con criterio y con números.", descripcion: "Doce módulos para preparar, calibrar, catar y servir con método: extracción, agua, molienda, filtrados, inmersión, espresso, leche y latte art, cata SCA CVA, tueste para baristas, diagnóstico y diseño de recetas, bebidas clásicas y frías, y bebidas de autor con diseño y costeo de menú. Cada módulo se lee como un manual y termina con práctica, checklist y quiz." },
    { id: "farmer", nombre: "Ruta Finca", lema: "Del suelo al saco: calidad que se cultiva, se mide y se demuestra.", descripcion: "Diez módulos de campo para producir y asesorar fincas: botánica y variedades, suelos y nutrición, sombra y agroforestería, plagas y enfermedades, cosecha y madurez, beneficio y fermentación, secado y almacenamiento, calidad del café verde, trazabilidad y EUDR, y una metodología completa de consultoría con números. Pensado para Honduras y Centroamérica." }
  ],
  modulos: [
{ id: "b01-extraccion", ruta: "brewer", orden: 1, nivel: "Básico", icono: "☕", titulo: "Fundamentos de extracción", resumen: "Qué se disuelve del café, cómo se mide (TDS y % de extracción) y cómo leer la carta de control para decidir con números y con el paladar.", duracion: "3 h",
      objetivos: [
        "Explicar qué es la extracción y qué variables la controlan.",
        "Medir TDS con refractómetro y calcular el % de extracción sin errores comunes.",
        "Leer la carta de control clásica y lo que cambió con la investigación de UC Davis y la SCA.",
        "Separar fuerza (TDS) de extracción para corregir una receta con un solo cambio a la vez.",
        "Registrar preparaciones comparables en Brewer Lab."
      ],
      lecciones: [
        { id: "b01-1", titulo: "Qué es extraer: del grano a la taza", md: `Preparar café es disolver. El agua entra en las partículas molidas, disuelve compuestos (ácidos, azúcares, productos de la tostión, aceites en suspensión) y los arrastra a la taza. Cerca de un tercio de la masa del café tostado puede disolverse; nuestro trabajo es sacar la parte que sabe bien y dejar la que no.

## Lo que sale primero y lo que sale después

Un modelo simple, útil en barra, dice que los compuestos más pequeños y solubles salen primero y los más pesados después:

1. **Primero**: ácidos orgánicos y aromas volátiles. Si cortas aquí, el café queda agrio, salado y corto.
2. **Después**: azúcares y productos de Maillard que dan dulzor, cuerpo y redondez.
3. **Al final**: compuestos más amargos y astringentes. En exceso, secan la boca.

> **Dato clave:** el modelo es una simplificación. Jonathan Gagné (Coffee ad Astra) muestra que cada compuesto tiene su propia velocidad de extracción y que la molienda, las partículas finas y el flujo cambian el resultado. Úsalo como mapa, no como ley.

## Las variables que mueven la extracción

| Variable | Si la aumentas | Efecto típico | Ojo con |
|---|---|---|---|
| Finura de molienda | Más superficie | Más extracción | Más finos, flujo lento |
| Tiempo de contacto | Más tiempo | Más extracción | Amargor y astringencia |
| Temperatura del agua | Agua más caliente | Más extracción | Tuestes oscuros se vuelven ásperos |
| Agitación | Más turbulencia | Más extracción y más pareja | Canales o lecho tapado |
| Proporción de agua | Más agua por gramo | Algo más de extracción, menos fuerza | Taza aguada |

Además influyen el agua (minerales y alcalinidad), el nivel de tueste, el reposo del grano y la geometría del filtro.

## Fuerza no es lo mismo que extracción

- **Fuerza (TDS)**: qué tan concentrada está la bebida. Se siente como intensidad y cuerpo.
- **Extracción (EY o % de extracción)**: qué porcentaje del café seco terminó disuelto. Se siente como balance: agrio y vacío si es baja, amargo y secante si es alta.

Puedes tener una taza fuerte y subextraída (mucho café, poco tiempo) o una taza débil y bien extraída (receta correcta con demasiada agua). Por eso medimos las dos cosas.

## Cómo se ve en tu equipo

- En tu **V60** con el **Fellow EKG**, la temperatura y el vertido son tus palancas rápidas.
- En la **Orea**, el fondo plano da un lecho parejo: la molienda manda más que la técnica.
- En la **AeroPress** y la **prensa**, el tiempo y la molienda son casi todo.
- Con el **Timemore C5 Pro**, anota siempre los clics: es la única forma de repetir una taza.` },
        { id: "b01-2", titulo: "TDS y % de extracción: medir sin engañarte", md: `El refractómetro mide cuánto se desvía la luz en una gota de café y lo convierte en **TDS** (sólidos disueltos totales, en %). Con el TDS, el peso de la bebida y la dosis calculas la extracción.

## Las fórmulas

> **TDS (%)** = sólidos disueltos ÷ peso de la bebida × 100

> **Extracción (%)** = TDS (%) × peso de la bebida (g) ÷ dosis de café (g)

### Ejemplo con V60

- Dosis: 15 g. Agua: 250 g. Bebida en la jarra: 220 g (el lecho retiene unos 2 g de agua por gramo de café).
- TDS medido: 1,35 %.
- Extracción = 1,35 × 220 ÷ 15 = **19,8 %**.

### Ejemplo con espresso

- Dosis: 18 g. Bebida: 38 g. TDS: 9,5 %.
- Extracción = 9,5 × 38 ÷ 18 = **20,1 %**. Divide siempre entre la dosis real, pesada en la báscula.

### Inmersión (prensa, AeroPress invertida, Clever)

En inmersión, el líquido retenido en el lecho tiene la misma concentración que el de la taza. Una aproximación práctica es usar el agua total:

> Extracción ≈ TDS × agua total ÷ dosis. Ejemplo: 1,30 × 500 ÷ 30 = 21,7 %.

## Protocolo de medición

1. Pon el cero con agua destilada o con tu agua de preparación, siempre la misma y a temperatura ambiente, según el manual de tu equipo.
2. Mezcla la bebida antes de tomar la muestra: el café se estratifica.
3. Toma 2 a 3 mL con pipeta o jeringa y déjalos enfriar a temperatura ambiente en un recipiente tapado.
4. En espresso, usa siempre el mismo método: con filtro de jeringa o sin él, pero no mezcles criterios.
5. Limpia el prisma, coloca la muestra, espera unos segundos y lee 3 veces. Usa el promedio.
6. Pesa la bebida, no supongas el peso.

## Errores que inflan o hunden el número

| Error | Qué pasa | Cómo evitarlo |
|---|---|---|
| Muestra caliente | Se evapora y el TDS sube | Enfría tapada |
| No mezclar la jarra | Lees solo una capa | Remueve antes de muestrear |
| Usar el peso del agua | Extracción inflada | Pesa la bebida |
| Prisma sucio | Lecturas inestables | Limpia y seca entre muestras |
| Partículas en espresso | Lectura alta | Filtra siempre igual |

## Y si no tienes refractómetro

Puedes trabajar muy bien sin él: fija la proporción, cambia solo la molienda y evalúa por sabor (acidez, dulzor, amargor, cuerpo, final). El refractómetro no sustituye al paladar; te ayuda a entender por qué una taza sabe como sabe y a repetirla.` },
        { id: "b01-3", titulo: "La carta de control: la clásica y la nueva", md: `La carta de control de preparación nació con el trabajo de E. E. Lockhart en 1957. Pone el **TDS** en el eje vertical, la **extracción** en el horizontal y dibuja la **proporción** como líneas diagonales. Encima, unas etiquetas de sabor: subdesarrollado a la izquierda, amargo a la derecha, fuerte arriba y débil abajo.

## La zona ideal clásica

> **Zona ideal clásica difundida por la SCA:** TDS 1,15–1,35 % y extracción 18–22 %, con proporciones cercanas a 55 g de café por litro.

Para cata descriptiva con preparación en lote, el estándar SCA‑102 (2024) pide 55–60 g por litro, es decir, entre 1:17 y 1:18 aproximadamente.

## Qué le faltaba a la carta clásica

La propia SCA reconoce dos problemas:

- Mezcla **descripción** (a qué sabe) con **preferencia** (qué le gusta a la gente). No son lo mismo.
- Sus nueve rectángulos sugieren cambios bruscos de sabor. Nadie distingue 17,9 % de 18,1 % de extracción, pero la carta los pone en zonas distintas.

## Lo que encontró UC Davis con la SCA

El Coffee Center de UC Davis, con la Coffee Science Foundation, cató cientos de preparaciones de un café lavado de **Honduras** con un panel entrenado. Algunos hallazgos:

| Atributo | Sube cuando | Baja cuando |
|---|---|---|
| Amargor | Suben TDS y extracción | Bajan ambos |
| Acidez agria | Sube TDS y baja extracción | Sube la extracción |
| Dulzor | Bajan TDS y extracción | Suben ambos |
| Chocolate oscuro | Sube extracción con TDS bajo | Sube el TDS |

Y con consumidores (Cotter y colaboradores, 2021): las preferencias se reparten en un rango amplio de fuerza y extracción. Aparecieron dos grupos: la mayoría prefería tazas más suaves y un grupo prefería tazas fuertes. La temperatura de preparación no cambió la preferencia.

> **Lección para la barra:** no hay una taza correcta universal. Hay una taza correcta para un café, un método y una persona. La carta te ayuda a llegar a ella a propósito.

## Cómo usar la carta en tu bitácora

1. Ubica cada preparación con su TDS y su extracción.
2. Traza la línea de tu proporción (por ejemplo 1:16).
3. Si quieres más dulzor y claridad, prueba bajar un poco la fuerza sin bajar la extracción: más agua o menos café, misma molienda.
4. Si quieres más intensidad, sube la dosis y ajusta la molienda para no subextraer.` },
        { id: "b01-4", titulo: "Del número al paladar: rutina de calibración", md: `La calibración es un ciclo corto y disciplinado. Si cambias dos cosas a la vez, no sabrás cuál funcionó.

## El ciclo de cinco pasos

1. **Prepara** con una receta escrita: dosis, agua, proporción, molienda (clics), temperatura, vertidos y tiempo.
2. **Prueba antes de medir**: anota acidez, dulzor, amargor, cuerpo, final y limpieza. Así el número no te sugestiona.
3. **Mide**: peso de bebida, TDS y extracción.
4. **Decide un solo cambio**: casi siempre la molienda; después la proporción; al final la temperatura o la agitación.
5. **Registra** en Brewer Lab y repite.

## Matriz de decisiones

| Lo que pruebas | Lo que suele medir | Primer cambio |
|---|---|---|
| Agrio, salado, corto | Extracción baja | Moler más fino |
| Amargo, seco, áspero | Extracción alta o canales | Moler más grueso o agitar menos |
| Aguado pero equilibrado | TDS bajo | Más dosis o menos agua |
| Pesado y saturado | TDS alto | Más agua o menos dosis |
| Agrio y amargo a la vez | Extracción desigual | Revisar molienda, vertido y lecho |

## Rangos frecuentes por método

Son puntos de partida, no reglas:

| Método | TDS frecuente | Extracción frecuente |
|---|---|---|
| Filtrado (V60, Orea, Hoop) | 1,20–1,45 % | 19–23 % |
| Inmersión (prensa, Clever) | 1,20–1,40 % | 19–22 % |
| Espresso | 8–12 % | 18–22 % |

## La escalera de molienda

Es el ejercicio que más enseña:

1. Fija una receta (por ejemplo, V60 de 15 g y 250 g a 96 °C).
2. Prepara tres tazas: tu molienda habitual, 2 clics más fino y 2 clics más grueso.
3. Pruébalas a ciegas con alguien que las sirva.
4. Mide TDS y extracción, ubícalas en la carta y compara con tus notas.

> **Hábito profesional:** guarda la receta ganadora con fecha, café, días de reposo y agua usada. Un café cambia con los días; tu receta también debe hacerlo.

## Señales de que la técnica, no la receta, es el problema

- Tres preparaciones iguales dan TDS muy distintos.
- El tiempo de drenado cambia mucho sin cambiar la molienda.
- La taza es agria y amarga al mismo tiempo.

En esos casos, revisa la uniformidad de la molienda, la altura y el caudal del vertido y si el lecho queda plano al final.` }
      ],
      practica: [
        "Prepara tres V60 idénticos (15 g, 250 g) y mide TDS en cada uno. Si la diferencia supera 0,10 % de TDS, revisa tu técnica antes de cambiar la receta.",
        "Haz una escalera de molienda de tres puntos con el Timemore C5 Pro y ubica las tazas en la carta de control.",
        "Prepara un filtrado fuerte y dilúyelo en tres niveles con agua caliente. Observa cómo cambia la percepción con la misma extracción.",
        "Calcula la extracción de un espresso y de una prensa francesa con las fórmulas de la lección.",
        "Registra cada prueba en Brewer Lab con notas de sabor escritas antes de medir."
      ],
      checklist: [
        "Báscula de 0,1 g calibrada",
        "Refractómetro limpio y con el cero puesto",
        "Muestra mezclada y a temperatura ambiente",
        "Peso real de la bebida anotado",
        "Un solo cambio por prueba",
        "Notas de sabor antes de ver el número",
        "Receta completa guardada en la app"
      ],
      quiz: [
        { p: "Usas 15 g de café y obtienes 220 g de bebida con TDS de 1,35 %. ¿Cuál es la extracción aproximada?", opciones: ["19,8 %", "13,5 %", "22,0 %", "16,2 %"], correcta: 0, explicacion: "Extracción = 1,35 × 220 ÷ 15 = 19,8 %. Se usa el peso de la bebida, no el del agua." },
        { p: "En la carta de control clásica, ¿qué representa el eje vertical?", opciones: ["El % de extracción", "La fuerza de la bebida (TDS)", "La temperatura del agua", "El tiempo de contacto"], correcta: 1, explicacion: "El eje vertical es el TDS (fuerza); el horizontal, la extracción; las diagonales, la proporción." },
        { p: "Según la investigación de UC Davis y la SCA, ¿dónde se percibe más dulzor?", opciones: ["Con TDS y extracción altos", "Con TDS alto y extracción baja", "Con TDS y extracción más bajos", "Solo en el centro de la zona ideal"], correcta: 2, explicacion: "El panel encontró el pico de dulzor en la zona de TDS y extracción más bajos, al contrario del amargor." },
        { p: "Tu taza sabe agria, salada y con final corto. ¿Qué cambias primero?", opciones: ["Moler más grueso", "Bajar la temperatura", "Usar menos café con la misma agua", "Moler más fino"], correcta: 3, explicacion: "Son señales de extracción baja. Moler más fino aumenta la superficie y la extracción." },
        { p: "¿Qué pasa si mides una muestra caliente que se evapora en el prisma?", opciones: ["El TDS medido sube", "El TDS medido baja", "No cambia nada", "La extracción baja aunque el TDS suba"], correcta: 0, explicacion: "Al evaporarse agua, la muestra se concentra y el refractómetro lee más TDS del real." }
      ],
      fuentes: [
        { titulo: "Towards a New Brewing Chart", autor: "SCA News · W. Ristenpart, J.-X. Guinard y S. Frost (UC Davis)", tipo: "articulo", url: "https://sca.coffee/sca-news/25/issue-13/towards-a-new-brewing-chart-xpj8t" },
        { titulo: "Consumer preferences for black coffee are spread over a wide range of brew strengths and extraction yields", autor: "Cotter y col., Journal of Food Science (2021)", tipo: "articulo", url: "https://pubmed.ncbi.nlm.nih.gov/33340109/" },
        { titulo: "The Dynamics of Coffee Extraction", autor: "Jonathan Gagné · Coffee ad Astra", tipo: "articulo", url: "https://coffeeadastra.com/2019/01/29/the-dynamics-of-coffee-extraction/" },
        { titulo: "Coffee Value Assessment: SCA‑102 y estándares relacionados", autor: "Specialty Coffee Association", tipo: "estandar", url: "https://sca.coffee/research/coffee-standards" },
        { titulo: "Dialing In Pourovers: A Very Good Guide, Maybe the Best", autor: "Lance Hedrick", tipo: "video", url: "https://www.youtube.com/watch?v=c34qcTTOLZY" }
      ] },
{ id: "b02-agua", ruta: "brewer", orden: 2, nivel: "Básico", icono: "💧", titulo: "Agua para café", resumen: "Dureza, alcalinidad y cloro: cómo el agua cambia la extracción y el sabor, cuáles son los números de referencia y cómo preparar tu propia agua.", duracion: "2 h",
      objetivos: [
        "Explicar el papel de la dureza (calcio y magnesio) y de la alcalinidad (bicarbonato).",
        "Interpretar una etiqueta de agua o un análisis y compararlo con las referencias SCA.",
        "Preparar agua de receta con concentrados de bicarbonato y sal de Epsom.",
        "Ajustar el agua según el café, el método y el equipo (filtrado o espresso)."
      ],
      lecciones: [
        { id: "b02-1", titulo: "Por qué el agua cambia el sabor", md: `En un filtrado, alrededor del 98 % de la taza es agua. Pero no es solo el vehículo: los minerales disueltos ayudan a extraer y la alcalinidad decide cuánto de la acidez del café llega a tu boca.

## Los tres protagonistas

| Componente | Qué hace | Si hay poco | Si hay mucho |
|---|---|---|---|
| Dureza (Ca y Mg) | Ayuda a extraer compuestos de sabor | Taza plana, poco dulce | Taza pesada, sarro en equipos |
| Alcalinidad (bicarbonato) | Amortigua (neutraliza) ácidos | Acidez filosa, agria | Taza apagada, calcárea |
| Cloro y cloraminas | Ninguna ayuda | Lo ideal es cero | Sabor a piscina o medicina |

- **Dureza general (GH)**: suma de calcio y magnesio, expresada como mg/L o ppm de carbonato de calcio (CaCO3).
- **Alcalinidad (KH)**: capacidad del agua de neutralizar ácidos, también como ppm de CaCO3.
- El **magnesio** suele resaltar notas dulces y frutales; el **calcio**, cuerpo y redondez. Es una tendencia, no una regla.

## Por qué un medidor de TDS no basta

Los medidores baratos de TDS miden conductividad y la convierten en un número. No distinguen calcio de sodio ni bicarbonato de sulfato. Dos aguas de 120 ppm pueden saber muy distinto en el café.

> **Dato clave:** para el café importan la dureza y la alcalinidad por separado. Un kit de gotas de acuario para GH y KH es barato y suficiente para empezar.

## Cómo leer una etiqueta

Si la etiqueta da los minerales en mg/L, conviértelos a CaCO3:

- Calcio × 2,5 = dureza cálcica como CaCO3.
- Magnesio × 4,1 = dureza magnésica como CaCO3.
- Bicarbonato × 0,82 = alcalinidad como CaCO3.

Ejemplo: un agua con 20 mg/L de Ca, 5 mg/L de Mg y 60 mg/L de bicarbonato tiene GH ≈ 50 + 21 = 71 ppm y KH ≈ 49 ppm.

## En Honduras

El agua purificada de garrafón suele venir de ósmosis inversa y tener muy pocos minerales: es una base excelente para remineralizar. El agua de grifo varía mucho entre ciudades y temporadas; mídela antes de culparla o de confiar en ella.` },
        { id: "b02-2", titulo: "Los números de referencia", md: `No existe un agua perfecta para todo, pero sí rangos probados que te sirven de punto de partida.

## Referencia clásica de la SCA para preparar

Es la del manual de agua de 2009, todavía muy usada:

| Parámetro | Objetivo | Rango aceptable |
|---|---|---|
| Sólidos disueltos (TDS) | 150 mg/L | 75–250 mg/L |
| Dureza cálcica | 68 mg/L como CaCO3 | 17–85 mg/L |
| Alcalinidad | 40 mg/L como CaCO3 | Cerca de 40 mg/L |
| pH | 7,0 | 6,5–7,5 |
| Sodio | 10 mg/L | Cerca de 10 mg/L |
| Cloro | 0 | 0 |

## Agua para cata: estándar SCA‑102 (2024)

El protocolo de catación del Coffee Value Assessment trae su propia tabla:

> **SCA‑102:** sin cloro, dureza cálcica 50–175 ppm como CaCO3, alcalinidad cercana a 40–70 ppm como CaCO3 y pH entre 6 y 8.

## Otras referencias útiles

| Referencia | GH aprox. | KH aprox. | Carácter |
|---|---|---|---|
| Agua tipo Melbourne | 24 | 12 | Muy suave, realza acidez |
| SCA (receta BH) | 69 | 40 | Equilibrada |
| Barista Hustle | 81 | 40 | Algo más de extracción |
| Rao | 76 | 50 | Equilibrada, más amortiguada |
| Hendon | 100 | 31 | Mucha dureza, poca alcalinidad |

Valores en ppm como CaCO3, según las recetas publicadas por Barista Hustle.

## Agua para máquinas de espresso

El agua de la caldera tiene otras prioridades: evitar sarro (dureza alta) y corrosión (cloruros y aguas demasiado puras). No uses agua destilada sola en una máquina y sigue la recomendación del fabricante. El agua que te encanta para V60 no siempre es la mejor para tu caldera.` },
        { id: "b02-3", titulo: "Haz tu propia agua", md: `Con agua destilada o de ósmosis, dos sales de grado alimenticio y una báscula de 0,01 g puedes preparar agua repetible en cualquier lugar.

## Ingredientes

- **Bicarbonato de sodio** (no polvo de hornear): aporta alcalinidad.
- **Sal de Epsom** (sulfato de magnesio heptahidratado): aporta dureza.
- **Agua destilada o de ósmosis**: la base vacía.
- Dos botellas limpias y rotuladas.

## Los concentrados de Barista Hustle

| Concentrado | Preparación | Resultado |
|---|---|---|
| Buffer (alcalinidad) | 1,68 g de bicarbonato en 1 L de agua destilada | KH cercano a 1.000 ppm |
| Dureza | 2,45 g de sal de Epsom en 1 L de agua destilada | GH de 1.000 ppm |

> **Truco mental:** como cada concentrado tiene 1.000 ppm, cada gramo que agregues a un litro final aporta cerca de 1 ppm.

## Recetas para un litro

| Receta | Buffer (g) | Dureza (g) | Agua destilada (g) |
|---|---|---|---|
| Melbourne | 11,5 | 23,7 | 964,8 |
| SCA | 40,1 | 68,6 | 891,3 |
| Barista Hustle | 40,1 | 80,7 | 879,2 |
| Rao | 50,1 | 75,7 | 874,2 |
| Hendon | 30,8 | 99,9 | 869,3 |

## Paso a paso

1. Pesa la sal en un vaso limpio y disuélvela en parte del agua destilada.
2. Completa hasta 1 L y agita. La sal de Epsom puede tardar en disolverse.
3. Rotula cada botella con nombre, fecha y concentración.
4. Para el agua final, pesa primero los concentrados en una garrafa y completa con agua destilada.
5. Guarda todo tapado, en lugar fresco y oscuro.

## Atajos comerciales

Existen minerales en sobre o en gotas (Third Wave Water, Lotus, Apax Lab y otros). Son prácticos para viajar o para la finca. Ten en cuenta que Lance Hedrick es cofundador de Lotus y lo declara en sus videos.` },
        { id: "b02-4", titulo: "Ajusta el agua al café", md: `Una vez que dominas las recetas, el agua se vuelve otra variable de calibración, igual que la molienda.

## Experimento base: tres aguas, un café

1. Elige un café lavado que conozcas bien.
2. Prepara tres V60 idénticos con agua Melbourne, SCA y Hendon.
3. Sirve a ciegas y evalúa acidez, dulzor, cuerpo y claridad.
4. Repite con un natural o un tueste más oscuro.

## Qué suele pasar

| Si la taza está... | Prueba con... | Por qué |
|---|---|---|
| Plana y apagada | Menos alcalinidad | Hay menos amortiguación de la acidez |
| Agria y filosa | Un poco más de alcalinidad | Suaviza la acidez percibida |
| Débil aunque la receta esté bien | Más dureza | Ayuda a extraer más |
| Pesada o terrosa | Menos dureza | Reduce la extracción |

> **Atajo para resaltar acidez:** bajar la alcalinidad (por ejemplo, mezclar tu agua con una parte de agua destilada) suele dar más brillo sin cambiar la receta. Ajusta de a poco.

## Agua y tueste

- Tuestes claros y densos agradecen agua con algo más de dureza y poca alcalinidad.
- Tuestes medios y oscuros suelen ir mejor con aguas más suaves y algo de alcalinidad para no sacar amargor.

## Agua y método

- **Filtrados** (V60, Orea, Hoop): el agua manda mucho porque la taza es casi toda agua.
- **Espresso**: la caldera limita. Muchas cafeterías usan un agua para la máquina y otra para la barra de filtrados.
- **Cata**: usa siempre la misma agua y anótala; si no, comparas aguas y no cafés.

## Registro

En Brewer Lab anota el agua de cada preparación (receta o marca y GH/KH). Cuando cambie el sabor de un café que conoces, revisa primero el agua y después la receta.` }
      ],
      practica: [
        "Mide GH y KH de tu agua de grifo y de tu agua de garrafón con un kit de gotas y anótalos.",
        "Prepara los concentrados de buffer y de dureza y deja listas dos garrafas: SCA y Hendon.",
        "Haz el experimento de tres aguas con un mismo café y registra cuál prefieres y por qué.",
        "Convierte a CaCO3 los minerales de la etiqueta de un agua embotellada que vendan en tu ciudad."
      ],
      checklist: [
        "Sales de grado alimenticio y báscula de 0,01 g",
        "Botellas rotuladas con fecha y concentración",
        "GH y KH medidos, no supuestos",
        "Sin cloro ni olores",
        "Agua de máquina según el fabricante",
        "Agua anotada en cada registro"
      ],
      quiz: [
        { p: "¿Qué componente del agua amortigua la acidez del café?", opciones: ["El magnesio", "La alcalinidad (bicarbonato)", "El cloro", "El sodio"], correcta: 1, explicacion: "La alcalinidad neutraliza ácidos: con mucha, la taza se apaga; con muy poca, la acidez se vuelve filosa." },
        { p: "Según el estándar SCA‑102 de cata, ¿qué alcalinidad se acepta?", opciones: ["0–10 ppm", "Cerca de 40–70 ppm como CaCO3", "150–250 ppm", "Más de 200 ppm"], correcta: 1, explicacion: "La tabla de agua para cata del SCA‑102 pide alcalinidad cercana a 40–70 ppm como CaCO3, sin cloro y con pH entre 6 y 8." },
        { p: "Si disuelves 1,68 g de bicarbonato de sodio en 1 L de agua destilada, ¿qué obtienes?", opciones: ["Un concentrado con KH cercano a 1.000 ppm", "Agua lista para tomar", "Un concentrado de dureza", "Agua con pH 4"], correcta: 0, explicacion: "Es el concentrado buffer de Barista Hustle: cada gramo agregado a un litro final aporta cerca de 1 ppm de alcalinidad." },
        { p: "Un medidor de TDS marca 150 ppm. ¿Qué sabes con certeza?", opciones: ["Que la dureza es 150 ppm", "Que la alcalinidad es ideal", "Solo una estimación del total de iones; no distingue dureza de alcalinidad", "Que el agua no tiene cloro"], correcta: 2, explicacion: "Los medidores de TDS miden conductividad. Para café necesitas GH y KH por separado." },
        { p: "Tu café se siente plano y calcáreo con agua de grifo dura. ¿Qué pruebas primero?", opciones: ["Subir la temperatura", "Moler mucho más fino", "Agregar sal de Epsom", "Bajar la alcalinidad mezclando con agua destilada o usando una receta más suave"], correcta: 3, explicacion: "La alcalinidad alta apaga la acidez. Diluir o cambiar de receta suele devolver el brillo." }
      ],
      fuentes: [
        { titulo: "Barista Water Recipes Including Our Brewing Water Calculator", autor: "Barista Hustle", tipo: "articulo", url: "https://www.baristahustle.com/diy-water-recipes-redux/" },
        { titulo: "SCA‑102 Coffee Value Assessment: Sample Preparation and Tasting Mechanics (tabla de agua para cata)", autor: "Specialty Coffee Association", tipo: "estandar", url: "https://sca.coffee/research/coffee-standards" },
        { titulo: "The Best Water for Coffee - An Introduction", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=jfElZfrmlRs" },
        { titulo: "Ultimate Guide to Water for Coffee", autor: "Lance Hedrick", tipo: "video", url: "https://www.youtube.com/watch?v=tiB6TpJRmOs" }
      ] },
{ id: "b03-molienda", ruta: "brewer", orden: 3, nivel: "Básico", icono: "⚙️", titulo: "Molienda", resumen: "Cómo muele un molino, qué son los finos y las partículas grandes, qué molienda usar en cada método y cómo calibrar y repetir con tu Timemore C5 Pro.", duracion: "2 h 30 min",
      objetivos: [
        "Entender la distribución de partículas y por qué la uniformidad importa.",
        "Elegir la molienda de partida para cada método.",
        "Encontrar el cero de un molino manual y construir tu propia tabla de clics.",
        "Diagnosticar problemas de flujo y sabor causados por la molienda."
      ],
      lecciones: [
        { id: "b03-1", titulo: "Cómo muele un molino", md: `Moler es multiplicar la superficie del café para que el agua pueda extraer en minutos y no en días. La molienda es la variable que más cambia una taza y la primera que debes mover.

## Muelas, no cuchillas

Las **cuchillas** golpean el grano al azar y producen polvo y trozos grandes a la vez. Las **muelas** (cónicas o planas) cortan y trituran el grano hasta que pasa por una abertura definida: el resultado es mucho más parejo.

| Tipo | Fortalezas | Debilidades | Uso típico |
|---|---|---|---|
| Cuchillas | Barato | Muy disparejo | Emergencia |
| Muelas cónicas | Compactas, toleran bien el espresso | Más dispersión en algunos diseños | Manuales y de casa |
| Muelas planas | Distribución estrecha, gran claridad | Más caras y con más retención | Barra y filtrados exigentes |

## Finos y partículas grandes

Ningún molino produce partículas de un solo tamaño. Siempre hay una **distribución**:

- **Finos**: polvo muy pequeño que se extrae rápido y migra hacia el fondo. En exceso, tapan el filtro, alargan el drenado y aportan amargor y astringencia.
- **Partículas grandes**: se extraen poco y aportan acidez sin dulzor.
- **El centro**: la mayoría de partículas, las que definen la taza.

> **Dato clave:** una molienda más uniforme permite moler más fino sin que el flujo colapse, y eso abre la puerta a extracciones más altas y más dulces.

## Lo que también afecta

- **Alineación** de las muelas: si están desalineadas, la distribución se ensancha.
- **Velocidad** de giro: en manuales, gira a ritmo constante.
- **Retención**: café que queda dentro del molino y sale en la siguiente dosis.
- **Estática**: hace que el café vuele y se pegue. Una gota de agua sobre los granos antes de moler (técnica RDT) la reduce mucho; investigaciones recientes incluso sugieren que puede mejorar la extracción.` },
        { id: "b03-2", titulo: "Molienda por método: puntos de partida", md: `La molienda correcta depende del tiempo de contacto y de cómo fluye el agua. Más contacto pide molienda más gruesa; menos contacto, más fina.

## Tabla de partida

| Método | Molienda | Tiempo típico | Señal de ajuste |
|---|---|---|---|
| Espresso | Muy fina | 25–35 s | Flujo muy rápido o goteo |
| Moka | Fina | 3–5 min | Café quemado o débil |
| AeroPress | Fina a media‑fina | 2–3 min | Cuesta mucho presionar |
| V60 una taza | Media‑fina | 2:45–3:30 | Drenado lento o rápido |
| Orea y Kalita | Media | 3:00–4:30 | Lecho seco al final o charco |
| Hoop | Media‑gruesa | Cerca de 4:00 | Se estanca o pasa rápido |
| Chemex | Media‑gruesa | 4:00–5:00 | Filtro grueso que frena |
| Prensa francesa | Media a gruesa | 4 + 5 min | Barro o taza débil |
| Cold brew | Fina (tipo moka) | 12 h en frío | Taza vacía o turbia |

> **Referencias medidas:** para la cata, el estándar SCA‑102 pide que pase entre 70 y 75 % del café por un tamiz de 850 µm (malla US 20), un poco más grueso que un filtrado típico. La receta de cold brew de James Hoffmann usa una molienda fina de moka o AeroPress, cerca de 250 µm de apertura.

## Reglas que no fallan

- Tuestes claros y densos suelen pedir molienda **más fina** que los oscuros.
- Café muy fresco con mucho CO2 fluye distinto: dale reposo o ajusta.
- Si cambias la dosis, cambia también la molienda: más café hace un lecho más alto y más lento.
- Cuando dudes entre dos puntos, prepara ambos y pruébalos lado a lado.` },
        { id: "b03-3", titulo: "Tu Timemore C5 Pro: calibrar y repetir", md: `Un molino manual es una herramienta de precisión si lo usas con método. El objetivo es que cada clic signifique siempre lo mismo.

## Encuentra el cero

1. Vacía el molino y límpialo con una brocha.
2. Cierra la regulación con suavidad hasta que las muelas se toquen y el eje ya no gire libre. **No fuerces.**
3. Ese es tu cero. Desde ahí, cuenta clics hacia lo grueso.
4. Revisa el cero cada vez que desarmes o limpies a fondo: puede moverse uno o dos clics.

## Tu tabla personal de clics

Llénala con tus cafés y guárdala en Brewer Lab. Los valores dependen de tu unidad, del café y del agua.

| Método | Clics desde el cero | Tiempo objetivo | Notas |
|---|---|---|---|
| AeroPress | Por definir | 2:30–3:00 | Hoffmann 11 g y 200 g |
| V60 una taza | Por definir | Cerca de 3:00 | 15 g y 250 g |
| Orea Big Boy | Por definir | 4:00–4:45 | 45 g y 750 g |
| Ceado Hoop | Por definir | 4:00–5:30 | 18 g y 288 g |
| Prensa | Por definir | 4 + 5 min | 30 g y 500 g |

## Rutina de molienda repetible

1. Pesa los granos, no los midas por volumen.
2. Aplica una gota de agua con el mango de una cuchara y mezcla (RDT): menos estática y menos retención.
3. Gira a un ritmo constante, sin apurarte al final.
4. Golpea suavemente el cuerpo para sacar lo retenido.
5. Pesa el café molido: si falta más de 0,2 g, revisa la retención.

## Cuidado y limpieza

- Limpieza en seco con brocha después de cada uso.
- Limpieza a fondo cada pocas semanas según el uso: desarma, cepilla y revisa el cero.
- Nunca laves las muelas con agua ni uses arroz para limpiarlas.` },
        { id: "b03-4", titulo: "Diagnóstico por molienda", md: `Muchos problemas que parecen de receta son de molienda. Aprende a leer el lecho, el tiempo y la taza.

## Lee el lecho al final

| Lo que ves | Causa probable | Qué hacer |
|---|---|---|
| Lecho plano y parejo | Buena distribución | Mantén la técnica |
| Cráter o hueco en el centro | Vertido muy agresivo en un punto | Vierte en espiral más amplia |
| Capa de lodo fino arriba | Muchos finos o agitación excesiva | Molienda algo más gruesa o menos agitación |
| Café pegado alto en las paredes | Vertido alto en los bordes | Gira suave al final (swirl) |
| Drenado que se detiene | Finos tapando el filtro | Engrosa 1–2 clics |

## Lee la taza

- **Agria y amarga a la vez**: extracción desigual. Suele ser molienda dispareja, canales o finos.
- **Seca o astringente**: exceso de finos o de agitación. Lance Hedrick insiste en distinguir amargor de astringencia: la astringencia se siente como sequedad en la lengua y las encías.
- **Plana y sin dulzor con flujo correcto**: prueba moler más fino y compensar con menos agitación.

> **Regla de oro:** primero acierta la molienda y después ajusta la técnica. Una técnica perfecta no salva una molienda equivocada.

## Avanzado: más fino, menos agitación

Con molinos de buena uniformidad puedes moler más fino de lo habitual y reducir vertidos o remolinos para que el flujo no se tape. Así subes la extracción y el dulzor sin amargor. Pruébalo en la V60 con la escalera de molienda del módulo 1.

## Cuándo pensar en otro molino

- Si tu taza es inconsistente aunque la técnica sea buena.
- Si necesitas moler para espresso y filtrados a diario.
- Si atiendes público: un molino eléctrico de muelas planas ahorra tiempo y mejora la repetibilidad.` }
      ],
      practica: [
        "Encuentra el cero de tu Timemore C5 Pro y anótalo en Brewer Lab con la fecha.",
        "Llena tu tabla personal de clics para AeroPress, V60, Orea, Hoop y prensa.",
        "Muele la misma dosis con y sin RDT y compara la retención y la estática.",
        "Prepara dos V60 con 2 clics de diferencia y describe el lecho final de cada uno."
      ],
      checklist: [
        "Granos pesados, no medidos por volumen",
        "Cero del molino verificado",
        "Clics anotados en cada receta",
        "RDT aplicado",
        "Peso del café molido revisado",
        "Lecho final observado y anotado"
      ],
      quiz: [
        { p: "¿Qué efecto tiene un exceso de finos en un filtrado?", opciones: ["Acelera el drenado y aclara la taza", "No cambia nada", "Frena el drenado y aporta amargor o astringencia", "Solo cambia el color"], correcta: 2, explicacion: "Los finos se extraen muy rápido y migran al filtro, lo tapan y suman compuestos amargos y secantes." },
        { p: "Para la cata, el estándar SCA‑102 pide que pase por un tamiz de 850 µm...", opciones: ["Entre 70 y 75 % del café molido", "El 100 % del café", "Menos del 30 %", "Entre 40 y 50 %"], correcta: 0, explicacion: "La molienda de cata debe pasar en un 70–75 % por la malla US 20 (850 µm), un poco más gruesa que un filtrado típico." },
        { p: "Cambias de 15 g a 30 g en la V60 con el mismo punto de molienda. ¿Qué esperas?", opciones: ["Drenado más rápido", "Drenado más lento por el lecho más alto", "El mismo tiempo", "Menos extracción siempre"], correcta: 1, explicacion: "Más café forma un lecho más alto y más resistente. Normalmente hay que engrosar la molienda." },
        { p: "¿Para qué sirve la técnica RDT?", opciones: ["Para tostar más parejo", "Para medir el TDS", "Para limpiar las muelas", "Para reducir la estática y la retención al moler"], correcta: 3, explicacion: "Una gota de agua sobre los granos disipa la carga estática, así el café no vuela ni se queda pegado." },
        { p: "Tu taza es agria y amarga a la vez. ¿Qué indica?", opciones: ["Extracción desigual", "Extracción perfecta", "Agua demasiado blanda", "Tueste muy claro, sin solución"], correcta: 0, explicacion: "Partes del café se subextraen y otras se sobreextraen: molienda dispareja, canales o finos." }
      ],
      fuentes: [
        { titulo: "A Beginner's Guide to Coffee Grinders", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=bgjvLQu5NlE" },
        { titulo: "Your Grind Size Might Be Ruining Your Coffee", autor: "Lance Hedrick", tipo: "video", url: "https://www.youtube.com/watch?v=6bcN07IwkDk" },
        { titulo: "Science Discovers What We All Missed: More Than An Anti-Static Hack", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=nLnB99VJ0HE" },
        { titulo: "The Dynamics of Coffee Extraction", autor: "Jonathan Gagné · Coffee ad Astra", tipo: "articulo", url: "https://coffeeadastra.com/2019/01/29/the-dynamics-of-coffee-extraction/" },
        { titulo: "The Physics of Filter Coffee", autor: "Jonathan Gagné (libro, distribuido por Scott Rao)", tipo: "libro", url: "https://www.scottrao.com/products/physics-of-filter-coffee-jonathan-gagne" },
        { titulo: "SCA‑102: molienda y protocolo de cata", autor: "Specialty Coffee Association", tipo: "estandar", url: "https://sca.coffee/research/coffee-standards" }
      ] },
{ id: "b04-filtrados", ruta: "brewer", orden: 4, nivel: "Intermedio", icono: "🔻", titulo: "Filtrados: V60, Orea, Kalita y Chemex", resumen: "Percolación de principio a fin: cómo fluye el agua, recetas de referencia verificadas para V60, fondo plano con Orea y Kalita, Chemex y lotes grandes, y diagnóstico fino.", duracion: "4 h",
      objetivos: [
        "Explicar percolación, bypass, preinfusión y agitación.",
        "Preparar con precisión cuatro recetas de referencia de V60.",
        "Usar la Orea con filtro wave o con filtro plano y negotiator.",
        "Preparar Chemex y lotes de 2 a 4 tazas sin perder calidad.",
        "Diagnosticar un filtrado por su tiempo, su lecho y su sabor."
      ],
      lecciones: [
        { id: "b04-1", titulo: "Cómo funciona un filtrado", md: `En un filtrado el agua pasa a través del café y sale por el filtro: es **percolación**. Cada gota que entra arrastra lo que disuelve y deja su lugar a agua nueva, por eso la percolación extrae con eficiencia.

## Los conceptos que debes dominar

- **Preinfusión o bloom**: el primer vertido moja todo el café y deja escapar el CO2 del tueste. Sin bloom, el gas empuja el agua y crea zonas secas.
- **Caudal y altura**: verter rápido o desde más alto agita el lecho; verter lento y bajo lo deja quieto.
- **Agitación**: remolinos (swirl), removidos con cuchara o el propio chorro. Más agitación, más extracción, pero también más finos migrando al filtro.
- **Bypass**: agua que baja por las paredes sin pasar por el café. Diluye la taza.
- **Drenado**: el tiempo desde el último vertido hasta que el lecho queda seco. Es tu mejor termómetro de la molienda.

## Cono o fondo plano

| Característica | Cono (V60) | Fondo plano (Orea, Kalita) |
|---|---|---|
| Lecho | Profundo en el centro | Parejo y más bajo |
| Flujo | Rápido, depende mucho del vertido | Más estable |
| Tolerancia a errores | Menor | Mayor |
| Carácter típico | Claridad y acidez | Dulzor y balance |

## Temperatura con tu Fellow EKG

| Tueste | Temperatura de partida | Comentario |
|---|---|---|
| Claro | 96–100 °C | Agua recién hervida, como sugiere Hoffmann |
| Medio | 92–95 °C | Equilibrio |
| Oscuro | 85–90 °C | Menos amargor |

> **Dato clave:** el agua pierde temperatura en el vertido y en el cono. Precalienta el dripper y el servidor, y enjuaga el papel con agua caliente para quitar el sabor a papel.

## Antes de cualquier receta

1. Pesa café y agua; usa temporizador.
2. Enjuaga el filtro y descarta esa agua.
3. Haz un hueco pequeño en el centro del café para que el bloom moje parejo.
4. Anota clics, temperatura, tiempos y peso final de la bebida.` },
        { id: "b04-2", titulo: "V60: cuatro recetas de referencia", md: `Aprende estas recetas tal como fueron publicadas. Cuando las domines, modifícalas una variable a la vez.

## Resumen

| Receta | Café y agua | Temperatura | Idea central | Tiempo |
|---|---|---|---|---|
| Hoffmann Ultimate | 30 g y 500 g | Muy caliente | Dos grandes vertidos y remolino | Cerca de 3:30 |
| Hoffmann 1 taza | 15 g y 250 g | Recién hervida | Cinco vertidos de 50 g | Cerca de 3:00 |
| Kasuya 4:6 | 20 g y 300 mL | 92 °C | El 40 % define el sabor; el 60 %, la fuerza | 3:30 |
| Hedrick Ultimate | Hasta 30 g | 85–100 °C según tueste | Bloom triple y vertido turbulento | 2–4 min |

## Hoffmann: una taza mejor (2022)

1. 15 g de café molido medio‑fino y 250 g de agua blanda recién hervida.
2. 0:00 vierte 50 g para el bloom y haz un remolino suave entre 0:10 y 0:15.
3. 0:45 a 1:00 llega a 100 g; pausa.
4. 1:10 a 1:20 llega a 150 g; pausa.
5. 1:30 a 1:40 llega a 200 g; pausa.
6. 1:50 a 2:00 llega a 250 g y haz un remolino suave.
7. El drenado debería terminar cerca de 3:00.

## Hoffmann: técnica definitiva (2019)

30 g de café medio‑fino para 500 g de agua muy caliente. Bloom con el doble del peso del café, remolino y 45 s de espera. Luego llega al 60 % del agua en unos 30 s y al total en los 30 s siguientes. Remueve con suavidad, deja bajar un poco el nivel y haz un remolino para dejar el lecho plano. Apunta a terminar cerca de 3:30.

## Tetsu Kasuya: método 4:6

Campeón mundial de Brewers Cup 2016. Usa 20 g de café molido grueso y 300 mL de agua a 92 °C, en unos 3:30.

- El **primer 40 %** (120 g) se divide en dos vertidos y define el balance: más agua en el primer vertido da más acidez; menos agua, más dulzor.
- El **60 % restante** (180 g) se divide en partes iguales según la fuerza deseada: más vertidos, más fuerza.

## Lance Hedrick: receta para cualquier método

Hasta 30 g de café, molienda media y agua entre 85 y 100 °C según el tueste. Bloom con el triple del peso del café, agita (remueve o aplica WDT en húmedo) y espera de 1 a 2 minutos. Vierte el resto a 6–8 g por segundo, con la altura justa para generar turbulencia. Si drena lento, solo remolino; si drena rápido, remueve el lecho. Total: 2–3 min con bloom de 1 min, o 3–4 min con bloom de 2 min.

> **Para practicar:** prepara la misma bolsa con las cuatro recetas en una sola mañana. Descubrirás qué técnica favorece a ese café.` },
        { id: "b04-3", titulo: "Fondo plano: Orea y Kalita", md: `Los drippers de fondo plano forman un lecho parejo que se extrae de manera uniforme. Perdonan más los errores de vertido y suelen dar tazas dulces y redondas.

## El sistema Orea

Orea trabaja con tres piezas que se combinan:

| Pieza | Para qué sirve | Detalle |
|---|---|---|
| Brewer | El cuerpo del dripper | V4 angosto o ancho, Big Boy para 2 a 5 tazas |
| Filtro wave | Papel ondulado que se sostiene solo | Rápido y práctico, con algo de bypass |
| Filtro plano | Papel circular, lecho más ancho | Más dulzor y cuerpo; necesita negotiator |
| Negotiator | Molde que pega el papel plano a las paredes | Bypass mínimo o nulo |

> **Dato clave:** con papel wave hay algo de bypass y la taza puede salir un poco menos dulce y concentrada; con papel plano y negotiator el agua pasa casi toda por el café.

## Tu Orea Big Boy

Es el dripper para servir a varias personas. Usa su propio filtro wave o filtros planos con su negotiator.

- **Receta base de tu bitácora**: 45 g de café y 750 g de agua, terminando entre 4:00 y 4:45.
- **Bloom**: 90–135 g (dos a tres veces el café) durante 40–60 s.
- **Vertidos**: 3 o 4 pulsos centrados, manteniendo un nivel de agua estable sin llenar hasta el borde.
- **Final**: un remolino suave para dejar el lecho plano.
- Si termina después de 5:00, engrosa; si termina antes de 3:45 y la taza es delgada, afina.

## Kalita Wave

- Tres orificios pequeños que regulan el flujo; tamaños 155 (una taza) y 185 (dos o más).
- Punto de partida: 20 g de café y 320 g de agua (1:16), molienda media.
- Bloom de 40 g y 30–40 s; luego pulsos de 60 g cada 15–20 s.
- Tiempo total cercano a 3:00–3:30.

## Técnica de fondo plano

1. Vierte en el centro, en círculos pequeños, sin tocar las paredes.
2. Mantén la columna de agua constante: el flujo depende del nivel.
3. Usa el último remolino para nivelar.
4. Un lecho plano y sin cráteres indica una extracción pareja.` },
        { id: "b04-4", titulo: "Chemex y lotes grandes", md: `La Chemex combina un cono con un filtro de papel muy grueso. El resultado es una taza muy limpia, con poco cuerpo y mucha claridad.

## Lo que hace distinta a la Chemex

- El papel es mucho más grueso que el de una V60: retiene más aceites y finos y frena el flujo.
- Necesita **molienda más gruesa** para no alargar demasiado el drenado.
- Hay que enjuagar muy bien el papel: su sabor se nota.
- El canal del pico debe quedar libre para que salga el aire; si el papel lo sella, el flujo se detiene.

## Receta de partida

| Paso | Indicación |
|---|---|
| Café y agua | 30 g y 500 g (1:16,7) |
| Molienda | Media‑gruesa |
| Agua | 94–96 °C |
| Bloom | 60–75 g durante 45 s |
| Vertidos | Tres pulsos hasta 500 g, sin llenar más de dos tercios |
| Tiempo total | 4:00–5:00 |

## Preparar para 3 o 4 personas

Al escalar una receta, el lecho se hace más alto y el agua tarda más en atravesarlo.

- Sube la dosis manteniendo la proporción (por ejemplo, de 30 g a 45 g en la Orea Big Boy).
- **Engrosa la molienda** de 1 a 3 clics para compensar el lecho más alto.
- Aumenta el bloom en proporción a la dosis.
- Acepta tiempos un poco más largos, pero vigila la astringencia.

> **Referencia de lote:** para cata descriptiva con preparación en lote, el estándar SCA‑102 pide entre 55 y 60 g de café por litro de agua.

## Servicio

- Mezcla bien el servidor antes de servir: la primera y la última parte del café no tienen la misma concentración.
- Sirve en tazas precalentadas.
- Un filtrado de lote se mantiene bien unos 20–30 minutos en un termo cerrado; en una placa caliente se degrada en minutos.` },
        { id: "b04-5", titulo: "Técnica fina y diagnóstico", md: `Cuando ya dominas las recetas, la diferencia entre una buena taza y una excelente está en los detalles del vertido y en la lectura del drenado.

## Diagnóstico rápido

| Síntoma | Causa probable | Ajuste |
|---|---|---|
| Drenado muy largo y taza seca | Molienda fina o exceso de finos | Engrosa 1–2 clics |
| Drenado rápido y taza agria | Molienda gruesa o poco contacto | Afina 1–2 clics o alarga el bloom |
| Taza plana aunque el tiempo esté bien | Agua muy alcalina o temperatura baja | Revisa agua y sube la temperatura |
| Agria y amarga a la vez | Canales o vertido desparejo | Vierte más parejo y agrega remolino |
| Cuerpo bajo | Papel muy grueso o mucho bypass | Prueba filtro plano en la Orea |

## Variables de técnica, de menor a mayor impacto

1. Altura del vertido.
2. Número de pulsos.
3. Tamaño y duración del bloom.
4. Remolino o removido.
5. Caudal (gramos por segundo).

> **Antes de cambiar la receta:** revisa lo básico. Reposo del café, papel enjuagado, agua adecuada, báscula en cero y molino limpio explican muchas malas tazas. Hoffmann dedica un video entero a evitar los filtrados fallidos (ver fuentes).

## Material y temperatura

- Un dripper de plástico pierde menos calor que uno de cerámica fría.
- El papel cambia el flujo: si cambias de marca, recalibra la molienda.
- El servidor también enfría: precaliéntalo.

## Rutina de ajuste en barra

1. Mañana: prepara la receta base y anota el tiempo y el sabor.
2. Ajusta solo la molienda hasta que el tiempo y el sabor coincidan.
3. Si el sabor sigue plano, cambia la temperatura o el agua.
4. Al final del día, deja anotada la receta del día para el siguiente turno.` }
      ],
      practica: [
        "Prepara la V60 de una taza de Hoffmann tres días seguidos con el mismo café y anota tiempos y sabores.",
        "Prepara el método 4:6 cambiando solo el primer vertido (40 g y 80 g) y compara acidez y dulzor.",
        "En la Orea, compara filtro wave frente a filtro plano con negotiator con la misma receta.",
        "Escala la receta de la Orea Big Boy de 30 g a 45 g y encuentra los clics que mantienen el tiempo.",
        "Fotografía el lecho final de cada preparación y guárdalo con la receta."
      ],
      checklist: [
        "Filtro enjuagado y dripper precalentado",
        "Café y agua pesados; temporizador listo",
        "Temperatura ajustada en el EKG según el tueste",
        "Bloom completo, sin zonas secas",
        "Tiempo de drenado anotado",
        "Lecho final plano",
        "Peso de la bebida y notas registradas"
      ],
      quiz: [
        { p: "En la receta de una taza de Hoffmann (15 g y 250 g), ¿cuánta agua lleva el bloom?", opciones: ["30 g", "50 g", "100 g", "15 g"], correcta: 1, explicacion: "El bloom es de 50 g y luego se agregan cuatro vertidos de 50 g hasta 250 g, con un remolino al final." },
        { p: "En el método 4:6 de Tetsu Kasuya, ¿qué controla el primer 40 % del agua?", opciones: ["La fuerza de la taza", "La temperatura", "El balance entre acidez y dulzor", "El tiempo de bloom"], correcta: 2, explicacion: "Más agua en el primer vertido da más acidez; menos agua, más dulzor. El 60 % restante controla la fuerza." },
        { p: "¿Para qué sirve el negotiator de Orea?", opciones: ["Para moler más fino", "Para medir el TDS", "Para calentar el agua", "Para pegar el papel plano a las paredes y reducir el bypass"], correcta: 3, explicacion: "Moldea el filtro plano contra la geometría del dripper, así el agua no se escapa por los lados." },
        { p: "¿Qué hace distinto al papel de la Chemex?", opciones: ["Es más grueso: retiene más aceites y finos y da una taza muy limpia", "Es más delgado y deja pasar más aceites", "No necesita enjuague", "Acelera el flujo"], correcta: 0, explicacion: "El papel grueso da claridad y poco cuerpo, pero pide molienda más gruesa y un buen enjuague." },
        { p: "Escalas de 30 g a 45 g en la Orea Big Boy y el drenado se alarga mucho. ¿Qué haces primero?", opciones: ["Bajar la temperatura", "Engrosar la molienda de 1 a 3 clics", "Usar menos agua", "Eliminar el bloom"], correcta: 1, explicacion: "Un lecho más alto resiste más el paso del agua; engrosar compensa sin cambiar la proporción." }
      ],
      fuentes: [
        { titulo: "The Ultimate V60 Technique", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=AI4ynXzkSQo" },
        { titulo: "A Better 1 Cup V60 Technique", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=1oB1oDrDkHM" },
        { titulo: "James Hoffmann - Ultimate V60 Technique (receta escrita)", autor: "Hario USA", tipo: "articulo", url: "https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-uitimate-v60-technique" },
        { titulo: "Hario V60 Recipe & Interview with Hario Ambassador Tetsu Kasuya", autor: "Hario UK", tipo: "articulo", url: "https://www.hario.co.uk/blogs/hario-ambassadors/hario-v60-recipe-interview-with-hario-ambassador-tetsu-kasuya" },
        { titulo: "ULTIMATE POUROVER RECIPE (any method)", autor: "Lance Hedrick", tipo: "video", url: "https://www.youtube.com/watch?v=BG5Tc8MR2_4" },
        { titulo: "OREA: The Complete Guide to Brewers, Filters & Negotiators", autor: "Rogue Wave Coffee", tipo: "articulo", url: "https://roguewavecoffee.ca/pages/orea-the-complete-guide-to-brewers-filters-negotiators" },
        { titulo: "The Chemex", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=ikt-X5x7yoc" },
        { titulo: "How To Avoid A Bad Pour Over Brew", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=mMwscUNKbPk" }
      ] },
{ id: "b05-inmersion", ruta: "brewer", orden: 5, nivel: "Intermedio", icono: "🫖", titulo: "Inmersión: prensa, AeroPress, Clever y Hoop", resumen: "Métodos donde el café y el agua conviven: por qué perdonan errores, recetas verificadas de prensa francesa, AeroPress y Clever, y cómo sacar lo mejor de tu Ceado Hoop.", duracion: "3 h",
      objetivos: [
        "Explicar la diferencia entre inmersión y percolación y sus consecuencias en la taza.",
        "Preparar prensa francesa limpia, sin barro, con la técnica de Hoffmann.",
        "Dominar la AeroPress estándar y sus variantes.",
        "Usar la Clever y el Hoop con recetas repetibles y saber qué los hace distintos."
      ],
      lecciones: [
        { id: "b05-1", titulo: "Inmersión: el método que perdona", md: `En la inmersión todo el café está en contacto con toda el agua durante un tiempo y después se separa con un filtro. A medida que el agua se carga de café, extrae más despacio: la extracción se frena sola. Por eso estos métodos toleran errores de vertido y son tan repetibles.

## Inmersión frente a percolación

| Aspecto | Inmersión | Percolación |
|---|---|---|
| Cómo extrae | Agua y café juntos un tiempo fijo | Agua nueva que atraviesa el lecho |
| Variable principal | Tiempo y molienda | Molienda, caudal y vertido |
| Técnica necesaria | Baja | Media a alta |
| Repetibilidad | Muy alta | Depende del barista |
| Carácter típico | Cuerpo y dulzor | Claridad y brillo |

> **Dato clave:** en inmersión la extracción depende sobre todo de la molienda y del tiempo. Si fijas ambos, la taza se repite casi sola.

## El filtro define el cuerpo

| Método | Filtro | Cuerpo | Comentario |
|---|---|---|---|
| Prensa francesa | Malla metálica | Alto, con aceites | Algo de sedimento |
| AeroPress | Papel (o metal) | Medio | Muy versátil |
| Clever | Papel cónico | Medio‑bajo | Taza limpia |
| Hoop | Papel, sin bypass | Medio | Taza dulce y limpia |

## Agitación en inmersión

Remover al inicio asegura que todo el café se moje. Remover de más al final levanta finos y ensucia la taza. La regla práctica: **moja todo al principio y deja que el tiempo trabaje**.

## Cuándo elegir inmersión

- Para enseñar o servir a alguien que empieza: es casi imposible fallar.
- En la finca o de viaje: poco equipo, buen resultado.
- Para catar orígenes: la cata SCA es, en esencia, una inmersión.` },
        { id: "b05-2", titulo: "Prensa francesa sin barro", md: `La prensa francesa tiene mala fama por el sedimento, pero con paciencia da una de las tazas más dulces y completas. La clave es esperar en vez de presionar.

## Técnica de Hoffmann (receta de tu bitácora)

| Paso | Indicación |
|---|---|
| Café y agua | 30 g y 500 g (1:16,7) |
| Molienda | Media |
| Agua | Recién hervida |
| Primera espera | 4 minutos |
| Segunda espera | 5 a 8 minutos más |

1. Pon el café en la prensa, vierte 500 g de agua recién hervida y espera **4 minutos**.
2. Rompe la costra removiendo suavemente: la mayor parte del café se hundirá.
3. Retira con dos cucharas la espuma y las partículas que flotan.
4. Espera **5 a 8 minutos más**: los finos se van al fondo y la taza se enfría a temperatura de beber.
5. Coloca el émbolo solo hasta la superficie, **sin empujar hacia abajo**: la malla actúa como colador.
6. Sirve despacio y deja el último poco en la prensa, donde está el sedimento.

> **Por qué funciona:** al no presionar, no levantas los finos del fondo. El tiempo extra casi no aumenta la extracción porque el agua ya está cargada y se ha enfriado.

## Ajustes

- Taza débil o ácida: muele un poco más fino o sube a 32–33 g.
- Taza amarga o pesada: engrosa la molienda o baja a 28 g.
- Mucho sedimento: revisa los finos del molino y no remuevas al final.

## Variante para la finca

En visitas, la prensa sirve para catar rápido: misma receta, varias prensas pequeñas en fila, misma molienda y tiempos escalonados de 30 segundos para servir todas a la vez.` },
        { id: "b05-3", titulo: "AeroPress: estándar y variantes", md: `La AeroPress combina inmersión y una leve presión final con filtro de papel. Es la herramienta más versátil de tu equipo y tiene hasta su propio campeonato mundial.

## Técnica de Hoffmann (2021)

| Paso | Indicación |
|---|---|
| Café | 11 g, molienda en el lado fino de media |
| Agua | 200 g recién hervida |
| Montaje | Normal, no invertido; sin enjuagar ni precalentar |
| Tiempo | 2 min de reposo, remolino, 30 s más y prensar |

1. Coloca el filtro en la tapa. Pon el café en la cámara.
2. Sobre la báscula, agrega 200 g de agua mojando todo el café durante el vertido.
3. Inicia el temporizador e inserta el émbolo 1 cm para crear vacío y frenar el goteo.
4. Espera 2 minutos.
5. Sujetando cámara y émbolo, haz un remolino suave.
6. Espera 30 segundos y presiona suave hasta el final.

> **Ajuste por tueste:** cuanto más oscuro el café, más conviene subir la dosis y engrosar la molienda, según el propio Hoffmann.

## Variantes útiles

- **Invertida**: el émbolo abajo y la cámara arriba. Evita el goteo y permite inmersiones más largas. Cuidado al voltearla con agua caliente.
- **Concentrada con bypass**: prepara con poca agua y diluye al final con agua caliente. Útil para servir rápido o para hacer bebidas con leche.
- **Filtro metálico**: más cuerpo y aceites, menos claridad.

## Lo que enseñan las competencias

El World AeroPress Championship publica cada año las recetas ganadoras. Sus constantes: control de temperatura según el café, tiempos cortos, presión suave y, muchas veces, dilución final. Estudiar esas recetas es un gran ejercicio de diseño.

## Diagnóstico

| Síntoma | Ajuste |
|---|---|
| Cuesta mucho presionar | Engrosa la molienda o presiona más lento |
| Taza ácida y vacía | Muele más fino o alarga el reposo |
| Taza amarga | Baja la temperatura o engrosa |
| Taza débil | Sube la dosis o diluye menos |` },
        { id: "b05-4", titulo: "Clever y Hoop: inmersión con papel y sin bypass", md: `Tanto la Clever como el Hoop separan el café con papel, pero funcionan de forma distinta. Entender su mecánica evita frustraciones.

## Clever Dripper

Es un cono con una válvula: retiene el agua mientras está sobre la mesa y la libera al apoyarlo sobre la taza. Es inmersión pura seguida de un drenado por papel.

**Técnica de Hoffmann (agua primero)**

1. 15 g de café molido medio‑fino y 250 g de agua caliente.
2. Vierte primero el agua y después el café: así el café no tapa el filtro al drenar.
3. Remueve para mojar todo y espera 2 minutos.
4. Rompe la costra, espera 30 segundos y apoya la Clever sobre la taza.
5. El drenado debería tardar cerca de un minuto.

## Ceado Hoop

El Hoop no es una inmersión clásica. Viertes toda el agua en el anillo exterior y el aparato la dosifica hacia el lecho por pequeñas aberturas, como si alguien vertiera por ti con un caudal constante. No hay bypass: toda el agua atraviesa el café.

- Scott Rao, que lo distribuye, recomienda **molienda gruesa** con los filtros estándar y un tiempo total **cercano a 4:00**.
- **No necesita bloom ni remolinos**: vierte el agua lentamente en el anillo y deja que trabaje.
- Si se forma una costra gruesa (café muy fresco o tueste oscuro), rómpela y sumérgela con una herramienta WDT, un tenedor o un batidor.
- Rao ofrece filtros mejorados que permiten moler más fino.

> **Tu receta base:** 18 g y 288 g (1:16), terminando entre 4:00 y 5:30. Si se estanca, engrosa; si queda débil, afina un poco.

## Hoffmann sobre el Hoop

En su reseña de 2025, Hoffmann valora que el diseño haga más fácil preparar bien a más personas y señala aspectos que le gustaría ver mejorados. Mira el video completo antes de comprar filtros o accesorios.

## Cuándo usar cada uno

| Situación | Mejor opción | Por qué |
|---|---|---|
| Taza limpia sin técnica | Clever | Inmersión y papel |
| Repetir sin vigilar | Hoop | Dosifica el agua por ti |
| Cuerpo máximo | Prensa | Malla metálica |
| Viaje o finca | AeroPress | Liviana y versátil |` }
      ],
      practica: [
        "Prepara la prensa de Hoffmann y compara contra una prensa presionada a los 4 minutos. Describe el sedimento y el dulzor.",
        "Prepara la AeroPress de Hoffmann con un café claro y con uno oscuro; ajusta dosis y molienda según la lección.",
        "Busca una receta ganadora del World AeroPress Championship y prepárala tal cual.",
        "Prepara el mismo café en Clever (agua primero) y en Hoop (18 g y 288 g) y compara claridad y cuerpo.",
        "Registra en Brewer Lab el tiempo de drenado de la Clever y del Hoop."
      ],
      checklist: [
        "Agua recién hervida para prensa y AeroPress",
        "Tiempos de reposo cronometrados",
        "Costra rota y espuma retirada en la prensa",
        "Émbolo sin presionar en la prensa",
        "Agua primero en la Clever",
        "Hoop sin bloom, con vertido lento en el anillo",
        "Resultados anotados con clics y tiempos"
      ],
      quiz: [
        { p: "¿Por qué la inmersión es más repetible que la percolación?", opciones: ["Porque usa más café", "Porque la extracción depende sobre todo de la molienda y el tiempo, y se frena sola", "Porque el agua está más fría", "Porque no usa filtro"], correcta: 1, explicacion: "A medida que el agua se carga de café, extrae más despacio. Fijando molienda y tiempo, la taza se repite." },
        { p: "En la técnica de prensa de Hoffmann, ¿qué haces con el émbolo?", opciones: ["Lo bajas con fuerza a los 4 minutos", "Lo bajas a mitad del recipiente", "Lo apoyas solo en la superficie y sirves sin presionar", "No usas émbolo"], correcta: 2, explicacion: "La malla actúa como colador; al no presionar, los finos se quedan en el fondo." },
        { p: "En la AeroPress de Hoffmann, ¿para qué se inserta el émbolo 1 cm al inicio?", opciones: ["Para generar vacío y frenar el goteo", "Para presionar más fuerte", "Para enfriar el café", "Para medir el TDS"], correcta: 0, explicacion: "El vacío retiene el agua en la cámara durante el reposo." },
        { p: "¿Qué hace distinto al Ceado Hoop?", opciones: ["Es una prensa con filtro metálico", "Necesita un bloom largo", "Requiere molienda de espresso", "Dosifica el agua desde un anillo exterior hacia el lecho, sin bypass"], correcta: 3, explicacion: "Toda el agua atraviesa el café a un caudal controlado; Rao recomienda molienda gruesa y cerca de 4:00." },
        { p: "En la Clever, ¿por qué conviene verter el agua antes que el café?", opciones: ["Para que el café no tape el filtro durante el drenado", "Para enfriar el agua", "Para que haya más crema", "Para usar menos café"], correcta: 0, explicacion: "Con el agua primero, el café flota y no se compacta contra el papel; el drenado es más rápido y parejo." }
      ],
      fuentes: [
        { titulo: "The Ultimate French Press Technique", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=st571DYYTR8" },
        { titulo: "The Ultimate AeroPress Technique (Episode #3)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=j6VlT_jUVPc" },
        { titulo: "The Ultimate Clever Dripper Technique", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=RpOdennxP24" },
        { titulo: "Introducing the Ceado Hoop", autor: "Scott Rao", tipo: "articulo", url: "https://www.scottrao.com/blog/ceado-hoop" },
        { titulo: "The Hoop Brewer Review: Almost A Slam Dunk", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=-g_Bcng41Js" },
        { titulo: "Immersion Coffee Brewing Is Better Than Percolation", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=09fNvoQMlGw" },
        { titulo: "World AeroPress Championship", autor: "World AeroPress Championship", tipo: "articulo", url: "https://worldaeropresschampionship.com/" }
      ] },
{ id: "b06-espresso", ruta: "brewer", orden: 6, nivel: "Intermedio", icono: "🎯", titulo: "Espresso y calibración", resumen: "Dosis, rendimiento, tiempo, presión y temperatura; preparación del puck; un método de calibración por sabor y con números; y la moka como espresso de estufa.", duracion: "4 h",
      objetivos: [
        "Definir dosis, rendimiento, proporción y tiempo, y medirlos bien.",
        "Preparar un puck parejo: dosis, distribución, compactación y limpieza.",
        "Calibrar un café nuevo en pocos disparos con un método ordenado.",
        "Reconocer canalización y corregirla.",
        "Preparar moka con buena técnica y entender en qué se diferencia del espresso."
      ],
      lecciones: [
        { id: "b06-1", titulo: "Anatomía de un espresso", md: `Un espresso es una percolación a presión: agua caliente atraviesa una pastilla de café muy fino y compacto a unos 9 bar. En 25–35 segundos obtienes una bebida concentrada, con crema y mucho cuerpo.

## Las cuatro medidas que mandan

| Medida | Qué es | Cómo se mide |
|---|---|---|
| Dosis | Café seco en el portafiltro | Báscula, en gramos |
| Rendimiento | Bebida en la taza | Báscula bajo la taza |
| Proporción | Rendimiento ÷ dosis | Ejemplo: 18 g a 36 g = 1:2 |
| Tiempo | Desde que arranca la bomba | Temporizador |

> **Dato clave:** mide el rendimiento en gramos, no en mililitros. La crema engaña al ojo; la báscula no.

## Estilos por proporción

| Estilo | Proporción | Tiempo orientativo | Carácter |
|---|---|---|---|
| Ristretto | 1:1 a 1:1,5 | 20–30 s | Denso, intenso, menos amargo |
| Normale | 1:2 | 25–32 s | Balance clásico |
| Lungo | 1:2,5 a 1:3 | 30–40 s | Más ligero, más extraído |
| Alta extracción, flujo rápido | 1:2,5 a 1:3 | 15–20 s | Claridad, menos cuerpo |

## Las otras variables

- **Temperatura**: 90–96 °C según el tueste. Más caliente para tuestes claros.
- **Presión**: el estándar es 9 bar; muchas máquinas permiten preinfusión a baja presión.
- **Canasta**: su tamaño fija la dosis útil. Respeta la capacidad (por ejemplo, 18 g en una de 18 g).

## Lo que dice la ciencia reciente

Un estudio publicado en la revista Matter (2020) mostró con modelos matemáticos y experimentos que moler más fino no siempre extrae más: si el lecho se tapa, el agua busca caminos y la extracción cae y se vuelve inconsistente. Los autores lograron espressos más repetibles con **menos dosis y molienda algo más gruesa**. Hoffmann lo comenta en su video «Did Science Just Reinvent Espresso?».` },
        { id: "b06-2", titulo: "El puck: preparación y canalización", md: `La mayoría de los espressos fallidos no son culpa de la receta sino del puck. El objetivo es que el agua encuentre la misma resistencia en todo el lecho.

## Rutina de preparación

1. **Purga** el grupo y seca la canasta.
2. **Dosifica** pesando: ±0,1 g de tu objetivo.
3. **Distribuye** con una herramienta WDT (agujas finas) en círculos desde el fondo hasta arriba: deshace grumos y empareja la densidad.
4. **Compacta** a nivel. La fuerza exacta importa poco; que quede plano importa mucho.
5. **Limpia** el borde del portafiltro y engancha sin golpes.
6. **Arranca** de inmediato y coloca la taza en la báscula.

## Señales de canalización

| Señal | Qué ves | Causa común |
|---|---|---|
| Chorros laterales | Rocío o chorros finos | Grumos o mala distribución |
| Rubio muy temprano | Color claro a los pocos segundos | Canal abierto en el puck |
| Huecos en el puck | Agujeros al sacar la pastilla | Compactación desnivelada |
| Sabor agrio y amargo | Taza confusa | Extracción desigual |

> **Regla práctica:** si dos espressos con la misma receta dan tiempos muy distintos, el problema es la preparación, no la molienda.

## Accesorios: cuáles sí y cuáles no

- **WDT**: sí; es el que más ayuda.
- **Tamper calibrado o nivelador**: útil para la consistencia entre baristas.
- **Filtro de papel o malla sobre el puck**: puede mejorar la uniformidad; pruébalo y mide.
- **Golpear el portafiltro después de compactar**: no; agrieta el puck.

## Limpieza diaria

- Purga antes y después de cada disparo.
- Cepilla la ducha al cierre y haz retrolavado según el fabricante.
- Aceites viejos dan sabor rancio: limpia portafiltros y canastas con detergente para máquinas.` },
        { id: "b06-3", titulo: "Calibrar un café nuevo", md: `Calibrar es encontrar la receta que hace brillar ese café en esa máquina, ese día. Con método, se logra en 4 a 6 disparos.

## El método en cuatro pasos

1. **Fija la dosis** según tu canasta (por ejemplo, 18 g).
2. **Fija la proporción** de partida: 1:2 para tuestes medios, 1:2,2–1:2,5 para tuestes claros.
3. **Ajusta la molienda** hasta caer en la ventana de tiempo (25–32 s). No pruebes aún el sabor si estás muy lejos del tiempo.
4. **Prueba y ajusta la proporción**: es la herramienta fina del sabor.

## Tabla de sabor

| Sabor | Interpretación | Ajuste |
|---|---|---|
| Agrio, salado, corto | Subextracción | Sube la proporción (más rendimiento) o muele más fino |
| Amargo, seco, áspero | Sobreextracción | Baja la proporción o engrosa |
| Débil, aguado | Poca concentración | Baja la proporción o sube la dosis |
| Intenso pero plano | Falta de dulzor | Sube un poco la temperatura o la proporción |
| Agrio y amargo | Canales | Revisa el puck |

> **Lance Hedrick** calibra en su guía de 2025 cinco cafés muy distintos, de un geisha ultraclaro a un tueste oscuro, pasando por un café de proceso intenso y uno ya viejo, con consejos de temperatura para cada caso. La lección: cada café pide su propia receta.

## Con refractómetro

- TDS habitual del espresso: 8–12 %.
- Extracción habitual: 18–22 %.
- Mide siempre con el mismo método (con o sin filtro de jeringa) para comparar.

## Espresso para bebidas con leche

La leche diluye y cubre la acidez. Muchos baristas usan una proporción más corta (1:1,5 a 1:2) y algo más de dosis para que el café atraviese la leche. Calibra probando el espresso solo y también dentro de un capuchino.` },
        { id: "b06-4", titulo: "Moka: el café de estufa", md: `La moka no es un espresso: trabaja a una presión mucho menor, generada por el vapor del agua que calientas en la base. Aun así, bien hecha, da una bebida intensa, dulce y con cuerpo.

## Cómo funciona

El agua de la base se calienta, el vapor empuja el agua caliente hacia arriba a través del café y la bebida sale por la chimenea al depósito superior. Si el agua se calienta demasiado o demasiado tiempo, el café se quema y se vuelve amargo.

## Técnica recomendada

1. Llena la base con agua **ya caliente** (recién hervida) hasta justo por debajo de la válvula. Reduce el tiempo en el fuego y el sabor a metal quemado.
2. Llena el filtro con café molido fino (más grueso que espresso), **a ras y sin compactar**. Nivela con el dedo.
3. Arma la moka con un paño (la base quema) y ponla a **fuego medio‑bajo** con la tapa abierta.
4. Cuando el café salga de color miel claro y empiece a burbujear, **retírala del fuego** y enfría la base bajo el chorro de agua fría o con un paño húmedo.
5. Sirve de inmediato. Si lo quieres más suave, diluye con agua caliente.

## Diagnóstico

| Síntoma | Causa probable | Ajuste |
|---|---|---|
| Amargo y quemado | Fuego alto o se dejó hasta el final | Fuego más bajo y corta antes |
| Ácido y débil | Molienda gruesa o filtro incompleto | Más fino y filtro lleno |
| Sale a chorros | Fuego muy alto | Baja la llama |
| No sube | Molienda muy fina o café compactado | Engrosa y no compactes |

> **Seguridad:** nunca superes la válvula al llenar y revisa que esté limpia; es la que libera presión si algo se tapa.

## Para qué usarla

- Base de bebidas con leche en casa (un «latte de moka»).
- Café fuerte para la mañana o para postres.
- Para mostrar en la finca cómo se toma el café en muchos hogares de la región.` }
      ],
      practica: [
        "Calibra un café nuevo en máximo 6 disparos siguiendo el método y anota cada cambio.",
        "Prepara tres espressos con 1:1,5, 1:2 y 1:2,5 con la misma molienda y describe la diferencia.",
        "Haz un disparo sin WDT y otro con WDT; compara tiempos y fotos del puck.",
        "Prepara moka con agua fría y con agua caliente en la base y compara el amargor.",
        "Mide TDS y calcula la extracción de tu mejor espresso de la semana."
      ],
      checklist: [
        "Dosis pesada a ±0,1 g",
        "WDT y compactación a nivel",
        "Báscula bajo la taza desde el inicio",
        "Tiempo desde que arranca la bomba",
        "Un solo cambio por disparo",
        "Purga y limpieza del grupo",
        "Moka: agua caliente, café sin compactar y fuego medio‑bajo"
      ],
      quiz: [
        { p: "Usas 18 g de café y obtienes 36 g de bebida. ¿Qué proporción es?", opciones: ["1:1", "1:3", "1:2", "2:1"], correcta: 2, explicacion: "Rendimiento ÷ dosis = 36 ÷ 18 = 2. Proporción 1:2, el estilo normale." },
        { p: "Tu espresso sabe agrio, salado y corto. ¿Qué ajuste pruebas?", opciones: ["Subir la proporción o moler más fino", "Bajar la temperatura", "Moler más grueso", "Usar menos rendimiento"], correcta: 0, explicacion: "Son señales de subextracción: más rendimiento o más finura aumentan la extracción." },
        { p: "Dos espressos con la misma receta dan 22 s y 34 s. ¿Qué revisas primero?", opciones: ["La molienda", "El puck: distribución y compactación", "El agua", "La taza"], correcta: 1, explicacion: "Si la receta es igual y el tiempo cambia mucho, el problema suele ser la preparación del puck." },
        { p: "¿Qué propuso el estudio publicado en Matter (2020) para espressos más repetibles?", opciones: ["Moler lo más fino posible", "Subir la presión a 15 bar", "Usar agua destilada", "Usar menos dosis y molienda algo más gruesa"], correcta: 3, explicacion: "Con molienda demasiado fina el lecho se tapa y aparecen canales; menos dosis y más grosor dieron extracciones más estables." },
        { p: "En la moka, ¿cuándo debes retirarla del fuego?", opciones: ["Cuando el café sale color miel claro y empieza a burbujear", "Cuando la base está vacía por completo", "Apenas hierve el agua", "Después de 10 minutos"], correcta: 0, explicacion: "Cortar a tiempo y enfriar la base evita el sabor a quemado del final." }
      ],
      fuentes: [
        { titulo: "Understanding Espresso - Dose (Episode #1)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=aTFsBqhpLes" },
        { titulo: "Understanding Espresso - Ratio (Episode #2)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=F4wrUP4c5P4" },
        { titulo: "Understanding Espresso - Brew Time (Episode #3)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=hQaV3w_XNiw" },
        { titulo: "Understanding Espresso: Pressure (Episode #6)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=po3oGIicu-8" },
        { titulo: "Dialing in Espresso: A Very Good Guide, Maybe the Best", autor: "Lance Hedrick", tipo: "video", url: "https://www.youtube.com/watch?v=EPF1_15KZvM" },
        { titulo: "Systematically Improving Espresso: Insights from Mathematical Modeling and Experiment", autor: "Cameron, Hendon y col. · Matter (2020)", tipo: "articulo", url: "https://doi.org/10.1016/j.matt.2019.12.019" },
        { titulo: "Did Science Just Reinvent Espresso?", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=BoYBLn9hRqs" },
        { titulo: "The Ultimate Moka Pot Technique (Episode #3)", autor: "James Hoffmann", tipo: "video", url: "https://www.youtube.com/watch?v=BfDLoIvb0w4" }
      ] }
  ]
};
