// All copy lives here, EN and ES side by side. `es` is typed against `en`, so a missing
// translation is a type error.

export const links = {
  email: "juanparracsfn@gmail.com",
  github: "https://github.com/CamiloParraS",
  linkedin: "https://www.linkedin.com/in/camiloparras/",
  // Drop the PDF at public/cv/camilo-parra-cv.pdf.
  cv: "/cv/camilo-parra-cv.pdf",
  // Flip to true once the PDF is in place; until then the button says it is on its way.
  cvReady: false,
};

const repo = (name: string) => `${links.github}/${name}`;

export type ArtId = "magi" | "ghost" | "haptic" | "sophiel" | "laaf";

const en = {
  meta: {
    title: "Camilo Parra · Software engineering student",
    description:
      "Portfolio of Camilo Parra, a software engineering student from Pasto, Colombia, building MAGI, a local multimodal semantic search engine in Rust.",
  },
  nav: {
    work: "Work",
    about: "About",
    record: "Record",
    offcode: "Off-code",
    contact: "Contact",
    menu: "Menu",
    close: "Close menu",
    lang: "Español",
    langShort: "ES",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    skip: "Skip to content",
  },
  hero: {
    name: "Camilo Parra",
    lead: "Software engineering student from Pasto, Colombia, trying to learn how to code. Currently building MAGI, a local semantic search engine, in Rust.",
    cv: "Download CV",
    cvPending: "CV coming soon",
    work: "See my work",
    open: "Open to internships and first roles",
    sceneLabel:
      "Dithered illustration of Galeras volcano over Pasto at {time}, with a small car on the road. Drag the car or use the Drive button.",
    night: "night",
    day: "day",
    caption: "Galeras over Pasto - drag the car",
    dragHint: "Drag the car",
    drive: "Drive",
    photoAlt: "Portrait of Camilo Parra",
    magiLine: "Search your files by meaning, offline.",
    ghostLine: "A stealth game whose enemy AI learns your habits.",
  },
  about: {
    title: "About",
    intro: "The longer version, for the people who scrolled.",
    bio: [
      "I'm Camilo, a software engineering student at Universidad Cooperativa de Colombia in Pasto. Honestly, I'm a pretty boring person: I like cars, I like videogames, and I like figuring out how things work underneath.",
      "That last part started with games. As a kid I got hooked on emulating the Nintendo 64, and the question of how a PC could pretend to be a console stuck with me. It turned into a habit of opening things up to see the parts, which is more or less what software engineering is.",
      "Today that means projects that go a bit deeper than a CRUD app: a search engine in Rust that understands your files, and a game whose AI studies how you play. I'm still learning, and I'd like to keep doing it on a team.",
    ],
    photoSlot: "Photo slot",
    photoHint: "Add a photo at public/img/about-{n}.jpg",
    stackTitle: "Stack",
    stack: [
      {
        group: "Languages",
        items: [
          "Rust",
          "TypeScript",
          "Kotlin",
          "Python",
          "Java",
          "GDScript",
          "C++",
        ],
      },
      {
        group: "Frameworks",
        items: [
          "React",
          "Next.js",
          "Spring",
          "Android",
          "Godot",
          "Tailwind CSS",
        ],
      },
      { group: "Tools", items: ["Git", "GitHub", "Vercel", "Arduino"] },
    ],
    factsTitle: "Quick facts",
    facts: [
      { k: "Based in", v: "Pasto, Colombia" },
      { k: "Studying", v: "Software Engineering, 2024–2028" },
      { k: "Way in", v: "Emulating the Nintendo 64" },
      { k: "Right now", v: "MAGI and Ghost Layer" },
      { k: "Off the clock", v: "Cars and videogames" },
    ],
  },
  work: {
    title: "Work",
    intro:
      "Things I've built. The first two are the ones I'd talk about in an interview.",
    code: "Code",
    demo: "Demo",
    demoPending: "Demo soon",
    artNote: "Illustration",
    projects: [
      {
        id: "magi" as ArtId,
        name: "MAGI",
        tagline: "A local, multimodal semantic search engine for your files.",
        body: "Search your own documents and images by what they mean instead of what they're named, and keep everything on your machine. Written in Rust.",
        tags: ["Rust", "Semantic search", "Multimodal", "MIT"],
        repo: repo("MAGI"),
        demo: null as string | null,
      },
      {
        id: "ghost" as ArtId,
        name: "Ghost Layer",
        tagline: "A short stealth game where the enemy AI profiles you.",
        body: "Between missions, an AI called Aigis studies your habits (stealth, combat, takedowns) and adapts its forces. Behaviour trees and utility AI in Godot 4, with a PSone-era look.",
        tags: ["Godot 4", "GDScript", "Game AI", "In development"],
        repo: repo("codename-DORO"),
        demo: null as string | null,
      },
      {
        id: "haptic" as ArtId,
        name: "HapticWash",
        tagline: "Smart handwashing monitoring with wearable motion sensing.",
        body: "A Kotlin wearable app that reads wrist motion during handwashing, plus a Python AI component that analyses it.",
        tags: ["Kotlin", "Wearables", "Python", "AI"],
        repo: repo("HapticWash"),
        demo: null as string | null,
      },
      {
        id: "sophiel" as ArtId,
        name: "Sophiel",
        tagline: "A visual content protection system.",
        body: "A Kotlin project for protecting visual content.",
        tags: ["Kotlin"],
        repo: repo("Sophiel"),
        demo: null as string | null,
      },
      {
        id: "laaf" as ArtId,
        name: "Laaf",
        tagline: "An institutional template manager.",
        body: "A TypeScript app for managing an institution's document templates.",
        tags: ["TypeScript"],
        repo: repo("Laaf"),
        demo: null as string | null,
      },
    ],
  },
  testimonials: {
    title: "Kind words",
    intro:
      "Reserved for people I've worked with. They're on their way; I'm not making them up.",
    pending: "Testimonial pending",
    pendingBody: "This space is saved for someone who has worked with me.",
  },
  record: {
    title: "Record",
    intro: "Where I've been, without the inflation.",
    experienceTitle: "Experience",
    experience: [
      {
        role: "Freelance developer",
        where: "Independent projects",
        when: "Ongoing",
        body: "Designing and shipping my own projects end to end, from MAGI in Rust to Kotlin apps and web tools.",
      },
      {
        role: "IT support",
        where: "Family and home",
        when: "Ongoing",
        body: "Setting up, fixing and maintaining computers, networks and devices for my family.",
      },
    ],
    educationTitle: "Education",
    education: [
      {
        role: "Software Engineering",
        where: "Universidad Cooperativa de Colombia, Pasto",
        when: "Aug 2024 – Aug 2028 (expected)",
        body: "Undergraduate degree, in progress.",
      },
    ],
  },
  offcode: {
    title: "Off-code",
    intro: "The boring-person part.",
    carsTitle: "2,000+ Hot Wheels",
    carsBody:
      "I collect Hot Wheels. The collection is past 2,000 cars, and I still can't walk past the toy aisle without checking the pegs. The car thing leaks into my code too:",
    carsRepos: [
      { name: "CarDynamics-Analyzer", href: repo("CarDynamics-Analyzer") },
      { name: "Downforce-Analytics", href: repo("Downforce-Analytics") },
    ],
    gamesTitle: "Save files",
    gamesBody: "Games I keep coming back to.",
    games: ["Cyberpunk 2077", "Skyrim", "Oblivion", "Metal Gear", "Forza"],
    originTitle: "Where it started",
    originAlt: "A Nintendo 64 console",
    originBody:
      "A Nintendo 64 emulator on a family PC. That's when I stopped just playing and started asking how it worked.",
  },
  contact: {
    title: "Let's talk",
    intro: "Internship, first role, or just a question about MAGI.",
    where: "Pasto, Colombia · UTC−5",
    copy: "Copy email",
    copied: "Copied",
    name: "Name",
    email: "Email",
    message: "Message",
    namePh: "Your name",
    emailPh: "you@company.com",
    messagePh: "What are you working on?",
    send: "Send message",
    sending: "Sending…",
    sent: "Thanks, your message is on its way. I'll reply to the email you left.",
    error: "That didn't go through. Try again, or email me directly at",
    invalid: "Please fill in your name, a valid email and a message.",
  },
  footer: {
    built: "Built with Next.js and a hand-rolled dither.",
    top: "Back to top",
  },
};

export type Content = typeof en;

const es: Content = {
  meta: {
    title: "Camilo Parra · Estudiante de ingeniería de software",
    description:
      "Portafolio de Camilo Parra, estudiante de ingeniería de software de Pasto, Colombia, que construye MAGI, un motor de búsqueda semántica local y multimodal en Rust.",
  },
  nav: {
    work: "Proyectos",
    about: "Sobre mí",
    record: "Trayectoria",
    offcode: "Fuera del código",
    contact: "Contacto",
    menu: "Menú",
    close: "Cerrar menú",
    lang: "English",
    langShort: "EN",
    toLight: "Cambiar a modo claro",
    toDark: "Cambiar a modo oscuro",
    skip: "Saltar al contenido",
  },
  hero: {
    name: "Camilo Parra",
    lead: "Estudiante de ingeniería de software de Pasto, Colombia, intentando aprender a programar. Ahora mismo construyo MAGI, un motor de búsqueda semántica local, en Rust.",
    cv: "Descargar CV",
    cvPending: "CV en camino",
    work: "Ver mis proyectos",
    open: "Disponible para prácticas y primeros empleos",
    sceneLabel:
      "Ilustración con tramado del volcán Galeras sobre Pasto de {time}, con un carro pequeño en la carretera. Arrastra el carro o usa el botón Conducir.",
    night: "noche",
    day: "día",
    caption: "El Galeras sobre Pasto - arrastra el carro",
    dragHint: "Arrastra el carro",
    drive: "Conducir",
    photoAlt: "Retrato de Camilo Parra",
    magiLine: "Busca tus archivos por su significado, sin conexión.",
    ghostLine: "Un juego de sigilo cuya IA enemiga aprende tus hábitos.",
  },
  about: {
    title: "Sobre mí",
    intro: "La versión larga, para quienes siguieron bajando.",
    bio: [
      "Soy Camilo, estudiante de ingeniería de software en la Universidad Cooperativa de Colombia, en Pasto. La verdad soy una persona bastante aburrida: me gustan los carros, me gustan los videojuegos y me gusta entender cómo funcionan las cosas por dentro.",
      "Eso último empezó con los juegos. De niño me obsesioné con emular la Nintendo 64, y la pregunta de cómo un PC podía hacerse pasar por una consola se me quedó en la cabeza. Se volvió la costumbre de abrir las cosas para ver sus piezas, que es más o menos lo que es la ingeniería de software.",
      "Hoy eso significa proyectos que van un poco más allá de un CRUD: un motor de búsqueda en Rust que entiende tus archivos y un juego cuya IA estudia cómo juegas. Sigo aprendiendo, y me gustaría seguir haciéndolo en un equipo.",
    ],
    photoSlot: "Espacio para foto",
    photoHint: "Agrega una foto en public/img/about-{n}.jpg",
    stackTitle: "Tecnologías",
    stack: [
      {
        group: "Lenguajes",
        items: [
          "Rust",
          "TypeScript",
          "Kotlin",
          "Python",
          "Java",
          "GDScript",
          "C++",
        ],
      },
      {
        group: "Frameworks",
        items: [
          "React",
          "Next.js",
          "Spring",
          "Android",
          "Godot",
          "Tailwind CSS",
        ],
      },
      { group: "Herramientas", items: ["Git", "GitHub", "Vercel", "Arduino"] },
    ],
    factsTitle: "Datos rápidos",
    facts: [
      { k: "Vivo en", v: "Pasto, Colombia" },
      { k: "Estudio", v: "Ingeniería de Software, 2024–2028" },
      { k: "Cómo empecé", v: "Emulando la Nintendo 64" },
      { k: "Ahora mismo", v: "MAGI y Ghost Layer" },
      { k: "Fuera del trabajo", v: "Carros y videojuegos" },
    ],
  },
  work: {
    title: "Proyectos",
    intro:
      "Cosas que he construido. Los dos primeros son de los que hablaría en una entrevista.",
    code: "Código",
    demo: "Demo",
    demoPending: "Demo pronto",
    artNote: "Ilustración",
    projects: [
      {
        id: "magi",
        name: "MAGI",
        tagline:
          "Un motor de búsqueda semántica local y multimodal para tus archivos.",
        body: "Busca tus propios documentos e imágenes por lo que significan y no por cómo se llaman, sin que nada salga de tu equipo. Escrito en Rust.",
        tags: ["Rust", "Búsqueda semántica", "Multimodal", "MIT"],
        repo: repo("MAGI"),
        demo: null,
      },
      {
        id: "ghost",
        name: "Ghost Layer",
        tagline: "Un juego corto de sigilo donde la IA enemiga te perfila.",
        body: "Entre misiones, una IA llamada Aigis estudia tus hábitos (sigilo, combate, derribos) y adapta sus fuerzas. Árboles de comportamiento e IA de utilidad en Godot 4, con estética de la era PSone.",
        tags: ["Godot 4", "GDScript", "IA de juegos", "En desarrollo"],
        repo: repo("codename-DORO"),
        demo: null,
      },
      {
        id: "haptic",
        name: "HapticWash",
        tagline:
          "Monitoreo inteligente del lavado de manos con sensores de movimiento.",
        body: "Una app para wearables en Kotlin que lee el movimiento de la muñeca durante el lavado de manos, más un componente de IA en Python que lo analiza.",
        tags: ["Kotlin", "Wearables", "Python", "IA"],
        repo: repo("HapticWash"),
        demo: null,
      },
      {
        id: "sophiel",
        name: "Sophiel",
        tagline: "Un sistema de protección de contenido visual.",
        body: "Un proyecto en Kotlin para proteger contenido visual.",
        tags: ["Kotlin"],
        repo: repo("Sophiel"),
        demo: null,
      },
      {
        id: "laaf",
        name: "Laaf",
        tagline: "Un gestor de plantillas institucionales.",
        body: "Una app en TypeScript para gestionar las plantillas de documentos de una institución.",
        tags: ["TypeScript"],
        repo: repo("Laaf"),
        demo: null,
      },
    ],
  },
  testimonials: {
    title: "Palabras amables",
    intro:
      "Reservado para personas con las que he trabajado. Ya vienen en camino; no me las voy a inventar.",
    pending: "Testimonio pendiente",
    pendingBody:
      "Este espacio está guardado para alguien que haya trabajado conmigo.",
  },
  record: {
    title: "Trayectoria",
    intro: "Por dónde he pasado, sin inflar nada.",
    experienceTitle: "Experiencia",
    experience: [
      {
        role: "Desarrollador freelance",
        where: "Proyectos independientes",
        when: "Actualmente",
        body: "Diseño y saco adelante mis propios proyectos de principio a fin, desde MAGI en Rust hasta apps en Kotlin y herramientas web.",
      },
      {
        role: "Soporte técnico",
        where: "Familia y hogar",
        when: "Actualmente",
        body: "Instalo, reparo y mantengo computadores, redes y dispositivos de mi familia.",
      },
    ],
    educationTitle: "Educación",
    education: [
      {
        role: "Ingeniería de Software",
        where: "Universidad Cooperativa de Colombia, Pasto",
        when: "Ago 2024 – Ago 2028 (previsto)",
        body: "Pregrado en curso.",
      },
    ],
  },
  offcode: {
    title: "Fuera del código",
    intro: "La parte de persona aburrida.",
    carsTitle: "Más de 2.000 Hot Wheels",
    carsBody:
      "Colecciono Hot Wheels. La colección ya pasa de 2.000 carros y todavía no puedo pasar por el pasillo de juguetes sin revisar qué hay nuevo. Lo de los carros también se cuela en mi código:",
    carsRepos: [
      { name: "CarDynamics-Analyzer", href: repo("CarDynamics-Analyzer") },
      { name: "Downforce-Analytics", href: repo("Downforce-Analytics") },
    ],
    gamesTitle: "Partidas guardadas",
    gamesBody: "Juegos a los que siempre vuelvo.",
    games: ["Cyberpunk 2077", "Skyrim", "Oblivion", "Metal Gear", "Forza"],
    originTitle: "Dónde empezó",
    originAlt: "Una consola Nintendo 64",
    originBody:
      "Un emulador de Nintendo 64 en el PC de la casa. Ahí dejé de solo jugar y empecé a preguntarme cómo funcionaba.",
  },
  contact: {
    title: "Hablemos",
    intro: "Prácticas, primer empleo o una pregunta sobre MAGI.",
    where: "Pasto, Colombia · UTC−5",
    copy: "Copiar correo",
    copied: "Copiado",
    name: "Nombre",
    email: "Correo",
    message: "Mensaje",
    namePh: "Tu nombre",
    emailPh: "tu@empresa.com",
    messagePh: "¿En qué estás trabajando?",
    send: "Enviar mensaje",
    sending: "Enviando…",
    sent: "Gracias, tu mensaje va en camino. Te responderé al correo que dejaste.",
    error: "No se pudo enviar. Inténtalo de nuevo o escríbeme directamente a",
    invalid: "Escribe tu nombre, un correo válido y un mensaje.",
  },
  footer: {
    built: "Hecho con Next.js y un tramado hecho a mano.",
    top: "Volver arriba",
  },
};

export const content = { en, es };
export type Lang = keyof typeof content;
