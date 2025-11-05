---
layout: two-cols
title: Namespaces
transition: fade
---

# [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

They provide a logical separation between applications

<v-click>

**Most** resources are `Namespace`-specific

</v-click>

<div class="mt-5" />

<v-click>

`kubectl` accepts the argument `-n [namespace]` to refer to the resources in a specific `Namespace`

```shell
kubectl -n echo-server get pods
```

</v-click>

<div class="mt-5" />

<v-click>

Some of its subcommands (e.g., `get`, `describe`) also support the argument `--all-namespaces` to refer to the resources in all `Namespaces`

```shell
kubectl get --all-namespaces echo-server pods
```

</v-click>

::right::

<<<@/snippets/manifests/namespaces/namespace-echo-server.yaml yaml[namespace-echo-server.yaml]{*}{lines:true}

<div class="mt-5" />

<<<@/snippets/manifests/namespaces/pod-echo-server.yaml yaml[pod-echo-server.yaml]{hide|5}{lines:true,at:1}

---
layout: two-cols
hideInToc: true
transition: fade
---

# [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

In general, resources in one `Namespace` cannot directly access resources in another `Namespace`

<v-clicks>

This example results in a `Pod` with the status `CreateContainerConfigError` and the error message `Error: secret "echo-server-secrets" not found`

</v-clicks>

::right::

<<<@/snippets/manifests/namespaces/secret-echo-server.yaml yaml[secret-echo-server.yaml]{hide|5}{lines:true,at:1}

<div class="mt-5" />

<<<@/snippets/manifests/namespaces/pod-echo-server-secret.yaml yaml[pod-echo-server.yaml]{hide|5,10-12}{lines:true,at:1}

---
hideInToc: true
---

# [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

By default, `Namespace` networks are not isolated

<v-clicks>

To access a `Service` in another `Namespace` you can use the domain in the form<br/>
`{service_name}.{namespace_name}`

This mechanism relies on the "search domains" system

```shell
kubectl -n tests exec pods/echo-server -- cat /etc/resolv.conf
```

```text
search tests.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
options ndots:5
```

`webapp -> webapp.tests.svc.cluster.local`

`postgresql.databases -> postgresql.databases.svc.cluster.local`

</v-clicks>
