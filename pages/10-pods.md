---
layout: two-cols
title: Pods
---

# [Pods](https://kubernetes.io/docs/concepts/workloads/pods/)

They are the smallest deployable units of computing that you can create and manage in Kubernetes

::right::

<<< @/snippets/manifests/pods/pod-echo-server.yaml yaml[pod-echo-server.yaml]{hide|all|1-2|3-4|6-11|7|8|9-11|12|all}{lines:true}

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
kubectl run -it --image=alpine/curl --rm --restart=Never --quiet ottenitore -- http://<ip-pod-echo-server> | jq
```
-->
