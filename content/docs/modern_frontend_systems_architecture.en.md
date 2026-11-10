---
title: "Modern Frontend Systems Architecture"
description: "Advanced component composition patterns, state management, decoupled events, micro-frontends, PWAs, and frontend testing strategies."
chapter: frontend
order: 1
tags:
  - Frontend
  - Architecture
  - React
  - TypeScript
published: true
---
## Component Composition and Advanced Modularity

Scalability in modern UI development relies on establishing strict architectural boundaries in client-side code. The traditional distinction between *Smart* and *Dumb* components evolves towards domain-oriented design patterns and strict composition using advanced TypeScript typing.

### Composition Patterns and Compound Components
The Compound Components pattern allows building component families that share implicit state through a strongly typed React context, exposing a clean and declarative API to the consumer:

```typescript
import React, { createContext, useContext, useState } from 'react';

type AccordionContextType = {
  activeIndex: number | null;
  toggleIndex: (index: number) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be wrapped within an <Accordion /> root.');
  }
  return context;
};

interface AccordionProps {
  readonly children: React.ReactNode;
  readonly defaultIndex?: number;
}

export const Accordion: React.FC<AccordionProps> = ({ children, defaultIndex = null }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
  const toggleIndex = (index: number) => setActiveIndex(prev => (prev === index ? null : index));

  return (
    <AccordionContext.Provider value={{ activeIndex, toggleIndex }}>
      <div className="accordion-root">{children}</div>
    </AccordionContext.Provider>
  );
};
```

### Effect Encapsulation and Custom Hooks
All imperative business logic, asynchronous calls, network event subscriptions, or browser API manipulations must be extracted into pure Custom Hooks. This decouples the component's lifecycle from its visual representation.

## Global State Management and Server Synchronization

One of the costlier anti-patterns in modern frontend applications is centralizing all application state into a monolithic global store (like classic Redux). Modern architecture strictly separates the nature of data:

1. **Server State:** Data fetched from remote APIs (users, catalogs, transactions). It should not reside in the global UI store. It is managed via specialized caching, invalidation, and asynchronous revalidation libraries (like TanStack Query or SWR), eliminating complex reducers for loading states.
2. **Local and Transient UI State:** Open modals, active tabs, temporary UI filters. Handled via local component state (`useState`, `useReducer`) or lightweight atomic stores (Zustand, Jotai) when sharing across distant tree branches without cascading re-renders.
3. **Immutable Global State:** Theme preferences, authenticated user sessions. Stored securely (IndexedDB or sessionStorage) with strict selectors preventing unnecessary re-renders.

## Event Architecture and Decoupled Flows

As the component tree grows, state propagation via global events or severe prop drilling introduces rigid coupling. Implementing a typed client-side event bus enables decoupled communication between independent functional modules.

### Typed Event Bus Implementation
Using native browser primitives (`EventTarget`) combined with strict TypeScript contracts, a low-overhead Pub/Sub system can be built:

```typescript
type EventMap = {
  'cart:item-added': { sku: string; quantity: number };
  'user:session-expired': { reason: string };
};

class TypedEventBus {
  private target = new EventTarget();

  public publish<K extends keyof EventMap>(event: K, detail: EventMap[K]): void {
    const customEvent = new CustomEvent(event, { detail });
    this.target.dispatchEvent(customEvent);
  }

  public subscribe<K extends keyof EventMap>(event: K, callback: (detail: EventMap[K]) => void): () => void {
    const listener = (e: Event) => {
      callback((e as CustomEvent<EventMap[K]>).detail);
    };
    this.target.addEventListener(event, listener as EventListener);
    return () => this.target.removeEventListener(event, listener as EventListener);
  }
}

export const eventBus = new TypedEventBus();
```

## Micro-frontends vs. Multizone: Deep Analysis and Trade-offs

Choosing between runtime micro-frontends and a server-routing-based Multizone approach depends on team autonomy and isolation requirements.

### Multizone Architecture (Next.js Native)
In this model, multiple independent Next.js applications coexist under the same domain, routing requests via a reverse proxy (Nginx, Vercel Edge, Cloudflare Workers):
* **Dependency Isolation:** Each zone can use different versions of libraries or frameworks without runtime collisions.
* **Session Management:** Requires a centralized token strategy (JWT stored in cookies with shared domain `*.domain.com`).

### Module Federation Micro-frontends (Webpack 5 / Vite)
Allows sharing code modules and design system components compiled independently directly in the browser, paying strict attention to shared singleton isolation (like React).

## PWAs, Service Workers, and Advanced Offline Persistence

Resilience against connectivity drops requires a robust architecture based on the Service Worker specification and structured client-side storage.

### Lifecycle and Network Interception Strategies
* **Stale-While-Revalidate:** Instantly serves assets from local cache while executing a background network request to update the cache for the next access.
* **Background Sync:** Queues offline mutations in `IndexedDB` to dispatch automatically once connectivity is restored.

## Frontend Testing Patterns and Code Quality

Ensuring stability in complex frontend systems requires a pragmatic testing strategy, prioritizing tests close to real user behavior over synthetic line coverage.

### The Frontend Testing Pyramid
1. **Unit Tests:** Focused on pure functions, data transformation utilities, schema validators (Zod), and pure Custom Hooks (`renderHook`).
2. **Component Integration Tests:** The core foundation (Testing Library). Evaluates complex components interacting via accessibility queries (`getByRole`), simulating real user events without coupling to internal implementation details.
3. **End-to-End (E2E) Tests:** Critical business flows executed in real browsers using modern frameworks (Playwright or Cypress), validating full integration between frontend, backend, and external services.

## Bundlers, Optimization, and Legacy Code Coexistence

Modernizing legacy frontend infrastructures requires surgical strategies to prevent initial load performance degradation (*Bundle Bloat*).

### Bundler Strangler Fig Pattern
* **Chunk Separation:** Legacy code is isolated into a specific directory and loaded via conditional dynamic imports (`import('./legacy/module')`).
* **Migration to SWC / esbuild:** Replacing slow JavaScript-based compilers (Babel) with Rust/Go engines reduces build times from minutes to seconds.