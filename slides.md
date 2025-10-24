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

<h2>All you need to start with kubernetes</h2>

---

# What is Kubernetes?

<v-clicks>

Kubernetes is an open-source container orchestration system for automating software deployment, scaling, and management.

</v-clicks>

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

## Let's use the glorified podman

<v-click>

```shell
kubectl run -it --image=alpine iwannabeubuntu sh
```

<man command="kubectl run">
Create and run a particular image in a pod.
</man>

</v-click>

<v-click>

```shell
kubectl get pods
```

<man command="kubectl get">
Display one or many resources.
</man>

</v-click>

---

# Why should I use Kubernetes?

<div class="text-7 mt-10">
<v-clicks>

- Standardization
- Huge market share
- Declarative approach

</v-clicks>
</div>

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

<<< @/snippets/pod-echo-server.yaml yaml[resource.yaml]{hide|all}{lines:true}

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

## Administrator requests cluster change

<br/>

<<< @/snippets/diagrams/kubeapi.mermaid mermaid

---
layout: center
class: text-center
---

## Operator updates cluster status according to desired one

<br/>

<<< @/snippets/diagrams/controller.mermaid mermaid {scale: 0.65}

---

# Pods

<<< @/snippets/pod-echo-server.yaml yaml {\*}{lines:true}

---
layout: coming-soon
---

# Services

---
layout: coming-soon
---

# Deployments

---
hideInToc: true
---

## Table of contents

<Toc maxDepth="1" columns="1"/>

---
layout: outro
---
