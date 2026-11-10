---
title: "Backend Architecture: Hexagonal, REST, and High Availability"
description: "Designing robust backend systems: from Hexagonal Architecture and RESTful APIs to latency optimization and resilience patterns for high availability."
chapter: backend
order: 1
tags:
  - Backend
  - Architecture
  - Hexagonal
  - REST
  - Resilience
  - Latency
published: true
---

## Context

A backend coupled to its framework or database becomes slow to test and brittle when transport, cache or a provider has to change.

## Decision

Separate domain and infrastructure, design APIs with stable contracts, and treat latency, cache and resilience as part of the design.

## Trade-offs

More layers and mapping up front. Less rewriting when the database, the protocol or the traffic changes.

## Outcome

A backend whose domain is tested on its own, and that runs under load with explicit failure paths.

## Context and the Backend Design Problem

In enterprise applications and high-traffic distributed systems, software complexity tends to grow non-linearly. Systems born with architectures tightly coupled to specific frameworks or database models end up suffering from operational friction: slow unit tests, difficulty migrating infrastructure components, and performance degradation under extreme loads.

The fundamental challenge of backend architecture is to isolate business domain logic from technological fluctuations (databases, third-party APIs, network transport) while ensuring strict operational metrics for latency, availability, and resilience.

## Backend Architectures and Decoupling

### N-Tier (Layered) Architecture and its Limitations

Traditional layered architecture organizes code vertically:

$$
\text{Presentation (Controllers)} \longrightarrow \text{Business Logic (Services)} \longrightarrow \text{Persistence (Repositories/ORM)}
$$

Although simple to implement initially, it presents severe structural flaws:

1. **Violation of the Dependency Inversion Principle (DIP):** The business layer often directly imports concrete data models or ORMs. If the database changes, the business logic is impacted.

2. **Infrastructure Coupling:** It becomes impossible to test the domain without spinning up a database or mocking complex external components.

### Hexagonal Architecture (Ports & Adapters)

Proposed by Alistair Cockburn, **Hexagonal Architecture** places domain logic at the center of the system, isolating it completely from the outside world via **Ports** (interfaces/contracts) and **Adapters** (concrete technological implementations).

```
                      ┌───────────────────────────────────────┐
                      │              DOMAIN CORE              │
                      │                                       │
                      │   ┌───────────────────────────────┐   │
   [ HTTP / REST ]───►│   │    Entities & Use Cases       │   │◄───[ gRPC Controller ]
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

#### Ports

Abstract interfaces belonging to the domain core.

* **Driving / Primary Ports:** Expose domain functionality to the outside world (e.g., use cases or service interfaces).

* **Driven / Secondary Ports:** Define the requirements the domain needs from the outside to function (e.g., persistence contracts, messaging, notification).

#### Adapters

Infrastructure components that interact with the outside world by implementing or consuming ports.

* **Driving Adapters:** HTTP Controllers, SQS/Kafka event consumers, CLI interfaces.

* **Driven Adapters:** Concrete database implementations (Postgres, DynamoDB), external API clients (Stripe, Sendgrid).

#### TypeScript Implementation Example

```
// 1. DOMAIN: Pure Business Entity
export class Account {
  constructor(
    public readonly id: string,
    private balance: number
  ) {}

  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive.");
    if (amount > this.balance) throw new Error("Insufficient funds.");
    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// 2. DRIVEN PORT: Persistence Contract (Belongs to Domain)
export interface AccountRepositoryPort {
  findById(id: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}

// 3. USE CASE (DRIVING PORT IMPLEMENTATION)
export class WithdrawUseCase {
  constructor(private readonly accountRepository: AccountRepositoryPort) {}

  async execute(accountId: string, amount: number): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new Error("Account not found.");

    account.withdraw(amount);
    await this.accountRepository.save(account);
  }
}

// 4. DRIVEN ADAPTER: Concrete Postgres Implementation (Infrastructure)
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

## API Design and Communication Protocols

### RESTful Principles and HTTP Semantics

RESTful APIs (*Representational State Transfer*) structure client-server communication around unique **resources** identified by URIs.

#### HTTP Method Semantics and Idempotency Table

| Method | Semantics | Idempotent | Safe (Read-Only) | Common Success Status | 
| ----- | ----- | ----- | ----- | ----- | 
| `GET` | Retrieve a resource or collection | Yes | Yes | `200 OK` | 
| `POST` | Create a new resource | No | No | `201 Created` | 
| `PUT` | Fully replace a resource | Yes | No | `200 OK` / `204 No Content` | 
| `PATCH` | Partially modify a resource | No / Yes\* | No | `200 OK` | 
| `DELETE` | Delete a resource | Yes | No | `204 No Content` | 

*\* PATCH can be designed idempotently, but RFC 5789 does not strictly mandate it.*

#### Standardized Error Handling (RFC 7807)

To avoid ad-hoc error responses, the `application/problem+json` format is used:

```
{
  "type": "https://api.domain.com/errors/insufficient-funds",
  "title": "Insufficient Funds",
  "status": 400,
  "detail": "Account 'acc_9876' does not have the required balance ($150.00) to process the transaction.",
  "instance": "/accounts/acc_9876/withdrawals"
}

```

### Backend Protocol Comparison

| Criterion | REST (JSON / HTTP/1.1) | gRPC (Protobuf / HTTP/2) | GraphQL | 
| ----- | ----- | ----- | ----- | 
| **Transport & Format** | Text (JSON) over HTTP/1.1 | Binary (Protobuf) over HTTP/2 | Text (JSON) over HTTP/1.1 or HTTP/2 | 
| **Typing** | Weak / Optional (OpenAPI/Swagger) | Strict (`.proto` schema files) | Strict (SDL Schema) | 
| **Performance / Latency** | Moderate (Large payload, JSON parsing) | High (Compact binary payload, multiplexing) | Variable (Risk of complex queries) | 
| **Ideal Use Cases** | Public APIs, Web/Mobile client communication. | Inter-service microservice communication. | Data aggregation in BFF (Backend-For-Frontend) layers. | 

## Latency, Caching, and Storage Optimization

### Latency Analysis: Percentiles vs. Averages

Evaluating performance through average latency ($\mu$) hides real degradation experienced by users. In production, analysis relies on percentiles:

* **p50 (Median):** Represents response time for $50\%$ of requests.

* **p95 and p99 (Tail Latency):** Represents latency for the slowest $5\%$ or $1\%$ of requests. This is the critical metric for infrastructure SLAs.

Accumulated latency in distributed microservice architectures follows the relation:

$$
P(\text{Total Latency}) = 1 - (1 - p99)^N
$$

where $N$ represents the number of sequential network calls.

### Backend Caching Patterns

To mitigate storage latency, in-memory caches like Redis or Memcached are employed.

```
1. Cache-Aside Pattern:
   [Client] ──► [Backend Server] ──1. Query Cache──► [Redis]
                         │                             │
                         ├──────2. Miss (Returns null)─┘
                         │
                         ├──3. Query DB──► [PostgreSQL]
                         │
                         └──4. Write to Cache ────────► [Redis]

```

1. **Cache-Aside (Lazy Loading):** The service checks cache first. On a *Miss*, it reads from the primary database, writes the result to cache with a TTL (Time-To-Live), and responds to the client.

2. **Read-Through:** The cache abstracts database access transparently; the application interacts solely with the caching layer.

3. **Write-Through:** All writes pass through the cache, which immediately updates the underlying database synchronously.

4. **Write-Behind (Write-Back):** Writes are acknowledged immediately in cache and asynchronously flushed to the database in batches, drastically reducing write latency.

### Preventing Cache Stampede (Thundering Herd)

When a high-traffic cache key expires, hundreds of simultaneous requests hit the database at once. Solutions include:

* **Distributed Locking:** Only one call acquires the lock to regenerate the cache; the rest await the result.

* **Probabilistic Early Expiration (XFetch):** Algorithm that probabilistically invalidates keys as time approaches the TTL:

$$
\Delta t - \beta \cdot \ln(\text{rand}()) > \text{TTL}
$$

## High Availability (HA) and Resilience

### Mathematical Availability Calculation

System availability is calculated based on MTBF (*Mean Time Between Failures*) and MTTR (*Mean Time To Repair*):

$$
\text{Availability} = \frac{\text{MTBF}}{\text{MTBF} + \text{MTTR}}
$$

| Availability Level | Permitted Downtime (Per Year) | 
| ----- | ----- | 
| **99% ("Two Nines")** | 3.65 days | 
| **99.9% ("Three Nines")** | 8.76 hours | 
| **99.99% ("Four Nines")** | 52.6 minutes | 
| **99.999% ("Five Nines")** | 5.26 minutes | 

### Backend Resilience Patterns

#### Circuit Breaker

Prevents downstream failures from cascading and taking down the entire system.

```
       ┌────────────────────────┐
       │         CLOSED         │ (Normal Operation)
       └────────────────────────┘
          │                  ▲
  Failures│                  │ Success
  > Threshold                │ Continuous
          ▼                  │
       ┌────────────────────────┐
       │          OPEN          │ (Fast Fail)
       └────────────────────────┘
          │
     Timeout Expires
          │
          ▼
       ┌────────────────────────┐
       │       HALF-OPEN        │ (Limited Traffic Test)
       └────────────────────────┘

```

#### Rate Limiting: Token Bucket Algorithm

The **Token Bucket** algorithm controls incoming traffic rates:

1. A bucket holds up to a maximum capacity $B$ of tokens.

2. Tokens are added to the bucket at a constant rate $r$ tokens per second.

3. Each incoming request requires consuming 1 or more tokens. If the bucket lacks sufficient tokens, the request is rejected with `429 Too Many Requests`.

```
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

#### Retry with Exponential Backoff and Jitter

Retrying requests immediately upon transient network errors can cause Retry Storms. This pattern applies exponential waiting intervals combined with randomization (*Jitter*):

$$
t_{\text{wait}} = 2^{\text{attempt}} \cdot t_{\text{base}} + \text{rand}(0, \text{Jitter})
$$

```
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

### CAP Theorem and Distributed Systems

In a distributed data store, only 2 out of 3 properties can be guaranteed simultaneously:

* **Consistency:** Every read receives the most recent write or an error.

* **Availability:** Every non-failing request returns a non-error response (without guarantee of containing the most recent write).

* **Partition Tolerance:** The system continues to operate despite network drops or delays between nodes.

Since network partitions are inevitable in real distributed environments ($P$), systems must choose between **CP** (Consistency over Availability) or **AP** (Availability over Eventual Consistency).