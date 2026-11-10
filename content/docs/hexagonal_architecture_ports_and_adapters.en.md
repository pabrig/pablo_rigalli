---
title: "Hexagonal Architecture, Ports and Adapters"
description: "Domain decoupling, dependency inversion, inbound and outbound port definitions, infrastructure adapters, and clean data mapping."
chapter: backend
order: 3
tags:
  - Backend
  - Arquitectura
  - DDD
  - Patrones
published: true
---

## Context

If the domain depends on the ORM or the framework, every infrastructure change drags business logic with it and slows the tests down.

## Decision

Isolate the core behind inbound and outbound ports. Adapters — HTTP, database, queues — live outside and translate DTOs without leaking into the domain.

## Trade-offs

More types and mapping at the edge. In return, a use case is tested without infrastructure, and an adapter can change without rewriting rules.

## Outcome

A domain that survives a framework change, with an explicit contract between business rules and infrastructure.

## Filosofía y separación de capas en Hexagonal

Hexagonal architecture (also known as Ports and Adapters), popularized by Alistair Cockburn, aims to isolate the core business logic (*Core Domain*) from external technical details such as databases, web frameworks, message queues, or user interfaces. In traditional layered designs tightly coupled to frameworks, business logic frequently ends up depending on ORMs or infrastructure details, hindering unit testing and causing premature obsolescence when frameworks evolve.

The guiding principle of hexagonal architecture is **dependency inversion**: business rules never depend on infrastructure; instead, infrastructure depends on the interfaces (ports) defined by the domain. Dependencies always point inwards toward the center of the hexagon.

```text
 +-------------------------------------------------------+
 |                 Infrastructure                        |
 |  +-------------------------------------------------+  |
 |  |               Adapters (DB, HTTP, CLI)          |  |
 |  |  +-------------------------------------------+  |  |
 |  |  |          Ports (Interfaces)               |  |  |
 |  |  |  +-------------------------------------+  |  |  |
 |  |  |  |        Domain / Use Cases           |  |  |  |
 |  |  |  |     (Pure Business Logic)           |  |  |  |
 |  |  |  +-------------------------------------+  |  |  |
 |  |  +-------------------------------------------+  |  |
 |  +-------------------------------------------------+  |
 +-------------------------------------------------------+
```

## Puertos de entrada (*Inbound/Driving*) y Casos de Uso

Inbound ports represent entry points into the application. They define **what** the system can perform (for instance, registering a user or processing a payment) without dictating **how** it is executed or who triggers it (whether from a REST API, a RabbitMQ consumer, or a CLI command).

**Use Cases** (*Interactors*) implement these inbound ports. They are pure TypeScript classes orchestrating application flow: receiving validated input commands, executing business rules on domain entities, and delegating persistence tasks through outbound ports.

```typescript
// Inbound Port (Interface)
export interface CreateUserCommand {
  email: string;
  name: string;
}

export interface RegisterUserUseCase {
  execute(command: CreateUserCommand): Promise<UserDomainModel>;
}

// Use Case Implementation (Core)
export class RegisterUserInteractor implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort, // Outbound Port
    private readonly eventPublisher: EventPublisherPort     // Outbound Port
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDomainModel> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new DomainError('User already exists');
    }

    const user = UserDomainModel.create(command.email, command.name);
    
    await this.userRepository.save(user);
    await this.eventPublisher.publish(new UserRegisteredEvent(user.id));

    return user;
  }
}
```

## Puertos de salida (*Outbound/Driven*) y Adaptadores de infraestructura

Outbound ports are interfaces declared inside the domain that specify what external capabilities the application requires to achieve its goals (such as querying a database or sending emails).

**Adapters** are concrete implementations of these outbound ports. For example, if an outbound port is defined as `UserRepositoryPort`, we will have a `PostgresUserRepository` adapter using Prisma or TypeORM to interact with PostgreSQL, and we could also create an `InMemoryUserRepository` adapter strictly for fast unit testing.

```typescript
// Outbound Port (Defined in Core)
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserDomainModel | null>;
  save(user: UserDomainModel): Promise<void>;
}

// Infrastructure Adapter (Concrete Prisma implementation)
import { PrismaClient } from '@prisma/client';

export class PostgresUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<UserDomainModel | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record) return null;
    return UserDomainModel.fromPersistence(record.id, record.email, record.name);
  }

  async save(user: UserDomainModel): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email, name: user.name },
      update: { email: user.email, name: user.name },
    });
  }
}
```

## Mapeo de datos y segregación de DTOs

A common flaw that violates hexagonal architecture is allowing database models (such as ORM entities decorated with DB metadata) or HTTP DTOs to leak into the domain layer. To preserve strict isolation, each layer maintains dedicated data structures and performs explicit mapping at boundaries:

1. **Input DTOs (Controller/HTTP):** Receive raw payloads and validate types (e.g., via Zod).
2. **Domain Models:** Pure entities encapsulating business rules and invariant enforcement.
3. **Persistence Models:** Schemas optimized for database engines (tables, ORM definitions).

This boundary isolation guarantees that database schema modifications or web framework version changes never require altering core business domain logic.