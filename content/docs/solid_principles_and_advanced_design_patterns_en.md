---
title: "SOLID Principles and Advanced Design Patterns"
description: "Practical application of SOLID principles, creational, structural, and behavioral patterns in TypeScript, and anti-pattern mitigation."
chapter: diseno-de-software
order: 3
tags:
  - Diseño de Software
  - Patrones de Diseño
  - SOLID
  - Clean Code
published: true
---

## Aplicación práctica de SOLID en sistemas complejos

SOLID principles are not mere theoretical rules from textbooks, but design constraints aimed at minimizing the blast radius of software change. In large enterprise systems, the primary challenge is not making code work initially, but ensuring it can evolve without triggering unwanted side effects in unrelated modules.

The **Dependency Inversion Principle (DIP)** serves as the cornerstone of modular architecture: high-level modules must not depend on low-level modules; both must depend on abstractions. Furthermore, abstractions must not depend on details, but details must depend on abstractions.

```typescript
// Incorrect: High coupling directly tied to a specific database implementation
class OrderProcessor {
  private database = new PostgreSQLDatabase();

  async process(order: Order): Promise<void> {
    await this.database.save(order);
  }
}

// Correct: Dependency inversion using an interface abstraction
export interface OrderRepository {
  save(order: Order): Promise<void>;
}

export class OrderProcessor {
  constructor(private readonly orderRepository: OrderRepository) {}

  async process(order: Order): Promise<void> {
    await this.orderRepository.save(order);
  }
}
```

## Patrones Creacionales y Estructurales en TypeScript

Design patterns provide battle-tested solutions to recurring architectural challenges using object-oriented principles and strict typing.

### Patrón Factory Method
Allows creating objects in a superclass while permitting subclasses or creator functions to alter the type of objects produced, uncoupling object instantiation logic from client execution code:

```typescript
export interface PaymentProcessor {
  charge(amount: number): Promise<boolean>;
}

export class StripePaymentProcessor implements PaymentProcessor {
  async charge(amount: number): Promise<boolean> {
    // Integration logic using Stripe SDK
    return true;
  }
}

export class PaymentProcessorFactory {
  static create(provider: 'stripe' | 'paypal'): PaymentProcessor {
    switch (provider) {
      case 'stripe':
        return new StripePaymentProcessor();
      case 'paypal':
        return new PayPalPaymentProcessor();
      default:
        throw new Error(`Unknown payment provider: ${provider}`);
    }
  }
}
```

## Patrones de Comportamiento para lógica de negocio desacoplada

When business logic accumulates nested conditional branches (`switch` or deep `if/else` statements) that expand with every new business rule, behavioral patterns enable encapsulating and delegating complex algorithms.

### Patrón Strategy
Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from the clients that utilize it:

```typescript
export interface TaxCalculationStrategy {
  calculate(amount: number): number;
}

export class ArgentinaTaxStrategy implements TaxCalculationStrategy {
  calculate(amount: number): number {
    return amount * 0.21; // 21% VAT
  }
}

export class OrderTaxCalculator {
  constructor(private readonly strategy: TaxCalculationStrategy) {}

  getTotalWithTax(amount: number): number {
    return amount + this.strategy.calculate(amount);
  }
}
```

## Antipatrones de diseño y code smells arquitectónicos

Recognizing anti-patterns early prevents long-term architectural degradation:

* **God Object:** A monolithic class that accumulates excessive responsibilities and controls the global state of the application.
* **Spaghetti Code:** Intricate and opaque control flow lacking clear separation between presentation, domain, and data access layers.
* **Premature Optimization / Over-engineering:** Implementing complex patterns (such as Event Sourcing or CQRS) in straightforward CRUD domains where a standard relational model is sufficient.