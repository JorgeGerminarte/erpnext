# Imágenes de la web

Guarda aquí las imágenes con **estos nombres exactos** (vale .jpg, .webp o .png). La web las usa sola en cuanto
existen; si falta alguna, se ve el marcador de color con el nombre del archivo.

| Archivo | Formato | Dónde sale |
|---|---|---|
| `hero-clinica.jpg` | 16:9 · 2400×1350 | Fondo del hero (capa trasera del parallax) |
| `planta-colgante.png` | PNG transparente · ~1600 px | Hero, rama que cuelga arriba a la derecha (la web la desenfoca) |
| `planta-derecha.png` | PNG transparente · ~1600 px | Hero abajo a la derecha y los dos lados del umbral (la izquierda es la misma en espejo) |
| `clinica-sala.jpg` | 16:9 · 2000×1125 | "Desde 2006", foto grande (sala de espera) |
| `clinica-detalle.jpg` | 1:1 · 1200×1200 | "Desde 2006", foto pequeña superpuesta: foto real de una consulta (si no existe, no se muestra). Con pacientes reconocibles, hace falta su consentimiento por escrito |
| `umbral-puerta.jpg` | 1:1 · 2048×2048 | El umbral: pared de la clínica con la puerta abierta. Si cambias la foto, ajusta `data-door="x y"` en `index.html` al centro del hueco (0–1) |
| `umbral-rehab.jpg` | 1:1 · 2048×2048 | El umbral: la sala de REHAB al otro lado |
| `rehab-sala.jpg` | 16:9 · 2000×1125 | Presentación de REHAB |
| `equipo-angel-juan.jpg`, `equipo-2.jpg`… | 4:5 | **Fotos reales** del equipo |

Las imágenes generadas con IA son para la maqueta. Antes de publicar la web conviene
sustituir las salas por fotos reales del local: los pacientes esperan ver el sitio al que van.

Comprime cada JPG por debajo de ~400 KB (por ejemplo con squoosh.app).

## Estilo común (añádelo al principio de cada prompt)

> Fotografía editorial de interiorismo, estilo revista de arquitectura, luz cálida y suave,
> paleta de arena, beige, topo y gris cálido, materiales naturales (madera clara, lino, microcemento),
> minimalismo sereno, mucho espacio vacío, sin personas, sin texto, sin logotipos, sin marcas,
> fotorrealista, objetivo 35 mm, profundidad de campo suave.

## Prompts

**1. hero-clinica.jpg (16:9)**
> Sala de fisioterapia premium con una camilla de tratamiento tapizada en lino color arena, junto a
> una gran ventana con cortina translúcida por la que entra luz de media tarde. Paredes de estuco
> beige, suelo de madera clara, una planta de olivo en maceta de barro y una rama de eucalipto en un
> jarrón. La mitad izquierda de la imagen más despejada y luminosa (ahí irá el texto); la camilla y
> la ventana en la mitad derecha. Ambiente de calma y cuidado, como un spa médico discreto.

**2. planta-colgante.png (fondo transparente)**
> Rama de olivo o de eucalipto que cae desde la esquina superior derecha hacia la izquierda, hojas
> estrechas verde salvia apagado, recortada sobre fondo totalmente transparente, sin maceta, sin
> sombra, iluminación suave lateral cálida, fotografía de producto recortada, PNG con canal alfa.

**3. planta-derecha.png (fondo transparente)**
> Ramas de olivo que crecen desde el borde inferior de la imagen hacia arriba, inclinándose
> ligeramente hacia la izquierda, 3 o 4 tallos finos con hojas estrechas verde salvia apagado,
> recortadas sobre fondo totalmente transparente, sin maceta, sin sombra, luz cálida lateral,
> PNG con canal alfa. La base de las ramas debe tocar el borde inferior.

**4. clinica-sala.jpg (16:9)**
> Rincón de recepción de una clínica de fisioterapia boutique: mostrador bajo de madera clara,
> banco tapizado en lino beige, pared de estuco arena, planta grande en maceta de barro, luz
> natural cálida lateral, composición vertical tranquila.

**5. clinica-detalle.jpg (1:1)**
> Bodegón cercano sobre una camilla de fisioterapia: toalla de lino doblada color arena, una rama
> de eucalipto y un pequeño frasco de aceite de masaje de vidrio ámbar, luz de ventana suave,
> fondo desenfocado beige.

**6. umbral-puerta.jpg (1:1) — la imagen más importante**
> Vista frontal y perfectamente simétrica de una pared de estuco beige cálido, iluminada por luz
> natural suave. **En el centro exacto de la imagen** hay una puerta abierta estrecha y alta, sin hoja
> visible (solo el hueco con un marco fino de madera clara), que ocupa aproximadamente el 20 % del
> ancho y el 45 % del alto de la imagen; el centro del hueco coincide con el centro de la imagen. A través del hueco se ve una
> sala oscura con techo negro y una línea de luz LED cálida indirecta en el techo. Un resplandor
> ámbar sale por la puerta al suelo de madera clara. Plantas de olivo a ambos lados, fuera del hueco.
> Contraste entre el lado claro (clínica) y el oscuro (sala de entrenamiento).

**7. umbral-rehab.jpg (1:1)**
> Interior de una sala de readaptación y entrenamiento minimalista y premium, vista frontal
> simétrica desde la entrada. Techo muy oscuro casi negro, con una línea continua de luz LED cálida
> indirecta (2700 K) cerca del techo que cruza la imagen. Paredes gris topo, suelo de caucho gris
> oscuro, al fondo un espejo largo y un rack de pesas ordenado y discreto, la parte central inferior
> despejada (ahí irá el texto). Nada de estética de gimnasio agresivo: sobrio, silencioso, de hotel.

**8. rehab-sala.jpg (16:10)**
> Detalle de la misma sala de readaptación: un banco de madera con unas mancuernas hexagonales
> gris topo, una kettlebell y una tablet apoyada mostrando una gráfica de evolución sencilla en
> tonos ámbar, techo oscuro con luz LED cálida indirecta, pared gris topo, sin personas.
