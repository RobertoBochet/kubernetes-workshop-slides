---
#layout: two-cols
transition: fade
title: cert-manager
---

# [cert-manager](https://cert-manager.io/docs/)

It's an operator designed to provision X.509 certificates

<v-space/>

<v-click>

It can be installed with `helm`

```shell
helm install cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true
```

</v-click>

<v-space/>

<small v-click>

N.B. `cert-manager` helm chart is distributed via OCI registry. In this case `helm repo add` is not required

</small>

<!--
```shell
kubectl get crds
```
-->

---
transition: fade
level: 2
---

# [X.509 Certificate](https://en.wikipedia.org/wiki/X.509)

An X.509 certificate binds an identity to a public key using a digital signature.

<v-clicks>

The concept of "identity" is purposefully kept generic,  
enabling certificates to be used across a wide range of use cases and applications.

- DNS names
- IP addresses
- email

The certificate, which includes the "identity" and the public key (owned by the applicant),  
is signed and released by a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority)

The validity of the certificate is proved through the [chain of trust](https://en.wikipedia.org/wiki/Chain_of_trust):  
The verifier of the certificate needs to trust only the [Root CA](https://en.wikipedia.org/wiki/Root_certificate)

</v-clicks>

---
layout: two-cols
transition: fade
level: 2
---

# [cert-manager Issuers](https://cert-manager.io/docs/concepts/issuer/) 

They represent certificate authorities (CAs) that are able to release X.509 certificates

<v-space size="xxl"/>

<v-click>

`cert-manager` offer two types of issuer resources: `Issuer` which is `Namespace` specific and `ClusterIssuer` which is usable cluster wide

</v-click>

::right::

<<<@/snippets/manifests/cert-manager/issuer-selfsigned.yaml yaml[issuer-selfsigned.yaml]{all}{lines:true}

<v-space/>

<<<@/snippets/manifests/cert-manager/clusterissuer-selfsigned.yaml yaml[clusterissuer-selfsigned.yaml]{hide|all}{lines:true,at:1}

---
layout: two-cols
transition: fade
level: 2
---

# [cert-manager Certificates](https://cert-manager.io/docs/usage/certificate/)

They represent a human-readable definition of a certificate request

<v-space/>

<v-clicks>

Each `Certificate` is managed by a specific `Issuer`

`cert-manager` provides support for specifying different "identities" to be included in the certificates  
(e.g. `dnsName`, `uris`, `ipAddresses`, etc.)

The certificate (and the associated private key) will be stored in a secret once it is generated

<small>N.B. the operator will take care of renewing the certificate when it is about to expire</small>

</v-clicks>

::right::

<<<@/snippets/manifests/cert-manager/certificate-selfsigned.yaml yaml[certificate-selfsigned.yaml]{all|6-9|10-12|13|all}{lines:true,at:1}

<!--
```shell
kubectl apply -f ./snippets/manifests/cert-manager/clusterissuer-selfsigned.yaml
kubectl apply -f ./snippets/manifests/cert-manager/certificate-selfsigned.yaml
kubectl get certificates
kubectl get secrets
kubectl get secrets/selfsigned-example-tls -o jsonpath="{.data['tls\.key']}" | base64 -d
kubectl get secrets/selfsigned-example-tls -o jsonpath="{.data['tls\.crt']}" | base64 -d | openssl x509 -text | less
```
-->

---
layout: two-cols-header
transition: fade
level: 2
---

# [ACME](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment)

(Automatic Certificate Management Environment)  
is a protocol for automating interactions between [Certificate Authorities](https://en.wikipedia.org/wiki/Certificate_authority) and servers

<v-space size="xl"/>

::left::

<v-click>

<div class="w-full flex flex-col justify-center items-center">
  <logos-certbot class="text-20" />
</div>

[certbot](https://certbot.eff.org/) is the reference implementation of server certificate management software using the ACME protocol

</v-click>

::right::

<v-click>

<div class="w-full flex flex-col justify-center items-center">
  <logos-letsencrypt class="text-20" />
</div>

[Let's Encrypt](https://certbot.eff.org/) is a non-profit certificate authority run by Internet Security Research Group (ISRG) that provides X.509 certificates for Transport Layer Security (TLS) encryption at no charge

</v-click>

---
layout: two-cols-header
transition: fade
level: 2
---

# [ACME Challenges](https://acmeprotocol.dev/acme/challenges/)

Challenges provide the CA with assurance that certificate requesters control the identifiers (domain names or IP addresses) requested to be included in the certificates

<v-space size="sm"/>

<v-clicks>

In a TLS scenario, the CA certifies ownership of domain names (or less commonly IP addresses)

So, the `cert-manager` operator needs to prove to the CA that it has control over the domains specified in the certificate request

</v-clicks>

---
layout: two-cols-header
transition: fade
level: 2
---

# [ACME HTTP-01 Challenge](https://acmeprotocol.dev/acme/challenges/#http-01)

It requires proving that the operator can expose an HTTP server on the domains

<v-space size="sm"/>

<v-click>

The CA provides a token for the challenge to the operator, who has to expose a plain text file at
```text
http://<DOMAIN>/.well-known/acme-challenge/<TOKEN>
```
containing the token plus a thumbprint of the ACME account key

</v-click>

<v-click>

The CA can verify the domain ownership by pulling the file and checking the content

</v-click>

<small v-click>

N.B. the HTTP server must be exposed on the internet to allow the CA to complete the check 

</small>

---
layout: two-cols-header
transition: fade
level: 2
---

# [ACME DNS-01 Challenge](https://acmeprotocol.dev/acme/challenges/#dns-01)

It requires proving that the operator can modify DNS records in the DNS zone

<v-space size="sm"/>

<v-click>

The CA provides a token for the challenge to the operator,  
who has to create a TXT record `_acme-challenge.<DOMAIN>` containing it

</v-click>

<v-click>

The CA can verify the domain ownership by making a DNS query to a trusted DNS

</v-click>

<small v-click>

N.B. this kind of challenge can be used also for wildcard domains and domains without record A/AAAA on the internet (e.g., inside a VPN)

</small>

---
transition: fade
level: 2
---

# [cert-manager Issuers HTTP-01](https://cert-manager.io/docs/configuration/acme/http01/)

`cert-manager` can perform an HTTP-01 challenge exploiting an <Link to="ingress-controllers">Ingress Controller</Link>

<<<@/snippets/manifests/cert-manager/clusterissuer-letsencrypt-staging-http01.yaml yaml[clusterissuer-letsencrypt-staging-http01.yaml]{all|7|8|9-10|11-14|all}{lines:true}

---
transition: fade
level: 2
---

# [cert-manager Issuers DNS-01](https://cert-manager.io/docs/configuration/acme/dns01/)

`cert-manager` also supports the DNS-01 challenge

<<<@/snippets/manifests/cert-manager/clusterissuer-letsencrypt-staging-dns01.yaml yaml[clusterissuer-letsencrypt-staging-dns01.yaml]{all|11-16|all}{lines:true}

<small v-click="1">

N.B. for this challenge, `cert-manager` has to support your DNS provider (e.g., Cloudflare)

</small>

---
layout: two-cols
transition: fade
level: 2
---

# [Ingresses over TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls)

`Ingresses` can also expose a service over HTTPS

<v-clicks>

If the `Ingress controller` supports HTTPS, settings the `.spec.tls` field makes the `Ingress` served also on HTTPS

It is enough to provide the `Secret` containing the certificate

</v-clicks>

::right::

````md magic-move[ingress-echo-server-tls.yaml] {lines:true,at:0}
<<<@/snippets/manifests/cert-manager/ingress-echo-server-tls.yaml yaml{17-20|17-20|20|17-20}
````

---
layout: two-cols
level: 2
---

# [Ingresses over TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls)

`cert-manager` can also directly provide the `Certificate` resource for an `Ingress`

<v-click>

This behavior can be achieved by setting the `"cert-manager.io/cluster-issuer"` <Link to="annotations">annotation</Link> to reference a `ClusterIssuer`

</v-click>

::right::

````md magic-move[ingress-echo-server-tls.yaml]{lines:true,at:0}
<<<@/snippets/manifests/cert-manager/ingress-echo-server-tls.yaml yaml{17-20}
<<<@/snippets/manifests/cert-manager/ingress-echo-server-tls-annotated.yaml yaml{5-6}
````
