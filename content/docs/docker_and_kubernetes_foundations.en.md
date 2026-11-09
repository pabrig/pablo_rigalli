---
title: "Docker and Kubernetes Foundations"
description: "A practical guide to containerization with Docker, multi-stage Dockerfiles, and scalable orchestration using Kubernetes."
chapter: contenedores
order: 1
tags:
  - Docker
  - Kubernetes
  - Infraestructura
  - Contenedores
published: true
---

## Context and the Packaging Problem

Modern software engineering requires guaranteed reproducibility across development, testing, and production environments. The classic "it works on my machine" issue arises when host operating system dependencies, shared libraries, or runtime versions differ between a developer's local machine and the deployment target.

### Containers vs. Virtual Machines

Unlike traditional Virtual Machines (VMs) that emulate complete hardware architectures—including a full Guest OS and hypervisor overhead—containers virtualize at the operating system level.

Containers rely directly on native Linux kernel capabilities:

* **Namespaces:** Isolate system resources (PID, NET, MNT, IPC, UTS) so processes inside a container only see their own isolated environment.
* **Control Groups (cgroups):** Restrict, prioritize, and monitor physical resource usage (CPU, memory, disk I/O) assigned to a process group.

This architecture enables multiple containers to share the host OS kernel, eliminating Guest OS overhead and allowing container startup times in milliseconds.

## Containerization with Docker

### Efficient and Secure Image Building

A `Dockerfile` serves as a declarative blueprint defining the instructions to build a container image. Applying official optimization guidelines maximizes both efficiency and supply chain security:

1. **Leveraging BuildKit:** Docker's modern build engine that parallelizes build stages and optimizes layer caching.
2. **Layers and Layer Caching:** Every instruction (`RUN`, `COPY`, `ADD`) creates an immutable layer. Ordering is critical: frequently changing code should be placed near the bottom, while stable dependencies stay near the top to leverage cache reuse.
3. **Non-Root Security Model:** Processes inside containers should never run as `root`. Explicitly create and switch to a non-privileged user.
4. **Minimal Base Images:** Use lightweight distributions or *Distroless* images to shrink attack vectors and cut down final image size.

```typescript
// Example multi-stage build structure
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root group and user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Persistence and Networking Management

* **Volumes (`volumes`):** Managed completely by Docker inside host storage (`/var/lib/docker/volumes/`). Recommended for persisting state across container lifecycles.
* **Bind Mounts:** Mount a specific path or file from the host filesystem directly into the container. Useful during local development (hot-reloading) but creates tight coupling to host path structures.
* **Docker Networks:** The default `bridge` driver sets up a virtual private network where containers resolve each other by container name via internal DNS, isolating external traffic.

## Orchestration with Kubernetes

As applications scale across dozens or hundreds of containers spread across multiple host nodes, manual management becomes impossible. Kubernetes automates deployment, scaling, and container operations.

### Architecture and the Declarative Model

Kubernetes operates on a **declarative model** powered by a continuous **reconciliation loop**, constantly comparing current cluster state against the desired state declared in manifests.

* **Control Plane:** The control brain of the cluster. Composed of `API Server` (entry point), `etcd` (distributed key-value store holding cluster state), `Scheduler` (assigns pods to worker nodes), and `Controller Managers` (enforce actual state matching desired state).
* **Worker Nodes:** Nodes executing workloads. Run `Kubelet` (agent communicating with the Control Plane), `Kube-proxy` (network routing rules), and the Container Runtime (e.g., containerd).
* **The Pod:** The smallest deployable unit in Kubernetes. A Pod encapsulates one or more containers sharing network namespaces, storage volumes, and an IP address.

### Lifecycle and Workload Management

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

* **Deployment:** Manages stateless pod replicas, handling zero-downtime rolling updates and automated rollbacks.
* **StatefulSet:** Designed for stateful workloads, providing stable network identities and ordered persistent storage bindings.
* **Service & Ingress:** A `Service` abstracts internal pod IP addressing into stable entrypoints (`ClusterIP`, `NodePort`, `LoadBalancer`). An `Ingress` manages Layer 7 HTTP/HTTPS routing from outside the cluster.

## Resilience, Observability, and Resource Governance

To ensure high availability and prevent cascade failures:

* **Health Probes:** *Liveness Probes* restart hung containers; *Readiness Probes* remove pods that are still warming up or overloaded from service endpoints.
* **Requests and Limits:** Strict resource definitions prevent pods from hogging node capacity, avoiding node eviction events and CPU throttling.