# GUARDRAILS.md — Barreras ejecutables (agnóstico)

**Usar cuando:** decidir dónde poner una corrección o diseñar cierre de feature.

Tan: *confianza sube de abajo hacia arriba — arquitectura y checks ejecutables primero; prose al final.*

---

## Pirámide (de más fuerte a más débil)

| Nivel | Qué es | Ejemplos agnósticos |
|-------|--------|---------------------|
| **1. Arquitectura / tipos** | Límites que el compilador o estructura imponen | Módulos, capas, tipos que excluyen estados inválidos |
| **2. Lint / análisis estático** | Reglas automáticas en CI o pre-commit | ESLint, ruff, clippy, custom rules |
| **3. Tests / CI** | Comportamiento esperado con exit ≠ 0 si falla | Unit, integration, contract tests |
| **4. Contrato de verificación** | Comandos en `plan.md` que el agente ejecuta | `VERIFICATION.md` |
| **5. Proceso SDD** | `spec.md`, gates, evidencia en `tasks.md` | No inventar requisitos |
| **6. Prose** | `AGENTS.md`, reglas Cursor, skills | Juicio que no cabe en 1–4 |

**Regla:** cada corrección repetida **sube** en la pirámide hasta encontrar mecanismo. No añadir nivel 6 si cabe en 1–3.

---

## Inventario en `plan.md` (obligatorio L1+)

En cada feature, sección **Guardrails del repositorio** (ver plantilla en `plan.template.md`):

| ID | Mecanismo | Comando / dónde | Qué impide |
|----|-----------|-----------------|------------|
| G1 | … | `npm run lint` | … |

Si el repo no tiene CI aún, documentar **vacío + deuda** y al menos contrato V* manual.

---

## Paradas obligatorias (stop the line)

El agente **no** continúa ni mergea sin humano cuando:

- Migración / borrado destructivo
- Producción / deploy
- Secretos, auth, pagos, PII
- Producto no especificado en `spec.md`
- Comando del contrato **en rojo**
- **Dos intentos** con el mismo enfoque fallidos (`FEEDBACK-LOOP.md`)

---

## De comentario de review a guardrail

Si el mismo comentario en PR aparece **dos veces** en el proyecto:

1. Abrir issue o línea en `decisions.md`.
2. Implementar **nivel 1–3** de la pirámide.
3. Referenciar en `plan.md` G* de la feature que lo tocó.

---

## PR como formulario de prueba

Usar `.github/PULL_REQUEST_TEMPLATE.md` (plantilla en `~/.ai-bridge/templates/`).

El merge gate preferido: **CI verde + evidencia en PR**, no “confiá en mi resumen”.

---

## Autonomía vs blast radius

| Entorno | Rung máximo razonable sin eval/guardrails extra |
|---------|-----------------------------------------------|
| Sandbox / feature flag / throwaway | Autopilot |
| Lib/producto compartido | Draft |
| Prod / datos reales | Investigate o Draft + humano |

Subir rung documentado en `spec.md` solo con contrato verde y eval de gobernanza al día si hubo cambios en `_bridge`.