---
title: "Observabilidad, Métricas, Tracing y Logging Estructurado"
description: "Pilares de observabilidad, propagación de contexto W3C, estrategias de sampling en trazas distribuidas, control de cardinalidad en Prometheus y correlación JSON."
chapter: sistemas-distribuidos
order: 1
tags:
  - Observabilidad
  - OpenTelemetry
  - Prometheus
  - Sistemas Distribuidos
published: true
---

## Contexto

En un sistema distribuido no se depura con logs locales. La transacción cruza servicios y, sin contexto, la telemetría no se puede unir.

## Decisión

Estandarizar trazas, métricas y logs con OpenTelemetry, propagar `traceparent` (W3C), elegir sampling head o tail a conciencia, y controlar la cardinalidad.

## Trade-offs

El tail sampling ve el error completo y cuesta buffer. El head sampling es barato y puede perder justo el request que falló. Una cardinalidad alta vuelve inutilizable la serie temporal.

## Resultado

Una traza correlacionada de punta a punta, con un volumen de telemetría que el equipo puede pagar y leer en un incidente.

## Pilares de la observabilidad y propagación de contexto

En arquitecturas de sistemas distribuidos y microservicios, la observabilidad es la capacidad de inferir el estado interno de un sistema a partir de las salidas de telemetría que este emite. La base fundamental para lograr trazabilidad a través de múltiples fronteras de red consiste en desatar la telemetría de las instancias individuales mediante OpenTelemetry (OTel), estandarizando las APIs y los SDKs de recolección.

Para reconstruir la ruta execution path completa de una transacción cliente a través de múltiples servicios independientes, es imperativo implementar la propagación de contexto basada en el estándar *W3C Trace Context*. La cabecera HTTP `traceparent` transporta el identificador global de la traza y del tramo actual (*span*):

```text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Donde la estructura descompone la versión (`00`), el `trace_id` (128 bits), el `parent_id` o `span_id` (64 bits) y los `trace_flags` (`01` indicando que el tramo fue muestreado). En TypeScript/Node.js, la inyección y extracción de contexto se gestiona transparente mediante el SDK de OpenTelemetry en los clientes HTTP o capas de middleware:

```typescript
import { trace, context, propagation } from '@opentelemetry/api';

export function makeDistributedRequest(url: string, headers: Record<string, string>) {
  const activeContext = context.active();
  const carrier: Record<string, string> = { ...headers };

  // Inyecta el contexto de traza activo (W3C traceparent) en las cabeceras salientes
  propagation.inject(activeContext, carrier);

  return fetch(url, { headers: carrier });
}
```

## Estrategias de sampling en trazado distribuido

La captura, serialización y transmisión del 100% de las trazas de producción en sistemas de alto tráfico introduce una penalización inaceptable en recursos computacionales, red y almacenamiento. Para gestionar este volumen se aplican estrategias de muestreo (*sampling*).

### Head-Based Sampling
El muestreo en la fuente (*head-based*) toma la decisión de conservar o descartar una traza en el momento exacto en que nace el tramo raíz (*root span*), antes de procesar el resto de las llamadas secundarias:

* **Muestreo Probabilístico:** Selecciona un porcentaje fijo de peticiones (por ejemplo, 5%).
* **Ventajas:** Extremadamente bajo costo computacional y memoria en los servicios de aplicación.
* **Desventajas:** Puede descartar transacciones anómalas, excepciones raras o trazas de alta latencia si cayeron fuera del porcentaje seleccionado.

### Tail-Based Sampling
El muestreo al final del flujo (*tail-based*) delega la decisión de captura a un componente intermediario (OpenTelemetry Collector). El colector almacena temporalmente en memoria todos los tramos pertenecientes a una misma traza hasta que la transacción finaliza completamente:

```yaml
# Configuración de tail sampling en OpenTelemetry Collector
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 10000
    expected_new_traces_per_sec: 2000
    policies:
      - name: drop_errors_policy
        type: status_code
        status_code: { status_codes: [ ERROR ] }
      - name: latency_policy
        type: latency
        latency: { threshold_ms: 1000 }
      - name: probabilistic_policy
        type: probabilistic
        probabilistic: { sampling_percentage: 1.0 }
```

Esta estrategia garantiza conservar el 100% de las trazas que hayan resultado en errores (status HTTP 5xx o excepiones no capturadas) o que hayan superado un umbral crítico de latencia, descartando el tráfico exitoso rutinario.

## Gestión de cardinalidad en métricas de producción

Las métricas representan datos numéricos agregados en intervalos de tiempo regulares. El desafío fundamental en sistemas como Prometheus o métricas de OpenTelemetry radica en la prevención de la explosión de cardinalidad (*cardinality explosion*).

La cardinalidad de una métrica equivale al producto cartesiano del número de valores únicos contenidos en cada una de sus etiquetas o dimensiones (*labels*):

$$\text{Cardinalidad total} = \prod_{i=1}^{N} |\text{Valores Únicos de Label}_i|$$

Inyectar identificadores únicos de alta variación —como `user_id`, `email`, UUIDs o direcciones IP— dentro de las etiquetas de una métrica genera millones de series temporales independientes, saturando la memoria del motor de almacenamiento y provocando caídas de servicio en la infraestructura de monitoreo.

```promql
# Correcto: Etiqueta restringida a valores finitos (método HTTP y ruta parametrizada)
http_requests_total{method="POST", route="/api/v1/users/:id", status="200"} 1542

# Incorrecto: Explosión de cardinalidad por UUID dinámico en la etiqueta
http_requests_total{method="POST", route="/api/v1/users/a9f8b2c1-4e00-4b21", status="200"} 1
```

Las métricas deben utilizar únicamente identificadores de ruta parametrizados y enumeraciones cerradas. Los identificadores únicos de entidad deben ser derivados exclusivamente hacia las trazas y los logs estructurados.

## Logging estructurado y correlación de telemetría

El registro de eventos (*logging*) en entornos de producción exige abandonar el formato de texto plano sin estructura en favor de objetos JSON strictly serializados por línea (*JSON Lines*). Esto permite que procesadores de logs como Fluentbit, Logstash o Vector analicen e indexen los campos sin requerir expresiones regulares complejas.

Para lograr una correlación bidireccional perfecta entre trazas distribuidas y registros de aplicación, el logger debe inyectar automáticamente el `trace_id` y el `span_id` extraídos del contexto de ejecución activo en cada línea de log emitida:

```json
{
  "timestamp": "2026-11-09T22:04:00.125Z",
  "severity": "ERROR",
  "service": "payment-gateway",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "message": "Payment provider connection timeout",
  "context": {
    "provider": "stripe",
    "retry_attempt": 3
  }
}
```

Al consultar un error en el sistema de monitoreo de logs, la presencia de la clave `trace_id` permite saltar directamente con un clic a la visualización de la traza distribuida completa en herramientas como Grafana Tempo, Jaeger o Datadog, reduciendo drásticamente el tiempo medio de resolución (*MTTR*).