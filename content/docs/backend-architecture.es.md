---
title: "Arquitectura de Backend: Hexagonal, REST y Alta Disponibilidad"
description: "Diseño de sistemas backend robustos: de la Arquitectura Hexagonal y APIs RESTful a la optimización de latencia y patrones de resiliencia para alta disponibilidad."
chapter: backend
order: 1
tags:
  - Backend
  - Arquitectura
  - Hexagonal
  - REST
  - Resiliencia
  - Latencia
published: true
---

## Contexto y el problema del diseño backend

En aplicaciones empresariales y sistemas distribuidos de alto tráfico, la complejidad del software tiende a crecer de forma no lineal. Los sistemas que nacen con arquitecturas acopladas a frameworks o modelos de base de datos específicos terminan sufriendo de fricción operativa: pruebas unitarias lentas, dificultad para migrar componentes de infraestructura y degradación del rendimiento bajo cargas extremas.

El reto fundamental de la arquitectura backend es aislar el dominio de negocio de las vicisitudes tecnológicas (bases de datos, APIs de terceros, transporte de red) mientras se garantizan métricas operativas estrictas de latencia, disponibilidad y resiliencia.

## Arquitecturas de Backend y Desacoplamiento

### Arquitectura en Capas (N-Tier) y sus limitaciones

La arquitectura tradicional en capas organiza el código verticalmente:

$$\text{Presentación (Controllers)} \longrightarrow \text{Negocio (Services)} \longrightarrow \text{Persistencia (Repositories/ORM)}$$

Aunque simple de implementar inicialmente, presenta deficiencias estructurales graves:

1. **Violación del Principio de Inversión de Dependencias (DIP):** La capa de negocio suele importar directamente modelos de datos u ORMs concretos. Si la base de datos cambia, la lógica de negocio se ve afectada.
2. **Acoplamiento de Infraestructura:** Resulta imposible probar el dominio sin levantar una base de datos o simular componentes externos complejos.

### Arquitectura Hexagonal (Ports & Adapters)

Propuesta por Alistair Cockburn, la **Arquitectura Hexagonal** coloca la lógica de dominio en el centro del sistema, aislándola completamente del exterior mediante **Puertos** (contratos/interfaces) y **Adaptadores** (implementaciones tecnológicas concretas).

```
                      ┌───────────────────────────────────────┐
                      │            CORE DE DOMINIO            │
                      │                                       │
                      │   ┌───────────────────────────────┐   │
   [ HTTP / REST ]───►│   │    Entidades & Casos de Uso   │   │◄───[ gRPC Controller ]
  (Driving Adapter)   │   └───────────────────────────────┘   │   (Driving Adapter)
                      │                   │                   │
                      └───────────────────┼───────────────────┘
                                          │
                                   (Driven Ports)
                                          │
                      ┌───────────────────┴───────────────────┐
                      ▼                                       ▼
             [ Postgres Adapter ]                   [ Redis Cache Adapter ]
             (Driven Adapter)                       (Driven Adapter)
```

#### Puertos (Ports)
Interfaces abstractas que pertenecen al núcleo del dominio.
* **Driving / Primary Ports:** Exponen la funcionalidad del dominio al mundo exterior (e.g., casos de uso o interfaces de servicio).
* **Driven / Secondary Ports:** Definen los requerimientos que el dominio necesita del exterior para funcionar (e.g., contratos de persistencia, mensajería, notificación).

#### Adaptadores (Adapters)
Componentes de infraestructura que interactúan con el exterior implementando o consumiendo los puertos.
* **Driving Adapters:** HTTP Controllers, consumidores de eventos SQS/Kafka, CLI interface.
* **Driven Adapters:** Implementaciones concretas de base de datos (Postgres, DynamoDB), clientes de APIs externas (Stripe, Sendgrid).

#### Ejemplo de Implementación en TypeScript

```typescript
// 1. DOMAIN: Entidad de Negocio pura
export class Account {
  constructor(
    public readonly id: string,
    private balance: number
  ) {}

  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("El monto a retirar debe ser positivo.");
    if (amount > this.balance) throw new Error("Fondos insuficientes.");
    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// 2. DRIVEN PORT: Contrato de Persistencia (Pertenece al Dominio)
export interface AccountRepositoryPort {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}

// 3. USE CASE (DRIVING PORT IMPLEMENTATION)
export class WithdrawUseCase {
  constructor(private readonly accountRepository: AccountRepositoryPort) {}

  async execute(accountId: string, amount: number): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new Error("Cuenta no encontrada.");

    account.withdraw(amount);
    await this.accountRepository.save(account);
  }
}

// 4. DRIVEN ADAPTER: Implementación concreta en Postgres (Infraestructura)
import { Pool } from "pg";

export class PostgresAccountAdapter implements AccountRepositoryPort {
  constructor(private readonly dbPool: Pool) {}

  async findById(id: string): Promise<Account | null> {
    const res = await this.dbPool.query("SELECT id, balance FROM accounts WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    return new Account(res.rows[0].id, parseFloat(res.rows[0].balance));
  }

  async save(account: Account): Promise<void> {
    await this.dbPool.query(
      "UPDATE accounts SET balance = $1 WHERE id = $2",
      [account.getBalance(), account.id]
    );
  }
}
```

---

## Diseño de APIs y Protocolos de Comunicación

### Principios RESTful y Semántica HTTP

Las APIs RESTful (*Representational State Transfer*) estructuran la comunicación cliente-servidor en torno a **recursos** únicos identificados por URIs.

#### Tabla de Idempotencia y Semántica de Métodos HTTP

| Método | Semántica | Idempotente | Seguro (Read-Only) | Código Exitoso Común |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | Recuperar un recurso o colección | Sí | Sí | `200 OK` |
| `POST` | Crear un nuevo recurso | No | No | `201 Created` |
| `PUT` | Reemplazar completamente un recurso | Sí | No | `200 OK` / `204 No Content` |
| `PATCH` | Modificación parcial de un recurso | No / Sí* | No | `200 OK` |
| `DELETE` | Eliminar un recurso | Sí | No | `204 No Content` |

*\* PATCH puede diseñarse de forma idempotente, pero la norma RFC 5789 no lo exige de manera estricta.*

#### Manejo de Errores Estandarizado (RFC 7807)

Para evitar respuestas de error ad-hoc, se utiliza el formato `application/problem+json`:

```json
{
  "type": "https://api.domain.com/errors/insufficient-funds",
  "title": "Fondos Insuficientes",
  "status": 400,
  "detail": "La cuenta 'acc_9876' no posee el saldo requerido ($150.00) para procesar la transacción.",
  "instance": "/accounts/acc_9876/withdrawals"
}
```

### Comparativa de Protocolos Backend

| Criterio | REST (JSON / HTTP/1.1) | gRPC (Protobuf / HTTP/2) | GraphQL |
| :--- | :--- | :--- | :--- |
| **Transporte & Formato** | Texto (JSON) sobre HTTP/1.1 | Binario (Protobuf) sobre HTTP/2 | Texto (JSON) sobre HTTP/1.1 o HTTP/2 |
| **Tipado** | Débil / Opcional (OpenAPI/Swagger) | Estricto (Archivos `.proto`) | Estricto (Schema SDL) |
| **Rendimiento / Latencia** | Moderado (Payload extenso, parsing JSON) | Alto (Payload binario compacto, multiplexación) | Variable (Riesgo de consultas complejas) |
| **Casos de Uso Ideales** | APIs públicas, comunicación Web/Mobile. | Comunicación entre microservicios interservicios. | Agregación de datos en capas BFF (Backend-For-Frontend). |

---

## Latencia, Caching y Optimización de Almacenamiento

### Análisis de Latencia: Percentiles vs. Promedios

Evaluar el rendimiento mediante el promedio de latencia ($\mu$) oculta la degradación real experimentada por los usuarios. En producción, el análisis se realiza mediante percentiles:

* **p50 (Mediana):** Representa el tiempo de respuesta del $50\%$ de las peticiones.
* **p95 y p99 (Tail Latency):** Representa la latencia del $5\%$ o $1\%$ de las peticiones más lentas. Es la métrica crítica para SLAs de infraestructura.

La latencia acumulada en arquitecturas distribuidas orientadas a microservicios sigue la relación:

$$P(\text{Latencia Total}) = 1 - (1 - p99)^N$$

donde $N$ representa la cantidad de llamadas en red secuenciales.

### Patrones de Caching en Backend

Para mitigar la latencia de almacenamiento, se emplean almacenes en memoria como Redis o Memcached.

```
1. Cache-Aside Pattern:
   [Cliente] ──► [Servidor Backend] ──1. Consulta Cache──► [Redis]
                         │                                  │
                         ├──────2. Miss (Devuelve null)─────┘
                         │
                         ├──3. Query BD──► [PostgreSQL]
                         │
                         └──4. Escribe en Cache ──────────► [Redis]
```

1. **Cache-Aside (Lazy Loading):** El servicio consulta primero la caché. En caso de *Miss*, lee de la base de datos primaria, escribe el resultado en caché con un TTL (Time-To-Live) y responde al cliente.
2. **Read-Through:** La caché actúa como abstracción transparente frente a la base de datos; la aplicación solo interactúa con la capa de caché.
3. **Write-Through:** Toda escritura pasa por la caché, que actualiza inmediatamente la base de datos subyacente de forma síncrona.
4. **Write-Behind (Write-Back):** Las escrituras se confirman inmediatamente en la caché y se asientan de forma asíncrona en la base de datos en lotes (*batches*), reduciendo drásticamente la latencia de escritura.

### Prevención de Cache Stampede (Thundering Herd)

Cuando una clave de alto tráfico expira en caché, cientos de peticiones simultáneas impactan la base de datos al mismo tiempo. Se resuelve mediante:

* **Locking Distribuido:** Solo una llamada obtiene el candado para regenerar la caché; el resto aguarda el resultado.
* **Probabilistic Early Expiration (XFetch):** Algoritmo que invalida la clave de forma probabilística a medida que el tiempo se aproxima al TTL:

$$\Delta t - \beta \cdot \ln(\text{rand}()) > \text{TTL}$$

---

## Alta Disponibilidad (HA) y Resiliencia

### Cálculo Matemático de Disponibilidad

La disponibilidad de un sistema se calcula en función del MTBF (*Mean Time Between Failures*) y MTTR (*Mean Time To Repair*):

$$\text{Disponibilidad} = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}$$

| Nivel de Disponibilidad | Tiempo de Inactividad Permitido (Por Año) |
| :--- | :--- |
| **99% ("Dos Nueves")** | 3.65 días |
| **99.9% ("Tres Nueves")** | 8.76 horas |
| **99.99% ("Cuatro Nueves")** | 52.6 minutos |
| **99.999% ("Cinco Nueves")** | 5.26 minutos |

### Patrones de Resiliencia en Backend

#### Circuit Breaker

Evita que una falla en un servicio dependiente aguas abajo (*downstream*) colapse todo el sistema.

```
       ┌────────────────────────┐
       │         CLOSED         │ (Operación Normal)
       └────────────────────────┘
          │                  ▲
   Fallas │                  │ Éxito
   > Threshold               │ Continuo
          ▼                  │
       ┌────────────────────────┐
       │          OPEN          │ (Falla Rápida / Fast Fail)
       └────────────────────────┘
          │
    Timeout Expira
          │
          ▼
       ┌────────────────────────┐
       │       HALF-OPEN        │ (Prueba de Tráfico Limitado)
       └────────────────────────┘
```

#### Rate Limiting: Algoritmo Token Bucket

El algoritmo **Token Bucket** controla la tasa de tráfico entrante:

1. Un contenedor (*bucket*) almacena hasta una capacidad máxima $B$ de tokens.
2. Se añaden tokens al bucket a una tasa constante $r$ tokens por segundo.
3. Cada petición entrante requiere consumir 1 o más tokens. Si el bucket no contiene suficientes tokens, la petición se rechaza con código `429 Too Many Requests`.

```typescript
// Token Bucket Rate Limiter
export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(
    private readonly capacity: number,
    private readonly fillRatePerSecond: number
  ) {
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public allowRequest(tokensRequested = 1): boolean {
    this.refill();

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedTimeInSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedTimeInSeconds * this.fillRatePerSecond;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }
}
```

#### Retry con Exponential Backoff y Jitter

Reintentar peticiones inmediatamente ante fallas transitorias de red puede causar tormentas de tráfico (*Retry Storms*). El patrón aplica un intervalo de espera exponencial con aleatorización (*Jitter*):

$$t_{\text{wait}} = 2^{\text{intento}} \cdot t_{\text{base}} + \text{rand}(0, \text{Jitter})$$

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 100
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Exponential backoff + Full Jitter
    const delay = Math.random() * (Math.pow(2, 3 - retries) * baseDelayMs);
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    return fetchWithRetry(fn, retries - 1, baseDelayMs);
  }
}
```

### Teorema CAP y Sistemas Distribuidos

En un sistema distribuido de almacenamiento de datos, solo se pueden garantizar simultáneamente 2 de las 3 siguientes propiedades:

* **Consistencia (Consistency):** Todos los nodos ven los mismos datos al mismo tiempo.
* **Disponibilidad (Availability):** Toda petición no fallida recibe una respuesta (sin garantía de contener el dato más reciente).
* **Tolerancia a Particiones (Partition Tolerance):** El sistema continúa funcionando a pesar de pérdidas o retrasos en la red entre nodos.

Dado que las particiones de red son inevitables en entornos distribuidos reales ($P$), los sistemas deben elegir entre **CP** (Consistencia sobre Disponibilidad) o **AP** (Disponibilidad sobre Consistencia Eventual).