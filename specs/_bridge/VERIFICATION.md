# VERIFICATION.md — Contrato de verificación (agnóstico)

**Usar cuando:** un agente va a marcar trabajo como hecho, abrir PR, o cerrar una tarea en `tasks.md`.

El humano **no** es el test suite. Si no hay señal verificable de éxito o fallo, la tarea **no está terminada**.

---

## ¿Es verificable este trabajo?

Antes de delegar o ejecutar, responder:

> ¿Existe al menos un **comando o procedimiento repetible** cuyo resultado (exit code, salida, artefacto) prueba éxito o fallo **sin interpretación subjetiva**?

| Si… | Entonces… |
|-----|-----------|
| Solo hay “probalo vos” | Inventar o documentar verificación en `plan.md` **antes** de codear |
| Hay tests/CI en el repo | Nombrarlos en `plan.md` y **ejecutarlos** antes de cerrar |
| Es UI / producto | Definir evidencia mínima (screenshot, grabación, o checklist manual **ejecutado por el agente**) |
| Es investigación | Rung **Investigate**: informe con reproducción; **sin PR** hasta contrato claro |

---

## Contrato en `plan.md` (obligatorio en L1+)

Sección **Contrato de verificación** con:

1. **Comandos** — uno por fila: comando exacto + éxito esperado (exit 0, substring en stdout, etc.).
2. **Evidencia por criterio** — enlace tabla `spec.md` → tipo de prueba.
3. **Reproducir antes de arreglar** — para bugs: pasos + estado observado **antes** del fix.
4. **Human gates** — migraciones, prod, secretos, pagos, permisos: siempre requieren humano (no negociable).

Sin contrato en `plan.md`, el agente **no** marca tareas `[x]` ni afirma “listo”.

---

## Paquete de prueba (por tarea o PR)

Al cerrar una tarea, el agente deja constancia **en el chat o en `tasks.md`** bajo la tarea:

```text
Evidencia:
- Comando: <comando>
- Resultado: <salida relevante o "exit 0">
- Criterios spec: #n, #m
```

Tipos de evidencia (elegir los que apliquen al stack, sin asumir stack):

| Tipo de cambio | Evidencia mínima |
|----------------|------------------|
| Lógica / API | Tests + comando de verificación del repo |
| Bug | Repro antes + misma secuencia en verde después |
| UI | Captura o descripción de flujo recorrido por el agente |
| Refactor | Misma batería que antes del cambio (comportamiento invariante) |
| Docs / specs | Diff acotado + enlace a criterios actualizados |

Un cambio sin evidencia registrada = **borrador**, aunque el código compile.

---

## Escalera de autonomía (nombrar en `spec.md` o en el prompt)

| Rung | El agente puede… | El humano… |
|------|------------------|------------|
| **Investigate** | Leer, diagnosticar, reproducir | Aprueba siguiente fase |
| **Draft** | Implementar y dejar evidencia | Revisa antes de merge/deploy |
| **Autopilot** | Implementar + ejecutar contrato de verificación | Solo excepciones y gates |
| **Full autopilot** | Planear + implementar + verificar | Solo descartables / sandbox |

Subir un rung solo si el contrato de verificación estuvo verde en la feature anterior comparable.

---

## Codificar lecciones (principio, no incidente)

Cuando una corrección se repite:

1. Preferir **lint, tipo, test, o cheque en CI** antes que otra línea en `AGENTS.md` (`GUARDRAILS.md`).
2. Si va a prose: regla **general** — sin fechas, archivos ni nombres del incidente.
3. Actualizar `spec.md` / `plan.md` si el contrato de verificación estaba incompleto.
4. Registrar el ciclo en `FEEDBACK-LOOP.md`; si cambió gobernanza, **eval** en `EVALS.md`.

---

## Checklist rápido (agente)

- [ ] Leí `spec.md`, `plan.md`, contrato de verificación
- [ ] Reproduje el problema (si es bug)
- [ ] Ejecuté los comandos del contrato (no solo los mencioné)
- [ ] Adjunté evidencia al cerrar cada tarea
- [ ] Pedí humano en gates sensibles