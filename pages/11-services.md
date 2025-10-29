---
layout: two-cols
transition: fade
title: Services
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
hideInToc: true
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
