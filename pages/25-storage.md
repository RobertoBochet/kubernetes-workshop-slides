---
transition: fade
title: Storage
---

# [Storage](https://kubernetes.io/docs/concepts/storage/)

It relies on the previously seen concept of volumes

<v-clicks>

However, being designed for working in clusters, the storage field can quickly become complex

</v-clicks>

---
layout: two-cols
transition: fade
title: Ephemeral volumes
level: 2
---

# [Ephemeral volumes](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/)

They are not persistent storage, but they follow the pod lifecycle

<v-clicks>

This kind of storage is managed locally by the node where the `Pod` is running,
and is automatically cleaned up when the pod terminates

Optionally, a `emptyDir` can be created with `tmpfs` (stored in RAM) setting parameter `medium` to `Memory`

</v-clicks>

::right::

````md magic-move[pod-echo-server-empty-dir.yaml]{lines:true,at:0}
<<<@/snippets/manifests/storage/pod-echo-server-empty-dir.yaml yaml{18-19|18-19}
<<<@/snippets/manifests/storage/pod-echo-server-empty-dir-memory.yaml yaml{18-20}
````

<!--
```shell
kubectl delete pods/echo-server
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-empty-dir.yaml
kubectl exec -it pods/echo-server -- sh -c "mount | grep /cache"
kubectl delete pods/echo-server
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-empty-dir-memory.yaml
kubectl exec -it pods/echo-server -- sh -c "mount | grep /cache"
```
-->

---
layout: two-cols
transition: fade
title: Host path volumes
level: 2
---

# [Host path volumes](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)

A path on the host filesystem can be mounted directly in a pod

<NoteBox level="Alert" v-click>

The use of `hostPath` is discouraged in production. [Read more](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)

</NoteBox>

::right::

<<<@/snippets/manifests/storage/pod-echo-server-host-path.yaml yaml[pod-echo-server-host-path.yaml]{18-23}{lines:true}

<!--
```shell
kubectl delete pods/echo-server
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-host-path.yaml
kubectl exec -it pods/echo-server -- sh -c "echo "test" > /data/test"
minikube ssh cat /var/data/test
```
-->

---
layout: two-cols-header
transition: fade
title: Volume types
level: 2
---

# [Volume types](https://kubernetes.io/docs/concepts/storage/volumes/#volume-types)

Kubernetes supports several types of volumes

::left::

<v-click>

Some examples are:

- [nfs](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [OCI image](https://kubernetes.io/docs/concepts/storage/volumes/#image)
- [iSCSI (SCSI over IP)](https://kubernetes.io/docs/concepts/storage/volumes/#iscsi)
- [fc (fiber channel)](https://kubernetes.io/docs/concepts/storage/volumes/#fc)

</v-click>

::right::

<v-click>

Originally, several provider-specific volume drivers were officially provided by kubernetes (e.g. [cephfs](https://kubernetes.io/docs/concepts/storage/volumes/#cephfs), [cinder](https://kubernetes.io/docs/concepts/storage/volumes/#cinder)).  
However, the current philosophy adopted by the Kubernetes development team is to move the development of these drivers out-of-tree, allowing volume providers to interface to the cluster via the [CSI(Container Storage Interface)](https://github.com/container-storage-interface/spec/blob/master/spec.md)

</v-click>

---
layout: two-cols
transition: fade
title: PersistentVolumes
level: 2
---

# [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)

They are used to abstract volumes, managing them as independent resources separate from `Pods`

<v-click>

A `PV` can rely on any volume types provided by the cluster (as those shown in the previous slide)

</v-click>

<v-click at="2">

The [`accessModes`](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) set can include:

</v-click>

<dl v-click="2" class="mt-[-0.6em]">
  <dt><code>ReadWriteOnce</code> (<code>RWO</code>)</dt>
  <dd>The volume can be mounted on a single node (not limited to one <code>Pod</code>) as read-write</dd>
  <dt><code>ReadOnlyMany</code> (<code>ROX</code>)</dt>
  <dd>The volume can be mounted on multiple nodes as read-only</dd>
  <dt><code>ReadWriteMany</code> (<code>RWX</code>)</dt>
  <dd>The volume can be mounted on multiple nodes as read-write</dd>
  <dt><code>ReadWriteOncePod</code> (<code>RWOP</code>)</dt>
  <dd>The volume can be mounted on a single <code>Pod</code> as read-write</dd>
</dl>

<v-space size="sm"/>

<v-click at="4">

`PVs` cannot be directly used by a `Pod`;  
another resource is required in the process...

</v-click>

::right::

<<<@/snippets/manifests/storage/pv-host-path.yaml yaml[pv-host-path.yaml]{all|6-8|9-10|11-12|all}{lines:true,at:0}

---
layout: two-cols
transition: fade
title: PersistentVolumeClaims
level: 2
---

# [PersistentVolumeClaims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)

A `PVC` binds to a specific `PV`, waiting for it to become available before use

<v-click>

`spec` defines the necessary requirements that a `PV` must meet to be eligible for binding with this `PVC`

</v-click>

::right::

<<<@/snippets/manifests/storage/pvc.yaml yaml[pvc.yaml]{all|5-12|7|8-9|10-12|6|all}{lines:true,at:0}

<v-space size="md"/>

<NoteBox level="Alert" v-click="5">

`storageClassName` is not required in this situation, but a cluster can set its own default if not provided. Setting it
to `""` explicitly prevents using the cluster's default storage class.  
This parameter will be explained later

</NoteBox>

---
layout: two-cols
transition: fade
hideInToc: true
---

# [PersistentVolumeClaims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)

A `Pod` can specify a volume referring to a `PVC`, which then binds to a matching `PV`

<v-click>

The `Pod`'s start is delayed until the `PVC` successfully binds to the `PV`,
ensuring storage availability before the `Pod` begins

</v-click>

::right::

<<<@/snippets/manifests/storage/pod-echo-server-pvc.yaml yaml[pod-echo-server-pvc.yaml]{18-20}{lines:true}

<!--
```shell
kubectl delete pods/echo-server
kubectl apply -f ./snippets/manifests/storage/pv-host-path.yaml
kubectl get pv
kubectl apply -f ./snippets/manifests/storage/pvc.yaml
kubectl get pvc
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-pvc.yaml
kubectl get pods
kubectl exec -it pods/echo-server -- sh -c "echo "test" > /data/test"
minikube ssh cat /var/data/test
```
-->

---
transition: fade
title: PersistentVolume provisioners
level: 2
---

# PersistentVolumes provisioners

Like many resources, also `PVs` can be provisioned by an operator

<v-clicks>

Once installed, each time a `PVC` is defined, the controller will create a suitable `PV` to bind it to

</v-clicks>

<div v-click class="flex justify-around pt-20 px-20 text-center">
    <div class="flex flex-col gap-2 items-center">
        <devicon-ceph class="size-20" />
        <a href="https://ceph.io/">Ceph</a>
    </div>
    <div class="flex flex-col gap-2 items-center">
        <img src="/icons/longhorn.svg" alt="longhorn logo" class="h-20" />
        <a href="https://longhorn.io/">Longhorn</a>
    </div>
    <div class="flex flex-col gap-2 items-center">
        <img src="/icons/openebs.svg" alt="openebs logo" class="h-20" />
        <a href="https://openebs.io/">OpenEBS</a>
    </div>
</div>

---
layout: two-cols
transition: fade
title: StorageClasses
level: 2
---

# [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/)

They define the `PV` classes and specify which controller should provision the `PV` required by a `PVC`

<v-clicks>

When a `PV` controller is installed, it may provide one or more `StorageClasses`

The manifest shown here is the `StorageClass` provided by the [Rancher local-path-provisioner](https://github.com/rancher/local-path-provisioner)

</v-clicks>

<NoteBox level="Info" v-click="6">

Also minikube by default provides a `StorageClass` called `standard`

</NoteBox>

::right::

<<<@/snippets/manifests/storage/storage-class-local-path-provisioner.yaml yaml[storage-class-local-path-provisioner.yaml]{all|5|6|7|8|all}{lines:true,at:2}

<v-space size="md"/>

<NoteBox level="Info" v-click="7">

A `StorageClass` can be set as the default one for a cluster by adding the `annotation` `storageclass.kubernetes.io/is-default-class: "true"`.  
If a `PVC` is created without an explicit `storageClassName`, the default one will be assigned to it

</NoteBox>

---
layout: two-cols
hideInToc: true
---

# [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/)

Assigning a `StorageClass` to a `PVC` triggers the provisioning of a suitable `PV` by the associated controller

::right::

<<<@/snippets/manifests/storage/pvc-provisioned.yaml yaml[pvc-provisioned.yaml]{6}{lines:true}

<!--
```shell
kubectl delete pods/echo-server
kubectl delete pvc/data
kubectl delete pv/data
kubectl apply -f ./snippets/manifests/storage/pvc-provisioned.yaml
kubectl get pvc
kubectl get pv
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-pvc.yaml
kubectl get pods
kubectl exec -it pods/echo-server -- sh -c "echo "test" > /data/test"
kubectl delete pods/echo-server
kubectl apply -f ./snippets/manifests/storage/pod-echo-server-pvc.yaml
kubectl exec -it pods/echo-server -- sh -c "cat /data/test"
```
-->
