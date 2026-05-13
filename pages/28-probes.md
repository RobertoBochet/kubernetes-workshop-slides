---
transition: fade
layout: two-cols
title: Probes
---

# [Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)

They are the tools Kubernetes uses to understand the real status of the running service inside a `Pod`

::right::

<<< @/snippets/manifests/probes/pod-echo-server.yaml yaml[pod-echo-server.yaml]{hide|10-18|11-13|14|15|16|17|18|10-18}{lines:true}

---
layout: two-cols
title: Startup probe
level: 2
transition: fade
---

# [Startup probe](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/#startup-probe)

It verifies whether the application within a container has started

<v-space size="xl" />

<NoteBox type="Success" v-click="3">

`on success`  
The probe is stopped

</NoteBox>

<v-space />

<NoteBox type="Alert" v-click="4">

`on failure`  
The `Pod` is restarted

</NoteBox>

::right::

<<< @/snippets/manifests/probes/pod-echo-server-startup-probe.yaml yaml[pod-echo-server-startup-probe.yaml]{none|10-14|15-20}{lines:true}

<!--
[click] Simulates a flaky startup: 80% chance to hang in sleep infinity, 20% chance to start the webserver correctly.

```shell
kubectl delete pods echo-server --force
kubectl apply -f ./snippets/manifests/probes/pod-echo-server-startup-probe.yaml
kubectl get pods echo-server -w
```
-->

---
layout: two-cols
title: Liveness probe
level: 2
transition: fade
---

# [Liveness probe](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/#liveness-probe)

It determines when to restart a container

<v-space size="xl" />

<NoteBox type="Success" v-click="3">

`on success`  
Nothing happens

</NoteBox>

<v-space />

<NoteBox type="Alert" v-click="4">

`on failure`  
The `Pod` is restarted

</NoteBox>

::right::

<<< @/snippets/manifests/probes/pod-echo-server-liveness-probe.yaml yaml[pod-echo-server-liveness-probe.yaml]{none|10-15|16-20}{lines:true}

<!--
[click] Starts the webserver, waits 30s, then kills the process while keeping the container alive. 

```shell
kubectl delete pods echo-server --force
kubectl apply -f ./snippets/manifests/probes/pod-echo-server-liveness-probe.yaml
kubectl get pods echo-server -w
```
-->

---
layout: two-cols
title: Readiness probe
level: 2
transition: fade
---

# [Readiness probe](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/#readiness-probe)

It determines when a `Pod` is ready to accept traffic

<v-space size="xl" />

<NoteBox type="Success" v-click="3">

`on success`  
The `Pod` is flagged as _Ready_:  
Kubernetes allows service traffic to go to this `Pod`

</NoteBox>

<v-space />

<NoteBox type="Alert" v-click="4">

`on failure`  
The `Pod` is flagged as **not** _Ready_:  
Kubernetes stops sending service traffic to this `Pod`

</NoteBox>

::right::

<<< @/snippets/manifests/probes/pod-echo-server-readiness-probe.yaml yaml[pod-echo-server-readiness-probe.yaml]{none|10-17|18-21}{lines:true}

<!--
[click] Runs the webserver and toggles the existence of /tmp/ready every 10s to simulate intermittent availability.

```shell
kubectl delete pods echo-server --force
kubectl apply -f ./snippets/manifests/probes/pod-echo-server-readiness-probe.yaml
kubectl get pods echo-server -w
kubectl apply -f ./snippets/manifests/services/service-echo-server.yaml
kubectl get endpoints echo-server -w
```
-->

---
layout: two-cols-grid
title: Probing methods
level: 2
---

# [Probing methods](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)

Kubernetes offers different methods to perform a probing task

::content::

<v-click>

`httpGet`  
<small>
Performs an HTTP GET request.  
Success if the response code is between 200 and 399
</small>

</v-click>

```yaml {hide|all|2|3|4|5|6-8|all}{lines:true,at:1}
httpGet:
  host: 127.0.0.1
  port: 8080
  path: /healthz
  scheme: HTTP
  httpHeaders:
    - name: Authorization
      value: "Bearer SECRET_TOKEN"
```

<v-click at="8">

`tcpSocket`  
<small>
Attempts to open a TCP connection.  
Success if the connection is established
</small>

</v-click>

```yaml {hide|all|2|3|all}{lines:true,at:8}
tcpSocket:
  port: 3306
  host: 127.0.0.1

```

<v-click at="12">

`exec`  
<small>
Executes a command inside the container.  
Success if the exit code is 0
</small>

</v-click>

```yaml {hide|all}{lines:true,at:12}
exec:
  command:
    - "/bin/sh"
    - "-c"
    - "cat /tmp/ready"
```

<!--
Kubernetes supports also grpc probe
-->
