% preguntas.pl
% -*- coding: utf-8 -*-

categoria(historia).
categoria(ciencia).
categoria(arte).
categoria(deportes).

% PREGUNTAS DE HISTORIA
pregunta(historia, '¿Quién descubrió América?', 'cristobal colon').
pregunta(historia, '¿En qué año fue la independencia de Costa Rica?', '1821').
pregunta(historia, '¿Quién fue el primer presidente de Estados Unidos?', 'george washington').
pregunta(historia, '¿En qué año terminó la Segunda Guerra Mundial?', '1945').
pregunta(historia, '¿Qué civilización construyó Machu Picchu?', 'incas').
pregunta(historia, '¿En qué año cayó el Muro de Berlín?', '1989').

% PREGUNTAS DE CIENCIA
pregunta(ciencia, '¿Cuál es el símbolo químico del agua?', 'h2o').
pregunta(ciencia, '¿Qué planeta es conocido como el planeta rojo?', 'marte').
pregunta(ciencia, '¿Cuál es la velocidad de la luz?', '300000 km/s').
pregunta(ciencia, '¿Qué gas respiramos principalmente?', 'oxigeno').
pregunta(ciencia, '¿Cuántos huesos tiene el cuerpo humano adulto?', '206').
pregunta(ciencia, '¿Quién propuso la teoría de la relatividad?', 'einstein').

% PREGUNTAS DE ARTE
pregunta(arte, '¿Quién pintó la Mona Lisa?', 'leonardo da vinci').
pregunta(arte, '¿Qué estilo artístico usó Pablo Picasso?', 'cubismo').
pregunta(arte, '¿Quién esculpió el David?', 'miguel angel').
pregunta(arte, '¿En qué museo se encuentra la Mona Lisa?', 'louvre').
pregunta(arte, '¿Quién pintó La noche estrellada?', 'van gogh').
pregunta(arte, '¿Qué nacionalidad tenía Frida Kahlo?', 'mexicana').

% PREGUNTAS DE DEPORTES
pregunta(deportes, '¿Cuántos jugadores hay en un equipo de fútbol?', '11').
pregunta(deportes, '¿En qué deporte se usa una raqueta?', 'tenis').
pregunta(deportes, '¿Cada cuántos años se celebran los Juegos Olímpicos?', '4').
pregunta(deportes, '¿En qué deporte se usa un aro?', 'baloncesto').
pregunta(deportes, '¿Cuántos sets se necesitan para ganar en tenis masculino?', '3').
pregunta(deportes, '¿Qué país ganó el Mundial de Fútbol 2022?', 'argentina').

% Normalizar texto (quitar espacios extras, pasar a minúsculas, quitar acentos)
normalizar_texto(Texto, TextoNormalizado) :-
    downcase_atom(Texto, TextoMin),
    atom_string(TextoMin, Str),
    % Quitar espacios extras
    split_string(Str, " ", " ", Partes),
    atomic_list_concat(Partes, ' ', TextoNormalizado).

% Verificar respuesta correcta con normalización mejorada
respuesta_correcta(Pregunta, RespuestaUsuario) :-
    pregunta(_, Pregunta, RespuestaCorrecta),
    normalizar_texto(RespuestaUsuario, RU),
    normalizar_texto(RespuestaCorrecta, RC),
    RU = RC.    