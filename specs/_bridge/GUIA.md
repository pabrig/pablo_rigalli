# Guía del Puente SDD + Verificación (ai-bridge)

Documento único para **instalar**, **usar** y **mantener** el puente en cualquier proyecto.  
No depende de un stack, negocio ni cantidad de agentes (pensado para 1–2 agentes, no para “50 bots”).

---

## 1. Qué es esto en una frase

Un **sistema ligero** que combina:

- **SDD (Spec-Driven Development):** qué hacer vive en `specs/`, no solo en el chat.
- **Verificación (Lauren Tan):** el agente **demuestra** que funcionó; vos no sos el test suite.
- **Tres pilares de confianza:** feedback loop, evals de reglas, guardrails mecánicos.

Todo vive en tu máquina en `~/.ai-bridge` y se **conecta** a cada repo con un comando.

---

## 2. Mapa mental (dibujo simple)

```text
                    TÚ
                     │
         ┌───────────┴───────────┐
         │  Objetivo + gates      │
         │  (prod, datos, $$)     │
         └───────────┬───────────┘
                     ▼
         ┌───────────────────────┐
         │  specs/ACTIVE          │  ← qué feature sigue
         │  spec / plan / tasks   │  ← intención + cómo probar
         └───────────┬───────────┘
                     ▼
         ┌───────────────────────┐
         │  Agente (Cursor, etc.) │
         │  implementa + EVIDENCIA │
         └───────────┬───────────┘
                     ▼
    ┌────────────────┼────────────────┐
    ▼                ▼                ▼
 Verificación    Feedback         Guardrails
 (comandos V*)   (mejorar reglas)  (lint/CI)
                     │
                     ▼
              Evals (si cambió
              reglas del puente)
```

---

## 3. Dónde está cada cosa

### En tu usuario (global, una sola fuente)

| Ruta | Qué es |
|------|--------|
| `~/.ai-bridge/GUIA.md` | Esta guía |
| `~/.ai-bridge/bin/sdd-init` | Instala el puente en un repo |
| `~/.ai-bridge/constitution/` | Reglas maestras (AGENTS, VERIFICATION, …) |
| `~/.ai-bridge/cursor-rules/sdd-bridge.mdc` | Regla Cursor que siempre aplica |
| `~/.ai-bridge/templates/` | Plantillas de feature, eval, PR |
| `~/AGENTS.md` | Symlink → `constitution/AGENTS.md` |
| `~/.cursor/rules/sdd-bridge.mdc` | Symlink → regla global (en muchos setups) |

### En cada repo (después de `sdd-init`)

| Ruta | Qué es | ¿Git? |
|------|--------|-------|
| `AGENTS.md` | Symlink a constitución global | No (excluido en `info/exclude`) |
| `.cursor/rules/sdd-bridge.mdc` | Symlink | No |
| `specs/_bridge/*.md` | Copia de contratos (pilares Tan) | **Sí, recomendado** |
| `specs/_bridge/evals/` | Resultados de evals | **Sí** |
| `specs/<feature>/` | spec, plan, tasks, session | **Sí** |
| `specs/ACTIVE` | Nombre de la feature en curso | **Sí** |
| `.github/PULL_REQUEST_TEMPLATE.md` | Formulario de prueba en PR | **Sí** |

**Idea clave:** lo global se actualiza en un solo lugar; lo del repo (`specs/`) es la **memoria del proyecto** que puede ir en git.

---

## 4. Instalación (primer uso en un repo)

```bash
cd /ruta/a/tu/proyecto
~/.ai-bridge/bin/sdd-init
```

Eso crea symlinks, `specs/_bridge/`, carpeta `evals/` y la plantilla de PR si no existen.

**Arrancar una feature nueva:**

```bash
~/.ai-bridge/bin/sdd-init nombre-feature
```

Crea `specs/nombre-feature/{spec,plan,tasks,session}.md` y escribe `specs/ACTIVE`.

---

## 5. Niveles: ¿cuándo hace falta `specs/`?

| Nivel | Cuándo | Qué hacer |
|-------|--------|-----------|
| **L0** | Typo, fix &lt; 30 min, exploración | Decir en el chat: *“L0”*. Igual conviene correr un comando obvio si existe. |
| **L1** | Un PR acotado | `sdd-init feature` + spec corto + contrato de verificación en plan |
| **L2** | Varios días / varias sesiones | L1 + `decisions.md` + retrospectiva en tasks |

Si hay `specs/` con trabajo activo, el agente debe seguir **L1+** (no inventar requisitos).

---

## 6. Los archivos de una feature (en orden de lectura)

1. **`spec.md`** — Qué y por qué. Criterios **C1, C2…** con “cómo se prueba”.
2. **`plan.md`** — Cómo implementar + **contrato de verificación (V1, V2…)** + tabla **guardrails G*** del repo.
3. **`tasks.md`** — Pasos en orden; cada uno con bloque **Evidencia** al cerrar.
4. **`session.md`** — Notas de continuidad entre chats (opcional pero útil).

**Regla:** el agente no marca `[x]` ni dice “listo” sin **ejecutar** los comandos V* y anotar salida.

---

## 7. Los tres pilares (Tan) — versión simple

### A) Feedback loop

**Qué:** cada corrección mejora el sistema, no solo el código del momento.

**Cuándo actuar:**

- El humano corrige al agente → escribir un **principio** (sin anécdota del día) en `decisions.md` o subir a lint/CI.
- Mismo error dos veces → **guardrail mecánico**, no más texto en AGENTS.md.
- Cierre L2 → tarea de retrospectiva en `tasks.md`.

**Doc:** `specs/_bridge/FEEDBACK-LOOP.md`

### B) Agent evals

**Qué:** las reglas que guían al agente también se **prueban** (como unit tests de comportamiento).

**Cuándo:**

- Editaste `specs/_bridge/*` o `.cursor/rules` del proyecto.
- Creaste o cambiaste un skill que define cómo trabaja el agente.

**Cómo (mínimo):**

```bash
cp ~/.ai-bridge/templates/eval-rubric.template.md \
   specs/_bridge/evals/mi-regla-$(date +%Y%m%d).md
```

Prompt **realista** (sin palabras “eval/benchmark”), corrida, notas en la rúbrica.

**Doc:** `specs/_bridge/EVALS.md`

### C) Guardrails

**Qué:** prioridad **lint / tests / CI / tipos** por encima de instrucciones en markdown.

**Pirámide (de fuerte a débil):**

1. Arquitectura y tipos  
2. Lint  
3. Tests y CI  
4. Contrato V* en plan  
5. SDD (spec/tasks)  
6. Prose (AGENTS, skills)

**En cada feature:** completar la tabla **Guardrails del repositorio** en `plan.md`.

**Doc:** `specs/_bridge/GUARDRAILS.md`

---

## 8. Flujo de una sesión (paso a paso)

1. Abrís el repo en Cursor.
2. Leés `specs/ACTIVE` → entrás a esa carpeta.
3. Revisás `spec.md` + `plan.md` (comandos V* y gates humanos).
4. Abrís `tasks.md` y pedís al agente la **siguiente tarea abierta**.
5. El agente implementa, **corre V***, pega evidencia, marca `[x]`.
6. Al cerrar sesión: actualizás `session.md` (bloqueo, próximo paso).

---

## 9. Prompts listos para copiar

### Empezar feature (L1/L2)

```text
Nivel L1. Lee specs/ACTIVE, spec.md, plan.md y tasks.md.
Ejecutá la primera tarea abierta en orden.
Rung: Draft. No marques [x] sin evidencia (comando + resultado + criterio C#).
Respeta specs/_bridge/VERIFICATION.md y GUARDRAILS.md.
```

### Fix rápido (L0)

```text
L0 — sin specs. Solo este cambio: [descripción].
Si hay test/lint del repo, ejecutalo y mostrá salida.
```

### Después de corregir al agente

```text
Aplicá FEEDBACK-LOOP: escribí el principio general en decisions.md y proponé
si va a lint/CI (guardrail) o solo spec/plan.
```

### Tras editar reglas del puente

```text
Corré un eval mínimo según specs/_bridge/EVALS.md y guardá la rúbrica en specs/_bridge/evals/.
```

---

## 10. Pull requests

Si `sdd-init` creó `.github/PULL_REQUEST_TEMPLATE.md`, completalo en cada PR: comandos corridos, criterios C*, repro de bugs.

El merge ideal: **CI verde + evidencia en PR**, no solo “revisá el diff”.

---

## 11. Actualizar el puente global en un repo viejo

Solo copia los archivos que **no** tengas o quieras refrescar (no pisa `evals/`):

```bash
cd /tu/proyecto
for f in VERIFICATION ORCHESTRATION FEEDBACK-LOOP EVALS GUARDRAILS; do
  cp ~/.ai-bridge/constitution/$f.md specs/_bridge/
done
cp ~/.ai-bridge/constitution/BRIDGE-README.md specs/_bridge/README.md
```

La constitución en `AGENTS.md` (symlink) y `sdd-bridge.mdc` se actualizan solos al editar `~/.ai-bridge`.

---

## 12. MCP (opcional)

`sdd-init` puede enlazar `~/.ai-bridge/mcp/mcp.json` a `.cursor/mcp.json` del repo.  
Uso sugerido:

- **Memory** — 2–3 hechos por feature al cerrar sesión.
- **GitHub** — issues/PRs vs criterios del spec.
- **Sequential thinking** — partir `tasks.md` en L2.

No son obligatorios para que el puente funcione.

---

## 13. Preguntas frecuentes

**¿Por qué `AGENTS.md` no aparece en git?**  
Es symlink global; `sdd-init` lo excluye para no ensuciar repos ajenos. Lo que **sí** versionás es `specs/`.

**¿Puedo usar Orca u otra herramienta?**  
Sí. El puente es agnóstico: workers externos deben leer el mismo `specs/<feature>/` y dejar evidencia igual.

**¿Cuántos agentes necesito?**  
Con 1 agente basta. L2 grande: opcional 1 verificador (otro chat/subagente) que ejecute V* sin haber escrito el código.

**El agente dice “listo” sin correr tests**  
La regla `sdd-bridge` lo prohíbe; reenviá `VERIFICATION.md` y pedí evidencia antes de `[x]`.

**¿Dónde está el detalle técnico completo?**  
`specs/_bridge/*.md` en el repo o `~/.ai-bridge/constitution/` en tu usuario.

---

## 14. Cheatsheet (una pantalla)

| Quiero… | Acción |
|---------|--------|
| Conectar repo | `~/.ai-bridge/bin/sdd-init` |
| Nueva feature | `~/.ai-bridge/bin/sdd-init mi-feature` |
| Saber qué sigue | `cat specs/ACTIVE` |
| Probar que una regla sirve | eval en `specs/_bridge/evals/` |
| Evitar repetir errores | lint/CI (`GUARDRAILS.md`) |
| Continuar otro día | `session.md` + `tasks.md` |
| Fix chico sin papeles | decir **L0** en el prompt |

---

## 15. Referencia de archivos del puente

| Archivo | Para qué |
|---------|----------|
| `AGENTS.md` | Constitución corta + tabla de pilares |
| `ORCHESTRATION.md` | Niveles L0–L2, ACTIVE, roles, flujo |
| `VERIFICATION.md` | Contrato V*, evidencia, rungs, checklist |
| `FEEDBACK-LOOP.md` | Correcciones → mejora compuesta |
| `EVALS.md` | Cómo evaluar reglas/skills |
| `GUARDRAILS.md` | Pirámide lint > prose, stop-the-line |

---

*Versión del puente: archivos en `~/.ai-bridge`. Mantené esta guía junto a ellos; si cambiás la constitución, actualizá la sección 11 para el equipo.*