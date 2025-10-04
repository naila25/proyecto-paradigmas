% preguntas.pl

categoria(historia).
categoria(ciencia).
categoria(arte).
categoria(deportes).

pregunta(historia, "¿Quién descubrió América?", "Cristóbal Colón").
pregunta(historia, "¿En qué año fue la independencia de Costa Rica?", "1821").
pregunta(ciencia, "¿Cuál es el símbolo químico del agua?", "H2O").
pregunta(ciencia, "¿Qué planeta es conocido como el planeta rojo?", "Marte").
pregunta(arte, "¿Quién pintó la Mona Lisa?", "Leonardo da Vinci").
pregunta(arte, "¿Qué estilo artístico usó Pablo Picasso?", "Cubismo").
pregunta(deportes, "¿Cuántos jugadores hay en un equipo de fútbol?", "11").
pregunta(deportes, "¿En qué deporte se usa una raqueta?", "Tenis").

respuesta_correcta(Pregunta, RespuestaUsuario) :-
    pregunta(_, Pregunta, RespuestaCorrecta),
    downcase_atom(RespuestaUsuario, RU),
    downcase_atom(RespuestaCorrecta, RC),
    RU = RC.
