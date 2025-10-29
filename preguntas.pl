% preguntas.pl
% -*- coding: utf-8 -*-

% Categorías disponibles
categoria(historia).
categoria(ciencia).
categoria(arte).
categoria(deportes).
categoria(musica).
categoria(geografia).
categoria(cine).

% Niveles de dificultad
dificultad(facil).
dificultad(media).
dificultad(dificil).

% Formato: pregunta(Categoria, Pregunta, Opciones, Respuesta, Dificultad)

% ===== PREGUNTAS DE HISTORIA =====

pregunta(historia, 'Quien descubrio America?', 
         ['Cristobal Colon', 'Americo Vespucio', 'Fernando de Magallanes', 'Hernan Cortes'], 
         'Cristobal Colon', facil).

pregunta(historia, 'En que ano fue la independencia de Costa Rica?', 
         ['1821', '1810', '1848', '1902'], 
         '1821', facil).

pregunta(historia, 'Quien fue el primer presidente de Estados Unidos?', 
         ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'Benjamin Franklin'], 
         'George Washington', facil).

pregunta(historia, 'En que ano termino la Segunda Guerra Mundial?', 
         ['1945', '1944', '1946', '1943'], 
         '1945', facil).

pregunta(historia, 'Que civilizacion construyo Machu Picchu?', 
         ['Incas', 'Mayas', 'Aztecas', 'Olmecas'], 
         'Incas', facil).

pregunta(historia, 'En que ano cayo el Muro de Berlin?', 
         ['1989', '1987', '1990', '1991'], 
         '1989', media).

pregunta(historia, 'Quien fue Napoleon Bonaparte?', 
         ['Emperador frances', 'Rey ingles', 'Zar ruso', 'Sultan turco'], 
         'Emperador frances', facil).

pregunta(historia, 'En que ano inicio la Primera Guerra Mundial?', 
         ['1914', '1912', '1916', '1918'], 
         '1914', media).

pregunta(historia, 'Que imperio construyo el Coliseo Romano?', 
         ['Imperio Romano', 'Imperio Griego', 'Imperio Persa', 'Imperio Egipcio'], 
         'Imperio Romano', facil).

pregunta(historia, 'Quien fue Cleopatra?', 
         ['Reina de Egipto', 'Reina de Grecia', 'Emperatriz romana', 'Diosa egipcia'], 
         'Reina de Egipto', media).

pregunta(historia, 'En que ano llego el hombre a la Luna?', 
         ['1969', '1965', '1972', '1968'], 
         '1969', media).

pregunta(historia, 'Que tratado puso fin a la Primera Guerra Mundial?', 
         ['Tratado de Versalles', 'Tratado de Paris', 'Tratado de Viena', 'Tratado de Roma'], 
         'Tratado de Versalles', dificil).

pregunta(historia, 'Quien fue Julio Cesar?', 
         ['General romano', 'Rey griego', 'Faraon egipcio', 'Emperador chino'], 
         'General romano', media).

pregunta(historia, 'En que siglo fue el Renacimiento?', 
         ['Siglo XV-XVI', 'Siglo XII-XIII', 'Siglo XVIII-XIX', 'Siglo X-XI'], 
         'Siglo XV-XVI', dificil).

pregunta(historia, 'Que pais construyo la Gran Muralla?', 
         ['China', 'Japon', 'Mongolia', 'Corea'], 
         'China', facil).

% ===== PREGUNTAS DE CIENCIA =====
pregunta(ciencia, 'Cual es el simbolo quimico del agua?', 
         ['H2O', 'O2', 'CO2', 'H2'], 
         'H2O', facil).

pregunta(ciencia, 'Que planeta es conocido como el planeta rojo?', 
         ['Marte', 'Venus', 'Jupiter', 'Saturno'], 
         'Marte', facil).

pregunta(ciencia, 'Que planeta esta mas cerca del sol?', 
         ['Mercurio', 'Venus', 'Tierra', 'Marte'], 
         'Mercurio', facil).

pregunta(ciencia, 'Que gas respiramos principalmente?', 
         ['Oxigeno', 'Nitrogeno', 'Hidrogeno', 'Helio'], 
         'Oxigeno', facil).

pregunta(ciencia, 'Cuantos huesos tiene el cuerpo humano adulto?', 
         ['206', '195', '215', '180'], 
         '206', media).

pregunta(ciencia, 'Quien propuso la teoria de la relatividad?', 
         ['Einstein', 'Newton', 'Galileo', 'Tesla'], 
         'Einstein', media).

pregunta(ciencia, 'Cual es el planeta mas grande del sistema solar?', 
         ['Jupiter', 'Saturno', 'Urano', 'Neptuno'], 
         'Jupiter', facil).

pregunta(ciencia, 'Que organo bombea la sangre?', 
         ['Corazon', 'Pulmon', 'Higado', 'Rinon'], 
         'Corazon', facil).

pregunta(ciencia, 'Cual es la velocidad de la luz?', 
         ['300000 km/s', '150000 km/s', '450000 km/s', '200000 km/s'], 
         '300000 km/s', dificil).

pregunta(ciencia, 'Que estudia la botanica?', 
         ['Plantas', 'Animales', 'Rocas', 'Estrellas'], 
         'Plantas', media).

pregunta(ciencia, 'Cual es el elemento mas abundante en el universo?', 
         ['Hidrogeno', 'Oxigeno', 'Carbono', 'Helio'], 
         'Hidrogeno', dificil).

pregunta(ciencia, 'Cuantos cromosomas tiene el ser humano?', 
         ['46', '42', '48', '50'], 
         '46', dificil).

pregunta(ciencia, 'Que animal es el mas rapido del mundo?', 
         ['Guepardo', 'Leon', 'Aguila', 'Tiburon'], 
         'Guepardo', media).

pregunta(ciencia, 'Cual es el metal mas abundante en la Tierra?', 
         ['Aluminio', 'Hierro', 'Cobre', 'Oro'], 
         'Aluminio', dificil).

pregunta(ciencia, 'Que es la fotosintesis?', 
         ['Proceso de plantas', 'Proceso de animales', 'Tipo de luz', 'Reaccion quimica'], 
         'Proceso de plantas', media).

% ===== PREGUNTAS DE MUSICA =====
pregunta(musica, 'Quien es conocido como el Rey del Pop?', 
         ['Michael Jackson','Elvis Presley','Prince','Freddie Mercury'], 
         'Michael Jackson', facil).

pregunta(musica, 'De que pais es originario el tango?', 
         ['Argentina','Espana','Mexico','Italia'], 
         'Argentina', media).

pregunta(musica, 'Que compositor escribio la Quinta Sinfonia?', 
         ['Beethoven','Mozart','Chopin','Bach'], 
         'Beethoven', dificil).

pregunta(musica, 'Que banda compuso el album Abbey Road?', 
         ['The Beatles','Queen','The Rolling Stones','Pink Floyd'], 
         'The Beatles', facil).

pregunta(musica, 'Que cantante popularizo la cancion Thriller?', 
         ['Michael Jackson','Madonna','Whitney Houston','Prince'], 
         'Michael Jackson', facil).

pregunta(musica, 'Que instrumento toca tradicionalmente un mariachi?', 
         ['Guitarron','Saxofon','Bateria','Arpa'], 
         'Guitarron', media).

pregunta(musica, 'Quien compuso Las cuatro estaciones?', 
         ['Vivaldi','Bach','Handel','Haydn'], 
         'Vivaldi', media).

pregunta(musica, 'Que genero musical nacio en Jamaica?', 
         ['Reggae','Samba','Blues','Flamenco'], 
         'Reggae', facil).

pregunta(musica, 'Que cantante es apodado La Reina del Tejano?', 
         ['Selena','Shakira','Gloria Estefan','Paulina Rubio'], 
         'Selena', media).

pregunta(musica, 'Que ciudad es cuna del grunge?', 
         ['Seattle','Los Angeles','Nueva York','Chicago'], 
         'Seattle', dificil).

% ===== PREGUNTAS DE GEOGRAFIA =====
pregunta(geografia, 'Cual es la capital de Australia?', 
         ['Canberra','Sidney','Melbourne','Perth'], 
         'Canberra', facil).

pregunta(geografia, 'Cual es el rio mas largo del mundo?', 
         ['Amazonas','Nilo','Yangtse','Misisipi'], 
         'Amazonas', media).

pregunta(geografia, 'En que continente esta Kazajistan?', 
         ['Asia','Europa','Africa','Oceania'], 
         'Asia', media).

pregunta(geografia, 'Que oceano es el mas grande?', 
         ['Pacifico','Atlantico','Indico','Artico'], 
         'Pacifico', facil).

pregunta(geografia, 'Que pais tiene mas islas?', 
         ['Suecia','Indonesia','Filipinas','Noruega'], 
         'Suecia', dificil).

pregunta(geografia, 'Que montana es la mas alta del mundo?', 
         ['Everest','K2','Kangchenjunga','Lhotse'], 
         'Everest', facil).

pregunta(geografia, 'La sabana africana se asocia sobre todo con que pais?', 
         ['Kenia','Egipto','Sudafrica','Marruecos'], 
         'Kenia', media).

pregunta(geografia, 'Que mar bania a Jordania e Israel y es muy salado?', 
         ['Mar Muerto','Mar Rojo','Mar Negro','Mar Aral'], 
         'Mar Muerto', media).

pregunta(geografia, 'Cual es la capital de Canada?', 
         ['Ottawa','Toronto','Vancouver','Montreal'], 
         'Ottawa', facil).

pregunta(geografia, 'Que desierto es el mas grande del mundo?', 
         ['Sahara','Arabia','Gobi','Kalahari'], 
         'Sahara', dificil).

% ===== PREGUNTAS DE CINE =====
pregunta(cine, 'En que anio se estreno Toy Story?', 
         ['1995','1993','1997','1999'], 
         '1995', media).

pregunta(cine, 'Quien interpreta a Iron Man en el MCU?', 
         ['Robert Downey Jr.','Chris Evans','Chris Hemsworth','Mark Ruffalo'], 
         'Robert Downey Jr.', facil).

pregunta(cine, 'Cual es la serie con el Trono de Hierro?', 
         ['Game of Thrones','The Witcher','Vikings','The Crown'], 
         'Game of Thrones', facil).

pregunta(cine, 'Que pelicula gano el Oscar a Mejor Pelicula en 2020?', 
         ['Parasitos','1917','Joker','Once Upon a Time in Hollywood'], 
         'Parasitos', dificil).

pregunta(cine, 'Como se llama el mago protagonista de J.K. Rowling?', 
         ['Harry Potter','Hermione Granger','Ron Weasley','Draco Malfoy'], 
         'Harry Potter', facil).

pregunta(cine, 'Que franquicia tiene a Darth Vader?', 
         ['Star Wars','Star Trek','Matrix','Alien'], 
         'Star Wars', facil).

pregunta(cine, 'Que director filmo Inception?', 
         ['Christopher Nolan','Steven Spielberg','James Cameron','Quentin Tarantino'], 
         'Christopher Nolan', media).

pregunta(cine, 'Que superheroe dice Yo soy Batman?', 
         ['Batman','Superman','Spider-Man','Flash'], 
         'Batman', facil).

pregunta(cine, 'Que famosa serie es de la ciudad de Springfield?', 
         ['Los Simpson','Padre de Familia','South Park','Futurama'], 
         'Los Simpson', media).

pregunta(cine, 'En que pelicula aparece el anillo unico?', 
         ['El Senor de los Anillos','Harry Potter','Narnia','Hobbiton'], 
         'El Senor de los Anillos', dificil).

% ===== PREGUNTAS DE ARTE =====
pregunta(arte, 'Quien pinto la Mona Lisa?', 
         ['Leonardo da Vinci', 'Picasso', 'Miguel Angel', 'Dali'], 
         'Leonardo da Vinci', facil).

pregunta(arte, 'Quien pinto La ultima cena?', 
         ['Leonardo da Vinci', 'Picasso', 'Miguel Angel', 'Dali'], 
         'Leonardo da Vinci', facil).

pregunta(arte, 'Que estilo artistico uso Pablo Picasso?', 
         ['Cubismo', 'Surrealismo', 'Impresionismo', 'Realismo'], 
         'Cubismo', media).

pregunta(arte, 'Quien esculpio el David?', 
         ['Miguel Angel', 'Donatello', 'Bernini', 'Rodin'], 
         'Miguel Angel', media).

pregunta(arte, 'En que museo se encuentra la Mona Lisa?', 
         ['Louvre', 'Prado', 'Vaticano', 'Britanico'], 
         'Louvre', media).

pregunta(arte, 'Que nacionalidad tenia Frida Kahlo?', 
         ['Mexicana', 'Espanola', 'Argentina', 'Colombiana'], 
         'Mexicana', facil).

pregunta(arte, 'Quien pinto La noche estrellada?', 
         ['Van Gogh', 'Monet', 'Renoir', 'Cezanne'], 
         'Van Gogh', media).

pregunta(arte, 'Que artista corto su propia oreja?', 
         ['Van Gogh', 'Picasso', 'Goya', 'Velazquez'], 
         'Van Gogh', media).

pregunta(arte, 'Quien pinto el Guernica?', 
         ['Picasso', 'Dali', 'Miro', 'Goya'], 
         'Picasso', dificil).

pregunta(arte, 'Que es el Renacimiento?', 
         ['Movimiento cultural', 'Tipo de pintura', 'Museo', 'Tecnica artistica'], 
         'Movimiento cultural', media).

pregunta(arte, 'Quien pinto la Capilla Sixtina?', 
         ['Miguel Angel', 'Leonardo', 'Rafael', 'Donatello'], 
         'Miguel Angel', dificil).

pregunta(arte, 'Que es el surrealismo?', 
         ['Movimiento artistico', 'Tipo de escultura', 'Tecnica de pintura', 'Museo'], 
         'Movimiento artistico', dificil).

pregunta(arte, 'Quien fue Claude Monet?', 
         ['Pintor impresionista', 'Escultor', 'Arquitecto', 'Musico'], 
         'Pintor impresionista', media).

pregunta(arte, 'Que pinto Salvador Dali?', 
         ['La persistencia de la memoria', 'La Gioconda', 'El grito', 'Guernica'], 
         'La persistencia de la memoria', dificil).

pregunta(arte, 'Donde nacio Pablo Picasso?', 
         ['Espana', 'Francia', 'Italia', 'Mexico'], 
         'Espana', facil).

% ===== PREGUNTAS DE DEPORTES =====
pregunta(deportes, 'Cuantos jugadores hay en un equipo de futbol?', 
         ['11', '9', '10', '12'], 
         '11', facil).

pregunta(deportes, 'En que deporte se usa una raqueta?', 
         ['Tenis', 'Futbol', 'Beisbol', 'Golf'], 
         'Tenis', facil).

pregunta(deportes, 'Cada cuantos anos se celebran los Juegos Olimpicos?', 
         ['4', '2', '3', '5'], 
         '4', facil).

pregunta(deportes, 'En que deporte se usa un aro?', 
         ['Baloncesto', 'Voleibol', 'Futbol', 'Tenis'], 
         'Baloncesto', facil).

pregunta(deportes, 'Cuantos sets se necesitan para ganar en tenis masculino Grand Slam?', 
         ['3', '2', '4', '5'], 
         '3', media).

pregunta(deportes, 'Que pais gano el Mundial de Futbol 2022?', 
         ['Argentina', 'Francia', 'Brasil', 'Alemania'], 
         'Argentina', facil).

pregunta(deportes, 'Cuantos puntos vale un touchdown en futbol americano?', 
         ['6', '7', '5', '3'], 
         '6', media).

pregunta(deportes, 'En que deporte destaco Michael Jordan?', 
         ['Baloncesto', 'Beisbol', 'Futbol', 'Tenis'], 
         'Baloncesto', facil).

pregunta(deportes, 'Cuantos jugadores hay en un equipo de baloncesto en cancha?', 
         ['5', '6', '7', '4'], 
         '5', facil).

pregunta(deportes, 'Que es un hat-trick en futbol?', 
         ['3 goles en un partido', '2 goles seguidos', '4 goles', '1 gol de cabeza'], 
         '3 goles en un partido', media).

pregunta(deportes, 'Donde se invento el voleibol?', 
         ['Estados Unidos', 'Brasil', 'Italia', 'Japon'], 
         'Estados Unidos', dificil).

pregunta(deportes, 'Cuantas bases hay en beisbol?', 
         ['4', '3', '5', '2'], 
         '4', media).

pregunta(deportes, 'Quien tiene mas Balones de Oro?', 
         ['Lionel Messi', 'Cristiano Ronaldo', 'Pele', 'Maradona'], 
         'Lionel Messi', media).

pregunta(deportes, 'En que ano se realizaron los primeros Juegos Olimpicos modernos?', 
         ['1896', '1900', '1888', '1904'], 
         '1896', dificil).

pregunta(deportes, 'Que pais tiene mas Copas del Mundo de futbol?', 
         ['Brasil', 'Alemania', 'Argentina', 'Italia'], 
         'Brasil', media).

% ===== REGLAS LOGICAS AVANZADAS =====

% Regla 1: Obtener puntos según dificultad
puntos_por_dificultad(facil, 10).
puntos_por_dificultad(media, 20).
puntos_por_dificultad(dificil, 30).

% Regla 2: Verificar si una pregunta pertenece a una categoría
pregunta_de_categoria(Pregunta, Categoria) :-
    pregunta(Categoria, Pregunta, _, _, _).

% Regla 3: Contar preguntas por categoría
contar_preguntas(Categoria, Cantidad) :-
    findall(P, pregunta(Categoria, P, _, _, _), Lista),
    length(Lista, Cantidad).

% Regla 4: Obtener todas las preguntas de una dificultad específica
preguntas_por_dificultad(Dificultad, Lista) :-
    findall([Cat, Preg], pregunta(Cat, Preg, _, _, Dificultad), Lista).

% Regla 5: Verificar respuesta correcta (mejorada)
respuesta_correcta(Pregunta, RespuestaUsuario) :-
    pregunta(_, Pregunta, _, RespuestaCorrecta, _),
    RespuestaUsuario = RespuestaCorrecta.

% Regla 6: Obtener dificultad de una pregunta
obtener_dificultad(Pregunta, Dificultad) :-
    pregunta(_, Pregunta, _, _, Dificultad).

% Regla 7: Verificar si una categoría tiene suficientes preguntas
categoria_completa(Categoria) :-
    contar_preguntas(Categoria, Cantidad),
    Cantidad >= 10.

% Regla 8: Obtener pregunta con su dificultad y puntos
pregunta_completa(Categoria, Pregunta, Opciones, Respuesta, Dificultad, Puntos) :-
    pregunta(Categoria, Pregunta, Opciones, Respuesta, Dificultad),
    puntos_por_dificultad(Dificultad, Puntos).

% Regla 9: Clasificar dificultad como numérica
nivel_dificultad(facil, 1).
nivel_dificultad(media, 2).
nivel_dificultad(dificil, 3).

% Regla 10: Comparar dificultad de dos preguntas
mas_dificil(Pregunta1, Pregunta2) :-
    obtener_dificultad(Pregunta1, Dif1),
    obtener_dificultad(Pregunta2, Dif2),
    nivel_dificultad(Dif1, N1),
    nivel_dificultad(Dif2, N2),
    N1 > N2.

% ===== NUEVA REGLA: Obtener pregunta por categoría Y dificultad específica =====
pregunta_completa_con_dificultad(Categoria, Dificultad, Pregunta, Opciones, Respuesta, Puntos) :-
    pregunta(Categoria, Pregunta, Opciones, Respuesta, Dificultad),
    puntos_por_dificultad(Dificultad, Puntos).