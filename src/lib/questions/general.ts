import { bank, type Category } from './types';

export const GENERAL_CATEGORIES: Category[] = [
  { id: 'geo', mode: 'general', label: 'Geografía', emoji: '🌍' },
  { id: 'hist', mode: 'general', label: 'Historia', emoji: '🏛️' },
  { id: 'sci', mode: 'general', label: 'Ciencia', emoji: '🔬' },
  { id: 'art', mode: 'general', label: 'Arte y literatura', emoji: '📚' },
  { id: 'pop', mode: 'general', label: 'Cine y música', emoji: '🎬' },
  { id: 'sport', mode: 'general', label: 'Deportes', emoji: '⚽' },
];

const q = bank('general');

export const GENERAL_QUESTIONS = [
  // --- Geografía ---
  q('geo', 'facil', '¿Cuál es la capital de Australia?', ['Canberra', 'Sídney', 'Melbourne', 'Perth'], 'Canberra se construyó como capital para zanjar la rivalidad entre Sídney y Melbourne.'),
  q('geo', 'facil', '¿Cuál es el océano más grande del planeta?', ['Pacífico', 'Atlántico', 'Índico', 'Ártico'], 'El Pacífico ocupa casi un tercio de la superficie de la Tierra.'),
  q('geo', 'facil', '¿En qué continente está Egipto?', ['África', 'Asia', 'Europa', 'Oceanía'], 'La península del Sinaí sí está en Asia, pero la mayor parte del país es africana.'),
  q('geo', 'facil', '¿Qué río atraviesa Sevilla?', ['Guadalquivir', 'Tajo', 'Ebro', 'Duero'], 'Su nombre viene del árabe al-wadi al-kabir, «el río grande».'),
  q('geo', 'media', '¿Cuál es el país más grande del mundo por superficie?', ['Rusia', 'Canadá', 'China', 'Estados Unidos'], 'Rusia supera los 17 millones de km², casi el doble que Canadá.'),
  q('geo', 'media', '¿Qué cordillera separa España de Francia?', ['Pirineos', 'Alpes', 'Montes Cantábricos', 'Sistema Central'], 'Andorra se encuentra en mitad de los Pirineos, entre ambos países.'),
  q('geo', 'media', '¿Cuál es la montaña más alta de África?', ['Kilimanjaro', 'Monte Kenia', 'Atlas', 'Ruwenzori'], 'El Kilimanjaro, en Tanzania, es un volcán de unos 5.895 metros.'),
  q('geo', 'media', '¿Cuál es la capital de Canadá?', ['Ottawa', 'Toronto', 'Montreal', 'Vancouver'], 'Toronto es la ciudad más poblada, pero la capital es Ottawa, en Ontario.'),
  q('geo', 'dificil', '¿Qué país tiene más husos horarios, contando sus territorios de ultramar?', ['Francia', 'Rusia', 'Estados Unidos', 'Reino Unido'], 'Gracias a territorios como la Polinesia o la Guayana, Francia usa 12 husos horarios.'),
  q('geo', 'dificil', '¿Cuál es el desierto cálido más grande del mundo?', ['Sáhara', 'Gobi', 'Kalahari', 'Atacama'], 'Si se cuentan los desiertos fríos, la Antártida es aún mayor.'),
  q('geo', 'dificil', '¿En qué país está el lago Titicaca, además de Perú?', ['Bolivia', 'Chile', 'Ecuador', 'Argentina'], 'Está a más de 3.800 metros y es uno de los lagos navegables más altos del mundo.'),
  q('geo', 'dificil', '¿Qué estrecho separa Asia de América?', ['Estrecho de Bering', 'Estrecho de Magallanes', 'Estrecho de Ormuz', 'Estrecho del Bósforo'], 'En su punto más estrecho, Rusia y Alaska están a unos 82 km.'),

  // --- Historia ---
  q('hist', 'facil', '¿En qué año llegó Colón a América?', ['1492', '1512', '1453', '1500'], 'El 12 de octubre de 1492 llegó a la isla de Guanahani, en las Bahamas.'),
  q('hist', 'facil', '¿Qué civilización construyó Machu Picchu?', ['Inca', 'Azteca', 'Maya', 'Olmeca'], 'Se levantó en el siglo XV en los Andes peruanos.'),
  q('hist', 'facil', '¿Quién fue el primer ser humano en pisar la Luna?', ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'], 'Fue en 1969 con el Apolo 11. Gagarin había sido el primero en viajar al espacio.'),
  q('hist', 'facil', '¿En qué ciudad cayó el Muro en 1989?', ['Berlín', 'Moscú', 'Viena', 'Praga'], 'Su caída el 9 de noviembre abrió el camino a la reunificación alemana.'),
  q('hist', 'media', '¿En qué año terminó la Segunda Guerra Mundial?', ['1945', '1939', '1918', '1950'], 'En Europa terminó en mayo y en el Pacífico, en septiembre de 1945.'),
  q('hist', 'media', '¿Qué emperador romano dio nombre al mes de agosto?', ['Augusto', 'Julio César', 'Nerón', 'Trajano'], 'Julio César, por su parte, dio nombre a julio.'),
  q('hist', 'media', '¿Qué año marca habitualmente el fin de la Edad Media con la caída de Constantinopla?', ['1453', '1492', '1348', '1517'], 'Otros historiadores usan 1492 como fecha de cierre.'),
  q('hist', 'media', '¿Qué reyes completaron la conquista de Granada en 1492?', ['Los Reyes Católicos', 'Carlos I y Felipe II', 'Alfonso X y Fernando III', 'Felipe V e Isabel de Farnesio'], 'Isabel de Castilla y Fernando de Aragón tomaron la ciudad el 2 de enero.'),
  q('hist', 'dificil', '¿Qué expedición completó la primera vuelta al mundo?', ['La de Magallanes y Elcano', 'La de Vasco da Gama', 'La de James Cook', 'La de Francis Drake'], 'Magallanes murió en Filipinas y Elcano llegó a Sanlúcar en 1522.'),
  q('hist', 'dificil', '¿En qué año se aprobó la Constitución española vigente?', ['1978', '1975', '1982', '1931'], 'Se ratificó en referéndum el 6 de diciembre de 1978.'),
  q('hist', 'dificil', '¿Qué faraón tiene la tumba que descubrió Howard Carter en 1922?', ['Tutankamón', 'Ramsés II', 'Keops', 'Akenatón'], 'Fue una de las pocas tumbas del Valle de los Reyes halladas casi intacta.'),
  q('hist', 'dificil', '¿Qué imperio gobernó Solimán el Magnífico?', ['Otomano', 'Persa', 'Mogol', 'Bizantino'], 'Bajo su reinado, en el siglo XVI, el imperio alcanzó su máximo esplendor.'),

  // --- Ciencia ---
  q('sci', 'facil', '¿Cuál es el símbolo químico del oro?', ['Au', 'Ag', 'Or', 'Go'], 'Viene del latín aurum. Ag es la plata (argentum).'),
  q('sci', 'facil', '¿Qué planeta es conocido como el planeta rojo?', ['Marte', 'Júpiter', 'Venus', 'Mercurio'], 'Su color se debe al óxido de hierro de la superficie.'),
  q('sci', 'facil', '¿Cuántos huesos tiene un adulto humano?', ['206', '180', '250', '312'], 'Un bebé nace con unos 300, pero muchos se fusionan al crecer.'),
  q('sci', 'facil', '¿Qué gas absorben las plantas para hacer la fotosíntesis?', ['Dióxido de carbono', 'Oxígeno', 'Nitrógeno', 'Hidrógeno'], 'Con CO₂, agua y luz producen glucosa y liberan oxígeno.'),
  q('sci', 'media', '¿Cuál es el planeta más grande del sistema solar?', ['Júpiter', 'Saturno', 'Neptuno', 'Urano'], 'En Júpiter cabrían más de 1.300 planetas como la Tierra.'),
  q('sci', 'media', '¿A qué temperatura hierve el agua a nivel del mar?', ['100 °C', '90 °C', '120 °C', '80 °C'], 'A mayor altitud la presión es menor y hierve antes.'),
  q('sci', 'media', '¿Qué órgano produce la insulina?', ['El páncreas', 'El hígado', 'Los riñones', 'El bazo'], 'Lo hacen las células beta de los islotes de Langerhans.'),
  q('sci', 'media', '¿Quién formuló la teoría de la relatividad?', ['Albert Einstein', 'Isaac Newton', 'Niels Bohr', 'Galileo Galilei'], 'La especial es de 1905 y la general, de 1915.'),
  q('sci', 'dificil', '¿A qué velocidad aproximada viaja la luz en el vacío?', ['300.000 km/s', '30.000 km/s', '3.000.000 km/s', '150.000 km/s'], 'Exactamente 299.792,458 km/s. La luz del Sol tarda unos 8 minutos en llegar.'),
  q('sci', 'dificil', '¿Cuál es el elemento más abundante del universo?', ['Hidrógeno', 'Helio', 'Oxígeno', 'Carbono'], 'Representa alrededor del 75 % de la materia ordinaria.'),
  q('sci', 'dificil', '¿Qué científica ganó el Nobel en dos ciencias distintas?', ['Marie Curie', 'Rosalind Franklin', 'Lise Meitner', 'Ada Lovelace'], 'Ganó el de Física en 1903 y el de Química en 1911.'),
  q('sci', 'dificil', '¿Qué partícula subatómica no tiene carga eléctrica?', ['Neutrón', 'Protón', 'Electrón', 'Positrón'], 'Lo descubrió James Chadwick en 1932.'),

  // --- Arte y literatura ---
  q('art', 'facil', '¿Quién escribió Don Quijote de la Mancha?', ['Miguel de Cervantes', 'Lope de Vega', 'Francisco de Quevedo', 'Calderón de la Barca'], 'La primera parte se publicó en 1605 y la segunda, en 1615.'),
  q('art', 'facil', '¿Quién pintó la Mona Lisa?', ['Leonardo da Vinci', 'Miguel Ángel', 'Rafael', 'Botticelli'], 'Se expone en el Museo del Louvre, en París.'),
  q('art', 'facil', '¿En qué museo de Madrid está Las meninas?', ['El Prado', 'El Reina Sofía', 'El Thyssen', 'El Museo Sorolla'], 'Velázquez la pintó en 1656.'),
  q('art', 'facil', '¿Quién pintó el Guernica?', ['Pablo Picasso', 'Salvador Dalí', 'Joan Miró', 'Francisco de Goya'], 'Se pintó en 1937 tras el bombardeo de la villa vasca y está en el Reina Sofía.'),
  q('art', 'media', '¿Quién escribió Cien años de soledad?', ['Gabriel García Márquez', 'Mario Vargas Llosa', 'Julio Cortázar', 'Isabel Allende'], 'La novela, de 1967, transcurre en el pueblo ficticio de Macondo.'),
  q('art', 'media', '¿Qué arquitecto diseñó la Sagrada Familia?', ['Antoni Gaudí', 'Santiago Calatrava', 'Rafael Moneo', 'Lluís Domènech i Montaner'], 'Gaudí trabajó en ella desde 1883 hasta su muerte en 1926.'),
  q('art', 'media', '¿Quién escribió Romeo y Julieta?', ['William Shakespeare', 'Christopher Marlowe', 'Charles Dickens', 'Oscar Wilde'], 'La tragedia transcurre en la ciudad italiana de Verona.'),
  q('art', 'media', '¿A qué movimiento artístico pertenece Salvador Dalí?', ['Surrealismo', 'Cubismo', 'Impresionismo', 'Barroco'], 'La persistencia de la memoria, con sus relojes blandos, es su obra más conocida.'),
  q('art', 'dificil', '¿Qué poeta escribió Poeta en Nueva York?', ['Federico García Lorca', 'Antonio Machado', 'Rafael Alberti', 'Miguel Hernández'], 'Lo escribió durante su estancia en la Universidad de Columbia en 1929 y 1930.'),
  q('art', 'dificil', '¿Quién pintó La noche estrellada?', ['Vincent van Gogh', 'Claude Monet', 'Paul Cézanne', 'Edvard Munch'], 'La pintó en 1889 desde el sanatorio de Saint-Rémy-de-Provence.'),
  q('art', 'dificil', '¿Qué autor creó al detective Hércules Poirot?', ['Agatha Christie', 'Arthur Conan Doyle', 'Raymond Chandler', 'Georges Simenon'], 'Apareció por primera vez en El misterioso caso de Styles, de 1920.'),
  q('art', 'dificil', '¿Qué escultor hizo El pensador?', ['Auguste Rodin', 'Miguel Ángel', 'Antonio Canova', 'Gian Lorenzo Bernini'], 'Formaba parte de La puerta del infierno, inspirada en la Divina comedia.'),

  // --- Cine y música ---
  q('pop', 'facil', '¿Cuántos miembros tenían los Beatles?', ['Cuatro', 'Tres', 'Cinco', 'Seis'], 'John Lennon, Paul McCartney, George Harrison y Ringo Starr.'),
  q('pop', 'facil', '¿Qué director rodó Parque Jurásico?', ['Steven Spielberg', 'James Cameron', 'George Lucas', 'Ridley Scott'], 'Se estrenó en 1993 y revolucionó los efectos digitales.'),
  q('pop', 'facil', '¿Qué compositor siguió componiendo tras quedarse sordo?', ['Ludwig van Beethoven', 'Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Frédéric Chopin'], 'Compuso la Novena Sinfonía cuando ya había perdido casi todo el oído.'),
  q('pop', 'facil', '¿Cómo se llama el vaquero de juguete protagonista de Toy Story?', ['Woody', 'Buzz', 'Jessie', 'Andy'], 'Toy Story, de 1995, fue el primer largometraje hecho entero por ordenador.'),
  q('pop', 'media', '¿Qué director español ganó el Óscar por Todo sobre mi madre?', ['Pedro Almodóvar', 'Alejandro Amenábar', 'Fernando Trueba', 'Luis Buñuel'], 'Ganó el de mejor película de habla no inglesa en 2000.'),
  q('pop', 'media', '¿Cuántas cuerdas tiene una guitarra española estándar?', ['Seis', 'Cuatro', 'Cinco', 'Doce'], 'Las de doce cuerdas existen, pero son una variante.'),
  q('pop', 'media', '¿Qué compositor escribió Las cuatro estaciones?', ['Antonio Vivaldi', 'Johann Sebastian Bach', 'Georg Friedrich Händel', 'Joseph Haydn'], 'Son cuatro conciertos para violín publicados en 1725.'),
  q('pop', 'media', '¿En qué película aparece la frase «Que la Fuerza te acompañe»?', ['Star Wars', 'Star Trek', 'Dune', 'Matrix'], 'La saga de George Lucas empezó en 1977.'),
  q('pop', 'dificil', '¿Qué película ganó el primer Óscar a la mejor película?', ['Alas', 'Lo que el viento se llevó', 'Metrópolis', 'El cantor de jazz'], 'Alas (Wings) ganó en la primera ceremonia, en 1929.'),
  q('pop', 'dificil', '¿Qué director rodó Viridiana y El ángel exterminador?', ['Luis Buñuel', 'Carlos Saura', 'Luis García Berlanga', 'Víctor Erice'], 'Viridiana ganó la Palma de Oro en Cannes en 1961.'),
  q('pop', 'dificil', '¿Qué compositor escribió la ópera La flauta mágica?', ['Mozart', 'Verdi', 'Wagner', 'Puccini'], 'Se estrenó en Viena en 1791, meses antes de la muerte de Mozart.'),
  q('pop', 'dificil', '¿Qué compositor español escribió el Concierto de Aranjuez?', ['Joaquín Rodrigo', 'Manuel de Falla', 'Isaac Albéniz', 'Enrique Granados'], 'Es una obra para guitarra y orquesta de 1939.'),

  // --- Deportes ---
  q('sport', 'facil', '¿Cuántos jugadores tiene un equipo de fútbol en el campo?', ['11', '10', '9', '12'], 'Contando al portero. Con menos de siete, el partido no puede continuar.'),
  q('sport', 'facil', '¿Cada cuántos años se celebran los Juegos Olímpicos de verano?', ['4', '2', '3', '5'], 'Los de invierno también son cada cuatro años, pero desfasados dos años.'),
  q('sport', 'facil', '¿En qué deporte se usa un volante o plumilla?', ['Bádminton', 'Tenis', 'Squash', 'Pádel'], 'El volante puede superar los 400 km/h tras un remate.'),
  q('sport', 'facil', '¿Cuántos puntos vale una canasta desde fuera de la línea de triple?', ['3', '2', '4', '1'], 'Los tiros libres valen un punto y el resto de canastas, dos.'),
  q('sport', 'media', '¿En qué ciudad se celebraron los Juegos Olímpicos de 1992?', ['Barcelona', 'Madrid', 'Sevilla', 'Atlanta'], 'Los de Atlanta fueron los siguientes, en 1996.'),
  q('sport', 'media', '¿Qué torneo de tenis se juega sobre tierra batida?', ['Roland Garros', 'Wimbledon', 'US Open', 'Open de Australia'], 'Wimbledon se juega sobre hierba y los otros dos, en pista dura.'),
  q('sport', 'media', '¿Cuánto mide una maratón?', ['42,195 km', '40 km', '45 km', '21,097 km'], '21,097 km es la media maratón.'),
  q('sport', 'media', '¿Qué país ganó el Mundial de fútbol de 2010?', ['España', 'Países Bajos', 'Alemania', 'Brasil'], 'Ganó la final en Sudáfrica por 1-0, con gol de Iniesta.'),
  q('sport', 'dificil', '¿Qué color de maillot lleva el líder de la clasificación general del Tour de Francia?', ['Amarillo', 'Rosa', 'Rojo', 'Verde'], 'El rosa es del Giro, el rojo de la Vuelta y el verde, del líder por puntos en el Tour.'),
  q('sport', 'dificil', '¿Cuántos jugadores tiene un equipo de rugby union en el campo?', ['15', '13', '11', '7'], 'El rugby league juega con 13 y el rugby a siete, con 7.'),
  q('sport', 'dificil', '¿Dónde se celebraron los primeros Juegos Olímpicos modernos, en 1896?', ['Atenas', 'París', 'Londres', 'Roma'], 'Los impulsó Pierre de Coubertin como homenaje a los juegos de la antigua Grecia.'),
  q('sport', 'dificil', '¿Cuál es la puntuación máxima en una partida de bolos?', ['300', '200', '250', '100'], 'Se consigue con doce plenos seguidos.'),
];
