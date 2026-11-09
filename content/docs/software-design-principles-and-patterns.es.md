---
title: "Principales patrones de diseño de Software"
description: "El equilibrio técnico entre SOLID, KISS, DRY y YAGNI, y cómo aplicar criterio de arquitectura evitando la sobreingeniería."
chapter: diseno-de-software
order: 1
tags:
  - Arquitectura
  - Patrones
  - Diseño
published: true
---

## Contexto y el problema del diseño

El costo real del desarrollo de software no reside en la escritura inicial del código, sino en su mantenimiento, lectura y evolución a lo largo del tiempo. En proyectos con ciclo de vida prolongado, una decisión de diseño apresurada o una abstracción forzada genera deuda técnica que ralentiza la velocidad de entrega del equipo.

El principal desafío en la arquitectura de software es equilibrar la flexibilidad futura con la simplicidad presente. La abstracción prematura suele ser tan dañina como el código espagueti: introduce capas de indirección innecesarias que dificultan el rastreo de ejecución sin aportar valor concreto. Una arquitectura saludable es evolutiva, respondiendo a los requerimientos del dominio a medida que emergen.

## Principios fundamentales

### SOLID

Los principios SOLID son guías fundamentales para diseñar sistemas orientados a objetos y arquitecturas modulares mantenibles.

#### Single Responsibility Principle (SRP)
Un módulo o clase debe tener una sola razón para cambiar. SRP no significa que una función o clase deba tener solo 5 líneas de código, sino que debe estar delimitada por una única responsabilidad dentro del dominio.

```typescript
// Anti-patrón: Mezcla persistencia, lógica de negocio y notificación
class OrderService {
  async processOrder(order: Order): Promise<void> {
    // 1. Lógica de negocio
    order.total = order.items.reduce((acc, item) => acc + item.price, 0);
    
    // 2. Persistencia directa
    await db.query("INSERT INTO orders ...", [order]);
    
    // 3. Notificación
    await fetch("https://api.email.com/send", { method: "POST", body: JSON.stringify(order) });
  }
}

// Aplicando SRP: Responsabilidades separadas por contratos
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
Las entidades de software deben estar abiertas a la extensión pero cerradas a la modificación. Se logra mediante el uso de polimorfismo o composición, permitiendo agregar nuevo comportamiento sin alterar el código existente.

#### Liskov Substitution Principle (LSP)
Las subclases o implementaciones de un contrato deben ser sustituibles por sus tipos base sin alterar la corrección del programa. Si una implementación lanza excepciones no esperadas o anula métodos del tipo base, rompe LSP.

#### Interface Segregation Principle (ISP)
Los clientes no deben estar obligados a depender de interfaces que no utilizan. Es preferible tener múltiples interfaces específicas y magras antes que una interfaz monolítica engorrosa.

#### Dependency Inversion Principle (DIP)
Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones. Las abstracciones no deben depender de los detalles, sino los detalles de las abstracciones.

### Pragmatismo operacional

Los principios pragmáticos actúan como contrapeso a la sobreingeniería:

* **DRY (Don't Repeat Yourself):** Toda pieza de conocimiento debe tener una representación única e inequívoca dentro de un sistema. DRY refiere a no duplicar la *lógica de negocio*, no a eliminar toda coincidencia sintáctica de código. La duplicación de código es preferible al acoplamiento incorrecto.
* **KISS (Keep It Simple, Stupid):** La simplicidad debe ser una meta primaria de diseño. El código más fácil de mantener es aquel que se lee de forma lineal sin capas innecesarias de indirección.
* **YAGNI (You Aren't Gonna Need It):** No agregues funcionalidad o abstracciones hasta que sea estrictamente necesario. Implementar código para requerimientos hipotéticos futuros añade costo de mantenimiento sin retorno de inversión.

## Catálogo de Patrones y su aplicación práctica

Los patrones de diseño son soluciones probadas a problemas recurrentes en el desarrollo de software.

### Patrones Creacionales

Mecanismos de creación de objetos que aumentan la flexibilidad y la reutilización de código.

#### Factory Method & Abstract Factory
Permiten delegar la lógica de instanciación a subclases o fábricas especializadas, aislando al cliente de las clases concretas (DIP + OCP).

#### Builder
Separa la construcción de un objeto complejo de su representación, permitiendo crear diferentes representaciones mediante el mismo proceso de construcción sin constructores telescópicos.

#### Singleton
Garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella. 

```typescript
// Cuándo usar: Administradores de conexiones o pools de recursos inmutables
class DatabasePool {
  private static instance: DatabasePool;

  private constructor() {
    // Inicialización del pool
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }
}
```

> **Trade-off:** El abuso de Singleton introduce estado global implícito, dificulta las pruebas unitarias y acopla componentes. En aplicaciones modernas, se prefiere gestionar la vida útil mediante inyección de dependencias (DI Container).

### Patrones Estructurales

Explican cómo ensamblar objetos y clases en estructuras más grandes manteniendo la flexibilidad y eficiencia.

#### Adapter
Permite la colaboración entre objetos con interfaces incompatibles. Es ideal para integrar librerías de terceros o sistemas legacy sin acoplar el código de dominio.

#### Decorator
Añade dinámicamente nuevas responsabilidades a un objeto envolviéndolo en un wrapper, sin alterar la clase original (cumplimiento directo de OCP).

#### Facade
Proporciona una interfaz simplificada a un conjunto complejo de clases, una librería o un subsistema (KISS aplicado a contratos de módulos).

### Patrones de Comportamiento

Se centran en los algoritmos y la asignación de responsabilidades entre objetos.

#### Strategy
Define una familia de algoritmos, encapsula cada uno y los hace intercambiables en tiempo de ejecución.

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<PaymentResult>;
}

class StripePayment implements PaymentStrategy {
  async pay(amount: number): Promise<PaymentResult> {
    // Integración con Stripe
    return { success: true, transactionId: "ch_stripe_123" };
  }
}

class CryptoPayment implements PaymentStrategy {
  async pay(amount: number): Promise<PaymentResult> {
    // Integración con blockchain/wallet
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
Establece un mecanismo de suscripción para notificar a múltiples objetos sobre cualquier evento que le suceda al objeto que están observando. Base del desacoplamiento en Event-Driven Architecture.

#### Command
Transforma una solicitud en un objeto independiente que contiene toda la información sobre la solicitud. Facilita la parametrización de métodos, colas de ejecución y operaciones deshacibles (undo/redo).

## Trade-offs y el límite de la sobreingeniería

La aplicación de patrones y principios exige criterio técnico. Aplicar patrones a problemas triviales introduce complejidad accidental.

| Enfoque | Ventaja | Riesgo / Costo |
| :--- | :--- | :--- |
| **Diseño Pragmático (KISS/YAGNI)** | Entrega rápida, menor cantidad de código, lectura directa. | Riesgo de refactorización mayor si las especificaciones cambian drásticamente. |
| **Abstracción Rigurosa (SOLID/Patrones)** | Alto desacoplamiento, facilidad para pruebas unitarias y extensión. | Alta indirección, curva de aprendizaje elevada, riesgo de "patronitis". |

El límite de la sobreingeniería se alcanza cuando la estructura creada para soportar un cambio hipotético requiere más esfuerzo de mantenimiento que el cambio en sí cuando este finalmente ocurre. La regla general es mantener el diseño lo más simple posible hasta que la necesidad real de extensión justifique la refactorización hacia un patrón.