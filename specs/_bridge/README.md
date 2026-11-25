# specs/_bridge/ — Puente SDD + confianza (Tan)

Copia versionable de la constitución global (`~/.ai-bridge/constitution/`).

| Archivo | Pilar |
|---------|--------|
| `VERIFICATION.md` | Evidencia; humano no es test suite |
| `ORCHESTRATION.md` | SDD liviano, ACTIVE, rungs |
| `FEEDBACK-LOOP.md` | **Feedback loop** — compounding tras correcciones |
| `EVALS.md` | **Agent evals** — probar reglas/skills |
| `GUARDRAILS.md` | **Guardrails** — pirámide lint/CI > prose |
| `evals/` | Rúbricas y resultados de eval |

Actualizar desde global (sin pisar evals locales):

```bash
cp ~/.ai-bridge/constitution/VERIFICATION.md specs/_bridge/
# repetir para ORCHESTRATION, FEEDBACK-LOOP, EVALS, GUARDRAILS si querés refrescar
```

Al editar cualquier `*_bridge/*.md` que guíe agentes: correr eval mínimo (`EVALS.md`).