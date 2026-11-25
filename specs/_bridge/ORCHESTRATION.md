# ORCHESTRATION.md — Orquestación liviana (escala pequeña)

**Usar cuando:** decidir si hace falta `specs/`, cómo continuar entre sesiones, o cuándo paralelizar.

Agnóstico a stack, negocio y herramienta (Cursor, Orca, otro). No asume decenas de agentes ni múltiples worktrees.

---

## Dos reglas que unen SDD y verificación

1. **SDD:** intención y alcance viven en `specs/<feature>/` — no en el chat efímero.
2. **Verificación:** terminar = demostrar con evidencia (`VERIFICATION.md`) — no “confío en el diff”.

**Pilares Tan en `specs/_bridge/`:** `FEEDBACK-LOOP.md`, `EVALS.md`, `GUARDRAILS.md` — ciclo cerrado tras correcciones y reglas.

---

## Niveles SDD (elegir antes de codear)

| Nivel | Cuándo | Artefactos |
|-------|--------|------------|
| **L0** | Fix &lt; ~30 min, typo, pregunta exploratoria | Ninguno obligatorio; igual aplicar evidencia mínima si hay comando obvio |
| **L1** | Cambio acotado, un PR | `specs/<feature>/spec.md` corto + `tasks.md` + contrato breve en `plan.md` |
| **L2** | Feature multi-sesión | `spec.md` + `plan.md` + `tasks.md` + opcional `decisions.md` |

Si existe `specs/` con feature activa, **L1+ es obligatorio** salvo que el usuario diga L0 explícito.

---

## Feature activa y continuidad

- Archivo **`specs/ACTIVE`**: una línea = nombre de carpeta bajo `specs/` (ej. `mi-feature`).
- Al iniciar sesión en un repo con `specs/`, leer `ACTIVE` y abrir esa carpeta primero.
- Al crear feature con `sdd-init <nombre>`, actualizar `ACTIVE`.
- **`tasks.md`** es la cola de verdad: `[x]` solo con evidencia (`VERIFICATION.md`).
- Opcional: `session.md` en la feature (último comando fallido, bloqueo, siguiente tarea).

---

## Roles (escala pequeña: 1 humano, 1–2 agentes)

No hace falta chief-of-staff ni 50 bots.

| Rol | Quién | Hace |
|-----|-------|------|
| **Definición** | Humano ± agente de diseño | Escribe/ajusta `spec`, `plan`, contrato de verificación |
| **Ejecución** | Agente en el repo | Implementa `tasks.md` en orden, corre verificación, registra evidencia |
| **Verificador** | Mismo u otro agente / subagente | Ejecuta contrato **sin** ser el autor del cambio cuando el cambio es grande |
| **Coordinador** | Solo L2 o varios hilos | Un chat que **no codea**: estado, siguiente tarea, resumen de evidencia |

**Paralelismo:** como máximo **1 worker de ejecución + 1 verificador** (p. ej. subagente). Más paralelismo solo si cada unidad tiene kickoff + evidencia independiente.

Antes de “crear otro agente”: ¿basta un skill, regla de proyecto o tarea nueva en `tasks.md`?

---

## Flujo por sesión

```text
Leer specs/ACTIVE → spec.md → plan.md (contrato) → tasks.md
→ por cada tarea: implementar → ejecutar verificación → evidencia → [x]
→ ambigüedad en spec → parar y actualizar spec.md
→ fin de sesión: dejar tasks.md + session.md coherentes
```

---

## Fases opcionales (cualquier herramienta)

| Fase | Entrada | Salida |
|------|---------|--------|
| Definición | Idea / issue | `spec.md` Approved, criterios verificables |
| Plan | spec | `plan.md` con contrato de verificación |
| Ejecución | tasks | Código + evidencia |
| Cierre | spec criterios | Todos `[x]` + comandos verdes |

Definición puede hacerse fuera de Cursor; ejecución lee solo los archivos en `specs/`.

---

## Puertas humanas (siempre)

- Migraciones / datos destructivos
- Producción / despliegue
- Auth, pagos, PII, secretos
- Decisión de producto no escrita en `spec.md`
- Dos intentos fallidos con el **mismo** enfoque → reportar y replantear (no bucle)

---

## MCP sugeridos (opcionales)

- **Memory:** `Feature:<nombre>`, decisiones — al cerrar sesión, 1–3 hechos, no dumps del chat.
- **GitHub:** issues/PRs alineados a criterios de `spec.md`.
- **Sequential thinking:** descomponer `tasks.md` en L2.