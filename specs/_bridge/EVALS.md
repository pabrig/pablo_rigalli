# EVALS.md — Evaluaciones de reglas y skills (escala pequeña)

**Usar cuando:** modificás texto que guía agentes (`specs/_bridge/*`, `.cursor/rules`, skills del repo).

Tan: *evals = unit tests del comportamiento del agente bajo una regla*, no solo tests de código.

No hace falta 50 candidatos. Basta **1 escenario + rúbrica + juicio por artefactos**.

---

## ¿Qué evaluar?

| Artefacto | Obligatorio re-eval |
|-----------|---------------------|
| `specs/_bridge/*.md` | Sí, si cambió comportamiento esperado |
| `.cursor/rules/*.mdc` nuevas o editadas | Sí |
| Skill del proyecto (`.cursor/skills`, etc.) | Sí |
| `spec.md` / `plan.md` de una feature | No (salvo que cambies contrato; re-ejecutar V* basta) |
| Código de producto | Tests del repo, no este eval |

---

## Eval mínimo (7 pasos, versión liviana)

1. **Rúbrica** — copiar `templates/eval-rubric.template.md` → `specs/_bridge/evals/<nombre>-YYYYMMDD.md`.
2. **3–6 criterios** observables (¿leyó spec? ¿ejecutó comandos? ¿puso evidencia? ¿evitó scope creep?).
3. **Prompt orgánico** — tarea realista; **no** usar palabras `eval`, `benchmark`, `candidate`, `juez`.
4. **Una corrida** en chat/worktree limpio (o subagente con brief autocontenido).
5. **Juicio por artefactos** — transcript, `tasks.md`, salida de comandos; **no** confiar en “seguí la regla X”.
6. **Segundo par de ojos (opcional recomendado)** — otro modelo o humano revisa rúbrica vs evidencia.
7. **Registrar** resultado en la misma carpeta `evals/` y en `session.md` si falla.

### Ceguera (anti observer effect)

- Carpeta de trabajo con nombre normal del proyecto, no `eval-run-001`.
- No decir al agente que es una prueba; el prompt debe parecer trabajo ordinario.
- Si el agente debe saber que audita, usar rol **Verificador** (`ORCHESTRATION.md`), no “eval”.

---

## Hill-climb (opcional)

Si la rúbrica puntúa 1–5 por criterio:

- **&lt; 4 en cualquier ítem crítico** → ajustar regla (principio, no parche) y re-correr.
- **5 en todos** → marcar eval como `passed` en el archivo; confiar hasta el próximo cambio del artefacto.

En escala chica, un solo ciclo suele bastar.

---

## Plantilla y archivo de evaluación

- Plantilla: `~/.ai-bridge/templates/eval-rubric.template.md`
- En repo: `specs/_bridge/evals/<artefacto>-<fecha>.md`

`sdd-init` crea `specs/_bridge/evals/` vacío (con `.gitkeep`).

---

## Relación con feedback y guardrails

```text
Feedback loop detecta fallo → cambia regla/skill
       ↓
EVALS (¿la regla produce el comportamiento?)
       ↓
Si OK y fallo era repetible en código → GUARDRAILS (lint/CI)
```

Sin eval, las reglas del puente son **prose sin tests**.