---
layout: two-cols
title: ConfigMaps and Secrets
transition: fade
---

# [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) and [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

Kubernetes provides two main resources to store and use application configurations

<v-click>

Both contain a list of key/value elements, and they can be passed to pods as environment variables or mounted as files

</v-click>

::right::

<v-after>

```yaml {*}{lines:true}
LISTEN_HOST: 0.0.0.0
LISTEN_PORT: 8080

DB_HOST: postgres-db
DB_PORT: 5432
DB_USER: postgres
DB_PASSWORD: changeme

LOG_LEVEL: warning
DEBUG: "true"
```

<div class="mt-5" />

```yaml {*}{lines:true}
init.sh: |
  #!/usr/bin/env sh
  apk add --no-cache git
purge.sh: |
  #!/usr/bin/env sh
  rm -r /var/cache/*
```

</v-after>

---
layout: two-cols
transition: fade
hideInToc: true
---

# [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)

They can be used to store non-confidential configurations, like scripts

::right::

<<<@/snippets/manifests/configmaps-secrets/configmap-echo-server-config.yaml yaml[configmap-echo-server-config.yaml]{all|5-7|all}{lines:true}

<div class="mt-5" />

<<<@/snippets/manifests/configmaps-secrets/configmap-echo-server-scripts.yaml yaml[configmap-echo-server-scripts.yaml]{all|5-13|all}{lines:true, at: 1}

---
layout: two-cols
transition: fade
hideInToc: true
---

# [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)

The content of a `ConfigMap` can be passed to a pod as environment variables

<v-clicks>

With the keyword `envFrom`, all the key/value pairs defined in the `ConfigMap` will be passed to the `Pod` as environment variables

`env` allows for more granular configuration, enabling you to define individual environment variables and bind them to a custom name

</v-clicks>

::right::

<<<@/snippets/manifests/configmaps-secrets/pod-echo-server-env.yaml yaml[pod-echo-server-env.yaml]{all|11-13|14-19|all}{lines:true,at:1}

<!--
```shell
kubectl delete deployments echo-server
kubectl apply -f configmap-echo-server-config.yaml
kubectl apply -f configmap-echo-server-scripts.yaml
kubectl apply -f pod-echo-server-env.yaml
kubectl run -it --image=alpine/curl --rm --restart=Never --quiet ottenitore -- http://echo-server:8080 | jq .environment
```
-->

---
layout: two-cols
transition: fade
hideInToc: true
---

# [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)

The content of a `ConfigMap` can also be mounted in the `Pod` as a volume

<v-clicks>

At the pod level the `ConfigMap` has to be referred as a volume definition

The whole content of the `configMap` can be mounted to a directory, or alternatively, specific elements can be mounted to specific paths

</v-clicks>

::right::

<<<@/snippets/manifests/configmaps-secrets/pod-echo-server-volumes.yaml yaml[pod-echo-server-volumes.yaml]{all|20-24|14-19|all}{lines:true,at:1}

<!--
```shell
kubectl delete pods echo-server
kubectl apply -f pod-echo-server-volumes.yaml
kubectl exec pods/echo-server -- ls -al /init.sh
kubectl exec pods/echo-server -- ls -al /scripts
```
-->

---
layout: two-cols
transition: fade
hideInToc: true
---

# [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

Putting sensitive information in `ConfigMaps` is not recommended. For this type of configuration, you should use `Secrets`

<v-clicks>

The secret data can be specified in the `data` field encoded in `base64`

Or alternatively, as plain text using the `stringData` field

The two secrets shown on the right are equivalent

</v-clicks>

::right::

<<<@/snippets/manifests/configmaps-secrets/secret-echo-server-base64.yaml yaml[secret-echo-server.yaml]{hide|all}{lines:true, at:1}

<div class="mt-5" />

<<<@/snippets/manifests/configmaps-secrets/secret-echo-server.yaml yaml[secret-echo-server.yaml]{hide|all}{lines:true, at:2}

---
layout: two-cols
hideInToc: true
---

# [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

The use is similar to the `ConfigMaps`

<v-clicks>

As with `ConfigMaps`, `Secrets` can be used both in the `envFrom` section...

... and in the `env` one

</v-clicks>

::right::

<<<@/snippets/manifests/configmaps-secrets/pod-echo-server-secrets.yaml yaml[pod-echo-server-secrets.yaml]{all|11-13|14-19|all}{lines:true,at:1}

<!--
```shell
kubectl delete pods echo-server
kubectl apply -f secret-echo-server.yaml
kubectl apply -f pod-echo-server-secrets.yaml
kubectl run -it --image=alpine/curl --rm --restart=Never --quiet ottenitore -- http://echo-server:8080 | jq .environment
```
-->
