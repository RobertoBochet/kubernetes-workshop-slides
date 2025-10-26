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
- You can extend it however you need (through the Operator pattern)

</v-clicks>
</div>

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
