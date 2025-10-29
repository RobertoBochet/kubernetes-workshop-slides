---
layout: two-cols
transition: fade
title: Deployments
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
