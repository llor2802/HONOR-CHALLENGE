/**
 * ============================================================================
 * Guion de validación del prototipo: "HONOR Tech Escape Room"
 * ----------------------------------------------------------------------------
 * Crea automáticamente:
 *   1) Un formulario de Google Forms con todas las preguntas del guion,
 *      incluido el registro del observador (solo moderador).
 *   2) Una hoja de cálculo de Google Sheets NUEVA, vinculada al formulario.
 *
 * Cómo usar: pega este código en un proyecto de Google Apps Script
 * (script.google.com) y ejecuta la función  crearFormularioValidacionHonor.
 * Los enlaces se imprimen en  Ver > Registros de ejecución (Logger.log).
 *
 * Seguridad: el script solo CREA archivos nuevos (FormApp.create y
 * SpreadsheetApp.create). No abre, modifica ni elimina archivos existentes.
 * ============================================================================
 */

var PROTOTIPO_URL_ = "https://claude.ai/artifact/8HGvVyU8qkFVEqBrFUuT6G";

// Escala de acuerdo (idéntica en P5 y P21 para poder comparar).
var COLUMNAS_ACUERDO_ = [
  "1 = Totalmente en desacuerdo",
  "2 = En desacuerdo",
  "3 = Ni de acuerdo ni en desacuerdo",
  "4 = De acuerdo",
  "5 = Totalmente de acuerdo",
  "No tengo suficiente información para responder"
];

// Afirmaciones (idénticas en P5 y P21).
var AFIRMACIONES_ = [
  "HONOR es una marca que ofrece más que smartphones.",
  "HONOR cuenta con diferentes tipos de dispositivos tecnológicos.",
  "Los dispositivos de HONOR pueden complementarse entre sí.",
  "HONOR ofrece experiencias tecnológicas integradas.",
  "Considero a HONOR una marca tecnológicamente innovadora."
];

// Productos (idénticos en P3 y P19).
var PRODUCTOS_ = [
  "Smartphones",
  "Tablets",
  "Laptops",
  "Smartwatches o relojes inteligentes",
  "Audífonos",
  "Otros dispositivos tecnológicos",
  "No lo sé"
];

/**
 * FUNCIÓN PRINCIPAL: ejecútala desde el editor de Apps Script.
 */
function crearFormularioValidacionHonor() {

  // ==========================================================================
  // 1. CREAR EL FORMULARIO Y SU CONFIGURACIÓN GENERAL
  // ==========================================================================
  var form = FormApp.create("Validación del prototipo · HONOR Tech Escape Room");

  form.setDescription(
    "Prueba de usabilidad, comprensión y cambio exploratorio de percepción.\n\n" +
    "Las secciones marcadas como SOLO MODERADOR las completa el moderador, no el participante."
  );

  intentar_(function () { form.setCollectEmail(false); });
  intentar_(function () { form.setRequireLogin(false); });
  intentar_(function () { form.setLimitOneResponsePerUser(false); });
  intentar_(function () { form.setAllowResponseEdits(false); });
  intentar_(function () { form.setShuffleQuestions(false); });
  intentar_(function () { form.setProgressBar(true); });
  intentar_(function () {
    form.setConfirmationMessage(
      "Muchas gracias por tu tiempo y por compartir tu opinión. Tus respuestas nos ayudarán a " +
      "identificar qué funciona bien y qué debemos mejorar antes de implementar la experiencia. " +
      "Buscamos comentarios sinceros, así que cualquier dificultad o aspecto que no te haya " +
      "convencido nos resulta útil."
    );
  });
  intentar_(function () {
    if (typeof form.setPublished === "function") { form.setPublished(true); }
  });
  intentar_(function () { form.setAcceptingResponses(true); });

  // ==========================================================================
  // 2. FICHA DE CONTROL DE LA SESIÓN (SOLO MODERADOR)
  // ==========================================================================
  form.addSectionHeaderItem()
    .setTitle("Ficha de control de la sesión · SOLO MODERADOR")
    .setHelpText("Completar antes de entregar el formulario al participante.");

  form.addTextItem()
    .setTitle("Código de sesión")
    .setRequired(true);

  form.addDateItem()
    .setTitle("Fecha")
    .setRequired(true);

  // ==========================================================================
  // 3. FASE 1. PRESENTACIÓN Y PRETEST
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 1. Presentación y pretest")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Hola, estamos evaluando una experiencia interactiva dirigida a estudiantes universitarios. " +
      "Queremos conocer tu opinión sobre algunas marcas de tecnología y, posteriormente, probar una " +
      "experiencia que estamos desarrollando.\""
    );

  // --- P1. Ciclo académico ---
  agregarOpcionMultiple_(form, {
    titulo: "P1. ¿En qué ciclo de tu carrera te encuentras actualmente?",
    ayuda: null,
    obligatoria: true,
    otra: true, // "Otro" con campo para escribir
    opciones: [
      "1.º–2.º ciclo",
      "3.º–4.º ciclo",
      "5.º–6.º ciclo",
      "7.º–10.º ciclo",
      "Prefiero no responder"
    ]
  });

  // --- P2. Asociación espontánea con HONOR ---
  form.addParagraphTextItem()
    .setTitle("P2. Cuando escuchas el nombre HONOR, ¿qué es lo primero que se te viene a la mente?")
    .setRequired(true);

  // --- P3. Productos asociados con HONOR ---
  agregarCasillas_(form, {
    titulo: "P3. ¿Qué tipos de productos crees que comercializa HONOR en Perú?",
    ayuda: "Selecciona todas las opciones que correspondan.",
    obligatoria: true,
    maxSelecciones: null,
    otra: false,
    opciones: PRODUCTOS_
  });

  // --- P5. Percepción inicial de HONOR (cuadrícula) ---
  agregarCuadriculaAcuerdo_(form,
    "P5. Indica cuánto estás de acuerdo con las siguientes afirmaciones sobre HONOR, según lo que sabes actualmente.",
    "5");

  // ==========================================================================
  // 4. FASE 2. INTERACCIÓN CON EL PROTOTIPO + REGISTRO DEL OBSERVADOR
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 2. Interacción con el prototipo")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Ahora te mostraré una experiencia interactiva que estamos desarrollando. Imagina que estás en " +
      "tu universidad y te encuentras con esta experiencia. Explórala como lo harías normalmente e intenta " +
      "descubrir cómo funciona. No te explicaré los pasos de entrada, porque queremos comprobar si se " +
      "entiende por sí sola. Mientras interactúas, puedes decir en voz alta lo que estás pensando, lo que " +
      "te llama la atención o cualquier duda que te surja. No te preocupes si algo no se entiende: eso " +
      "también nos ayuda a identificar qué debemos mejorar.\"\n\n" +
      "Acción: compartir el prototipo y dejar que el participante lo explore sin explicar las funciones " +
      "ni señalar dónde hacer clic.\n" +
      "Prototipo: " + PROTOTIPO_URL_
    );

  form.addSectionHeaderItem()
    .setTitle("Registro del observador · SOLO MODERADOR")
    .setHelpText("No leer como preguntas al participante. Completar mientras explora el prototipo.");

  // --- P6. Inicio de la interacción ---
  agregarCasillas_(form, {
    titulo: "P6. Inicio de la interacción",
    ayuda: "Marcar todas las que correspondan.",
    obligatoria: true,
    maxSelecciones: null,
    otra: true, // "Otra conducta relevante"
    opciones: [
      "Exploró espontáneamente",
      "Leyó primero las instrucciones",
      "Intentó interactuar sin leerlas",
      "Observó antes de actuar",
      "Preguntó qué debía hacer",
      "Necesitó que el moderador le indicara cómo empezar"
    ]
  });

  // --- P7. Finalización ---
  agregarOpcionMultiple_(form, {
    titulo: "P7. ¿Pudo completar el recorrido previsto?",
    ayuda: null,
    obligatoria: true,
    otra: false,
    opciones: [
      "Sí, sin ayuda",
      "Sí, con una indicación puntual",
      "Sí, con varias indicaciones",
      "Completó solo una parte",
      "No pudo completarlo",
      "No aplica porque el prototipo no tiene un recorrido de finalización definido"
    ]
  });

  // --- P8. Dificultades observadas ---
  agregarCasillas_(form, {
    titulo: "P8. Dificultades observadas",
    ayuda: "Marcar todas las que correspondan.",
    obligatoria: true,
    maxSelecciones: null,
    otra: true, // "Otros"
    opciones: [
      "Comprender el objetivo",
      "Entender las instrucciones",
      "Identificar los elementos interactivos",
      "Saber cómo avanzar",
      "Comprender la relación entre dispositivos",
      "Entender cómo terminar",
      "Problemas técnicos",
      "No presentó dificultades observables"
    ]
  });

  form.addParagraphTextItem()
    .setTitle("P8. Ejemplos concretos de las dificultades")
    .setHelpText("Registrar en qué momento o zona ocurrió y qué hizo o dijo el participante.")
    .setRequired(false);

  // --- P9. Tiempo (segundos, número entero) ---
  var validacionTiempo = FormApp.createTextValidation()
    .setHelpText("Escribe solo un número entero de segundos (por ejemplo: 150).")
    .requireTextMatchesPattern("^[0-9]+$")
    .build();
  form.addTextItem()
    .setTitle("P9. Tiempo registrado (segundos)")
    .setHelpText("Si no completa el recorrido, registrar el tiempo transcurrido y marcarlo como incompleto en la pregunta siguiente.")
    .setRequired(true)
    .setValidation(validacionTiempo);

  agregarOpcionMultiple_(form, {
    titulo: "P9. Tipo de tiempo registrado",
    ayuda: null,
    obligatoria: true,
    otra: false,
    opciones: [
      "Tiempo de finalización (completó el recorrido)",
      "Tiempo transcurrido (incompleto)",
      "Solo tiempo de exploración (sin tarea definida)"
    ]
  });

  form.addParagraphTextItem()
    .setTitle("Observaciones adicionales del moderador")
    .setRequired(false);

  // ==========================================================================
  // 5. FASE 3. COMPRENSIÓN ESPONTÁNEA
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 3. Comprensión espontánea")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Gracias. Ahora quiero conocer tu interpretación de la experiencia. Responde con tus propias " +
      "palabras. No hay problema si algo no te quedó claro; precisamente queremos saber qué comunica el prototipo.\""
    );

  // --- P10. Objetivo de la experiencia ---
  form.addParagraphTextItem()
    .setTitle("P10. Con tus propias palabras, ¿cuál crees que es el objetivo principal de esta experiencia?")
    .setRequired(true);

  // --- P11. Relación entre dispositivos ---
  agregarEscala_(form, "P11. ¿Qué tan claro te quedó cómo se relacionan los dispositivos presentados en la experiencia?",
    ["Nada claro", "Poco claro", "Medianamente claro", "Bastante claro", "Totalmente claro"]);

  // ==========================================================================
  // 6. FASE 4. EVALUACIÓN DE LA EXPERIENCIA
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 4. Evaluación de la experiencia")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Ahora quisiera conocer tu opinión sobre la experiencia en general. Nos interesa tanto lo que te " +
      "haya gustado como aquello que cambiarías.\""
    );

  // --- P13. Interés general ---
  agregarEscala_(form, "P13. En general, ¿qué tan interesante te pareció la experiencia?",
    ["Nada interesante", "Poco interesante", "Moderadamente interesante", "Muy interesante", "Extremadamente interesante"]);

  // --- P14. Atractivo de la dinámica ---
  agregarEscala_(form, "P14. ¿Qué tan atractiva te pareció la idea de resolver un reto mediante una experiencia interactiva como esta?",
    ["Nada atractiva", "Poco atractiva", "Moderadamente atractiva", "Muy atractiva", "Extremadamente atractiva"]);

  // --- P15. Credibilidad ---
  agregarEscala_(form, "P15. ¿Qué tan creíble te resultó la experiencia tecnológica presentada?",
    ["Nada creíble", "Poco creíble", "Moderadamente creíble", "Muy creíble", "Totalmente creíble"]);

  // --- P16. Fortalezas y mejoras ---
  form.addParagraphTextItem()
    .setTitle("P16. ¿Qué fue lo que más te gustó de la experiencia y qué cambiarías para mejorarla?")
    .setRequired(true);

  // ==========================================================================
  // 7. FASE 5. POSTEST DE PERCEPCIÓN DE HONOR
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 5. Postest de percepción de HONOR")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Para terminar, quisiera volver a algunas preguntas sobre marcas de tecnología. Responde según lo " +
      "que piensas ahora, después de haber explorado la experiencia. No hay respuestas correctas o incorrectas.\""
    );

  // --- P18. Asociación espontánea posterior ---
  form.addParagraphTextItem()
    .setTitle("P18. Después de esta experiencia, cuando escuchas el nombre HONOR, ¿qué es lo primero que se te viene a la mente?")
    .setRequired(true);

  // --- P19. Productos asociados después de la experiencia ---
  agregarCasillas_(form, {
    titulo: "P19. Después de esta experiencia, ¿qué tipos de productos asocias con HONOR?",
    ayuda: "Selecciona todas las opciones que correspondan.",
    obligatoria: true,
    maxSelecciones: null,
    otra: false,
    opciones: PRODUCTOS_
  });

  // --- P21. Percepción posterior de HONOR (cuadrícula) ---
  agregarCuadriculaAcuerdo_(form,
    "P21. Indica cuánto estás de acuerdo con las siguientes afirmaciones sobre HONOR, después de haber explorado la experiencia.",
    "21");

  // ==========================================================================
  // 8. FASE 6. INTENCIÓN DE PARTICIPACIÓN
  // ==========================================================================
  form.addPageBreakItem()
    .setTitle("Fase 6. Intención de participación")
    .setHelpText(
      "Texto que leerá el moderador:\n" +
      "\"Imagina que esta experiencia se instalara realmente en tu universidad, con un espacio físico en " +
      "el que pudieras participar y resolver los retos. Quisiera saber qué tan atractiva te resultaría esa posibilidad.\""
    );

  // --- P22. Intención de participar ---
  agregarEscala_(form, "P22. Si esta experiencia se instalara en tu universidad, ¿qué tan probable sería que participaras?",
    ["Nada probable", "Poco probable", "Ni probable ni improbable", "Probable", "Muy probable"]);

  // ==========================================================================
  // 9. CREAR LA HOJA DE CÁLCULO NUEVA Y VINCULARLA AL FORMULARIO
  // ==========================================================================
  var hoja = SpreadsheetApp.create("Respuestas - Validación HONOR Tech Escape Room");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());

  intentar_(function () {
    SpreadsheetApp.flush();
    var hojas = hoja.getSheets();
    if (hojas.length > 1) {
      for (var i = 0; i < hojas.length; i++) {
        var nombre = hojas[i].getName();
        var esPorDefecto = (nombre === "Hoja 1" || nombre === "Sheet1" || nombre === "Hoja1");
        if (esPorDefecto && hojas[i].getLastRow() === 0) {
          hoja.deleteSheet(hojas[i]);
          break;
        }
      }
    }
  });

  // ==========================================================================
  // 10. ENLACES EN LOS REGISTROS
  // ==========================================================================
  Logger.log("Formulario creado: " + form.getTitle());
  Logger.log("Número de ítems (secciones + preguntas): " + form.getItems().length);
  intentar_(function () { Logger.log("Enlace para RESPONDER el formulario: " + form.getPublishedUrl()); });
  Logger.log("Enlace para EDITAR el formulario: " + form.getEditUrl());
  Logger.log("Enlace de la HOJA DE CÁLCULO vinculada: " + hoja.getUrl());
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Pregunta de casillas de verificación.
 * cfg: {titulo, ayuda, obligatoria, maxSelecciones (número o null), otra, opciones[]}
 */
function agregarCasillas_(form, cfg) {
  var item = form.addCheckboxItem();
  item.setTitle(cfg.titulo);
  if (cfg.ayuda) { item.setHelpText(cfg.ayuda); }
  item.setChoices(cfg.opciones.map(function (texto) {
    return item.createChoice(texto);
  }));
  if (cfg.otra) { item.showOtherOption(true); }
  item.setRequired(cfg.obligatoria);
  if (cfg.maxSelecciones) {
    var validacion = FormApp.createCheckboxValidation()
      .setHelpText("Selecciona como máximo " + cfg.maxSelecciones + " opciones.")
      .requireSelectAtMost(cfg.maxSelecciones)
      .build();
    item.setValidation(validacion);
  }
  return item;
}

/**
 * Pregunta de opción múltiple (una sola respuesta).
 * cfg: {titulo, ayuda, obligatoria, otra, opciones[]}
 */
function agregarOpcionMultiple_(form, cfg) {
  var item = form.addMultipleChoiceItem();
  item.setTitle(cfg.titulo);
  if (cfg.ayuda) { item.setHelpText(cfg.ayuda); }
  item.setChoices(cfg.opciones.map(function (texto) {
    return item.createChoice(texto);
  }));
  if (cfg.otra) { item.showOtherOption(true); }
  item.setRequired(cfg.obligatoria);
  return item;
}

/**
 * Escala 1 a 5 como opción múltiple, con la etiqueta completa de cada valor.
 * etiquetas: 5 textos, del 1 al 5.
 */
function agregarEscala_(form, titulo, etiquetas) {
  var opciones = [];
  for (var i = 0; i < etiquetas.length; i++) {
    opciones.push((i + 1) + " = " + etiquetas[i]);
  }
  return agregarOpcionMultiple_(form, {
    titulo: titulo,
    ayuda: null,
    obligatoria: true,
    otra: false,
    opciones: opciones
  });
}

/**
 * Cuadrícula de acuerdo (P5 y P21). setRequired(true) exige responder CADA fila.
 * prefijo: "5" o "21" para numerar las filas (5a, 5b... / 21a, 21b...).
 */
function agregarCuadriculaAcuerdo_(form, titulo, prefijo) {
  var letras = ["a", "b", "c", "d", "e"];
  var filas = [];
  for (var i = 0; i < AFIRMACIONES_.length; i++) {
    filas.push(prefijo + letras[i] + ". " + AFIRMACIONES_[i]);
  }
  return form.addGridItem()
    .setTitle(titulo)
    .setRows(filas)
    .setColumns(COLUMNAS_ACUERDO_)
    .setRequired(true);
}

/** Ejecuta una función y registra (sin detener el script) si falla. */
function intentar_(fn) {
  try {
    fn();
  } catch (e) {
    Logger.log("Aviso (no crítico): " + e.message);
  }
}
