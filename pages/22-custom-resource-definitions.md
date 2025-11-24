---
layout: two-cols
transition: fade
title: Custom Resource Definitions
---

# [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions)

They allow the extension of Kubernetes API by introducing new resource types, according to the <Link to="operator-pattern">operator pattern</Link>

<v-clicks>

Several operators that can be installed as `helm charts` provide their own `CRDs`

</v-clicks>

---
layout: two-cols
transition: fade
hideInToc: true
---

# [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions)

`CRDs` define the schema for the custom resources

<v-click at="3">

The custom resource can be `Namespace` specific or defined `Cluster` wide

</v-click>

<v-click at="7">

Version name must follow a [specific schema](https://kubernetes.io/docs/reference/using-api/#api-versioning)

</v-click>

<v-click at="10">

The resource structure is defined via [OpenAPI v3.0 schemas](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)

</v-click>

<v-space size="xxl"/>

<NoteBox level="warning" v-click="5">

The `name` cannot be chosen arbitrarily;
it must be set as `"{.spec.names.plural}.{.spec.group}"` and be a valid [DNS subdomain name](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)

</NoteBox>

::right::

<Transform :scale="0.9" origin="top center">
<<<@/snippets/manifests/custom-resource-definitions/crd-distro.yaml yaml[crd-distro.yaml]{all|1-2|6|7|8-10|4|11-28|12|13|14|15-28}{lines:true}
</Transform>

<!--
- [click]: `apiVersion` and `kind`
- [click]: `group`
- [click]: `scope`
- [click]: `names`
- [click]: `name`
- [click]: `versions`
- [click]: `name`  
  
- [click]: `served`
- [click]: `storage`  
  Only one version must have this field set to `true`.  
  It indicates which version is used to serialize the resource to be stored it in etcd
- [click]: `schema`

```shell
kubectl apply -f ./snippets/manifests/custom-resource-definitions/crd-distro.yaml
kubectl get crds
```
-->

---
layout: two-cols
hideInToc: true
---

# [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions)
Once the `CRDs` are defined, the relative resources are managed as the native ones

::right::

<<<@/snippets/manifests/custom-resource-definitions/distro-fedora.yaml yaml[distro-fedora.yaml]{all|1-2|5-8|all}{lines:true}
<div class="mt-5"/>
<<<@/snippets/manifests/custom-resource-definitions/distro-ubuntu.yaml yaml[distro-ubuntu.yaml]{all|1-2|5-8|all}{lines:true,at:1}

<!--
- [click]: `apiVersion` and `kind`
- [click]: `spec`

```shell
kubectl apply -f ./snippets/manifests/custom-resource-definitions/distro-fedora.yaml
kubectl apply -f ./snippets/manifests/custom-resource-definitions/distro-ubuntu.yaml
kubectl get distro
kubectl describe distro
```
-->
