---
transition: fade
title: API access control
---

# [API access control](https://kubernetes.io/docs/reference/access-authn-authz/)

As previously seen, the KubeAPI is the single-point access to manage the cluster

---
layout: two-cols
transition: fade
title: Service Accounts
level: 2
---

# [Service Accounts](https://kubernetes.io/docs/concepts/security/service-accounts/)

They are a type of non-human account, allowing authentication on the KubeAPI

<v-clicks>

Kubernetes allows assigning a `ServiceAccount` to a `Pod` setting the _.spec.serviceAccountName_ parameter, enabling KubeAPI authentication from within the `Pod`.  
This mechanism is commonly used by controllers

Assigning `SA` to a `Pod` makes Kubernetes generate and mount an authentication token (JWT) in the _/var/run/secrets/kubernetes.io/serviceaccount/token_ file

</v-clicks>

<NoteBox v-click>

The JWT follows the lifecycle of the Pod:  
when the Pod is destroyed, the JWT is revoked

</NoteBox>

::right::

<<<@/snippets/manifests/api-access-control/service-account.yaml yaml[service-account.yaml]{all}{lines:true}

<v-space />

<NoteBox v-click>

Whenever a `Namespace` is created, Kubernetes automatically create a `SevrviceAccount` in that `Namespace` called `default`

</NoteBox>

<!--
```shell
kubectl exec pods/<pod_name> -- cat /var/run/secrets/kubernetes.io/serviceaccount/token
```
-->

---
transition: fade
level: 3
hideInToc: true
---

# [Service Accounts](https://kubernetes.io/docs/concepts/security/service-accounts/)

`ServiceAccounts`, like other account entities when first created, have no permissions

<v-space size="md"/>

<v-click>

```shell
kubectl auth can-i --as=system:serviceaccount:default:controller-account get pods
```

<man command="kubectl auth can-i">
Check if an account has permission to perform an operation
</man>

</v-click>

---
transition: fade
title: RBAC
level: 2
---

# [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

Role-based access control is the main method of regulating access to the KubeAPI

---
layout: two-cols
transition: fade
title: Role and ClusterRoles
level: 3
---

# [Roles and ClusterRoles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)

They define which actions can be performed on cluster resources

<v-clicks>

Rules are interpreted additively

The pair _apiGroups_ and _resources_ specifies which resources this rule applies to

The _verbs_ set defines which operations can be performed on the resources

</v-clicks>

<v-space/>

<NoteBox v-click>

The complete list of _resources_ and relative _verbs_ can be obtained using the following command
```shell
kubectl api-resources --sort-by name -o wide
```

</NoteBox>

::right::

<<<@/snippets/manifests/api-access-control/role.yaml yaml[role.yaml]{all|5-|6-7,9-10|8,11|all}{lines:true,at:0}

<v-space size="xxl" />

<NoteBox v-click>

A `Role` defines permissions within a specific `Namespace`,  
while a `ClusterRole` can set permissions cluster-wide

</NoteBox>

---
layout: two-cols-header
transition: fade
title: RoleBindings and ClusterRoleBindings
level: 3
---

# [RoleBindings and ClusterRoleBindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding)

They associate `Roles`(or `ClusterRoles`) to accounts (e.g., `ServiceAccounts`)

::left::

<v-space size="xxl"/>

<NoteBox v-click="3">

A `RoleBinding` can reference a `Role` from the same `Namespace`.  
It can also reference a `ClusterRole` and apply its permissions within its own `Namespace`.  
Instead, `ClusterRoleBinding` applies a `ClusterRole` across the entire cluster

</NoteBox>

::right::

<<<@/snippets/manifests/api-access-control/role-binding.yaml yaml[role-binding.yaml]{all|5-8|9-11|all}{lines:true}

---
transition: fade
title: Users
level: 2
---

# [Users](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#users-in-kubernetes)

They represent the equivalent `ServiceAccount` for the human account

<v-clicks>

Unlike `ServiceAccounts`, users are not Kubernetes resources.  
Instead, user identity is verified through an `X.509` certificate signed by the cluster CA

</v-clicks>

<NoteBox level="Alert" v-click>

A certificate signed by the Kubernetes CA cannot be revoked.  
Once issued, the certificate holder can authenticate to the cluster until this expires  

</NoteBox>

---
layout: steps
transition: fade
title: Issue a Certificate for a User
level: 3
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key

::content::

```shell {hide|all}
openssl genrsa -out new-user.key 3072
```

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request

::content::

<v-click>

```shell
openssl req -new -key new-user.key -out new-user.csr -subj "/CN=new-user"
```

<NoteBox>

The subject `CN` (common name) of the certificate will be the name of the user

</NoteBox>

</v-click>

<v-click>

and sends it to a cluster `🛡️administrator`️

</v-click>

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request
3. The `🛡️administrator`️ creates a `CertificateSigningRequest` resource

::content::

<<<@/snippets/manifests/api-access-control/csr.yaml yaml[csr.yaml]{hide|all|6-8|9|10|all}{lines:true}

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request
3. The `🛡️administrator`️ creates a `CertificateSigningRequest` resource
4. The `🛡️administrator`️ approves the `CertificateSigningRequest`

::content::

<v-click>

```shell
kubectl certificate approve new-user
```

<man command="kubectl certificate approve">
It allows a cluster admin to approve a certificate signing request (CSR).
</man>

</v-click>

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request
3. The `🛡️administrator`️ creates a `CertificateSigningRequest` resource
4. The `🛡️administrator`️ approves the `CertificateSigningRequest`
5. The `🛡️administrator`️ sends the signed certificate to the `👤user`

::content::

<v-clicks>

```shell
kubectl get csr new-user -o jsonpath='{.status.certificate}' | base64 -d > new-user.crt
```

To allow the `👤user` to perform the authentication process,  
the `🛡️administrator` sends with the user certificate also the CA 

```shell
kubectl get configmaps kube-root-ca.crt -o jsonpath="{.data['ca\.crt']}" > ca.crt
```

</v-clicks>

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request
3. The `🛡️administrator`️ creates a `CertificateSigningRequest` resource
4. The `🛡️administrator`️ approves the `CertificateSigningRequest`
5. The `🛡️administrator`️ sends the signed certificate to the `👤user`
6. The `🛡️administrator`️ sets the right permissions for the `👤user`

::content::

<div class="w-full grid grid-cols-[5fr_4fr]">
  <div>

<v-clicks>

This can be achieved by assigning `Roles` (or `ClusterRoles`) with `RoleBindings` (or `ClusterRoleBindings`) to the user

</v-clicks>

<NoteBox level="Alert" v-click="3">

Certificate signed by the Kubernetes CA <u>cannot</u> be revoked.  
The only method to limit a user owning a valid certificate is to delete its `RoleBindings` (or `ClusterRoleBindings`)

</NoteBox>

  </div>

<Transform :scale="0.85" origin="top center">
<<<@/snippets/manifests/api-access-control/cluster-role-binding-user.yaml yaml[cluster-role-binding-user.yaml]{hide|9-}{lines:true}
</Transform>

</div>

---
layout: steps
transition: fade
hideInToc: true
---

# [Issue a Certificate for a User](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)

::steps::

1. The `👤user` generates a private key
2. The `👤user` generates an X.509 certificate signing request
3. The `🛡️administrator`️ creates a `CertificateSigningRequest` resource
4. The `🛡️administrator`️ approves the `CertificateSigningRequest`
5. The `🛡️administrator`️ sends the signed certificate to the `👤user`
6. The `🛡️administrator`️ sets the right permissions for the `👤user`
7. The `👤user` composes its `kubeconfig`

::content::

<v-click>

The user can now authenticate with the KubeAPI using this configuration

</v-click>

---
layout: two-cols
title: kubeconfig
level: 2
---

# [kubeconfig](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/)

A `kubeconfig` file is a configuration file that stores information required to connect to a cluster's KubeAPI

<v-space/>

<NoteBox v-click="5">

`kubectl` looks for `kubeconfig` in _$HOME/.kube/config_.
It can be changed by setting the `KUBECONFIG` env variable

</NoteBox>

<NoteBox level="Alert" v-click="6">

On each cluster's node, during the bootstrap phase, a `kubeconfig` for the administration role is created.
It must never leave the nodes and should only be used for creating the first personal user.  
If compromised, revoking these credentials is a painful and risky operation

</NoteBox>

::right::

<<<@/snippets/manifests/api-access-control/kubeconfig.yaml yaml[~/.kube/config]{all|3-8|9-15|16-20|21|all}{lines:true}

<!--
```shell
openssl genrsa -out new-user.key 3072
openssl req -new -key new-user.key -out new-user.csr -subj "/CN=new-user"

cp ./snippets/manifests/api-access-control/csr.yaml ./
yq -yi ".spec.request=\"$(cat new-user.csr | base64 | tr -d '\n')\"" ./csr.yaml
kubectl apply -f ./csr.yaml

kubectl certificate approve new-user

kubectl get csr new-user -o jsonpath='{.status.certificate}' | base64 -d > new-user.crt
kubectl get configmaps kube-root-ca.crt -o jsonpath="{.data['ca\.crt']}" > ca.crt

kubectl apply -f ./snippets/manifests/api-access-control/cluster-role-binding-user.yaml

cp ./snippets/manifests/api-access-control/kubeconfig-empty.yaml ./kubeconfig.yaml
export KUBECONFIG=`pwd`/kubeconfig.yaml

kubectl config set-credentials new-user --client-key=new-user.key --client-certificate=new-user.crt --embed-certs
kubectl config set-cluster new-cluster --server=https://192.168.49.2:8443 --certificate-authority=ca.crt --embed-certs
kubectl config set-context new-context --cluster=new-cluster --user=new-user
kubectl config use-context new-context
cat $KUBECONFIG

kubectl auth can-i delete pods
kubectl auth can-i get pods
kubectl get pods
```
-->
