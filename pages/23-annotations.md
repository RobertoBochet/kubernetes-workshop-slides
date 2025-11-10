---
layout: two-cols
title: Annotations
routeAlias: annotations
---

# [Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)

They introduce the flexibility of `CRDs` to the built-in `RDs`

<v-clicks>

`Annotations` are a set of key/value pairs that can be defined for any resource in the `metadata` field

They can be read and processed by tools and controllers, enabling them to modify their behavior based on these values

</v-clicks>

::right::

<<<@/snippets/manifests/annotations/configmap-echo-server-annotated.yaml yaml[configmap-echo-server-annotated.yaml]{5-7}{lines:true}
