---
title: "Principios SOLID y Patrones de Diseño Avanzados"
description: "Aplicación práctica de principios SOLID, patrones creacionales, estructurales y de comportamiento en TypeScript, y mitigación de antipatrones."
chapter: diseno-de-software
order: 3
tags:
  - Diseño de Software
  - Patrones de Diseño
  - SOLID
  - Clean Code
published: true
---

## Contexto

En un sistema grande el problema no es que el código arranque. Es que un cambio en un módulo no debería romper los demás.

## Decisión

Aplicar SOLID — sobre todo inversión de dependencias — y patrones como Factory o Strategy solo donde aíslan una variación real.

## Trade-offs

Una interfaz por cada variación imaginada es ruido. Una dependencia concreta en el núcleo hace que el próximo cambio de proveedor toque el dominio.

## Resultado

Módulos que cambian por una sola razón, con la variación detrás de un contrato chico.

## Aplicación práctica de SOLID en sistemas complejos

Los principios SOLID no son meras reglas teóricas de libros de texto, sino restricciones de diseño orientadas a minimizar el impacto del cambio. En sistemas de software grandes, el principal desafío no es hacer que el código funcione inicialmente, sino garantizar que pueda evolucionar sin provocar efectos colaterales (*side effects*) en módulos independientes.

El principio de **Inversión de Dependencias (DIP)** es el pilar que sostiene toda arquitectura modular: los módulos de alto nivel no deben depender de los módulos de bajo nivel; ambos deben depender de abstracciones. Además, las abstracciones no deben depender de los detalles, sino los detalles de las abstracciones.

```typescript
// Incorrecto: Alto acoplamiento directo a una base de datos específica
class OrderProcessor {
  private database = new PostgreSQLDatabase();

  async process(order: Order): Promise<void> {
    await this.database.save(order);
  }
}

// Correcto: Inversión de dependencias mediante un puerto/interfaz
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

Los patrones de diseño proporcionan soluciones probadas a problemas recurrentes de arquitectura orientada a objetos y tipado estricto.

### Patrón Factory Method
Permite crear objetos en una superclase, pero permitiendo que las subclases o funciones creadoras alteren el tipo de objetos que se crearán, desacoplando la lógica de instanciación del código cliente:

```typescript
export interface PaymentProcessor {
  charge(amount: number): Promise<boolean>;
}

export class StripePaymentProcessor implements PaymentProcessor {
  async charge(amount: number): Promise<boolean> {
    // Lógica con Stripe SDK
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

Cuando la lógica de negocio contiene múltiples bifurcaciones condicionales (`switch` o `if/else` anidados) que crecen con cada nueva regla, los patrones de comportamiento permiten encapsular y delegar algoritmos complejos.

### Patrón Strategy
Define una familia de algoritmos, encapsula cada uno de ellos y los hace intercambiables. Strategy permite que el algoritmo varíe independientemente de los clientes que lo utilizan:

```typescript
export interface TaxCalculationStrategy {
  calculate(amount: number): number;
}

export class ArgentinaTaxStrategy implements TaxCalculationStrategy {
  calculate(amount: number): number {
    return amount * 0.21; // IVA 21%
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

Reconocer un antipatrón a tiempo evita la degradación estructural del software:

* **God Object:** Una clase que acumula demasiadas responsabilidades y conoce el estado de todo el sistema.
* **Spaghetti Code:** Flujo de control intrincado y opaco, sin separación clara entre lógica de presentación, dominio y persistencia.
* **Premature Optimization / Over-engineering:** Aplicar patrones complejos (como Event Sourcing o CQRS) en dominios CRUD sencillos donde un modelo relacional simple bastaba.