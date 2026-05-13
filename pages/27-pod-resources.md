---
layout: two-cols
title: Pod Resources
transition: fade
---

# [`Pod` Resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

Kubernetes `Nodes` provide resources, while the system provides the abstraction to allocate them to `Pods`

<v-clicks>

Primary manageable resources include CPU time and memory

Additional resource types are supported;  
furthermore, the set of manageable resources can be [extended through the operator pattern](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#extended-resources)

</v-clicks>

<Directive v-click name="resources">

Enables managing resource allocations for a container

</Directive>

<NoteBox v-click>

Since `v1.34`, [`Pod`-level resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#pod-level-resource-specification) has been introduced as `Beta` feature

</NoteBox>

::right::

<<< @/snippets/manifests/pod-resources/pod-resources.yaml yaml[pod-resources.yaml] {hide|10|10-11}{lines:true,at:3}

<!--
```shell
kubectl describe nodes
```
-->

---
title: Pod Resource Requests
layout: two-cols
transition: fade
level: 2
---

## `Pod` Resource Requests

Resource requests represent a guaranteed reservation of capacity, ensuring that the `Pod` is only scheduled on `Nodes` with sufficient unallocated resources to satisfy its requirements

<v-clicks>

The Scheduler relies on these values to calculate node availability and prevent resource overcommitment during placement

Once scheduled, the container is guaranteed the requested amount of resources, which remain reserved regardless of actual usage

</v-clicks>

<Directive v-click name="requests.cpu">

Defines the minimum CPU time reserved for the container

</Directive>

<Directive v-click name="requests.memory">

Defines the minimum memory amount reserved for the container

</Directive>

::right::

<<< @/snippets/manifests/pod-resources/pod-resources-requests.yaml yaml[pod-resources-requests.yaml] {none|10-12|10-11,13|10-13}{lines:true,at:1}

---
title: Pod Resource Limits
layout: two-cols
transition: fade
level: 2
---

## `Pod` Resource Limits

Kubernetes leverages Linux [Control Groups (cgroups)](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v1/cgroups.html) to enforce resource boundaries on containers

<Directive v-click name="limits.cpu">

Sets the maximum CPU time for a container.  
Exceeding this limit results in CPU throttling, which slows down the process without terminating it

</Directive>

<Directive v-click name="limits.memory">

Sets the maximum amount of memory available to a container.  
Exceeding this limit triggers the `OOM Killer`, which terminates the process to protect the host system

</Directive>

::right::

<<< @/snippets/manifests/pod-resources/pod-resources-limits.yaml yaml[pod-resources-limits.yaml] {none|10-12|10-11,13|10-13}{lines:true,at:1}

<v-space/>

<NoteBox v-click>

Defining a resource `limits` without an explicit `requests` one causes the `requests` to be automatically set to match the limit value

</NoteBox>

<!--
```shell
systemd-cgls
ls -l /sys/fs/cgroup/kubepods/
```
-->

---
title: Pod QoS Classes
layout: two-cols-grid
level: 2
---

## [`Pod` Quality of Service Classes](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/)

<v-space size="sm"/>

Defining `requests` and `limits` results in the assignment of one of three Quality of Service (QoS) classes to a `Pod`

::content::

<v-click>

[`Guaranteed`](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#guaranteed)  
<small>
`requests` and `limits` for both CPU and memory must be set and must coincide
</small>

</v-click>

```yaml {hide|all}{lines:true,at:1}
requests:
  cpu: 250m
  memory: 125Mi
limits:
  cpu: 250m
  memory: 125Mi
```

<v-click>

[`Burstable`](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#burstable)  
<small>
The `Pod` does not meet `Guaranteed` criteria, but at least one CPU or memory `requests` field is defined
</small>

</v-click>

```yaml {hide|all}{lines:true,at:2}
requests:
  cpu: 125m
  memory: 150Mi
limits:
  memory: 1Gi
```

<v-click>

[`BestEffort`](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#besteffort)  
<small>
The `Pod` does not meet either `Guaranteed` or `Burstable` criteria
</small>

</v-click>

<div class="col-span-2 mt-2">
<NoteBox v-click>

The QoS classes define the `Pod` eviction priority during resource pressure:  
`BestEffort` are terminated first, followed by `Burstable` exceeding their requests, while `Guaranteed` are the least likely to be evicted

</NoteBox>
</div>
