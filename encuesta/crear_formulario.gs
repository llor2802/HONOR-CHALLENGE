/**
 * Guion de validación del prototipo · HONOR Tech Escape Room
 * Crea el Google Form completo (pretest, registro del observador, comprensión,
 * evaluación, postest e intención) y una hoja de cálculo enlazada para las respuestas.
 *
 * Uso: script.google.com → Proyecto nuevo → pegar este código → ejecutar crearFormulario().
 */

const PROTOTIPO_URL = 'https://claude.ai/artifact/8HGvVyU8qkFVEqBrFUuT6G';

const ACUERDO = [
  '1 = Totalmente en desacuerdo',
  '2 = En desacuerdo',
  '3 = Ni de acuerdo ni en desacuerdo',
  '4 = De acuerdo',
  '5 = Totalmente de acuerdo',
  'No tengo suficiente información para responder'
];

const AFIRMACIONES = [
  'a. HONOR es una marca que ofrece más que smartphones.',
  'b. HONOR cuenta con diferentes tipos de dispositivos tecnológicos.',
  'c. Los dispositivos de HONOR pueden complementarse entre sí.',
  'd. HONOR ofrece experiencias tecnológicas integradas.',
  'e. Considero a HONOR una marca tecnológicamente innovadora.'
];

const PRODUCTOS = [
  'Smartphones',
  'Tablets',
  'Laptops',
  'Smartwatches o relojes inteligentes',
  'Audífonos',
  'Otros dispositivos tecnológicos',
  'No lo sé'
];

function crearFormulario() {
  const form = FormApp.create('Validación del prototipo · HONOR Tech Escape Room');
  form.setDescription('Prueba de usabilidad, comprensión y cambio exploratorio de percepción.');
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setConfirmationMessage(
    'Muchas gracias por tu tiempo y por compartir tu opinión. Tus respuestas nos ayudarán a ' +
    'identificar qué funciona bien y qué debemos mejorar antes de implementar la experiencia. ' +
    'Buscamos comentarios sinceros, así que cualquier dificultad o aspecto que no te haya ' +
    'convencido nos resulta útil.'
  );

  // ---------- Ficha de control (moderador) ----------
  form.addSectionHeaderItem()
    .setTitle('Ficha de control de la sesión · SOLO MODERADOR')
    .setHelpText('Completar antes de entregar el formulario al participante.');

  form.addTextItem().setTitle('Código de sesión').setRequired(true);
  form.addDateItem().setTitle('Fecha').setRequired(true);

  // ---------- FASE 1 ----------
  form.addPageBreakItem()
    .setTitle('Fase 1. Presentación y pretest')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Hola, estamos evaluando una experiencia interactiva dirigida a estudiantes universitarios. ' +
      'Queremos conocer tu opinión sobre algunas marcas de tecnología y, posteriormente, probar una ' +
      'experiencia que estamos desarrollando."'
    );

  form.addMultipleChoiceItem()
    .setTitle('P1. ¿En qué ciclo de tu carrera te encuentras actualmente?')
    .setChoiceValues(['1.º–2.º ciclo', '3.º–4.º ciclo', '5.º–6.º ciclo', '7.º–10.º ciclo', 'Prefiero no responder'])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('P2. Cuando escuchas el nombre HONOR, ¿qué es lo primero que se te viene a la mente?')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('P3. ¿Qué tipos de productos crees que comercializa HONOR en Perú?')
    .setHelpText('Selecciona todas las opciones que correspondan.')
    .setChoiceValues(PRODUCTOS)
    .setRequired(true);

  form.addGridItem()
    .setTitle('P5. Indica cuánto estás de acuerdo con las siguientes afirmaciones sobre HONOR, según lo que sabes actualmente.')
    .setRows(AFIRMACIONES.map(a => '5' + a))
    .setColumns(ACUERDO)
    .setRequired(true);

  // ---------- FASE 2 ----------
  form.addPageBreakItem()
    .setTitle('Fase 2. Interacción con el prototipo')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Ahora te mostraré una experiencia interactiva que estamos desarrollando. Imagina que estás en ' +
      'tu universidad y te encuentras con esta experiencia. Explórala como lo harías normalmente e intenta ' +
      'descubrir cómo funciona. No te explicaré los pasos de entrada, porque queremos comprobar si se ' +
      'entiende por sí sola. Mientras interactúas, puedes decir en voz alta lo que estás pensando, lo que ' +
      'te llama la atención o cualquier duda que te surja. No te preocupes si algo no se entiende: eso ' +
      'también nos ayuda a identificar qué debemos mejorar."\n\n' +
      'Acción: compartir el prototipo y dejar que el participante lo explore sin explicar las funciones ' +
      'ni señalar dónde hacer clic.\n' +
      'Prototipo: ' + PROTOTIPO_URL
    );

  form.addSectionHeaderItem()
    .setTitle('Registro del observador · SOLO MODERADOR')
    .setHelpText('No leer como preguntas al participante. Completar mientras explora el prototipo.');

  form.addCheckboxItem()
    .setTitle('P6. Inicio de la interacción')
    .setHelpText('Marcar todas las que correspondan.')
    .setChoiceValues([
      'Exploró espontáneamente',
      'Leyó primero las instrucciones',
      'Intentó interactuar sin leerlas',
      'Observó antes de actuar',
      'Preguntó qué debía hacer',
      'Necesitó que el moderador le indicara cómo empezar'
    ])
    .showOtherOption(true) // "Otra conducta relevante"
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('P7. ¿Pudo completar el recorrido previsto?')
    .setChoiceValues([
      'Sí, sin ayuda',
      'Sí, con una indicación puntual',
      'Sí, con varias indicaciones',
      'Completó solo una parte',
      'No pudo completarlo',
      'No aplica porque el prototipo no tiene un recorrido de finalización definido'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('P8. Dificultades observadas')
    .setHelpText('Marcar todas las que correspondan.')
    .setChoiceValues([
      'Comprender el objetivo',
      'Entender las instrucciones',
      'Identificar los elementos interactivos',
      'Saber cómo avanzar',
      'Comprender la relación entre dispositivos',
      'Entender cómo terminar',
      'Problemas técnicos',
      'No presentó dificultades observables'
    ])
    .showOtherOption(true) // "Otros"
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('P8. Ejemplos concretos de las dificultades')
    .setHelpText('Registrar en qué momento o zona ocurrió y qué hizo o dijo el participante.');

  form.addTextItem()
    .setTitle('P9. Tiempo registrado (segundos)')
    .setHelpText('Si no completa el recorrido, registrar el tiempo transcurrido y marcarlo como incompleto abajo.')
    .setValidation(FormApp.createTextValidation()
      .requireWholeNumber()
      .setHelpText('Ingresa solo un número entero de segundos.')
      .build())
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('P9. Tipo de tiempo registrado')
    .setChoiceValues([
      'Tiempo de finalización (completó el recorrido)',
      'Tiempo transcurrido (incompleto)',
      'Solo tiempo de exploración (sin tarea definida)'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Observaciones adicionales del moderador');

  // ---------- FASE 3 ----------
  form.addPageBreakItem()
    .setTitle('Fase 3. Comprensión espontánea')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Gracias. Ahora quiero conocer tu interpretación de la experiencia. Responde con tus propias ' +
      'palabras. No hay problema si algo no te quedó claro; precisamente queremos saber qué comunica el prototipo."'
    );

  form.addParagraphTextItem()
    .setTitle('P10. Con tus propias palabras, ¿cuál crees que es el objetivo principal de esta experiencia?')
    .setRequired(true);

  escala(form, 'P11. ¿Qué tan claro te quedó cómo se relacionan los dispositivos presentados en la experiencia?',
    ['Nada claro', 'Poco claro', 'Medianamente claro', 'Bastante claro', 'Totalmente claro']);

  // ---------- FASE 4 ----------
  form.addPageBreakItem()
    .setTitle('Fase 4. Evaluación de la experiencia')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Ahora quisiera conocer tu opinión sobre la experiencia en general. Nos interesa tanto lo que te ' +
      'haya gustado como aquello que cambiarías."'
    );

  escala(form, 'P13. En general, ¿qué tan interesante te pareció la experiencia?',
    ['Nada interesante', 'Poco interesante', 'Moderadamente interesante', 'Muy interesante', 'Extremadamente interesante']);

  escala(form, 'P14. ¿Qué tan atractiva te pareció la idea de resolver un reto mediante una experiencia interactiva como esta?',
    ['Nada atractiva', 'Poco atractiva', 'Moderadamente atractiva', 'Muy atractiva', 'Extremadamente atractiva']);

  escala(form, 'P15. ¿Qué tan creíble te resultó la experiencia tecnológica presentada?',
    ['Nada creíble', 'Poco creíble', 'Moderadamente creíble', 'Muy creíble', 'Totalmente creíble']);

  form.addParagraphTextItem()
    .setTitle('P16. ¿Qué fue lo que más te gustó de la experiencia y qué cambiarías para mejorarla?')
    .setRequired(true);

  // ---------- FASE 5 ----------
  form.addPageBreakItem()
    .setTitle('Fase 5. Postest de percepción de HONOR')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Para terminar, quisiera volver a algunas preguntas sobre marcas de tecnología. Responde según lo ' +
      'que piensas ahora, después de haber explorado la experiencia. No hay respuestas correctas o incorrectas."'
    );

  form.addParagraphTextItem()
    .setTitle('P18. Después de esta experiencia, cuando escuchas el nombre HONOR, ¿qué es lo primero que se te viene a la mente?')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('P19. Después de esta experiencia, ¿qué tipos de productos asocias con HONOR?')
    .setHelpText('Selecciona todas las opciones que correspondan.')
    .setChoiceValues(PRODUCTOS)
    .setRequired(true);

  form.addGridItem()
    .setTitle('P21. Indica cuánto estás de acuerdo con las siguientes afirmaciones sobre HONOR, después de haber explorado la experiencia.')
    .setRows(AFIRMACIONES.map(a => '21' + a))
    .setColumns(ACUERDO)
    .setRequired(true);

  // ---------- FASE 6 ----------
  form.addPageBreakItem()
    .setTitle('Fase 6. Intención de participación')
    .setHelpText(
      'Texto que leerá el moderador:\n' +
      '"Imagina que esta experiencia se instalara realmente en tu universidad, con un espacio físico en ' +
      'el que pudieras participar y resolver los retos. Quisiera saber qué tan atractiva te resultaría esa posibilidad."'
    );

  escala(form, 'P22. Si esta experiencia se instalara en tu universidad, ¿qué tan probable sería que participaras?',
    ['Nada probable', 'Poco probable', 'Ni probable ni improbable', 'Probable', 'Muy probable']);

  // ---------- Hoja de respuestas ----------
  const hoja = SpreadsheetApp.create('Respuestas · Validación HONOR Tech Escape Room');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());

  Logger.log('Formulario para responder: ' + form.getPublishedUrl());
  Logger.log('Formulario para editar: ' + form.getEditUrl());
  Logger.log('Hoja de respuestas: ' + hoja.getUrl());
}

/** Escala lineal 1–5 con las cinco etiquetas visibles en la ayuda. */
function escala(form, titulo, etiquetas) {
  form.addScaleItem()
    .setTitle(titulo)
    .setHelpText(etiquetas.map((e, i) => (i + 1) + ' = ' + e).join(' · '))
    .setBounds(1, 5)
    .setLabels(etiquetas[0], etiquetas[4])
    .setRequired(true);
}
