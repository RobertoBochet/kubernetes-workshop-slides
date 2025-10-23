---
title: Kubernetes Workshop
info: |
  Slides for the Kubernetes workshop
  POuL sysadmin internal course
author: Roberto Bochet <avrdudo@poul.org>
keywords: kubernetes,sysadmin,workshop

theme: default

transition: slide-left

drawings:
  presenterOnly: true
presenter: dev
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
layout: image-right
image: ./kubernetes-bg.svg
class: text-center
---

# Kubernetes Workshop

## All you need to start with kubernetes

Roberto Bochet &lt;avrdudo@poul.org&gt;

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
    <a href="https://github.com/RobertoBochet/kubernetes-workshop-slides" target="_blank" class="slidev-icon-btn">
        <carbon:logo-github />
    </a>
</div>

---

# What is Kubernetes?

---

# Why should you use Kubernetes?

---

# How can I **safely** test Kubernetes?

<v-click>

## [Minikube](https://minikube.sigs.k8s.io/docs/)

...sets up a **development** cluster directly on your machine using **containers**, or **VMs**

</v-click>

<v-click>

```shell
minikube start --nodes 3
```

It will deploy a kubernetes cluster composed of 3 nodes

</v-click>

---
layout: two-cols-header
---

<div class="text-center">

## Imperative vs Declarative

</div>

<br/>

::left::

<p v-click="1">I specify a task to be executed</p>

<i v-click="3">e.g., "Clean the room!"</i>

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
layout: center
class: text-center
---

## Administrator requests cluster change

<br/>

```mermaid {scale: 0.8}
sequenceDiagram
    actor Admin as Administrator
    participant API as Kubernetes API
    participant Database@{ "type" : "database" }

Admin->>+API: kubectl apply -f resource.yaml
API->>API: Schema validation
API->>+Database: UPDATE
Database--)-API: Done
API--)-Admin: Done
```

---
layout: center
class: text-center
---

## Operator updates cluster status according to desired one

<br/>

```mermaid {scale: 0.65}
sequenceDiagram
    participant Controller as Controller
    participant API as Kubernetes API
    participant Database@{ "type" : "database" }
participant Node as Kubernetes Node

Controller->>+API: Requests desired status
API->>+Database: GET
Database--)-API: Response
API--)-Controller: Desired status
Controller<<->>Node: Verifies real status
Controller->>Node: Makes changes
Controller->>+API: Update real cluster status
API->>+Database: UPDATE
Database--)-API: Done
API--)-Controller: Done
```

---
layout: center
class: text-center
---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev) · [Showcases](https://sli.dev/resources/showcases)

<PoweredBySlidev mt-10 />
