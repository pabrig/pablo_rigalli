---
title: "Escalabilidad Frontend y Federación de Módulos"
description: "Arquitectura de microfrontends, integración en tiempo de ejecución mediante Module Federation (Webpack/Vite), optimización de Core Web Vitals y estrategias de comunicación."
chapter: frontend
order: 3
tags:
  - Frontend
  - Microfrontends
  - React
  - Performance
  - Module Federation
published: true
---

## Arquitectura de Microfrontends y desacoplamiento de equipos

A medida que las organizaciones crecen y múltiples equipos multifuncionales desarrollan sobre una misma aplicación web, los monolitos frontend tradicionales sufren de cuellos de botella en el despliegue, colisiones en el control de versiones y tiempos de compilación insostenibles. La arquitectura de microfrontends extiende los principios de microservicios hacia el navegador, permitiendo que equipos independientes desarrollen, prueben y desplieguen porciones autónomas de la interfaz de usuario (*MFEs*).

Existen dos enfoques principales de integración:
* **Integración en Tiempo de Compilación (Build-time):** Cada microfrontend se publica como un paquete NPM que el contenedor principal instala. Requiere redesplegar la aplicación contenedora completa ante cualquier actualización de un microfrontend.
* **Integración en Tiempo de Ejecución (Run-time):** El contenedor y los microfrontends se despliegan de forma totalmente independiente. El contenedor carga los fragmentos remotos dinámicamente bajo demanda utilizando tecnologías como *Module Federation*.

## Federación de Módulos (Webpack 5 / Vite)

La Federación de Módulos permite que una aplicación JavaScript (el *host*) cargue dinámicamente código consumido desde otra aplicación independiente (el *remote*) en tiempo de ejecución. El mayor desafío técnico radica en la compartición eficiente de dependencias globales (como `react` o `react-dom`) para evitar duplicaciones masivas en memoria y fallos de hooks por múltiples instancias de React.

```javascript
// Configuración en el Host (Webpack 5)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        checkoutMfe: "checkoutMfe@https://checkout.enterprise.com/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};
```

La propiedad `singleton: true` garantiza que, aunque el *host* y el *remote* utilicen versiones ligeramente distintas compatibles, el runtime cargará una única instancia compartida de React en el navegador.

## Optimización de rendimiento y Core Web Vitals a escala

Integrar múltiples microfrontends incrementa el riesgo de degradación en los *Core Web Vitals* si no se gobiernan estrictamente métricas críticas:
* **Largest Contentful Paint (LCP):** Las hojas de estilo y los chunks remotos críticos deben precargarse (*preconnect* y *preload*) para evitar bloqueos en el renderizado inicial del DOM.
* **Cumulative Layout Shift (CLS):** Los microfrontends cargados de forma asíncrona deben reservar espacio explícito en el DOM mediante skeletons o contenedores de altura fija para prevenir saltos visuales repentinos cuando el remoto termina de hidratarse.
* **Interaction to Next Paint (INP):** Mantener liviano el hilo principal (*main thread*) evitando la ejecución simultánea de pesadas inicializaciones en múltiples remotos.

## Estrategias de comunicación entre microfrontends

Para mantener el desacoplamiento estricto, los microfrontends no deben importar componentes ni estados internos directamente entre sí. La comunicación debe regirse mediante contratos explícitos:

1. **Eventos Globales del DOM (Custom Events):** Útiles para notificaciones globales desacopladas (ej. cambios en el estado de autenticación del usuario).
2. **Contexto de Navegación URL:** Parámetros de consulta (*query params*) o rutas hijas gestionadas por el enrutador principal.
3. **Contratos TypeScript compartidos:** Paquetes internos de tipos para estandarizar los payloads emitidos y consumidos.