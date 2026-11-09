---
title: "Software Design Principles and Patterns"
description: "The technical balance between SOLID, KISS, DRY, and YAGNI, and how to apply architectural judgment without over-engineering."
chapter: diseno-de-software
order: 1
tags:
  - Arquitectura
  - Patrones
  - Diseño
published: true
---

## Context and the Design Problem

The real cost of software development does not lie in writing the initial code, but in its maintenance, readability, and evolution over time. In projects with a long lifecycle, a rushed design decision or a forced abstraction creates technical debt that slows down the team's delivery velocity.

The main challenge in software architecture is balancing future flexibility with present simplicity. Premature abstraction is often as harmful as spaghetti code: it introduces unnecessary layers of indirection that make execution flow hard to trace without adding tangible value. A healthy architecture is evolutionary, responding to domain requirements as they emerge.

## Fundamental Principles

### SOLID

The SOLID principles are fundamental guidelines for designing maintainable object-oriented systems and modular architectures.

#### Single Responsibility Principle (SRP)

A module or class should have only one reason to change. SRP does not mean a function or class must contain only 5 lines of code, but rather that it must be bounded by a single responsibility within the domain context.

```typescript
// Anti-pattern: Blends persistence, business logic, and notification
class OrderService {
  async processOrder(order: Order): Promise<void> {
    // 1. Business logic
    order.total = order.items.reduce((acc, item) => acc + item.price, 0);
    
    // 2. Direct persistence
    await db.query("INSERT INTO orders ...", [order]);
    
    // 3. Notification
    await fetch("https://api.email.com/send", { method: "POST", body: JSON.stringify(order) });
  }
}

// Applying SRP: Responsibilities segregated by contracts
interface OrderRepository {
  save(order: Order): Promise<void>;
}

interface NotificationService {
  notify(order: Order): Promise<void>;
}

class OrderProcessor {
  constructor(
    private readonly repository: OrderRepository,
    private readonly notifier: NotificationService
  ) {}

  async process(order: Order): Promise<void> {
    order.calculateTotal();
    await this.repository.save(order);
    await this.notifier.notify(order);
  }
}
```

#### Open/Closed Principle (OCP)

Software entities should be open for extension, but closed for modification. This is achieved through polymorphism or composition, allowing new behavior to be added without altering existing code.

#### Liskov Substitution Principle (LSP)

Subclasses or implementations of a contract must be substitutable for their base types without altering the correctness of the program. If an implementation throws unexpected exceptions or voids base type methods, it violates LSP.

#### Interface Segregation Principle (ISP)

Clients should not be forced to depend on interfaces they do not use. Prefer multiple specific, lean interfaces over a single bloated monolithic interface.

#### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

### Operational Pragmatism

Pragmatic principles act as a counterbalance to over-engineering:

* **DRY (Don't Repeat Yourself):** Every piece of knowledge must have a single, unambiguous representation within a system. DRY refers to avoiding duplication of *business logic*, not eliminating every single syntactic code coincidence. Code duplication is preferable to wrong coupling.
* **KISS (Keep It Simple, Stupid):** Simplicity should be a primary design goal. The easiest code to maintain is that which reads linearly without unnecessary indirection layers.
* **YAGNI (You Aren't Gonna Need It):** Do not add functionality or abstractions until strictly necessary. Writing code for hypothetical future requirements adds maintenance cost with no immediate return on investment.

## Pattern Catalog and Practical Application

Design patterns are proven solutions to recurring problems in software engineering.

### Creational Patterns

Object creation mechanisms that increase flexibility and code reuse.

#### Factory Method & Abstract Factory

Delegate instantiation logic to specialized subclasses or factories, isolating the client from concrete classes (DIP + OCP).

#### Builder

Separates the construction of a complex object from its representation, allowing the same construction process to create different representations without telescoping constructors.

#### Singleton

Ensures a class has only one instance while providing a global access point to it.

```typescript
// Use case: Connection managers or immutable resource pools
class DatabasePool {
  private static instance: DatabasePool;

  private constructor() {
    // Pool initialization
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }
}
```

> **Trade-off:** Overusing Singleton introduces implicit global state, hinders unit testing, and tightly couples components. Modern applications prefer managing lifecycles via Dependency Injection (DI Containers).

### Structural Patterns

Explain how to assemble objects and classes into larger structures while keeping them flexible and efficient.

#### Adapter

Allows objects with incompatible interfaces to collaborate. Ideal for integrating third-party libraries or legacy systems without coupling domain code.

#### Decorator

Dynamically attaches new responsibilities to an object by wrapping it, without modifying the original class (direct compliance with OCP).

#### Facade

Provides a simplified interface to a complex set of classes, a library, or a subsystem (KISS applied to module contracts).

### Behavioral Patterns

Focus on algorithms and the assignment of responsibilities between objects.

#### Strategy

Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<PaymentResult>;
}

class StripePayment implements PaymentStrategy {
  async pay(amount: number): Promise<PaymentResult> {
    // Stripe integration
    return { success: true, transactionId: "ch_stripe_123" };
  }
}

class CryptoPayment implements PaymentStrategy {
  async pay(amount: number): Promise<PaymentResult> {
    // Blockchain/wallet integration
    return { success: true, transactionId: "0xabc..." };
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  async execute(amount: number) {
    return this.strategy.pay(amount);
  }
}
```

#### Observer

Establishes a subscription mechanism to notify multiple objects about any events that happen to the object they are observing. Foundational for decoupling in Event-Driven Architecture.

#### Command

Turns a request into a stand-alone object that contains all information about the request. Enables parameterizing methods, queuing execution, and undoable operations (undo/redo).

## Trade-offs and the Limits of Over-Engineering

Applying patterns and principles requires technical judgment. Applying patterns to trivial problems introduces accidental complexity.

| Approach | Advantage | Risk / Cost |
| :--- | :--- | :--- |
| **Pragmatic Design (KISS/YAGNI)** | Fast delivery, lower codebase size, direct readability. | Higher refactoring risk if specifications change drastically. |
| **Rigorous Abstraction (SOLID/Patterns)** | Loose coupling, testability, high extensibility. | High indirection, steep learning curve, risk of "patternitis". |

The limit of over-engineering is reached when the structure built to support a hypothetical change requires more maintenance effort than implementing the change itself when it actually occurs. The general rule is to keep the design as simple as possible until concrete extension needs justify refactoring toward a pattern.