---
title: "Frontend Scalability and Module Federation"
description: "Microfrontend architecture, runtime integration using Module Federation (Webpack/Vite), Core Web Vitals optimization, and communication strategies."
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

As organizations scale and multiple cross-functional teams build on the same web application, traditional monolithic frontends face deployment bottlenecks, version control conflicts, and unacceptable build times. Microfrontend architecture extends microservice principles into the browser, allowing independent teams to build, test, and deploy autonomous user interface slices (*MFEs*).

There are two primary integration strategies:
* **Build-time Integration:** Each microfrontend is published as an NPM package that the shell application installs. Updating any microfrontend requires a full redeployment of the main shell application.
* **Run-time Integration:** The shell container and individual microfrontends are deployed completely independently. The shell dynamically loads remote fragments on demand using runtime technologies such as *Module Federation*.

## Federación de Módulos (Webpack 5 / Vite)

Module Federation enables a JavaScript application (the *host*) to dynamically load and execute code consumed from another independent application (the *remote*) at runtime. The key technical challenge is sharing global dependencies (such as `react` or `react-dom`) efficiently to prevent massive memory duplication and hook execution crashes caused by multiple React runtime instances.

```javascript
// Host configuration (Webpack 5)
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

Setting `singleton: true` ensures that even if host and remotes declare compatible semver ranges, the runtime forces a single shared instance of React in the browser context.

## Optimización de rendimiento y Core Web Vitals a escala

Assembling multiple microfrontends increases the risk of degrading *Core Web Vitals* unless critical metrics are strictly governed:
* **Largest Contentful Paint (LCP):** Critical remote chunks and external stylesheets must be preloaded (*preconnect* and *preload*) to avoid blocking initial DOM rendering.
* **Cumulative Layout Shift (CLS):** Asynchronously loaded microfrontends must reserve explicit DOM space using skeletons or fixed-height containers to prevent sudden layout shifts when remotes finish hydrating.
* **Interaction to Next Paint (INP):** Keep the browser main thread unblocked by avoiding simultaneous heavy initialization across multiple remotes.

## Estrategias de comunicación entre microfrontends

To maintain strict decoupling, microfrontends should not import internal states or components directly from one another. Inter-MFE communication must adhere to explicit boundary contracts:

1. **Global DOM Events (Custom Events):** Ideal for decoupled global notifications (e.g., user authentication state changes).
2. **URL Navigation Context:** Query parameters or nested sub-routes managed by the primary shell router.
3. **Shared TypeScript Contracts:** Internal type definition packages to standardize emitted and consumed event payloads.