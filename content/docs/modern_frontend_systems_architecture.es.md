---
title: "Arquitectura de Sistemas Frontend Modernos"
description: "Patrones avanzados de composición de componentes, gestión de estado, eventos desacoplados, micro-frontends, PWAs y estrategias de testing en frontend."
chapter: frontend
order: 1
tags:
  - Frontend
  - Arquitectura
  - React
  - TypeScript
published: true
---
## Composición de componentes y modularidad avanzada

La escalabilidad en el desarrollo de interfaces modernas depende de la capacidad de establecer límites arquitectónicos estrictos en el código del cliente. La distinción tradicional entre componentes *Smart* (con lógica y estado) y *Dumb* (puramente presentacionales) evoluciona hacia patrones de diseño orientados a dominios y composición estricta mediante tipado avanzado en TypeScript.

### Patrones de Composición y *Compound Components*
El patrón de *Compound Components* (Componentes Compuestos) permite construir familias de componentes que comparten un estado implícito a través de un contexto de React fuertemente tipado, exponiendo una capa declarativa y limpia al consumidor:

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

### Encapsulación de efectos y *Custom Hooks*
Toda la lógica de negocio imperativa, llamadas asíncronas, suscripciones a eventos de red o manipulación de APIs del navegador debe extraerse obligatoriamente a *Custom Hooks* puros. Esto desacopla el ciclo de vida del componente de su representación visual.

## Gestión de estado global y sincronización con servidor

Uno de los anti-patrones más costosos en aplicaciones frontend modernas es centralizar absolutamente todo el estado de la aplicación en un store global monolítico (como Redux clásico). La arquitectura moderna separa tajantemente la naturaleza de los datos:

1. **Estado de Servidor (*Server State*):** Datos obtenidos de APIs remotas (usuarios, catálogos, transacciones). No deben residir en el store global de UI. Se gestionan mediante librerías especializadas en caché, invalidación y revalidación asíncrona (como TanStack Query o SWR). Esto elimina la necesidad de *Reducers* complejos para manejar estados de carga (`isLoading`, `isError`, `data`).
2. **Estado de UI Local y Transitorio:** Modales abiertos, pestañas activas, filtros de UI temporales. Se gestionan mediante estado local de componente (`useState`, `useReducer`) o stores ligeros y atómicos (como Zustand o Jotai) si requieren compartirse entre ramas distantes del árbol sin provocar re-renders en cascada.
3. **Estado Global Inmutable:** Preferencia de tema, sesión de usuario autenticado. Se almacena con persistencia segura (IndexedDB o sessionStorage) y selectores estrictos que evitan renderizados innecesarios.

## Arquitectura de eventos y flujos desacoplados

A medida que el árbol de componentes crece, la propagación de estados mediante eventos globales o *prop drilling* severo introduce acoplamiento rígido. La implementación de un bus de eventos tipado en el cliente permite la comunicación desacoplada entre módulos funcionales independientes.

### Implementación de un Bus de Eventos Tipado
Utilizando las primitivas nativas del navegador (`EventTarget`) combinadas con contratos estrictos en TypeScript, es posible construir un sistema Pub/Sub de baja sobrecarga:

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

## Micro-frontends vs. Multizone: Análisis Profundo y Trade-offs

La elección entre una arquitectura de micro-frontends en tiempo de ejecución y una aproximación *Multizone* basada en ruteo de servidor depende de los requerimientos de aislamiento y velocidad de entrega de los equipos.

### Arquitectura Multizone (Next.js Native)
En este modelo, múltiples aplicaciones Next.js independientes conviven bajo el mismo dominio, enrutando peticiones mediante un proxy inverso (como Nginx, Vercel Edge o Cloudflare Workers):
* **Aislamiento de Dependencias:** Cada zona puede utilizar versiones diferentes de librerías o frameworks sin colisiones en el runtime.
* **Gestión de Sesión:** Requiere una estrategia centralizada de tokens (JWT almacenados en cookies con dominio compartido `*.dominio.com`).

### Micro-frontends por Module Federation (Webpack 5 / Vite)
Permite compartir módulos de código y componentes de diseño compilados de forma independiente directamente en el navegador del cliente, guardando estricta cautela con el aislamiento de singletons compartidos (como React).

## PWA, Service Workers y persistencia offline avanzada

La resiliencia ante cortes de conectividad requiere una arquitectura robusta basada en la especificación Service Worker y almacenamiento estructurado en el cliente.

### Ciclo de vida y estrategias de interceptación de red
* **Stale-While-Revalidate:** Se sirve inmediatamente el recurso desde la caché local mientras en segundo plano se ejecuta la petición de red para actualizar la caché de cara al siguiente acceso.
* **Background Sync:** Permite encolar mutaciones realizadas sin conexión en `IndexedDB` para despacharlas automáticamente al recuperar conectividad.

## Patrones de testing frontend y calidad de código

Garantizar la estabilidad de sistemas frontend complejos exige una estrategia de pruebas pragmática, priorizando la cercanía de los tests al comportamiento real del usuario por encima de la cobertura sintáctica de líneas.

### La Pirámide de Pruebas en Frontend
1. **Pruebas Unitarias:** Enfocadas en funciones puras, utilidades de transformación de datos, validadores de esquemas (Zod) y *Custom Hooks* puros (utilizando `renderHook`).
2. **Pruebas de Integración de Componentes:** La base fundamental (Testing Library). Evalúan componentes complejos interactuando con su entorno mediante consultas orientadas a accesibilidad (`getByRole`, `getByLabelText`), simulando eventos reales del usuario sin acoplarse a detalles de implementación internos (como estados privados o métodos de clases).
3. **Pruebas End-to-End (E2E):** Flujos críticos de negocio ejecutados en navegadores reales mediante frameworks modernos (Playwright o Cypress), validando la integración completa entre frontend, backend y pasarelas de pago o servicios externos.

## Bundlers, optimización y convivencia con código legacy

La modernización de infraestructuras frontend legadas exige estrategias quirúrgicas para evitar la degradación del rendimiento de carga inicial (*Bundle Bloat*).

### Patrón de Estrangulamiento de Bundlers (*Strangler Fig Pattern*)
* **Separación de Chunks:** El código legacy se aísla en un directorio específico y se carga mediante importaciones dinámicas condicionales (`import('./legacy/module')`).
* **Migración a SWC / esbuild:** Reemplazar compiladores lentos basados en JavaScript (Babel) por motores escritos en Rust/Go reduce los tiempos de compilación de minutos a segundos.