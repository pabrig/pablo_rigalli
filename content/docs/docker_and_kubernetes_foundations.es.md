---
title: "Fundamentos de Docker y Kubernetes"
description: "Guía práctica de contenedores con Docker, Dockerfiles multi-stage y orquestación escalable mediante Kubernetes."
chapter: contenedores
order: 1
tags:
  - Docker
  - Kubernetes
  - Infraestructura
  - Contenedores
published: true
---

## Contexto y el problema del empaquetado

El desarrollo moderno de software exige garantías de reproducibilidad entre entornos de desarrollo, pruebas y producción. El clásico dilema del "funciona en mi máquina" surge cuando las dependencias del sistema operativo, bibliotecas compartidas o versiones de runtime difieren entre la estación de trabajo del desarrollador y el servidor de despliegue.

### Contenedores vs. Máquinas Virtuales

A diferencia de las Máquinas Virtuales (VMs) tradicionales, que emulan un hardware completo incluyendo un sistema operativo invitado (Guest OS) y un hipervisor, los contenedores virtualizan a nivel de sistema operativo. 

Utilizan los mecanismos nativos del kernel de Linux:
- **Namespaces:** Aislen los recursos del sistema (PID, NET, MNT, IPC, UTS) de modo que los procesos dentro de un contenedor solo ven su propio entorno aislado.
- **Control Groups (cgroups):** Limitan, controlan y contabilizan el uso de recursos de hardware (CPU, memoria, E/S de disco) asignados a un grupo de procesos.

Esta arquitectura permite que múltiples contenedores compartan el mismo kernel del sistema operativo host, eliminando la sobrecarga de recursos de un Guest OS y permitiendo arranques en milisegundos.

## Contenedorización con Docker

### Construcción eficiente y segura de imágenes

Un `Dockerfile` es el manifiesto declarativo que define los pasos para construir una imagen de contenedor. Para maximizar la eficiencia y seguridad, se deben aplicar las especificaciones oficiales de optimización:

1. **Uso de BuildKit:** El motor de compilación moderno de Docker que paraleliza etapas y optimiza el almacenamiento en caché.
2. **Capas (Layers) y Layer Caching:** Cada instrucción (`RUN`, `COPY`, `ADD`) genera una capa inmutable. El orden de las instrucciones es crítico: los cambios en archivos estáticos o dependencias deben colocarse al final para aprovechar la caché de las capas base estables.
3. **Seguridad y Usuario Non-Root:** Nunca se debe ejecutar procesos como usuario `root` dentro del contenedor. Se debe declarar explícitamente un usuario sin privilegios.
4. **Imágenes Base Mínimas:** Utilizar distribuciones ligeras o imágenes *Distroless* para reducir la superficie de ataque y el tamaño de la imagen.

```dockerfile
# Etapa 1: Compilación (Build stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Ejecución de producción (Runtime stage)
FROM node:20-alpine AS runner
WORKDIR /app

# Crear un usuario y grupo sin privilegios por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Gestión de persistencia y redes

* **Volúmenes (`volumes`):** Gestionados íntegramente por Docker, almacenados en una zona aislada del host (`/var/lib/docker/volumes/`). Son el mecanismo recomendado para persistir datos más allá del ciclo de vida del contenedor.
* **Bind Mounts:** Montan un directorio o archivo específico del host directamente en el contenedor. Son útiles para desarrollo local (hot-reloading) pero introducen acoplamiento con la estructura del host.
* **Redes Docker:** El driver `bridge` crea una red privada virtual donde los contenedores se comunican por nombre mediante resolución DNS interna, aislando el tráfico externo.

## Orquestación con Kubernetes

Cuando las aplicaciones escalan a decenas o cientos de contenedores distribuidos en múltiples nodos físicos, la gestión manual se vuelve impracticable. Kubernetes automatiza el despliegue, el escalado y las operaciones de contenedores.

### Arquitectura y el modelo declarativo

Kubernetes opera bajo un modelo **declarativo** impulsado por un bucle de control continuo (*reconciliation loop*), donde el estado actual del clúster se compara constantemente con el estado deseado especificado en los manifiestos.

- **Control Plane:** Cerebro del clúster. Compuesto por el `API Server` (puerta de entrada), `etcd` (almacenamiento clave-valor distribuido para el estado), `Scheduler` (asigna pods a nodos) y `Controller Managers` (aseguran que el estado actual coincida con el deseado).
- **Worker Nodes:** Nodos que ejecutan las cargas de trabajo. Contienen el `Kubelet` (agente que se comunica con el Control Plane), `Kube-proxy` (gestión de redes y reglas de iptables) y el Container Runtime (ej. containerd).
- **El Pod:** La unidad atómica de despliegue en Kubernetes. Un Pod encapsula uno o más contenedores que comparten almacenamiento, dirección IP y espacios de nombres de red.

### Ciclo de vida y gestión de cargas de trabajo

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service-deployment
  labels:
    app: api-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api
        image: myregistry.azurecr.io/api-service:v1.2.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

- **Deployment:** Administra réplicas sin estado (`stateless`), gestionando actualizaciones continuas (`rolling updates`) y rollbacks automáticos.
- **StatefulSet:** Diseñado para aplicaciones con estado persistente, asignando identidades de red estables y almacenamiento persistente ordenado.
- **Service & Ingress:** El `Service` abstrae la IP interna de los pods exponiéndolos de forma estable (`ClusterIP`, `NodePort`, `LoadBalancer`). El `Ingress` gestiona el enrutamiento HTTP/HTTPS de capa 7 desde el exterior del clúster.

## Resiliencia, observabilidad y gobierno de recursos

Para garantizar la alta disponibilidad y evitar fallas en cascada:
- **Probes de Salud:** Las *Liveness Probes* reinician contenedores colgados; las *Readiness Probes* retiran del tráfico a pods que aún están inicializándose o saturados.
- **Requests y Limits:** La definición estricta de recursos de CPU y memoria evita que un pod monopolice el nodo, previniendo eventos de desalojo (*eviction*) y estrangulamiento (*throttling*).