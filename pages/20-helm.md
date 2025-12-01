---
layout: two-cols
transition: fade
title: Helm
---

# [Helm](https://helm.sh/docs)

A [CNCF graduated project](https://www.cncf.io/projects/), it is the main package manager for Kubernetes

<v-clicks>

Helm charts (packages) are released as `tgz` archives, containing all the manifests needed to deploy a whole service

To customize the installation of the service, a helm chart exposes a list of overridable variables: the `values.yaml`

</v-clicks>

::right::

<div class="w-full h-full flex flex-col justify-center items-center">
  <logos-helm class="text-60" />
</div>

---
layout: two-cols-header
transition: fade
hideInToc: true
---

# [Helm](https://helm.sh/docs)

It uses a templating system based on [Go template language](https://pkg.go.dev/text/template)

::left::

<<<@/snippets/manifests/helm/templates.yaml yaml[templates.yaml]{hide|all}{lines:true}
<<<@/snippets/manifests/helm/values.yaml yaml[values.yaml]{hide|all}{lines:true}

::right::

<v-click>

With the release name "example" these produce

</v-click>

<<<@/snippets/manifests/helm/rendered.yaml yaml{hide|all}{lines:true,at:3}

---
transition: fade
hideInToc: true
---

# [Helm](https://helm.sh/docs)

It has not an official repository, instead it allows developers to create one's own

<v-clicks>

Anyway, an indexer for Helm charts is available: [Artifact Hub](https://artifacthub.io/), a [CNCF incubating project](https://www.cncf.io/projects/)

You can find charts directly on the web search or from cli using the command `helm search hub [keywords]`

For each result, you can find: the repository, the chart name, the version history and the default `values.yaml`

</v-clicks>

---
layout: steps
transition: fade
hideInToc: true
---

# [Helm](https://helm.sh/docs)
The procedure to install a Helm chart is straightforward

::steps::

1. Fetch the helm chart repository

::content::

<v-click>

```shell
helm repo add ealenn https://ealenn.github.io/charts
```

<man command="helm repo add">
Adds a chart repository to your local Helm configuration
</man>

</v-click>

<div class="mt-5" />

<v-click>

```shell
helm repo update
```

<man command="helm repo update">
Gets the latest information about charts from the respective chart repositories
</man>

</v-click>

---
layout: steps
transition: fade
hideInToc: true
---

# [Helm](https://helm.sh/docs)
The procedure to install a Helm chart is straightforward

::steps::

1. Fetch the helm chart repository
2. Define the custom `values.yaml`

::content::

<v-click>

```shell
helm show values ealenn/echo-server
```

<man command="helm show values">
Inspects a chart (directory, file, or URL) and displays the contents of the values.yaml file
</man>

</v-click>

---
layout: steps
hideInToc: true
---

# [Helm](https://helm.sh/docs)
The procedure to install a Helm chart is straightforward

::steps::

1. Fetch the helm chart repository
2. Define the custom `values.yaml`
3. Install the chart

::content::

<v-click>

```shell
helm install -n echo-server --create-namespace --values ./values.yaml echo-server ealenn/echo-server
```

<man command="helm install">
Installs a chart archive
</man>

</v-click>
