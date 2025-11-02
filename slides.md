---
title: Kubernetes Workshop
info: |
  Slides for the Kubernetes workshop
  POuL sysadmin internal course
author: Roberto Bochet <avrdudo@poul.org>
keywords: kubernetes,sysadmin,workshop
sourceCode: https://github.com/RobertoBochet/kubernetes-workshop-slides
license: CC-BY-SA-4.0

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
  withToc: true

remoteAssets: build

colorSchema: auto

###############################
layout: intro
image: ./kubernetes-bg.svg
hideInToc: true
---

<div class="mt-[-50px]">All you need to start with Kubernetes</div>

---
src: ./pages/00-overview.md
---

---
src: ./pages/10-pods.md
---

---
src: ./pages/11-services.md
---

---
src: ./pages/12-deployments.md
---

---
src: ./pages/13-configmaps-secrets.md
---

---
src: ./pages/14-namespaces.md
---

---
src: ./pages/20-helm.md
---

---
hideInToc: true
---

# Table of contents

<Toc maxDepth="1" columns="1"/>

---
layout: outro
---
