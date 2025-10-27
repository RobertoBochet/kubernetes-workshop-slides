---
title: Kubernetes Workshop
info: |
  Slides for the Kubernetes workshop
  POuL sysadmin internal course
author: Roberto Bochet <avrdudo@poul.org>
keywords: kubernetes,sysadmin,workshop
sourceCode: https://github.com/RobertoBochet/kubernetes-workshop-slides

theme: default

transition: slide-left

drawings:
  presenterOnly: true
presenter: true
browserExporter: false
download: true
export:
  format: pdf
  timeout: 30000
  dark: true
  withClicks: false
  withToc: false

remoteAssets: build

colorSchema: dark

###############################
layout: intro
image: ./kubernetes-bg.svg
hideInToc: true
---

<h2>All you need to start with Kubernetes</h2>

---

# What is Kubernetes?

<v-clicks>

Kubernetes is an open-source container orchestration system for automating software deployment, scaling, and management.

</v-clicks>

---

# How can I **safely** test Kubernetes?

<v-click>

## [Minikube](https://minikube.sigs.k8s.io/docs/)

...creates a test cluster right on your computer using either **containers** or **VMs**

</v-click>

<v-click>

```shell
minikube start --nodes 3
```

This deploys a development Kubernetes cluster composed of 3 nodes

</v-click>

<div class="pt-6" />

<v-click>

```shell
kubectl get nodes
```

To check if the 3 nodes are correctly set up

</v-click>

<man command="kubectl" v-click>
kubectl controls the Kubernetes cluster manager.
</man>

---

## Let's use the glorified podman

<div class="pt-6" />

<v-click>

```shell
kubectl run -it --image=alpine iwannabeubuntu sh
```

<man command="kubectl run">
Create and run a particular image in a pod.
</man>

</v-click>

<div class="pt-6" />

<v-click>

```shell
kubectl get pods
```

<man command="kubectl get">
Display one or many resources.
</man>

</v-click>

<v-click>
  <p class="text-8 pt-10">That's it? Then why use Kubernetes?</p>
</v-click>

---
layout: two-cols-header
title: Useful definitions
---

<div class="text-center">

# Imperative vs Declarative

</div>

<br/>

::left::

<p v-click="1">I specify a task to be executed</p>

<i v-click="3">e.g., "Clean the room"</i>

<p v-click="5">You have to perform the required task,
and once completed,
it's no longer your responsibility</p>

<div v-click="7" class="grid grid-cols-2 gap-4 pt-10 px-20 text-center">
    <div>
        <img src="/icons/ansible.svg" alt="ansible logo" class="h-20 mx-auto" />
        <p>Ansible</p>
    </div>
    <div>
        <img src="/icons/podman.svg" alt="podman logo" class="h-20 mx-auto" />
        <p class="text-center">Podman</p>
    </div>
</div>

::right::

<p v-click="2">I declare a desired state</p>

<i v-click="4">e.g., "The room must be clean"</i>

<p v-click="6">You have to maintain the desired state until a new state is declared</p>

<div v-click="8" class="grid grid-cols-2 gap-4 pt-10 px-20 text-center">
    <div>
        <img src="/icons/opentofu.svg" alt="opentofu logo" class="h-20 mx-auto" />
        <p>OpenTofu<br/><small>(Terraform)</small></p>
    </div>
    <div>
        <img src="/icons/kubernetes.svg" alt="kubernetes logo" class="h-20 mx-auto" />
        <p class="text-center">Kubernetes</p>
    </div>
</div>

---

# Kubernetes resources

These are defined by `yaml` manifests

```yaml {none|1|2|3-5|6|all}{lines: true}
apiVersion: <api_version>
kind: <kind_of_resource>
metadata:
  name: <resource_name>
  # other metadata
# resource specification
```

<<< @/snippets/manifests/pod-echo-server.yaml yaml[resource.yaml]{hide|all}{lines:true}

---

## Create a resource

```shell
kubectl apply -f resource.yaml
```

<man command="kubectl apply">
Apply a configuration to a resource by file name or stdin.
The resource name must be specified.<br/>
This resource will be created if it doesn't exist yet.<br/><br/>
JSON and YAML formats are accepted.
</man>

---
layout: center
class: text-center
---

## You require a resource...

<div class="pt-4"></div>

<<< @/snippets/diagrams/kubeapi.mermaid mermaid {scale: 0.95}

---
layout: center
class: text-center
---

## ...a controller provisions it

<div class="pt-4"></div>

<<< @/snippets/diagrams/controller.mermaid mermaid {scale: 0.65}

---

## Operator pattern

<div class="pt-4" />

This is what makes Kubernetes really powerful

<span v-click>You require a resource...</span> <span v-click><carbon-arrow-right class="mb-[-4px]" /> ...a controller provisions it</span>

<p v-click class="text-5 pt-20">A little spoiler:</p>
<p v-after class="font-italic">Relying on this mechanism, you can extend the Kubernetes functionality,<br/>creating custom resource schemas and controllers.</p>

<p v-click>We'll come back to it later</p>

---

# So, why should I use Kubernetes?

<div class="text-7 mt-10">
<v-clicks>

- It's the industry standard
- Everyone's using it
- Tell it what you want, not how to do it
- You can extend it however you need <small>(through the operator pattern)</small>

</v-clicks>
</div>

---
layout: two-cols
---

# [Pods](https://kubernetes.io/docs/concepts/workloads/pods/)

They are the smallest deployable units of computing that you can create and manage in Kubernetes

::right::

<<< @/snippets/manifests/pod-echo-server.yaml yaml[pod-echo-server.yaml]{hide|all|1-2|3-4|6-11|7|8|9-11|12|all}{lines:true}

<!--
[click:2] `apiVersion` and `kind`

[click] `metadata`

[click] `containers`

[click] `name`

[click] `image`

[click] `ports`

[click] `restartPolicy`

```shell
kubectl apply -f pod-echo-server.yaml
kubectl get pods -o wide
kubectl run -it --image=alpine/curl --rm --restart=Never ottenitore -- http://<ip-pod-echo-server> | jq
```
-->

---
layout: two-cols
transition: fade
---

# [Services](https://kubernetes.io/docs/concepts/services-networking/service/)

They act as an abstraction layer that exposes the applications in the running pods to other services or external clients.<br/>
They provide a stable endpoint and load balancing features for accessing pods within the cluster

::right::

<<< @/snippets/manifests/service-echo-server.yaml yaml[service-echo-server.yaml]{hide|all|1-2|3-4|6|9-12|7-8|all}{lines:true}

<!--
[click:2] `apiVersion` and `kind`

[click] `metadata`

[click] `type`

[click] `ports`

[click] Pay attention on `selector` field

```shell
kubectl apply -f service-echo-server.yaml
kubectl get services -o wide
kubectl run -it --image=alpine/curl --rm --restart=Never ottenitore -- http://echo-server:8080 #error: Could not connect to server
```
-->

---
transition: fade
---

## [Labels and Selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)

<v-click>

**Labels** are key/value pairs that are attached to objects such as Pods.

</v-click>

```yaml{hide|all}{lines: true}
labels:
  app: echo-server
  tier: frontend
  environment: production
```

<v-click>

**Selectors** are used to target a group of objects that match a specified set of labels

</v-click>

```yaml{hide|all}{lines: true}
selector:
  matchLabels:
    app: echo-server
    environment: production
```

<v-click>

`matchLabels` targets resources that match all specified labels;<br/>
`matchExpressions` lets you use more complex logic based on labels

</v-click>

---
layout: two-cols
transition: fade
hideInToc: true
---

# [Services](https://kubernetes.io/docs/concepts/services-networking/service/)

So, the pod we want to expose needs labels that match the service selector

::right::

````md magic-move[pod-echo-server.yaml]{lines:true}
<<< @/snippets/manifests/pod-echo-server.yaml yaml{all}

<<< @/snippets/manifests/pod-echo-server-labels.yaml yaml{5-6|all}
````

<!--
[click] `labels`

```shell
kubectl apply -f pod-echo-server-labels.yaml
kubectl run -it --image=alpine/curl --rm --restart=Never ottenitore -- http://echo-server:8080 | jq
```
-->

---
layout: two-cols
hideInToc: true
---

# [Services](https://kubernetes.io/docs/concepts/services-networking/service/)

A `ClusterIP` service can't be reached from outside the cluster.<br/>
To expose it externally, use a `NodePort` service.

<small v-click="4">Available service types in addition to the default [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/#type-clusterip) are [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport), [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer), and [ExternalName](https://kubernetes.io/docs/concepts/services-networking/service/#externalname)</small>

<small v-click="6">Note: Kubernetes only allows node ports in the range 30000-32767 by default</small>

::right::

<v-click>

````md magic-move[service-node-port-echo-server.yaml]{lines:true}
<<< @/snippets/manifests/service-echo-server.yaml yaml{all}

<<< @/snippets/manifests/service-node-port-echo-server.yaml yaml{all|6|6|13|13|all}
````

</v-click>

<!--
[click] Old ClusterIP service

[click] New NodePort service

[click] `type`

[click:2] `nodePort`

```shell
kubectl apply -f service-node-port-echo-server.yaml
kubectl get nodes -o wide
curl http://<node-ip>:30808 | jq
```
-->

---
layout: two-cols
transition: fade
---

# [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

These manages a set of Pods to run an application workload, usually one that doesn't maintain state.

<small v-click="5">Deployments and pods are bound by the Labels/Selectors system</small>

<small v-click="8">Note: deployments do not directly create pods; they use an intermediate resource called [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)</small>

::right::

<<< @/snippets/manifests/deployment-echo-server.yaml yaml[deployment-echo-server.yaml]{hide|all|1-2|3-4|10-22|7-9,13-14|6|all}{lines: true}

<!--
[click:2] `apiVersion` and `kind`

[click] `metadata`

[click] `template`

[click] `selector` and `labels`

[click] `replicas`

```shell
kubectl delete pods/echo-server # remove old pod
kubectl apply -f deployment-echo-server.yaml
kubectl get deployments
kubectl get pods -o wide
curl http://<node-ip>:30808
kubectl delete pods/echo-server-##########-#####
kubectl get pods -o wide
kubectl get pods -o wide
curl http://<node-ip>:30808 # curl still works
```
-->

---
hideInToc: true
---

# [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

Deployments are one of the Kubernetes resources that help ensure Highly Availability(HA) of services

<v-click>

```shell
kubectl scale --replicas 1 deployment echo-server
```

<man command="kubectl scale">
Set a new size for a deployment, replica set, replication controller, or stateful set.
</man>

</v-click>

<!--
```shell
kubectl scale --replicas 1 deployment echo-server
kubectl get deployments
kubectl get pods -o wide
kubectl scale --replicas 9 deployment echo-server
kubectl get deployments
kubectl get pods -o wide
curl http://<node-ip>:30808
kubectl scale --replicas 3 deployment echo-server
```
-->

---
hideInToc: true
---

## Table of contents

<Toc maxDepth="1" columns="1"/>

---
layout: outro
---
