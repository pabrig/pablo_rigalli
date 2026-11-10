export type Lang = "es" | "en";

export const profile = {
  name: "Pablo Rigalli",
  email: "rigallipablo@gmail.com",
  location: { es: "Argentina · remoto", en: "Argentina · remote" },
  linkedin: "https://www.linkedin.com/in/pablo-rigalli",
  github: "https://github.com/pabrig",
  cvPath: "/documents/Pablo_Rigalli_Senior_Software_Engineer_2026_EN.pdf",
  /** Google Calendar “Appointment schedule” URL (includes Google Meet). Override with NEXT_PUBLIC_GOOGLE_BOOKING_URL. */
  bookingUrl: "",
  headline: {
    es: "Senior Software & Product-Minded Engineer",
    en: "Senior Software & Product-Minded Engineer"
  },
  kicker: {
    es: "AI-Augmented DX · arquitectura · producto",
    en: "AI-Augmented DX · architecture · product"
  }
};

export const copy = {
  nav: {
    work: { es: "Aporte", en: "Impact" },
    experience: { es: "Trayectoria", en: "Experience" },
    stack: { es: "IA & Stack", en: "AI & Stack" },
    blog: { es: "Blog", en: "Blog" },
    // docs: { es: "Notas", en: "Notes" },
    contact: { es: "Contacto", en: "Contact" },
    talk: { es: "Hablemos", en: "Let’s talk" },
    menu: { es: "Menú", en: "Menu" },
    close: { es: "Cerrar", en: "Close" },
    startA: { es: "Empecemos un", en: "Start a" },
    newProject: { es: "Nuevo proyecto", en: "New project" },
    together: { es: "juntos", en: "together" }
  },
  reading: {
    open: { es: "Lectura", en: "Reading" },
    title: { es: "Edición de lectura", en: "Reading settings" },
    close: { es: "Cerrar", en: "Close" },
    page: { es: "Tipo de página", en: "Page" },
    pages: {
      paper: { es: "Papel", en: "Paper" },
      sepia: { es: "Sepia", en: "Sepia" },
      light: { es: "Claro", en: "Light" },
      dark: { es: "Oscuro", en: "Dark" }
    },
    brightness: { es: "Brillo", en: "Brightness" },
    warmth: { es: "Luz calidad", en: "Light quality" },
    size: { es: "Tamaño de letra", en: "Type size" },
    font: { es: "Tipografía", en: "Typeface" },
    fonts: {
      default: { es: "Actual", en: "Current" },
      literata: { es: "Literata", en: "Literata" },
      source: { es: "Source Sans", en: "Source Sans" },
      fraunces: { es: "Fraunces", en: "Fraunces" }
    },
    reset: { es: "Restablecer", en: "Reset" }
  },
  hero: {
    greeting: { es: "Hola, soy Pablo", en: "Hi, I’m Pablo" },
    title: {
      es: "Construyo productos digitales donde la *arquitectura* y el *negocio* se encuentran.",
      en: "I build digital products where *architecture* and the *business* meet."
    },
    body: {
      es: "Ingeniero senior full-stack con foco en producto. Diseño y construyo interfaces, APIs e integraciones en TypeScript — y uso IA para iterar más rápido sin resignar calidad.",
      en: "Senior full-stack engineer with a product focus. I design and build interfaces, APIs and integrations in TypeScript — and use AI to iterate faster without trading off quality."
    },
    primary: { es: "Hablemos de tu producto", en: "Let’s talk about your product" },
    secondary: { es: "Ver trayectoria", en: "See experience" },
    downloadCv: { es: "Descargar CV", en: "Download CV" },
    scheduleMeet: { es: "Agendar Meet", en: "Book a call" },
    linkedin: "LinkedIn",
    stack: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "GraphQL", "AI-Augmented DX"],
    scroll: { es: "Scroll para explorar", en: "Scroll to explore" },
    layers: {
      es: ["Producto", "Experiencia", "APIs", "Arquitectura"],
      en: ["Product", "Experience", "APIs", "Architecture"]
    },
    chips: ["React", "Next.js", "NestJS", "GraphQL", "TypeScript", "MCP"]
  },
  stats: [
    {
      value: "6+",
      label: {
        es: "años en producción · fintech, consultoría y medios",
        en: "years in production · fintech, consulting, media"
      }
    },
    {
      value: "E2E",
      label: {
        es: "del discovery al deploy · UI, APIs e integraciones",
        en: "discovery to deploy · UI, APIs, integrations"
      }
    },
    {
      value: "AI-first",
      label: {
        es: "flujo de ingeniería aumentado con IA",
        en: "AI-augmented engineering workflow"
      }
    }
  ],
  impact: {
    eyebrow: { es: "Qué aporto", en: "What I bring" },
    title: {
      es: "Ingeniería senior que entiende el negocio y entrega software que *escala*.",
      en: "Senior engineering that understands the business and ships software that *scales*."
    },
    items: [
      {
        id: "product",
        title: { es: "Producto de punta a punta", en: "End-to-end product" },
        body: {
          es: "Full-stack TypeScript: interfaces en React y Next.js, APIs en Node.js y NestJS, contratos en GraphQL o REST. Una sola cabeza conectando UX, datos y reglas de negocio — menos handoffs, menos fricción.",
          en: "Full-stack TypeScript: React and Next.js interfaces, Node.js and NestJS APIs, GraphQL or REST contracts. One mind connecting UX, data and business rules — fewer handoffs, less friction."
        },
        tags: ["React", "Next.js", "Node.js", "NestJS", "GraphQL"]
      },
      {
        id: "architecture",
        title: { es: "Arquitectura que aguanta el crecimiento", en: "Architecture built to grow" },
        body: {
          es: "Módulos con límites claros, tipado end-to-end y contratos de API versionados. Integraciones con terceros que fallan de forma controlada. Decisiones documentadas para que el equipo pueda cambiar sin romper.",
          en: "Modules with clear boundaries, end-to-end typing and versioned API contracts. Third-party integrations that fail gracefully. Documented decisions so the team can change things without breaking them."
        },
        tags: ["API design", "Integrations", "Type safety", "ADRs"]
      },
      {
        id: "dx",
        title: { es: "Velocidad con IA, sin deuda", en: "AI speed, without the debt" },
        body: {
          es: "Agentes en el IDE, contexto del repo vía MCP y prompts como parte del flujo. Menos boilerplate, más tests y reviews más rápidos: el equipo itera más por sprint sin bajar la vara de calidad.",
          en: "IDE agents, repo context via MCP and prompts as part of the workflow. Less boilerplate, more tests and faster reviews: the team ships more per sprint without lowering the quality bar."
        },
        tags: ["Cursor", "Claude", "MCP", "Testing"]
      }
    ]
  },
  experience: {
    eyebrow: { es: "Trayectoria", en: "Experience" },
    title: {
      es: "Empresas y productos donde el delivery tuvo que funcionar de verdad.",
      en: "Companies and products where delivery had to actually work."
    },
    roles: [
      {
        company: "itti",
        period: { es: "Ago 2024 — Actualidad", en: "Aug 2024 — Present" },
        title: { es: "Sr Software Engineer", en: "Sr Software Engineer" },
        location: { es: "LATAM · remoto", en: "LATAM · remote" },
        summary: {
          es: "Compañía de tecnología con base en Paraguay: core financiero, digitalización y productos de software para empresas. Lidero decisiones de arquitectura y calidad de entrega en sistemas que más de un producto comparte.",
          en: "Paraguay-based technology company: financial core, digitalization and enterprise software products. I lead architecture and delivery quality on systems more than one product shares."
        },
        signal: {
          es: "Core financiero · credit scoring · multi-tenant",
          en: "Financial core · credit scoring · multi-tenant"
        },
        stack: ["TypeScript", "React", "Micro-frontends", "AI DX"],
        highlights: {
          es: [
            "Arquitectura del core financiero en producción: micro-frontends y la plataforma de credit scoring, con límites que aguantan más de un producto.",
            "Componentes compartidos multi-tenant para que varios equipos entreguen sobre el mismo sistema sin acoplar el release.",
            "Flujos de IA en el IDE — agentes, contexto del repo vía MCP y review asistido — que acortan exploración e implementación, con tests en el camino a producción."
          ],
          en: [
            "Production architecture for the financial core: micro-frontends and the credit-scoring platform, with boundaries that hold up across more than one product.",
            "Shared multi-tenant components so several teams ship on the same system without coupling releases.",
            "AI workflows in the IDE — agents, repo context via MCP and assisted review — that shorten exploration and implementation, with tests on the path to production."
          ]
        }
      },
      {
        company: "Acid Labs",
        period: { es: "Abr 2023 — Ago 2024", en: "Apr 2023 — Aug 2024" },
        title: { es: "Software Developer Engineer", en: "Software Developer Engineer" },
        location: { es: "Estados Unidos · remoto", en: "United States · remote" },
        summary: {
          es: "Consultora de software y AI que diseña y desarrolla productos para clientes en EE.UU. y LATAM. Pasé de frontend a ownership de punta a punta en arquitecturas de e-commerce.",
          en: "Software and AI consultancy that designs and builds products for U.S. and LATAM clients. I moved from frontend into end-to-end ownership on e-commerce architectures."
        },
        signal: {
          es: "E-commerce · clientes US/LATAM · integraciones E2E",
          en: "E-commerce · US/LATAM clients · E2E integrations"
        },
        stack: ["React", "Next.js", "NestJS", "GraphQL", "Module Federation"],
        highlights: {
          es: [
            "Arquitecturas de e-commerce para clientes internacionales: Module Federation en el frontend, NestJS y GraphQL en el contrato.",
            "Integraciones E2E con contratos tipados y caminos de fallo explícitos, para que un release no dependa del happy path.",
            "Delivery de la interfaz al API en equipos distribuidos, con dominio en logística comercial y reglas de negocio no triviales."
          ],
          en: [
            "E-commerce architectures for international clients: Module Federation on the frontend, NestJS and GraphQL on the contract.",
            "E2E integrations with typed contracts and explicit failure paths, so a release does not depend on the happy path.",
            "Delivery from interface to API on distributed teams, including commercial logistics and non-trivial business rules."
          ]
        }
      },
      {
        company: "Acid Labs",
        period: { es: "Dic 2021 — Abr 2023", en: "Dec 2021 — Apr 2023" },
        title: { es: "Frontend Developer", en: "Frontend Developer" },
        location: { es: "Estados Unidos · remoto", en: "United States · remote" },
        summary: {
          es: "Experiencias de producto para clientes internacionales, con React como núcleo y una vara alta de interfaz, performance y colaboración con diseño y backend.",
          en: "Product experiences for international clients, with React at the core and a high bar for interface, performance and collaboration with design and backend."
        },
        signal: {
          es: "UI de producto · clientes internacionales",
          en: "Product UI · international clients"
        },
        stack: ["React", "TypeScript", "Next.js"],
        highlights: {
          es: [
            "Interfaces de producto en React para equipos distribuidos y clientes internacionales, entregadas a producción.",
            "Diseño y requerimientos convertidos en UI mantenible, con performance y handoff directo con diseño y backend."
          ],
          en: [
            "React product interfaces for distributed teams and international clients, shipped to production.",
            "Design and requirements turned into maintainable UI, with performance and a direct handoff to design and backend."
          ]
        }
      },
      {
        company: "Contenidos-Digitales.com",
        period: { es: "Ene 2021 — Dic 2021", en: "Jan 2021 — Dec 2021" },
        title: { es: "Frontend Developer", en: "Frontend Developer" },
        location: { es: "Argentina", en: "Argentina" },
        summary: {
          es: "Desarrollo frontend para productos de contenidos digitales: interfaces, layouts y experiencia web orientada a publicación y consumo de contenido.",
          en: "Frontend development for digital-content products: interfaces, layout and web experience oriented to publishing and consumption."
        },
        signal: {
          es: "Contenidos digitales · mercado hispano",
          en: "Digital content · Spanish-speaking market"
        },
        stack: ["JavaScript", "HTML", "CSS"],
        highlights: {
          es: [
            "Construí y mantuve experiencias web para un producto de contenidos en el mercado hispano."
          ],
          en: [
            "Built and maintained web experiences for a digital-content product in the Spanish-speaking market."
          ]
        }
      },
      {
        company: "Applica Solutions",
        period: { es: "Ene 2020 — Ene 2021", en: "Jan 2020 — Jan 2021" },
        title: { es: "Frontend Developer", en: "Frontend Developer" },
        location: { es: "Argentina", en: "Argentina" },
        summary: {
          es: "Desarrollo frontend en una boutique de soluciones móviles y digitales. Base de mi carrera profesional en interfaces, JavaScript y entrega con equipos de producto.",
          en: "Frontend development at a mobile and digital solutions studio. The foundation of my professional path in interfaces, JavaScript and shipping with product teams."
        },
        signal: {
          es: "Interfaces · equipos de producto",
          en: "Interfaces · product teams"
        },
        stack: ["JavaScript", "UI"],
        highlights: {
          es: [
            "Aporté interfaces y lógica de presentación en productos digitales para clientes locales."
          ],
          en: [
            "Delivered interfaces and presentation logic for digital products with local clients."
          ]
        }
      },
      {
        company: "Alberione Ingeniería en Sistemas",
        period: { es: "2020", en: "2020" },
        title: { es: "Web Developer", en: "Web Developer" },
        location: { es: "Argentina", en: "Argentina" },
        summary: {
          es: "Desarrollo web en un entorno de ingeniería en sistemas: sitios y soluciones a medida, con foco en maquetado, JavaScript y necesidades reales de negocio.",
          en: "Web development in a systems-engineering environment: custom sites and solutions, focused on layout, JavaScript and real business needs."
        },
        signal: {
          es: "Primeras entregas web",
          en: "Early web deliveries"
        },
        stack: ["JavaScript", "HTML"],
        highlights: {
          es: ["Primeras entregas profesionales de software web para un estudio de ingeniería."],
          en: ["Early professional web deliveries for a systems-engineering firm."]
        }
      }
    ]
  },
  stack: {
    eyebrow: { es: "Cómo trabajo con IA", en: "How I work with AI" },
    title: {
      es: "La IA acelera. *El criterio* decide.",
      en: "AI accelerates. *Judgment* decides."
    },
    intro: {
      es: "La IA es parte de mi stack, no un truco. La integro en todo el ciclo — discovery, diseño, código, tests y release — como un equipo extra que explora, propone y verifica. Yo pongo el problema, la arquitectura y la vara de calidad. El resultado: ciclos de feedback más cortos y más iteraciones por sprint, sin deuda técnica escondida.",
      en: "AI is part of my stack, not a gimmick. I wire it into the whole cycle — discovery, design, code, tests and release — as an extra team that explores, proposes and verifies. I own the problem, the architecture and the quality bar. The result: shorter feedback loops and more iterations per sprint, without hidden tech debt."
    },
    aiLabel: { es: "IA", en: "AI" },
    youLabel: { es: "Criterio", en: "Judgment" },
    steps: [
      {
        id: "understand",
        title: { es: "Entender", en: "Understand" },
        body: {
          es: "Antes de escribir código entiendo el dominio y el sistema. Con IA mapeo repos, dependencias y flujos críticos en minutos, no en días.",
          en: "Before writing code I understand the domain and the system. With AI I map repos, dependencies and critical flows in minutes, not days."
        },
        ai: {
          es: "Mapea el repo, resume módulos y detecta riesgos",
          en: "Maps the repo, summarizes modules and flags risks"
        },
        you: {
          es: "Define qué problema de negocio vale la pena resolver",
          en: "Defines which business problem is worth solving"
        },
        command: "explain the checkout flow and where it can break",
        output: [
          "indexing repo · modules · dependencies",
          "checkout → payments → ledger",
          "risk: retries without idempotency key",
          "→ 3 hotspots worth reviewing first"
        ]
      },
      {
        id: "design",
        title: { es: "Diseñar", en: "Design" },
        body: {
          es: "Evalúo alternativas — REST o GraphQL, sincrónico o eventos — con trade-offs explícitos y decisiones documentadas, no con intuición.",
          en: "I weigh options — REST or GraphQL, sync or events — with explicit trade-offs and documented decisions, not gut feeling."
        },
        ai: {
          es: "Propone enfoques, esquemas y borradores de contratos",
          en: "Proposes approaches, schemas and contract drafts"
        },
        you: {
          es: "Elige según escala, equipo y costo de cambio",
          en: "Chooses based on scale, team and cost of change"
        },
        command: "compare REST vs GraphQL for the orders API",
        output: [
          "REST — simple caching, more round-trips",
          "GraphQL — typed schema, one query per view",
          "draft: type Order · mutation createOrder",
          "→ ADR-012 ready for review"
        ]
      },
      {
        id: "build",
        title: { es: "Construir", en: "Build" },
        body: {
          es: "Agentes en el IDE para scaffolding, migraciones y refactors. Mi tiempo va a la lógica de negocio y a los detalles que el usuario percibe.",
          en: "IDE agents handle scaffolding, migrations and refactors. My time goes to business logic and the details users actually notice."
        },
        ai: {
          es: "Genera módulos, tipos y código repetible",
          en: "Generates modules, types and repeatable code"
        },
        you: {
          es: "Escribe el núcleo y revisa cada diff",
          en: "Writes the core and reviews every diff"
        },
        command: "scaffold orders module, typed end-to-end",
        output: [
          "+ app/orders/page.tsx",
          "+ src/orders/orders.resolver.ts",
          "+ src/orders/orders.service.ts",
          "→ schema → resolver → UI · fully typed"
        ]
      },
      {
        id: "verify",
        title: { es: "Verificar", en: "Verify" },
        body: {
          es: "Tests unitarios y e2e, casos borde y code review asistido antes de producción. La velocidad no se paga después.",
          en: "Unit and e2e tests, edge cases and assisted code review before production. Speed shouldn’t be paid for later."
        },
        ai: {
          es: "Escribe tests, busca casos borde y revisa PRs",
          en: "Writes tests, hunts edge cases and reviews PRs"
        },
        you: {
          es: "Decide qué riesgo es aceptable y qué no se mergea",
          en: "Decides which risk is acceptable and what doesn’t merge"
        },
        command: "write tests for refunds incl. edge cases",
        output: [
          "✓ full refund",
          "✓ partial refund · currency rounding",
          "✓ duplicate webhook ignored",
          "→ all green · edge cases covered"
        ]
      },
      {
        id: "ship",
        title: { es: "Entregar", en: "Ship" },
        body: {
          es: "Releases chicos y frecuentes con CI/CD, changelog y documentación que el equipo puede mantener sin depender de mí.",
          en: "Small, frequent releases with CI/CD, changelogs and docs the team can maintain without depending on me."
        },
        ai: {
          es: "Redacta changelog, docs y notas de release",
          en: "Drafts changelog, docs and release notes"
        },
        you: {
          es: "Mide el impacto y decide la próxima iteración",
          en: "Measures impact and decides the next iteration"
        },
        command: "draft release notes for v2.4",
        output: [
          "feat: partial refunds",
          "fix: idempotent payment retries",
          "docs: orders API v1 updated",
          "→ deployed · monitoring on"
        ]
      }
    ],
    toolboxTitle: { es: "Toolbox", en: "Toolbox" },
    toolbox: [
      {
        title: { es: "IA & DX", en: "AI & DX" },
        note: {
          es: "Agentes en el IDE, contexto del repo y prompts versionados.",
          en: "IDE agents, repo context and versioned prompts."
        },
        items: ["Cursor", "Claude", "ChatGPT", "GitHub Copilot", "MCP"]
      },
      {
        title: { es: "Producto", en: "Product" },
        note: {
          es: "Full-stack TypeScript, de la interfaz a la API.",
          en: "Full-stack TypeScript, from interface to API."
        },
        items: ["React", "Next.js", "TypeScript", "Node.js", "NestJS"]
      },
      {
        title: { es: "Plataforma", en: "Platform" },
        note: {
          es: "Contratos claros e integraciones que no se rompen al crecer.",
          en: "Clear contracts and integrations that don’t break as you grow."
        },
        items: ["GraphQL", "REST APIs", "Webhooks", "3rd-party APIs"]
      },
      {
        title: { es: "Calidad", en: "Quality" },
        note: {
          es: "Lo que hace que la velocidad no se pague después.",
          en: "What keeps speed from being paid for later."
        },
        items: ["Unit & e2e testing", "Code review", "CI/CD"]
      }
    ]
  },
  blog: {
    site: { es: "Sitio", en: "Site" },
    reading: { es: "Lectura", en: "Reading" },
    postsLabel: { es: "Publicaciones", en: "Posts" },
    title: {
      es: "Blog",
      en: "Blog"
    },
    subtitle: {
      es: "El día a día es el único lugar donde una teoría dice la verdad.",
      en: "Everyday life is the only place where a theory tells the truth."
    },
    minRead: { es: "min de lectura", en: "min read" },
    back: { es: "Todos los posts", en: "All posts" },
    more: { es: "Más posts", en: "More posts" },
    readNext: { es: "Siguiente lectura", en: "Read next" },
    keepReading: { es: "Seguí leyendo", en: "Keep reading" },
    moreFrom: { es: "Más en el blog", en: "More on the blog" },
    continueReading: { es: "Continuar leyendo", en: "Continue reading" },
    relatedNotes: { es: "Notas de arquitectura", en: "Architecture notes" },
    viewAll: { es: "Ver todos los artículos", en: "View all articles" },
    readMoreEmpty: {
      es: "Hay más en el blog",
      en: "There’s more on the blog"
    },
    readMoreEmptyHint: {
      es: "Cuando publique el próximo post, aparecerá acá. Mientras tanto, explorá el índice.",
      en: "The next post will show up here. For now, browse the index."
    },
    empty: { es: "Pronto hay nuevos posts.", en: "New posts coming soon." },
    indexCount: { es: "publicaciones", en: "posts" },
    latest: { es: "Reciente", en: "Latest" },
    openPost: { es: "Leer artículo", en: "Read article" },
    teaser: {
      eyebrow: { es: "Blog", en: "Blog" },
      title: {
        es: "El día a día es el único lugar donde una teoría dice la verdad.",
        en: "Everyday life is the only place where a theory tells the truth."
      },
      body: {
        es: "Escribo desde la opinión y desde lo vivido. Quedate, y leé como quien tiene tiempo.",
        en: "I write from opinion and from lived experience. Stay, and read as someone with time."
      },
      all: { es: "Ver todos los artículos", en: "View all articles" },
      morePostsHint: {
        es: "Más notas en el índice.",
        en: "More notes in the index."
      },
      indexLink: { es: "Abrir el índice", en: "Open the index" }
    },
    cta: {
      site: { es: "Explorar el sitio", en: "Explore the site" },
      allPosts: { es: "Más posts", en: "More posts" }
    }
  },
  // docs: {
  //   index: { es: "Índice", en: "Index" },
  //   search: { es: "Buscar en las notas", en: "Search the notes" },
  //   tags: { es: "Temas", en: "Topics" },
  //   all: { es: "Todos", en: "All" },
  //   onThisPage: { es: "En esta nota", en: "On this note" },
  //   empty: { es: "Nada coincide con esa búsqueda.", en: "Nothing matches that search." },
  //   prev: { es: "Anterior", en: "Previous" },
  //   next: { es: "Siguiente", en: "Next" },
  //   kind: { es: "ADR", en: "ADR" },
  //   kicker: { es: "Notas de arquitectura", en: "Architecture notes" },
  //   header: {
  //     es: "Engineering Logs & ADRs — Decisiones de arquitectura y aprendizajes de proyectos reales.",
  //     en: "Engineering Logs & ADRs — Architecture decisions and lessons from real projects."
  //   },
  //   relatedBlog: { es: "En el blog", en: "On the blog" },
  //   emptyManual: {
  //     es: "Las notas todavía no tienen secciones.",
  //     en: "The notes have no sections yet."
  //   },
  //   teaser: {
  //     eyebrow: { es: "Notas de arquitectura", en: "Architecture notes" },
  //     title: {
  //       es: "Engineering Logs & ADRs — Decisiones de arquitectura y aprendizajes de proyectos reales.",
  //       en: "Engineering Logs & ADRs — Architecture decisions and lessons from real projects."
  //     },
  //     body: {
  //       es: "Cada nota está escrita como un ADR: contexto, decisión, trade-offs y resultado.",
  //       en: "Each note is written as an ADR: context, decision, trade-offs and outcome."
  //     },
  //     open: { es: "Leer las notas", en: "Read the notes" }
  //   }
  // },
  contact: {
    eyebrow: { es: "Siguiente paso", en: "Next step" },
    title: {
      es: "Si tu producto necesita un ingeniero que piense como partner, hablemos.",
      en: "If your product needs an engineer who thinks like a partner, let’s talk."
    },
    body: {
      es: "Disponible para proyectos, asesoría técnica y roles donde el impacto en producto importe tanto como el código. Respondo personalmente.",
      en: "Open to projects, technical advising and roles where product impact matters as much as the code. I reply personally."
    },
    cta: { es: "Escribime", en: "Email me" },
    linkedin: "LinkedIn",
    github: "GitHub",
    downloadCv: { es: "Descargar CV", en: "Download CV" },
    scheduleMeet: { es: "Agendar por Google Meet", en: "Book via Google Meet" }
  }
} as const;
