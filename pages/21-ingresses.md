---
layout: two-cols
transition: fade
title: Ingresses
---

# [Ingresses](https://kubernetes.io/docs/concepts/services-networking/ingress/)

They allow the exposure of multiple HTTP services through the same endpoint, acting as a reverse proxy

<v-clicks at="7">

`Ingresses` also rely on the <Link to="operator-pattern">operator pattern</Link>, but no default controller is provided out of the box

</v-clicks>

<v-space size="xl"/>

<NoteBox level="warning" v-click="8">

`Ingresses` are now in the EoL, superseded by [Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/). However, they are still widely used

</NoteBox>

::right::

<<<@/snippets/manifests/ingresses/ingress-echo-server.yaml yaml[ingress-echo-server.yaml]{hide|all|1-2|7|10-11|12-16|all}{lines:true,at:1}

<!--
[click:2] `apiVersion` and `kind`

[click] `host`

[click] `path` and `pathType: Prefix`
  - `Prefix` matches based on a URL path prefix, 
  - `Exact` matches the URL path exactly

[click] `backend`, `port` can be provided as `name` or `number`
-->

---
layout: two-cols-header
transition: fade
title: Ingress Controllers
level: 2
routeAlias: ingress-controllers
---

# [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)

To use `Ingresses`, a specific controller has to provision it

::left::

<v-clicks>

There are various controllers based on applications like `nginx`, `traefik`, etc.

One of the most popular is the [Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/)

It can be easily installed exploiting the official [helm chart](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)

</v-clicks>

::right::

```shell{hide|all}
helm repo add ingress-nginx \
        https://kubernetes.github.io/ingress-nginx
```

<div class="mt-5" />

<<<@/snippets/manifests/ingresses/ingress-nginx-values.yaml yaml[values.yaml]{hide|all}{lines:true}

<div class="mt-5" />

```shell{hide|all}
helm install -n ingress-nginx --create-namespace \
        --values ./values.yaml \
        ingress-nginx ingress-nginx/ingress-nginx
```

---
layout: two-cols
transition: fade
hideInToc: true
---

# [Ingresses](https://kubernetes.io/docs/concepts/services-networking/ingress/)

Ingress can be now provisioned by the nginx controller

<v-clicks>

When the controller receives an HTTP request matching the `Host` header and the path prefix, it will be redirected to the backend service

</v-clicks>

::right::

````md magic-move[ingress-echo-server.yaml]{lines:true}
<<<@/snippets/manifests/ingresses/ingress-echo-server.yaml yaml
````

<!--
```shell
kubectl apply -f ./snippets/manifests/ingresses/ingress-echo-server.yaml
curl -H "Host: echo.example.org" http://{node_ip}:30080
```
-->

---
layout: two-cols
hideInToc: true
---

# [IngressClasses](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-class)

They allow specifying which controller should provision an `Ingress`

<<< @/snippets/manifests/ingresses/ingress-nginx-class.yaml yaml{hide|all}{lines:true}

::right::

````md magic-move[ingress-echo-server.yaml]{lines:true}
<<< @/snippets/manifests/ingresses/ingress-echo-server.yaml yaml{all}

<<< @/snippets/manifests/ingresses/ingress-echo-server-class.yaml yaml{6}
````
