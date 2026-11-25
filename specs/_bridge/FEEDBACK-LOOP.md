# FEEDBACK-LOOP.md — Ciclo de mejora (agnóstico)

**Usar cuando:** el humano corrige al agente, un patrón falla dos veces, o cerrás una feature L2.

Tan/PStack: *observar fallo → activo durable (skill/regla) → verificar → eval → confianza → guardrail → repetir*.

Este archivo cubre el loop de **gobernanza** (cómo trabajan los agentes), además del loop de **entrega** en `VERIFICATION.md`.

---

## Loop de entrega (por tarea)

Ya cubierto por SDD + verificación:

```text
spec/plan → implementar → ejecutar contrato V* → evidencia → [x] en tasks.md
```

---

## Loop de gobernanza (compounding)

```text
Fallo observado
  → Principio general (no historia del día)
  → ¿Dónde vive? (ver pirámide en GUARDRAILS.md)
  → Verificación / contrato actualizado si aplica
  → Eval si cambiaste regla/skill del puente (EVALS.md)
  → Subir rung de autonomía solo si evidencia + eval OK
```

### Gatillos obligatorios

| Evento | Acción mínima |
|--------|----------------|
| Humano corrige al agente en chat | Registrar en `decisions.md` o `session.md`: **principio** + acción (lint, regla, spec, skill) |
| Mismo error **2 veces** | Dejar de añadir prose: **guardrail mecánico** (test/lint/CI) o tarea explícita en `plan.md` |
| Cierre feature **L2** | Tarea retrospectiva en `tasks.md` (ver plantilla): encode repeticiones |
| Cambio en `specs/_bridge/*` o regla `.cursor/rules` del proyecto | Correr eval mínimo (`EVALS.md`) antes de confiar en el cambio |

---

## Orden: mano → activo → automatizar

No automatizar (routine, autopilot, CI que merge solo) hasta:

1. El trabajo se hizo **a mano o supervisado** al menos una vez y sabés qué es “bien”.
2. El agente tiene **comandos/señales** del `plan.md` (contrato de verificación).
3. Cada etapa puede **parar** sin merge ciego (gates en `GUARDRAILS.md`).
4. Si tocaste gobernanza: **eval** registrado o “N/A — solo typo” en `session.md`.

---

## Corrección humana (protocolo)

Cuando corrijas al agente:

1. **No** arreglar solo en silencio: pedir que escriba el **principio** (sin fecha ni anécdota).
2. Destino (elige uno, de más fuerte a más débil):
   - Test / lint / CI del repo
   - `spec.md` / `plan.md` (contrato o criterio)
   - `.cursor/rules/` del proyecto
   - Skill local (ruta que defina el proyecto)
   - `specs/_bridge/` o `decisions.md`
3. Si el cambio fue en regla/skill compartida → **eval** (`templates/eval-rubric.template.md`).

---

## Retrospectiva mínima (cierre L2)

En `tasks.md`, fase final:

- ¿Qué comentario o corrección se repitió? → ¿Quedó en guardrail mecánico?
- ¿El contrato de verificación faltaba algo? → actualizar `plan.md`
- ¿Alguna regla nueva sobrevive el test “¿lo entendería alguien que no estuvo en el chat?”

---

## Anti-patrones

| Evitar | Hacer en su lugar |
|--------|-------------------|
| Parche en chat sin registrar | `decisions.md` + encode |
| Regla con nombres de archivos del martes | Principio general |
| Subir a Autopilot sin contrato verde previo | Rung Draft hasta evidencia estable |
| Más líneas en `AGENTS.md` por defecto | Lint / CI primero (`GUARDRAILS.md`) |