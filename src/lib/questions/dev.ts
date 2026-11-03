import { bank, type Category } from './types';

export const DEV_CATEGORIES: Category[] = [
  { id: 'html', mode: 'dev', label: 'HTML', emoji: '🧱' },
  { id: 'css', mode: 'dev', label: 'CSS', emoji: '🎨' },
  { id: 'js', mode: 'dev', label: 'JavaScript', emoji: '⚡' },
  { id: 'ts', mode: 'dev', label: 'TypeScript', emoji: '🔷' },
  { id: 'a11y', mode: 'dev', label: 'Accesibilidad', emoji: '♿' },
  { id: 'web', mode: 'dev', label: 'Git y web', emoji: '🌐' },
];

const q = bank('dev');

export const DEV_QUESTIONS = [
  // --- HTML ---
  q('html', 'facil', '¿Qué etiqueta define el título que aparece en la pestaña del navegador?', ['<title>', '<h1>', '<header>', '<meta name="title">'], '<title> va dentro de <head> y es también el título que usan los buscadores.'),
  q('html', 'facil', '¿Qué atributo da un texto alternativo a una imagen?', ['alt', 'title', 'src', 'label'], 'El texto de alt lo leen los lectores de pantalla y se muestra si la imagen no carga.'),
  q('html', 'facil', '¿Qué elemento es el más adecuado para la navegación principal del sitio?', ['<nav>', '<menu>', '<aside>', '<section>'], '<nav> crea un punto de referencia que los lectores de pantalla permiten saltar.'),
  q('html', 'facil', '¿Qué etiqueta crea un enlace a otra página?', ['<a>', '<link>', '<href>', '<url>'], '<a href="…"> es el enlace; <link> enlaza recursos como hojas de estilo desde <head>.'),
  q('html', 'media', '¿Qué hace el atributo defer en una etiqueta <script>?', ['Lo descarga en paralelo y lo ejecuta al terminar de analizar el HTML', 'Lo ejecuta en cuanto termina de descargarse', 'Retrasa la descarga hasta que el usuario interactúa', 'Impide que el navegador lo guarde en caché'], 'Con defer el HTML no se bloquea y los scripts se ejecutan en orden antes de DOMContentLoaded.'),
  q('html', 'media', '¿Qué elemento agrupa campos relacionados de un formulario junto a un <legend>?', ['<fieldset>', '<group>', '<formgroup>', '<section>'], '<fieldset> con <legend> da contexto a grupos como unos botones de opción.'),
  q('html', 'media', '¿Para qué sirve <label for="email">?', ['Asocia la etiqueta con el control que tiene id="email"', 'Valida que el campo contenga un email', 'Define el texto de ejemplo del campo', 'Indica el nombre con el que se envía el dato'], 'Así el control tiene nombre accesible y al pulsar la etiqueta se enfoca el campo.'),
  q('html', 'media', '¿Qué valor de loading en <img> retrasa la carga hasta que la imagen se acerca a la pantalla?', ['lazy', 'defer', 'async', 'auto'], 'loading="lazy" ahorra datos en imágenes que no se ven al cargar la página.'),
  q('html', 'media', '¿Qué elemento nativo crea un cuadro de diálogo modal con el método showModal()?', ['<dialog>', '<modal>', '<popup>', '<div role="modal">'], '<dialog> gestiona el foco, la tecla Escape y el fondo (::backdrop) sin JavaScript extra.'),
  q('html', 'dificil', '¿Qué hace <link rel="preconnect" href="https://fonts.gstatic.com">?', ['Abre de antemano la conexión con ese origen', 'Descarga y ejecuta un recurso de ese origen', 'Precarga la siguiente página que visitará el usuario', 'Comprueba que el enlace existe antes de mostrarlo'], 'Adelanta DNS, TCP y TLS para que la petición posterior sea más rápida.'),
  q('html', 'dificil', '¿Cuántos elementos <main> visibles debería tener una página?', ['Uno', 'Uno por cada sección', 'Los que hagan falta', 'Ninguno: está obsoleto'], '<main> marca el contenido principal y solo debe haber uno visible a la vez.'),
  q('html', 'dificil', '¿Qué elemento ofrece sugerencias de autocompletado para un <input> sin limitar el texto libre?', ['<datalist>', '<optgroup>', '<select multiple>', '<output>'], 'Se enlaza con el atributo list del input y el usuario puede escribir otro valor.'),

  // --- CSS ---
  q('css', 'facil', '¿Qué propiedad cambia el color del texto?', ['color', 'font-color', 'text-color', 'foreground'], 'color afecta al texto y es el valor que hereda currentColor.'),
  q('css', 'facil', 'Con display: flex, ¿qué propiedad alinea los elementos en el eje principal?', ['justify-content', 'align-items', 'align-content', 'place-self'], 'justify-content trabaja en el eje principal; align-items, en el transversal.'),
  q('css', 'facil', '¿Qué unidad es relativa al tamaño de fuente del elemento raíz (html)?', ['rem', 'em', 'px', 'vh'], 'rem = root em. em, en cambio, depende de la fuente del propio elemento.'),
  q('css', 'facil', '¿Qué valor de position fija un elemento respecto a la ventana aunque se haga scroll?', ['fixed', 'relative', 'static', 'absolute'], 'fixed lo saca del flujo y lo posiciona respecto al viewport.'),
  q('css', 'media', '¿Qué selector tiene mayor especificidad?', ['#menu a', '.menu a', 'nav a', 'a:hover'], 'Un id (1,0,1) gana a clases y pseudoclases (0,1,1) y a elementos (0,0,2).'),
  q('css', 'media', '¿Qué hace box-sizing: border-box?', ['Incluye padding y borde en el ancho y alto declarados', 'Dibuja un borde alrededor de la caja', 'Elimina los márgenes del elemento', 'Convierte la caja en un contenedor flexible'], 'Con border-box, width: 200px son 200 px reales aunque haya padding.'),
  q('css', 'media', '¿Cómo creas una rejilla de 3 columnas iguales?', ['grid-template-columns: repeat(3, 1fr)', 'grid-columns: 3', 'columns: 3 1fr', 'grid-template: 3 / auto'], '1fr reparte el espacio libre; repeat evita escribir 1fr 1fr 1fr.'),
  q('css', 'media', '¿Qué pseudoclase muestra el foco solo cuando se navega con teclado?', [':focus-visible', ':focus', ':active', ':target'], 'El navegador decide cuándo es útil mostrarlo, normalmente al usar el teclado.'),
  q('css', 'media', '¿Cómo se usa una variable CSS llamada --color-primario?', ['var(--color-primario)', '$color-primario', '@color-primario', 'env(--color-primario)'], '$ y @ son de Sass y Less; en CSS nativo se lee con var().'),
  q('css', 'dificil', '¿En qué caso NO tiene efecto z-index?', ['En un elemento con position: static que no es hijo de flex o grid', 'En un elemento con position: relative', 'En un elemento con position: absolute', 'En un hijo de un contenedor grid'], 'z-index necesita un elemento posicionado o un hijo de flex o grid.'),
  q('css', 'dificil', '¿Qué devuelve clamp(1rem, 2.5vw, 2rem)?', ['2.5vw, pero nunca menos de 1rem ni más de 2rem', 'La suma de los tres valores', 'Siempre el valor más grande', 'Uno de los tres valores según tres tamaños de pantalla'], 'Es la base de la tipografía fluida: crece con la pantalla dentro de unos límites.'),
  q('css', 'dificil', '¿Qué propiedad convierte un elemento en contenedor para usar container queries?', ['container-type', 'media-type', 'viewport-fit', 'size-adjust'], 'Con container-type: inline-size, @container responde al ancho del contenedor.'),

  // --- JavaScript ---
  q('js', 'facil', '¿Qué muestra este código?', ['object', 'null', 'undefined', 'number'], 'Es un error histórico del lenguaje que se mantiene por compatibilidad.', 'console.log(typeof null);'),
  q('js', 'facil', '¿Qué método añade un elemento al final de un array?', ['push', 'pop', 'shift', 'unshift'], 'pop quita el último; shift y unshift trabajan con el principio.'),
  q('js', 'facil', '¿Qué muestra este código?', ['false', 'true', 'undefined', 'TypeError'], '=== compara también el tipo: número y string nunca son estrictamente iguales.', "console.log(0 === '0');"),
  q('js', 'facil', '¿Qué palabra declara una variable que no se puede reasignar?', ['const', 'let', 'var', 'static'], 'const impide reasignar, aunque el contenido de un objeto o array sí puede cambiar.'),
  q('js', 'media', '¿Qué muestra este código?', ['[2, 4, 6]', '[1, 2, 3]', '6', '[1, 4, 9]'], 'map devuelve un array nuevo con el resultado de aplicar la función a cada elemento.', 'console.log([1, 2, 3].map((n) => n * 2));'),
  q('js', 'media', '¿Qué muestra este código?', ['false', 'true', '0.3', 'NaN'], 'Los números de coma flotante binaria no representan 0.1 exactamente: la suma da 0.30000000000000004.', 'console.log(0.1 + 0.2 === 0.3);'),
  q('js', 'media', '¿Qué muestra este código?', ['3', '2', 'undefined', 'Error'], 'a y b apuntan al mismo array: los objetos se asignan por referencia.', 'const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a.length);'),
  q('js', 'media', '¿Qué devuelve siempre una función async?', ['Una promesa', 'El valor de return directamente', 'Un callback', 'undefined'], 'Aunque devuelvas un valor normal, se envuelve en una promesa resuelta.'),
  q('js', 'media', '¿Qué muestra este código?', ['53 2', '8 2', '53 53', '8 8'], 'Con + y un string se concatena; con - se convierte a número.', "console.log('5' + 3, '5' - 3);"),
  q('js', 'dificil', '¿Qué muestra este código?', ['3 3 3', '0 1 2', '0 0 0', 'undefined undefined undefined'], 'var tiene ámbito de función: los tres callbacks comparten la misma i, que vale 3 al ejecutarse. Con let saldría 0 1 2.', 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}'),
  q('js', 'dificil', '¿En qué orden se muestran los números?', ['1 4 3 2', '1 2 3 4', '1 3 4 2', '1 4 2 3'], 'Primero el código síncrono (1 y 4), luego las microtareas como las promesas (3) y después las tareas como setTimeout (2).', 'console.log(1);\nsetTimeout(() => console.log(2));\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);'),
  q('js', 'dificil', '¿Qué hace el operador ??', ['Devuelve el lado derecho solo si el izquierdo es null o undefined', 'Devuelve el lado derecho si el izquierdo es cualquier valor falsy', 'Compara dos valores con igualdad estricta', 'Accede a una propiedad solo si el objeto existe'], 'A diferencia de ||, respeta valores como 0 o una cadena vacía.'),

  // --- TypeScript ---
  q('ts', 'facil', '¿Qué tipo acepta cualquier valor pero obliga a comprobarlo antes de usarlo?', ['unknown', 'any', 'never', 'object'], 'any desactiva las comprobaciones; unknown es la alternativa segura.'),
  q('ts', 'facil', '¿Cómo se marca una propiedad opcional en una interfaz?', ['nombre?: string', 'nombre!: string', 'optional nombre: string', 'nombre: string | ?'], 'Con ? la propiedad puede no existir y su tipo incluye undefined.'),
  q('ts', 'facil', '¿Qué genera el compilador de TypeScript?', ['JavaScript', 'WebAssembly', 'Bytecode', 'Un ejecutable'], 'Los tipos se eliminan al compilar: en el navegador solo llega JavaScript.'),
  q('ts', 'media', '¿Qué hace Partial<Usuario>?', ['Hace opcionales todas las propiedades de Usuario', 'Elimina las propiedades opcionales', 'Hace obligatorias todas las propiedades', 'Crea una copia de solo lectura'], 'Es muy útil para tipar actualizaciones parciales de un objeto.'),
  q('ts', 'media', '¿Qué tipo infiere TypeScript para x?', ["'hola'", 'string', 'any', 'String'], 'Con const se infiere el tipo literal, porque el valor nunca cambiará.', "const x = 'hola';"),
  q('ts', 'media', '¿Qué representa el tipo never?', ['Valores que nunca pueden ocurrir', 'El valor null', 'Un any vacío', 'Lo mismo que void'], 'Aparece en funciones que siempre lanzan errores o en comprobaciones exhaustivas.'),
  q('ts', 'media', '¿Qué tipo es B?', ["'b'", "'a'", "'a' | 'b'", 'never'], "Exclude quita de la unión los miembros asignables a 'a'.", "type A = 'a' | 'b';\ntype B = Exclude<A, 'a'>;"),
  q('ts', 'media', '¿Qué hace el operador keyof?', ['Obtiene la unión de las claves de un tipo', 'Comprueba en ejecución si existe una clave', 'Devuelve los valores de un objeto', 'Hace obligatoria una clave'], "keyof { a: 1; b: 2 } es 'a' | 'b'. Solo existe en tiempo de compilación."),
  q('ts', 'dificil', '¿Para qué sirve el operador satisfies?', ['Comprueba que un valor cumple un tipo sin ensanchar el tipo inferido', 'Fuerza la conversión de un valor a otro tipo', 'Declara un tipo global', 'Hace el valor de solo lectura'], 'Valida contra el tipo y conserva la inferencia precisa, al contrario que una anotación.'),
  q('ts', 'dificil', '¿Qué puede hacer una interface que un type no?', ['Fusionarse con otra declaración del mismo nombre', 'Representar uniones de tipos', 'Usar tipos genéricos', 'Describir la forma de un objeto'], 'Es el declaration merging, que usan por ejemplo las librerías para ampliar tipos.'),
  q('ts', 'dificil', '¿Qué tipo tiene r?', ['number[]', 'T', 'any[]', '[number, number]'], 'El genérico T se infiere a partir del argumento.', 'function id<T>(x: T): T {\n  return x;\n}\nconst r = id([1, 2]);'),
  q('ts', 'dificil', '¿Qué hace as const al final de una expresión?', ['Infiere el tipo más estrecho posible y de solo lectura', 'Congela el objeto en tiempo de ejecución', 'Convierte las variables en constantes', 'Elimina los tipos al compilar'], "['a', 'b'] as const tiene el tipo readonly ['a', 'b'] en lugar de string[]."),

  // --- Accesibilidad ---
  q('a11y', 'facil', '¿Qué contraste mínimo pide WCAG AA para texto de tamaño normal?', ['4.5:1', '3:1', '7:1', '2:1'], '3:1 basta para texto grande; 7:1 corresponde al nivel AAA.'),
  q('a11y', 'facil', '¿Qué elemento debes usar para una acción que no navega a otra página?', ['<button>', '<a href="#">', '<div onclick>', '<span role="link">'], '<button> es enfocable, se activa con Enter y Espacio y se anuncia como botón.'),
  q('a11y', 'facil', '¿Qué atributo da nombre accesible a un botón que solo tiene un icono?', ['aria-label', 'title', 'alt', 'name'], 'Sin él, un lector de pantalla anunciaría solo «botón».'),
  q('a11y', 'media', '¿Qué dice la primera regla de ARIA?', ['Si hay un elemento HTML nativo con esa función, úsalo en vez de ARIA', 'Añade un role a todos los elementos', 'ARIA siempre mejora la accesibilidad', 'Oculta todos los elementos decorativos'], 'Un ARIA mal usado empeora la accesibilidad; los elementos nativos ya traen la semántica.'),
  q('a11y', 'media', '¿Qué hace aria-hidden="true"?', ['Oculta el elemento a los lectores de pantalla', 'Oculta el elemento visualmente', 'Desactiva los clics en el elemento', 'Lo quita del orden de tabulación'], 'Sigue visible y enfocable, así que nunca debe ponerse en elementos interactivos.'),
  q('a11y', 'media', '¿Qué atributo hace que se anuncien cambios de contenido sin mover el foco?', ['aria-live', 'aria-describedby', 'aria-expanded', 'aria-current'], 'Con aria-live="polite" el lector anuncia el cambio cuando termina de hablar.'),
  q('a11y', 'media', '¿Qué tabindex quita un elemento del orden de tabulación pero permite enfocarlo por código?', ['-1', '0', '1', 'none'], 'tabindex="0" lo añade al orden natural; los positivos alteran el orden y se desaconsejan.'),
  q('a11y', 'media', '¿Qué media query respeta a quien prefiere menos animaciones?', ['prefers-reduced-motion', 'prefers-contrast', 'reduced-animation', 'motion: none'], 'Es una preferencia del sistema operativo, importante para personas con trastornos vestibulares.'),
  q('a11y', 'dificil', '¿Qué tamaño mínimo de objetivo táctil exige WCAG 2.2 en el nivel AA?', ['24 × 24 px CSS', '16 × 16 px CSS', '32 × 32 px CSS', '64 × 64 px CSS'], 'Es el criterio 2.5.8. En AAA (2.5.5) se piden 44 × 44 px.'),
  q('a11y', 'dificil', '¿Qué atributo marca el enlace de la página actual en un menú?', ['aria-current="page"', 'aria-selected="true"', 'aria-active="true"', 'aria-pressed="true"'], 'aria-selected es para pestañas o listas de opciones, no para la navegación.'),
  q('a11y', 'dificil', '¿Qué problema tiene saltar de un <h1> a un <h4>?', ['Rompe la jerarquía que usan los lectores de pantalla para navegar', 'Impide que el navegador muestre la página', 'El <h4> deja de mostrarse', 'Ninguno, es una buena práctica'], 'Los usuarios de lector de pantalla navegan por encabezados y esperan niveles consecutivos.'),
  q('a11y', 'dificil', '¿Con qué atributo asocias un mensaje de error a su campo de formulario?', ['aria-describedby', 'aria-controls', 'aria-owns', 'aria-flowto'], 'El lector lee el error junto al nombre del campo cuando recibe el foco.'),

  // --- Git y web ---
  q('web', 'facil', '¿Qué comando crea una rama y cambia a ella a la vez?', ['git switch -c nueva', 'git branch nueva', 'git merge nueva', 'git commit -b nueva'], 'git branch nueva la crea, pero te deja en la rama actual. Equivale a git checkout -b nueva.'),
  q('web', 'facil', '¿Qué código de estado HTTP significa «no encontrado»?', ['404', '500', '301', '403'], '500 es un error del servidor, 301 una redirección permanente y 403 un acceso prohibido.'),
  q('web', 'facil', '¿Qué archivo indica a Git qué archivos no debe versionar?', ['.gitignore', '.gitkeep', '.gitconfig', '.npmignore'], '.gitkeep es solo una convención para conservar carpetas vacías.'),
  q('web', 'media', '¿Qué hace git stash?', ['Guarda temporalmente los cambios sin hacer commit', 'Borra los cambios locales', 'Sube los cambios al remoto', 'Crea una etiqueta de versión'], 'Luego los recuperas con git stash pop.'),
  q('web', 'media', '¿Qué método HTTP se usa habitualmente para reemplazar un recurso completo?', ['PUT', 'POST', 'GET', 'HEAD'], 'PUT es idempotente; para modificaciones parciales se suele usar PATCH.'),
  q('web', 'media', '¿Qué cabecera usa el servidor para permitir peticiones desde otro origen?', ['Access-Control-Allow-Origin', 'Allow-Origin', 'Cross-Origin-Allow', 'Origin-Allowed'], 'Forma parte de CORS, que el navegador comprueba en peticiones entre orígenes.'),
  q('web', 'media', '¿Qué métrica de Core Web Vitals mide la estabilidad visual de la página?', ['CLS', 'LCP', 'INP', 'TTFB'], 'Cumulative Layout Shift: cuánto se mueve el contenido mientras carga.'),
  q('web', 'media', 'Estando en tu rama, ¿qué hace git rebase main?', ['Reaplica tus commits encima del último commit de main', 'Crea un commit de fusión con main', 'Borra la rama main', 'Sube tu rama al remoto'], 'Deja un historial lineal; no se debe hacer con commits ya compartidos.'),
  q('web', 'dificil', '¿Qué métrica sustituyó a FID en Core Web Vitals en 2024?', ['INP', 'CLS', 'FCP', 'TBT'], 'Interaction to Next Paint mide la respuesta a todas las interacciones, no solo a la primera.'),
  q('web', 'dificil', '¿Qué indica la cabecera Cache-Control: no-store?', ['Que la respuesta no se puede guardar en ninguna caché', 'Que hay que revalidarla con el servidor antes de usarla', 'Que se guarda en caché durante un año', 'Que solo la puede guardar el navegador'], 'Revalidar antes de usar es no-cache, que a menudo se confunde con no-store.'),
  q('web', 'dificil', '¿Qué comando muestra quién cambió por última vez cada línea de un archivo?', ['git blame', 'git log --oneline', 'git diff', 'git show'], 'Muestra el commit, el autor y la fecha de cada línea.'),
  q('web', 'dificil', '¿Qué código HTTP indica que el recurso no ha cambiado y puede usarse la copia en caché?', ['304', '204', '302', '412'], 'Se devuelve en peticiones condicionales con If-None-Match o If-Modified-Since.'),
];
