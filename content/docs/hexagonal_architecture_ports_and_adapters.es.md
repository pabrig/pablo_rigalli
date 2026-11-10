---
title: "Arquitectura Hexagonal, Puertos y Adaptadores"
description: "Desacoplamiento del dominio, inversión de dependencias, definición de puertos de entrada/salida, adaptadores de infraestructura y mapeo de datos sin contaminación."
chapter: backend
order: 3
tags:
  - Backend
  - Arquitectura
  - DDD
  - Patrones
published: true
---

## Filosofía y separación de capas en Hexagonal

La arquitectura hexagonal (también conocida como puertos y adaptadores), popularizada por Alistair Cockburn, busca aislar la lógica de negocio central (*Core Domain*) de los detalles tecnológicos externos como bases de datos, frameworks web, colas de mensajes o interfaces de usuario. En un diseño tradicional en capas acoplado a frameworks, la lógica de negocio suele terminar dependiendo de ORMs o detalles de infraestructura, dificultando las pruebas unitarias y provocando obsolescencia prematura cuando el framework cambia.

El principio rector de la arquitectura hexagonal es la **inversión de dependencias**: las reglas de negocio nunca dependen de la infraestructura; por el contrario, la infraestructura depende de las interfaces (puertos) definidas por el dominio. Las dependencias siempre apuntan hacia adentro, hacia el centro del hexágono.

```text
 +-------------------------------------------------------+
 |                 Infraestructura                       |
 |  +-------------------------------------------------+  |
 |  |               Adaptadores (DB, HTTP, CLI)       |  |
 |  |  +-------------------------------------------+  |  |
 |  |  |          Puertos (Interfaces)             |  |  |
 |  |  |  +-------------------------------------+  |  |  |
 |  |  |  |        Dominio / Casos de Uso       |  |  |  |
 |  |  |  |     (Lógica de Negocio Pura)        |  |  |  |
 |  |  |  +-------------------------------------+  |  |  |
 |  |  +-------------------------------------------+  |  |
 |  +-------------------------------------------------+  |
 +-------------------------------------------------------+
```

## Puertos de entrada (*Inbound/Driving*) y Casos de Uso

Los puertos de entrada representan los puntos de acceso a la aplicación. Definen **qué** puede hacer el sistema (por ejemplo, registrar un usuario, procesar un pago) sin especificar **cómo** se ejecuta o quién lo invoca (si viene de una API REST, una cola de mensajes RabbitMQ o un comando CLI).

Los **Casos de Uso** (*Use Cases* o *Interactors*) implementan estos puertos de entrada. Son clases puras de TypeScript que orquestan el flujo de datos: reciben los parámetros de entrada validados, ejecutan las reglas de negocio sobre las entidades de dominio y delegan la persistencia a través de los puertos de salida.

```typescript
// Puerto de Entrada (Interfaz)
export interface CreateUserCommand {
  email: string;
  name: string;
}

export interface RegisterUserUseCase {
  execute(command: CreateUserCommand): Promise<UserDomainModel>;
}

// Implementación del Caso de Uso (Core)
export class RegisterUserInteractor implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort, // Puerto de Salida
    private readonly eventPublisher: EventPublisherPort     // Puerto de Salida
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

Los puertos de salida son interfaces definidas dentro del dominio que especifican qué capacidades externas necesita la aplicación para cumplir su propósito (como consultar una base de datos o enviar un correo electrónico). 

Los **Adaptadores** son las implementaciones concretas de estos puertos. Por ejemplo, si el puerto de salida es `UserRepositoryPort`, tendremos un adaptador `PostgresUserRepository` que utiliza Prisma o TypeORM para interactuar con PostgreSQL, y podríamos tener otro adaptador `InMemoryUserRepository` puramente para testing rápido.

```typescript
// Puerto de Salida (Definido en el Core)
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserDomainModel | null>;
  save(user: UserDomainModel): Promise<void>;
}

// Adaptador de Infraestructura (Implementación concreta con Prisma)
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

Un error común que rompe la arquitectura hexagonal es permitir que los objetos de base de datos (como entidades de ORM con decoradores de base de datos) o los DTOs de HTTP penetren en la capa de dominio. Para mantener el aislamiento estricto, cada capa utiliza sus propias estructuras de datos y realiza un mapeo explícito en las fronteras:

1. **DTOs de Entrada (Controller/HTTP):** Reciben la petición cruda y validan tipos (ej. usando Zod).
2. **Modelos de Dominio:** Entidades puras con lógica de negocio y validación de invariantes.
3. **Modelos de Persistencia:** Estructuras optimizadas para la base de datos (tablas, esquemas de ORM).

Este aislamiento garantiza que un cambio en la estructura de la base de datos o en la versión de un framework web jamás requiera modificar las reglas de negocio del dominio.