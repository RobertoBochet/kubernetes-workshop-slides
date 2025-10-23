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
image: ./kubernetes-bg.png
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

## Minikube[^1]

...sets up a **development** cluster directly on your machine using **containers**, or **VMs**

</v-click>

<v-click>

```shell
minikube start --nodes 3
```

It will deploy a kubernetes cluster composed of 3 nodes

</v-click>

<v-click>

[^1]: https://minikube

</v-click>

---
layout: center
class: text-center
---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev) · [Showcases](https://sli.dev/resources/showcases)

<PoweredBySlidev mt-10 />
