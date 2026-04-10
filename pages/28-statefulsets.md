---
transition: fade
layout: two-cols
title: StatefulSets
---

# [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

They replicate a set of `Pods` and maintain a sticky identity for each of those `Pods`

<v-clicks>

`StatefulSets` provide some features that make them more suitable for deploying stateful applications than `Deployments`

Generated `Pod` names are predictable  
(e.g., _echo-server-0_, _echo-server-1_, ...)

When scaling up, `Pods` are created in order;  
the next starts only after the previous becomes _Ready_

Conversely, when scaling down, `Pods` are deleted in reverse order, one at a time, waiting for each to fully terminate

A `StatefulSet` requires an associated **headless** `Service`, to provide a sticky network identity to each `Pod`

</v-clicks>

::right::

<<< @/snippets/manifests/statefulsets/statefulset-echo-server.yaml yaml[statefulset-echo-server.yaml]{all|7|all}{lines:true,at:5}

---
transition: fade
layout: two-cols
title: Headless Services
level: 2
---

## [Headless Services](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)

They define `Services` without an associated cluster IP, enabling direct client access to individual `Pods`

<v-clicks>

A `Service` is headless if the `.spec.clusterIP` property is set to `None`

Without a cluster IP, a headless `Service` does not function as a load balancer; instead, it returns the associated `Pod` IPs directly

A headless `Service` associated with a `StatefulSet` allows determining a specific `Pod` IP, exposing it as a subdomain DNS record  
(e.g., _echo-server-0.echo-server-headless_)

</v-clicks>

::right::

<<< @/snippets/manifests/statefulsets/service-echo-server-headless.yaml yaml[service-echo-server-headless.yaml]{all|7|all}{lines:true,at:0}

<!--
```shell
kubectl apply -f ./snippets/manifests/statefulsets/statefulset-echo-server.yaml
kubectl apply -f ./snippets/manifests/statefulsets/service-echo-server-headless.yaml
kubectl get statefulsets
kubectl get pods -o wide
kubectl get services
kubectl run -it --image tutum/dnsutils --rm dnsutils
> nslookup echo-server
> nslookup echo-server-headless
> nslookup echo-server-0.echo-server-headless
```
-->

---
layout: two-cols
title: StatefulSets pvc templates
level: 2
---

# [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

Unlike `Deployments`, they can provision dedicated,  
per-`Pod` `PVCs`

<v-clicks>

One or more `PVC` templates can be defined inside a `StatefulSet`

When `Pods` are created, the relative `PVCs` are provisioned, one per `Pod` (e.g., _data-echo-server-0_)

When scaling down, the associated `PVCs` are not deleted by default

This ensures each `Pod` maintains its own storage identity

</v-clicks>

::right::

```yaml {7-15}{lines:true}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: echo-server
spec:
  # [...]
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        storageClassName: "fast-storage"
        resources:
          requests:
            storage: 1Gi
```

<!--
```shell
kubectl delete statefulsets echo-server
kubectl apply -f ./snippets/manifests/statefulsets/statefulset-echo-server-pvc.yaml
kubectl get statefulsets
kubectl get pods,pvc
kubectl scale statefulset echo-server --replicas=4
kubectl get pods,pvc
kubectl scale statefulset echo-server --replicas=2
kubectl get pods,pvc
```
-->
