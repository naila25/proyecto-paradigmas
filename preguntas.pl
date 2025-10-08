

% preguntas.pl
% -*- coding: utf-8 -*-

categoria(historia).
categoria(ciencia).
categoria(arte).
categoria(deportes).

% PREGUNTAS DE HISTORIA
pregunta(historia, 'Quien descubrio America?', 
         ['Cristobal Colon', 'Americo Vespucio', 'Fernando de Magallanes', 'Hernan Cortes'], 
         'Cristobal Colon').

pregunta(historia, 'En que ano fue la independencia de Costa Rica?', 
         ['1821', '1810', '1848', '1902'], 
         '1821').

pregunta(historia, 'Quien fue el primer presidente de Estados Unidos?', 
         ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'Benjamin Franklin'], 
         'George Washington').

pregunta(historia, 'En que ano termino la Segunda Guerra Mundial?', 
         ['1945', '1944', '1946', '1943'], 
         '1945').

pregunta(historia, 'Que civilizacion construyo Machu Picchu?', 
         ['Incas', 'Mayas', 'Aztecas', 'Olmecas'], 
         'Incas').

pregunta(historia, 'En que ano cayo el Muro de Berlin?', 
         ['1989', '1987', '1990', '1991'], 
         '1989').

% PREGUNTAS DE CIENCIA
pregunta(ciencia, 'Cual es el simbolo quimico del agua?', 
         ['H2O', 'O2', 'CO2', 'H2'], 
         'H2O').

pregunta(ciencia, 'Que planeta es conocido como el planeta rojo?', 
         ['Marte', 'Venus', 'Jupiter', 'Saturno'], 
         'Marte').

pregunta(ciencia, 'Que planeta esta mas cerca del sol?', 
         ['Mercurio', 'Venus', 'Tierra', 'Marte'], 
         'Mercurio').

pregunta(ciencia, 'Que gas respiramos principalmente?', 
         ['Oxigeno', 'Nitrogeno', 'Hidrogeno', 'Helio'], 
         'Oxigeno').

pregunta(ciencia, 'Cuantos huesos tiene el cuerpo humano adulto?', 
         ['206', '195', '215', '180'], 
         '206').

pregunta(ciencia, 'Quien propuso la teoria de la relatividad?', 
         ['Einstein', 'Newton', 'Galileo', 'Tesla'], 
         'Einstein').

% PREGUNTAS DE ARTE
pregunta(arte, 'Quien pinto la Mona Lisa?', 
         ['Leonardo da Vinci', 'Picasso', 'Miguel Angel', 'Dali'], 
         'Leonardo da Vinci').

pregunta(arte, 'Quien pinto La ultima cena?', 
         ['Leonardo da Vinci', 'Picasso', 'Miguel Angel', 'Dali'], 
         'Leonardo da Vinci').

pregunta(arte, 'Que estilo artistico uso Pablo Picasso?', 
         ['Cubismo', 'Surrealismo', 'Impresionismo', 'Realismo'], 
         'Cubismo').

pregunta(arte, 'Quien esculpio el David?', 
         ['Miguel Angel', 'Donatello', 'Bernini', 'Rodin'], 
         'Miguel Angel').

pregunta(arte, 'En que museo se encuentra la Mona Lisa?', 
         ['Louvre', 'Prado', 'Vaticano', 'Britanico'], 
         'Louvre').

pregunta(arte, 'Que nacionalidad tenia Frida Kahlo?', 
         ['Mexicana', 'Espanola', 'Argentina', 'Colombiana'], 
         'Mexicana').

% PREGUNTAS DE DEPORTES
pregunta(deportes, 'Cuantos jugadores hay en un equipo de futbol?', 
         ['11', '9', '10', '12'], 
         '11').

pregunta(deportes, 'En que deporte se usa una raqueta?', 
         ['Tenis', 'Futbol', 'Beisbol', 'Golf'], 
         'Tenis').

pregunta(deportes, 'Cada cuantos anos se celebran los Juegos Olimpicos?', 
         ['4', '2', '3', '5'], 
         '4').

pregunta(deportes, 'En que deporte se usa un aro?', 
         ['Baloncesto', 'Voleibol', 'Futbol', 'Tenis'], 
         'Baloncesto').

pregunta(deportes, 'Cuantos sets se necesitan para ganar en tenis masculino?', 
         ['3', '2', '4', '5'], 
         '3').

pregunta(deportes, 'Que pais gano el Mundial de Futbol 2022?', 
         ['Argentina', 'Francia', 'Brasil', 'Alemania'], 
         'Argentina').

% Verificar respuesta correcta - Comparación simple
respuesta_correcta(Pregunta, RespuestaUsuario) :-
    pregunta(_, Pregunta, _, RespuestaCorrecta),
    RespuestaUsuario = RespuestaCorrecta.