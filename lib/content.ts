// All copy lives here. Anything marked `pending: true` is a placeholder the
// site renders with a dashed "pending" style: replace it with real material.

export const links = {
  github: "https://github.com/CamiloParraS",
  email: "", // pending: your email
  linkedin: "", // pending: your LinkedIn URL
  cv: "", // pending: drop your CV at public/cv.pdf, then set this to "/cv.pdf"
};

export const portrait = "/img/avatar.jpg"; // pending: replace with a real photo

export const stack = {
  languages: ["Rust", "TypeScript", "Kotlin", "Python", "Java", "JavaScript", "C++"],
  platforms: ["React", "NestJS", "Spring Boot", "Android · Wear OS", "LiteRT", "SQLite · sqlite-vec"],
  tools: ["Git", "Gradle", "uv", "just", "Vercel"],
};

export type Project = {
  id: string;
  name: string;
  stack: string[];
  year: string;
  repo: string;
  demo?: string;
  plate: "magi" | "wave" | "mask" | "sheets";
};

export const projects: Project[] = [
  {
    id: "magi",
    name: "MAGI",
    stack: ["Rust", "SQLite", "sqlite-vec", "OCR"],
    year: "2026",
    repo: "https://github.com/CamiloParraS/MAGI",
    demo: "https://github.com/CamiloParraS/MAGI/releases",
    plate: "magi",
  },
  {
    id: "hapticwash",
    name: "HapticWash",
    stack: ["Kotlin", "Wear OS", "Python", "LiteRT"],
    year: "2026",
    repo: "https://github.com/CamiloParraS/HapticWash",
    plate: "wave",
  },
  {
    id: "sophiel",
    name: "Sophiel",
    stack: ["Kotlin", "Android", "Python"],
    year: "2026",
    repo: "https://github.com/CamiloParraS/Sophiel",
    plate: "mask",
  },
  {
    id: "laaf",
    name: "Laaf",
    stack: ["TypeScript", "NestJS"],
    year: "2026",
    repo: "https://github.com/CamiloParraS/Laaf",
    plate: "sheets",
  },
];

const en = {
  meta: {
    title: "Camilo Parra · Software Engineer",
    description:
      "Software engineering student from Pasto, Colombia. Builds local-first systems: a semantic search engine in Rust, a Wear OS handwashing coach, an on-device content filter.",
  },
  nav: {
    status: "Status",
    work: "Work",
    bonds: "Bonds",
    record: "Record",
    after: "After hours",
    contact: "Contact",
    // Plain meaning under each pause-menu command.
    sub: {
      status: "About me",
      work: "Projects",
      bonds: "Testimonials",
      record: "Experience · Education",
      after: "Off the clock",
      contact: "Get in touch",
    },
    skip: "Skip to projects",
    menu: "Menu",
    close: "Close menu",
    lang: "Español",
    toDay: "Switch to day",
    toNight: "Switch to midnight",
    day: "Day",
    night: "Midnight",
  },
  hero: {
    first: "Camilo",
    last: "Parra",
    role: "Software engineer in training",
    lede: "I build software that runs on your own machine and thinks a little. Right now that's MAGI, a semantic search engine for your files, written in Rust. Before it: a handwashing coach for Wear OS and an on-device content filter for Android. Still learning how to code, on purpose.",
    building: "Now building",
    cvPending: "CV coming soon",
    cv: "Save data",
    cvSub: "Download CV",
    where: "Pasto, Colombia",
    open: "Open to internships",
    portraitAlt: "Camilo's avatar, dithered",
    portraitPending: "Avatar · real photo pending",
  },
  status: {
    title: "Status",
    bio: [
      "I'm Camilo, a software engineering student in Pasto, a city in the south of Colombia. Most of my sixty-odd repositories started as coursework: data structures, design patterns, Spring backends, small React apps. A few of them turned into things I actually use.",
      "Lately I keep coming back to software that runs on your own hardware. MAGI searches your files by meaning without uploading anything. HapticWash fits a classifier on a watch. Sophiel filters the screen without leaving the phone. Small, private, a bit stubborn.",
      "Outside code it's cars and videogames. That's about it. Honestly, a pretty boring person.",
    ],
    statsTitle: "Quick bits",
    stats: [
      ["Based in", "Pasto, Colombia"],
      ["Studying", "Software Engineering"],
      ["Status", "Open to internships"],
      ["Building", "MAGI v0.1.1"],
      ["Speaks", "Español · English"],
      ["Off hours", "Cars, videogames"],
    ] as [string, string][],
    stackTitle: "Skills",
    stackGroups: { languages: "Languages", platforms: "Frameworks & platforms", tools: "Tools" },
    photoPending: "Photo pending",
    photoAlt: "Camilo, rendered in ASCII",
  },
  work: {
    title: "Work",
    repo: "Source",
    demo: "Demo",
    download: "Download",
    noDemo: "Demo pending",
    more: "Sixty more repositories on GitHub",
    items: {
      magi: {
        tagline: "Search your files by meaning. Locally.",
        body: "A desktop app that indexes the folders you choose (text, code, PDFs, Office documents, images through OCR and visual embeddings, even QR codes) and lets you search them by meaning. The index never leaves your computer: no uploads, no telemetry.",
        status: "v0.1.1 · Windows · macOS · Linux",
      },
      hapticwash: {
        tagline: "A handwashing coach on your wrist.",
        body: "A Wear OS app that reads wrist motion while you wash your hands and reports which WHO steps you did and which you skipped. The classifier is trained in a separate Python pipeline and ships to the watch as a quantized LiteRT model.",
        status: "App + AI pipeline",
      },
      sophiel: {
        tagline: "A visual safety layer for Android.",
        body: "Captures the screen, classifies frames on the device and masks flagged content with a system overlay. Nothing is sent anywhere.",
        status: "On-device",
      },
      laaf: {
        tagline: "Institutional template manager.",
        body: "A NestJS backend for managing an institution's document templates.",
        status: "In progress",
      },
    } as Record<string, { tagline: string; body: string; status: string }>,
    demoTitle: "Try it",
    demoHint: "Pick a query. MAGI ranks files by what they mean, not by the words in their names.",
    demoNote: "Illustrative files and scores, not a live index.",
    queries: ["receipt from the mechanic", "photo of a whiteboard diagram", "notes about linked lists"],
  },
  bonds: {
    title: "Bonds",
    intro: "What people I've worked with say. These are being collected.",
    pendingQuote: "This bond hasn't been forged yet. A real quote goes here.",
    pendingName: "Name pending",
    pendingRole: "Role · Organisation",
  },
  record: {
    title: "Record",
    experience: "Experience",
    education: "Education",
    expPending: [
      { when: "20XX – 20XX", what: "Role pending", where: "Organisation pending", note: "Details coming soon." },
    ],
    eduItems: [
      { when: "In progress", what: "Software Engineering", where: "University pending · Pasto, Colombia", note: "Coursework: data structures, design patterns, software design, interface development." },
    ],
  },
  after: {
    title: "After hours",
    intro: "Cars and videogames. That's the whole personality. So here's a road at midnight.",
    drive: "Night drive",
    driveHelp: "Arrow keys or A / D to steer, W to accelerate. On touch, hold the left or right half.",
    start: "Start the engine",
    stop: "Pull over",
    speed: "km/h",
    distance: "km",
    garage: "Garage",
    library: "Library",
    garagePending: "Dream car, favourite race and daily driver, coming soon.",
    libraryPending: "Favourite game, current playthrough and all-time soundtrack, coming soon.",
  },
  contact: {
    title: "Send a request",
    intro: "Internships, projects, or just to talk about cars. I answer in English or Spanish.",
    name: "Your name",
    email: "Your email",
    message: "Message",
    send: "Send",
    sending: "Opening your mail app…",
    emailPending: "The form opens once my email is published. Until then, GitHub is the fastest way to reach me.",
    githubCta: "Message me on GitHub",
    errName: "Tell me who you are.",
    errEmail: "That email doesn't look right.",
    errMessage: "Write a message first.",
    elsewhere: "Elsewhere",
  },
  footer: {
    end: "The hour is over.",
    built: "Built in Pasto with Next.js and a fragment shader.",
    top: "Back to midnight",
  },
};

export type Content = typeof en;

const es: Content = {
  meta: {
    title: "Camilo Parra · Ingeniero de software",
    description:
      "Estudiante de ingeniería de software de Pasto, Colombia. Construye sistemas locales: un buscador semántico en Rust, un coach de lavado de manos para Wear OS, un filtro de contenido en el dispositivo.",
  },
  nav: {
    status: "Estado",
    work: "Trabajo",
    bonds: "Vínculos",
    record: "Registro",
    after: "Fuera de horario",
    contact: "Contacto",
    sub: {
      status: "Sobre mí",
      work: "Proyectos",
      bonds: "Testimonios",
      record: "Experiencia · Educación",
      after: "Fuera del código",
      contact: "Escríbeme",
    },
    skip: "Saltar a proyectos",
    menu: "Menú",
    close: "Cerrar menú",
    lang: "English",
    toDay: "Cambiar a día",
    toNight: "Cambiar a medianoche",
    day: "Día",
    night: "Medianoche",
  },
  hero: {
    first: "Camilo",
    last: "Parra",
    role: "Ingeniero de software en formación",
    lede: "Hago software que corre en tu propia máquina y piensa un poco. Ahora mismo es MAGI, un buscador semántico para tus archivos, escrito en Rust. Antes: un coach de lavado de manos para Wear OS y un filtro de contenido en el dispositivo para Android. Sigo aprendiendo a programar, a propósito.",
    building: "Construyendo",
    cvPending: "CV muy pronto",
    cv: "Guardar partida",
    cvSub: "Descargar CV",
    where: "Pasto, Colombia",
    open: "Abierto a prácticas",
    portraitAlt: "Avatar de Camilo, con tramado",
    portraitPending: "Avatar · foto real pendiente",
  },
  status: {
    title: "Estado",
    bio: [
      "Soy Camilo, estudiante de ingeniería de software en Pasto, una ciudad del sur de Colombia. La mayoría de mis sesenta y tantos repositorios empezaron como trabajos de clase: estructuras de datos, patrones de diseño, backends en Spring, pequeñas apps en React. Algunos terminaron siendo cosas que de verdad uso.",
      "Últimamente vuelvo una y otra vez al software que corre en tu propio hardware. MAGI busca tus archivos por significado sin subir nada. HapticWash mete un clasificador en un reloj. Sophiel filtra la pantalla sin salir del teléfono. Pequeño, privado y un poco terco.",
      "Fuera del código: carros y videojuegos. Eso es todo. La verdad, una persona bastante aburrida.",
    ],
    statsTitle: "Datos rápidos",
    stats: [
      ["Desde", "Pasto, Colombia"],
      ["Estudia", "Ingeniería de Software"],
      ["Estado", "Abierto a prácticas"],
      ["Construye", "MAGI v0.1.1"],
      ["Habla", "Español · English"],
      ["Fuera de horario", "Carros, videojuegos"],
    ],
    stackTitle: "Habilidades",
    stackGroups: { languages: "Lenguajes", platforms: "Frameworks y plataformas", tools: "Herramientas" },
    photoPending: "Foto pendiente",
    photoAlt: "Camilo, en ASCII",
  },
  work: {
    title: "Trabajo",
    repo: "Código",
    demo: "Demo",
    download: "Descargar",
    noDemo: "Demo pendiente",
    more: "Sesenta repositorios más en GitHub",
    items: {
      magi: {
        tagline: "Busca tus archivos por significado. En local.",
        body: "Una app de escritorio que indexa las carpetas que elijas (texto, código, PDFs, documentos de Office, imágenes con OCR y embeddings visuales, hasta códigos QR) y te deja buscar por significado. El índice nunca sale de tu computador: sin subidas, sin telemetría.",
        status: "v0.1.1 · Windows · macOS · Linux",
      },
      hapticwash: {
        tagline: "Un coach de lavado de manos en tu muñeca.",
        body: "Una app de Wear OS que lee el movimiento de la muñeca mientras te lavas las manos y te dice qué pasos de la OMS hiciste y cuáles saltaste. El clasificador se entrena en un pipeline aparte en Python y llega al reloj como un modelo LiteRT cuantizado.",
        status: "App + pipeline de IA",
      },
      sophiel: {
        tagline: "Una capa de seguridad visual para Android.",
        body: "Captura la pantalla, clasifica los fotogramas en el dispositivo y tapa el contenido marcado con una superposición del sistema. No se envía nada a ningún lado.",
        status: "En el dispositivo",
      },
      laaf: {
        tagline: "Gestor de plantillas institucionales.",
        body: "Un backend en NestJS para gestionar las plantillas de documentos de una institución.",
        status: "En progreso",
      },
    },
    demoTitle: "Pruébalo",
    demoHint: "Elige una búsqueda. MAGI ordena los archivos por lo que significan, no por las palabras de su nombre.",
    demoNote: "Archivos y puntajes ilustrativos, no un índice real.",
    queries: ["recibo del mecánico", "foto de un diagrama en el tablero", "apuntes de listas enlazadas"],
  },
  bonds: {
    title: "Vínculos",
    intro: "Lo que dice la gente con la que he trabajado. Se están recopilando.",
    pendingQuote: "Este vínculo aún no se ha forjado. Aquí va una cita real.",
    pendingName: "Nombre pendiente",
    pendingRole: "Cargo · Organización",
  },
  record: {
    title: "Registro",
    experience: "Experiencia",
    education: "Educación",
    expPending: [
      { when: "20XX – 20XX", what: "Cargo pendiente", where: "Organización pendiente", note: "Detalles muy pronto." },
    ],
    eduItems: [
      { when: "En curso", what: "Ingeniería de Software", where: "Universidad pendiente · Pasto, Colombia", note: "Materias: estructuras de datos, patrones de diseño, diseño de software, desarrollo de interfaces." },
    ],
  },
  after: {
    title: "Fuera de horario",
    intro: "Carros y videojuegos. Esa es toda la personalidad. Así que aquí hay una carretera a medianoche.",
    drive: "Manejo nocturno",
    driveHelp: "Flechas o A / D para girar, W para acelerar. En pantalla táctil, mantén la mitad izquierda o derecha.",
    start: "Encender el motor",
    stop: "Orillarse",
    speed: "km/h",
    distance: "km",
    garage: "Garaje",
    library: "Biblioteca",
    garagePending: "Carro soñado, carrera favorita y carro del día a día, muy pronto.",
    libraryPending: "Juego favorito, lo que estoy jugando y la banda sonora de siempre, muy pronto.",
  },
  contact: {
    title: "Envía una solicitud",
    intro: "Prácticas, proyectos o solo para hablar de carros. Respondo en español o en inglés.",
    name: "Tu nombre",
    email: "Tu correo",
    message: "Mensaje",
    send: "Enviar",
    sending: "Abriendo tu app de correo…",
    emailPending: "El formulario se activa cuando publique mi correo. Mientras tanto, GitHub es la forma más rápida de contactarme.",
    githubCta: "Escríbeme en GitHub",
    errName: "Dime quién eres.",
    errEmail: "Ese correo no parece válido.",
    errMessage: "Escribe un mensaje primero.",
    elsewhere: "En otros lados",
  },
  footer: {
    end: "La hora terminó.",
    built: "Hecho en Pasto con Next.js y un fragment shader.",
    top: "Volver a medianoche",
  },
};

export const content = { en, es };
export type Lang = keyof typeof content;
