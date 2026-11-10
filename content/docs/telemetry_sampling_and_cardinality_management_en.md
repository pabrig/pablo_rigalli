---
title: "Observability, Metrics, Tracing and Structured Logging"
description: "Observability pillars, W3C context propagation, sampling strategies in distributed traces, Prometheus cardinality control, and JSON log correlation."
chapter: sistemas-distribuidos
order: 1
tags:
  - Observabilidad
  - OpenTelemetry
  - Prometheus
  - Sistemas Distribuidos
published: true
---

## Pilares de la observabilidad y propagación de contexto

In distributed systems and microservices architectures, observability is the capability to infer the internal state of a system from the telemetry outputs it produces. The foundational base for achieving traceability across multiple network boundaries relies on uncoupling telemetry from individual instances using OpenTelemetry (OTel), standardizing telemetry APIs and collection SDKs.

To reconstruct the complete execution path of a client request across multiple independent services, it is imperative to implement context propagation based on the *W3C Trace Context* standard. The HTTP `traceparent` header transports the global trace identifier and the current span identifier:

```text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Where the structure breaks down into version (`00`), `trace_id` (128-bit), `parent_id` or `span_id` (64-bit), and `trace_flags` (`01` indicating that the span was sampled). In TypeScript/Node.js, context injection and extraction are managed transparently via the OpenTelemetry SDK within HTTP clients or middleware layers:

```typescript
import { trace, context, propagation } from '@opentelemetry/api';

export function makeDistributedRequest(url: string, headers: Record<string, string>) {
  const activeContext = context.active();
  const carrier: Record<string, string> = { ...headers };

  // Inject active trace context (W3C traceparent) into outgoing headers
  propagation.inject(activeContext, carrier);

  return fetch(url, { headers: carrier });
}
```

## Estrategias de sampling en trazado distribuido

Capturing, serializing, and transmitting 100% of production traces in high-traffic systems introduces an unacceptable penalty on computational resources, network bandwidth, and storage costs. Sampling strategies are applied to manage this volume.

### Head-Based Sampling
Head-based sampling makes the decision to keep or discard a trace at the exact moment the root span is created, prior to processing downstream calls:

* **Probabilistic Sampling:** Selects a fixed percentage of requests (e.g., 5%).
* **Pros:** Extremely low computational overhead and memory usage across application services.
* **Cons:** May discard anomalous transactions, rare exceptions, or high-latency traces if they fall outside the selected percentage threshold.

### Tail-Based Sampling
Tail-based sampling delegates the capture decision to an intermediary component (the OpenTelemetry Collector). The collector temporarily buffers in memory all spans belonging to a single trace until the entire transaction completes:

```yaml
# Tail sampling configuration in OpenTelemetry Collector
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

This strategy guarantees the retention of 100% of traces resulting in errors (HTTP 5xx status codes or unhandled exceptions) or exceeding critical latency thresholds, while discarding routine successful traffic.

## Gestión de cardinalidad en métricas de producción

Metrics represent numerical data aggregated over regular time intervals. The fundamental challenge in systems like Prometheus or OpenTelemetry metrics lies in preventing *cardinality explosion*.

The cardinality of a metric equals the Cartesian product of the number of unique values contained in each of its labels or dimensions:

$$\text{Total Cardinality} = \prod_{i=1}^{N} |\text{Unique Label Values}_i$$

Injecting high-variance unique identifiers—such as `user_id`, `email`, UUIDs, or IP addresses—into metric labels generates millions of independent time series, exhausting storage engine memory and causing outages in the monitoring infrastructure.

```promql
# Correct: Label restricted to finite values (HTTP method and parametrized route)
http_requests_total{method="POST", route="/api/v1/users/:id", status="200"} 1542

# Incorrect: Cardinality explosion due to dynamic UUID in label
http_requests_total{method="POST", route="/api/v1/users/a9f8b2c1-4e00-4b21", status="200"} 1
```

Metrics must use only parametrized route identifiers and closed enumerations. Unique entity identifiers should be routed exclusively to traces and structured logs.

## Logging estructurado y correlación de telemetría

Event logging in production environments requires abandoning unstructured plain text in favor of strict JSON objects serialized per line (*JSON Lines*). This allows log processors like Fluentbit, Logstash, or Vector to parse and index fields without requiring complex regular expressions.

To achieve seamless bidirectional correlation between distributed traces and application logs, the logger must automatically inject the `trace_id` and `span_id` extracted from the active execution context into every emitted log line:

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

When investigating an error in the log monitoring platform, the presence of the `trace_id` key allows jumping directly with a single click to the full distributed trace visualization in tools like Grafana Tempo, Jaeger, or Datadog, drastically reducing Mean Time to Resolution (*MTTR*).