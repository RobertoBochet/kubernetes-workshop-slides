---
title: Pod Hardening
---

# `Pod` Hardening

It consists of a set of security practices aimed at significantly reducing the attack surface of a `Pod` to mitigate potential exploits 

<v-clicks>

Focuses on the principle of least privilege, ensuring containers run with only the minimum necessary permissions

Acts as a defense-in-depth layer to mitigate the impact of a breach, ensuring a compromised `Pod` provides no path for host access, container escape, or lateral movement

</v-clicks>

---
title: Security Context
layout: two-cols
hideInToc: true
level: 3
---

# [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
Allows managing the permissions of a `Pod` or container

<v-clicks>

Directives apply at either `Pod` level or container level within the `securityContext` object

Specific directives defined only at `Pod` level, others at container level, or at both levels

Container level directives take precedence over `Pod` level ones

</v-clicks>

::right::

<<< @/snippets/manifests/pod-hardening/pod-empty-security-context.yaml yaml[pod-empty-security-context.yaml] {none|10-11}{lines:true,at:1}

---
layout: two-cols
title: Rootless Pods
level: 2
---

## Rootless `Pods`

<v-clicks>

Kubernetes follows the [`USER`](https://docs.docker.com/reference/dockerfile/#user) directive if declared in the image, running the container as non-root

</v-clicks>

<Directive v-click name="runAsNonRoot" :labels="[['Pod','blue'],['Container','green']]">

When set to `true`, ensures the container process runs with a non-zero UID, failing to start if root execution is detected

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-rootless.yaml yaml[pod-rootless.yaml] {none|12}{lines:true,at:2}

---
title: Run as User and Group
layout: two-cols
level: 3
---

## Rootless `Pods`

The [`USER`](https://docs.docker.com/reference/dockerfile/#user) directive takes precedence over the default `UID=0` and `GID=0` (root)

<v-clicks>

Regardless, Kubernetes allows overriding these values at `Pod` and container level

</v-clicks>

<Directive v-click name="runAsUser" :labels="[['Pod','blue'],['Container','green']]">

Allows overriding the `UID` of the process run in the container

</Directive>

<Directive v-click name="runAsGroup" :labels="[['Pod','blue'],['Container','green']]">

Allows overriding the `GID` of the process run in the container

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-rootless-user-group.yaml yaml[pod-rootless-user-group.yaml] {none|13|14|13-14}{lines:true,at:2}

---
title: Filesystem Group
layout: two-cols
level: 3
---

## Rootless `Pods`

Mounted volumes generally do not match filesystem permissions inside a rootless `Pod`.  
For example, volumes created by a CSI driver are often owned by `0:0` (root:root)

<v-clicks>

Kubernetes provides directives to manage volume ownership

</v-clicks>

<Directive v-click name="fsGroup" :labels="[['Pod','blue']]">

When a volume is mounted, Kubernetes recursively changes the group ownership of files to this value.  
Furthermore, it sets the `setgid` bit on the volume root

</Directive>

<Directive v-click name="fsGroupChangePolicy" :labels="[['Pod','blue']]">

Defines whether the recursive group ownership change is performed `Always` or `OnRootMismatch`

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-rootless-fsgroup.yaml yaml[pod-rootless-fsgroup.yaml] {none|15|16|15-16}{lines:true,at:2}

---
title: Supplemental Groups
layout: two-cols
level: 3
---

## Rootless `Pods`

Kubernetes allows defining additional group memberships to grant access to shared resources

<Directive v-click name="supplementalGroups" :labels="[['Pod','blue']]">

Assigns a list of additional `GID`s to all processes within the `Pod` containers to grant extended resource access

</Directive>

<Directive v-click name="supplementalGroupsPolicy" :labels="[['Pod','blue']]">

(Beta in v1.33+)  
Determines whether supplemental groups are merged with those defined in the image (`Merge`) or applied exclusively from the manifest (`Strict`)

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-rootless-supplemental-groups.yaml yaml[pod-rootless-supplemental-groups.yaml] {none|17|18|17-18}{lines:true,at:1}

<!--
```shell
kubectl run busybox -i --rm --image=busybox --restart=Never --overrides='{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000,"runAsGroup":2000,"fsGroup":3000,"supplementalGroups":[4000,5000]}}}' -- id
```
-->

---
level: 2
layout: two-cols
---

## Readonly Filesystem

Further hardening can be achieved by mounting the container root filesystem as read-only

<v-clicks>

Implementing an immutable filesystem drastically reduces the attack surface available to an attacker who has compromised the `Pod`

</v-clicks>

<Directive v-click name="readOnlyRootFilesystem" :labels="[['Container','green']]">

When set to `true`, mounts the container root filesystem as read-only, requiring volumes for any write operation

</Directive>

<NoteBox type="Warning" v-click>

Certain applications require write access to temporary directories (e.g., `/tmp`, `/run`, or `/var/cache`).  
These locations must be made writable by mounting ephemeral volumes

</NoteBox>

::right::

<<< @/snippets/manifests/pod-hardening/pod-readonly-fs.yaml yaml[pod-readonly-fs.yaml] {none|11|12-14,16-20|11-14,16-20}{lines:true,at:2}

---
title: Linux Capabilities
level: 2
---

## [Linux Capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html)

<v-clicks>

On Linux systems, certain operations traditionally require root privileges.  
Capabilities allow splitting these into granular units, enabling processes to perform specific operations without running as root

_Examples include changing file ownership (`CAP_CHOWN`) or opening raw network sockets (`CAP_NET_RAW`)_

Any Linux process is associated with multiple capability sets, each serving a specific security role:

</v-clicks>

<v-clicks>

- `bounding set` acts as the upper limit for the capabilities a process can acquire
- `permitted set` defines the total pool of capabilities that a process is authorized to enable
- `effective set` represents the capabilities currently active and evaluated by the kernel for permission checks

</v-clicks>

<v-clicks>

Processes can transition a capability from the `permitted set` into the `effective set` using the `capset` system call

</v-clicks>

---
hideInToc: true
---

## [Linux Capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html)

When a process runs a new binary (`execve`), the capability sets are recomputed:

<v-clicks>

- `bounding set` is inherited by the child process; the parent can reduce it before execution using the `prctl` system call
- `permitted` and `effective` sets are determined by the new process `UID`:
    - `UID = 0` (`root`): sets are set equal to the `bounding set`
    - `UID > 0` (`unprivileged`): sets are cleared by default, resulting in a loss of privileges

</v-clicks>

---
hideInToc: true
---

## [Linux Capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html)

Capabilities can be assigned directly to binary files, allowing unprivileged processes (`UID > 0`) to execute them with those capabilities loaded into the `permitted` and `effective` sets (privilege escalation)

<v-click>

The `setcap` command is used to assign capabilities to an executable file

```shell
setcap 'cap_net_bind_service=ep cap_net_admin=ep' /path/to/file
```

</v-click>

<v-click>

The `getcap` command is used to display the capabilities assigned to a binary file

```shell
getcap /path/to/file
```

</v-click>

<NoteBox v-click>

Processes can be executed with the [`NO_NEW_PRIVS`](https://www.kernel.org/doc/html/latest/userspace-api/no_new_privs.html) attribute, which prevents child processes from acquiring more capabilities in their `permitted set` than those possessed by the parent, thus completely inhibiting privilege escalation mechanisms

</NoteBox>

---
level: 2
layout: two-cols
---

## Capabilities

Kubernetes runs containers with a reduced set of capabilities by default, including only those deemed reasonably safe for a containerized process

<v-clicks>

This default set can be modified within the `securityContext`

</v-clicks>

<Directive v-click name="capabilities" :labels="[['Container','green']]">

Capabilities listed in `.add` are added to the `bounding set`, while those in `.drop` are removed from it.  
The `CAP_` prefix is optional when defining capabilities.  
The special value `ALL` targets every available capability

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-capabilities.yaml yaml[pod-capabilities.yaml] {none|11-14}{lines:true,at:2}

<NoteBox type="Warning" v-click>

Containers running with a non-zero `runAsUser` start with empty `permitted` and `effective` sets. In a rootless `Pod`, privilege escalation via file capabilities currently remains the only method to acquire capabilities.  
An enhancing proposal ([`KEP-2763`](https://github.com/kubernetes/enhancements/tree/master/keps/sig-security/2763-ambient-capabilities)) is being evaluated to address this limitation by relying on the `ambient set`

</NoteBox>

---
title: Allow Privilege Escalation
level: 3
layout: two-cols
---

## Capabilities

The attack surface can be reduced by disabling privilege escalation when it is not required

<Directive v-click name="allowPrivilegeEscalation" :labels="[['Container','green']]">

When set to `false`, the container process runs with the `NO_NEW_PRIVS` flag, which prevents child processes from gaining more privileges than their parent, effectively disabling `setuid` binaries and file capabilities

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-capabilities-privilege-escalation.yaml yaml[pod-capabilities-privilege-escalation.yaml] {none|11}{lines:true,at:1}

---
level: 2
layout: two-cols
---

## Privileged Containers

Kubernetes allows running containers in privileged mode when full access to the host is required

<Directive v-click name="privileged" :labels="[['Container','green']]">

When set to `true`, grants the container full access to the host, including all kernel capabilities, access to all host devices, and the removal of standard runtime isolation

</Directive>

<NoteBox type="Alert" v-click>

Enabling privileged mode disables all container isolation mechanisms and should be avoided unless strictly required for specialized tasks like system management or direct hardware access (e.g., operators)

</NoteBox>

::right::

<<< @/snippets/manifests/pod-hardening/pod-privileged.yaml yaml[pod-privileged.yaml] {none|11}{lines:true,at:1}

---
title: Seccomp
level: 2
layout: two-cols
---

## [Seccomp](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container)

Seccomp (SECure COMPuting) allows filtering the system calls (syscalls) that a process can make to the Linux kernel

<Directive v-click name="seccompProfile" link="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#seccompprofile-v1-core" :labels="[['Pod','blue'],['Container','green']]">

Allows changing the Seccomp profile used in the `Pod`.  
The property `.type` can be set to `RuntimeDefault`, which uses the default profile provided by the container runtime (e.g., containerd).  
Setting `.type` to `Localhost` allows using specific profiles available on the node; it requires the profile JSON file path to be specified via `.localhostProfile`

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-seccomp.yaml yaml[pod-seccomp.yaml] {none|12-13}{lines:true,at:2}

---
title: AppArmor and SELinux
level: 2
layout: two-cols
---

## [AppArmor](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-apparmor-profile-for-a-container) and [SELinux](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)

AppArmor and SELinux provide Mandatory Access Control (MAC) to further restrict container access to host resources

<Directive v-click name="appArmorProfile" link="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#apparmorprofile-v1-core" :labels="[['Pod','blue'],['Container','green']]">

Enables selecting the AppArmor profile for the container, supporting `RuntimeDefault`, `Unconfined`, or `Localhost` options

</Directive>

<Directive v-click name="seLinuxOptions" link="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#selinuxoptions-v1-core" :labels="[['Pod','blue'],['Container','green']]">

Allows assigning specific SELinux labels to a `Pod` or container, including settings for `user`, `role`, `type`, and `level`

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-lsm.yaml yaml[pod-lsm.yaml]{none|12-13|14|12-14}{lines:true,at:1}

---
layout: two-cols
title: ServiceAccount Token Automount
level: 2
---

## `ServiceAccount` Token Automount

<v-clicks>

By default, Kubernetes automatically mounts a `ServiceAccount` token into every `Pod` to allow KubeAPI authentication

Although these tokens possess no permissions by default, disabling the automounting mechanism for workloads that do not require API access follows the principle of least privilege

</v-clicks>

<Directive v-click name=".spec.automountServiceAccountToken">

When set to `false`, prevents Kubernetes from mounting the `ServiceAccount` token into the `Pod` filesystem

</Directive>

::right::

<<< @/snippets/manifests/pod-hardening/pod-no-sa-token.yaml yaml[pod-no-sa-token.yaml]{none|6}{lines:true,at:3}

---
layout: two-cols
title: Digest Pinning
level: 2
---

## Digest Pinning

<v-clicks>

Pinning an image digest is an effective technique to mitigate specific supply chain attacks

When a digest is pinned, the specified `tag` becomes a human-readable annotation: Kubernetes pulls and executes only the image corresponding to the digest

In the event of a supply chain attack where the image on the registry associated with the target `tag` is compromised, Kubernetes continues to use the unaffected version

</v-clicks>

<NoteBox type="Warning" v-click>

Security updates are often pushed to the registry by overriding existing tags, making the update transparent to users.  
With digest pinning, these updates are not applied even when legitimate.  
Automating image updates is strongly recommended, especially when digest pinning is used

</NoteBox>

::right::

<<< @/snippets/manifests/pod-hardening/pod-digest.yaml yaml[pod-digest.yaml]{none|8}{lines:true,at:2}

---
layout: two-cols
title: Pod Security Admission
level: 2
transition: slide-left
---

## [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/)

<v-clicks>

Native admission controller used to enforce the [`Pod` Security Standards (PSS)](https://kubernetes.io/docs/concepts/security/pod-security-standards/) by evaluating `Pod` specifications against predefined security levels at the `Namespace` level

Applies security policies to all `Pods` within a `Namespace` by leveraging labels to define the desired security level and the action to take upon violation

Offers three operational modes: `enforce` to reject non-compliant `Pods`, `audit` to record violations in the Kubernetes audit log, and `warn` to return warning messages to the client

Provides three distinct security levels defined in the PSS: `privileged` (unrestricted), `baseline` (minimal restrictions), and `restricted` (best practice hardening)

</v-clicks>

::right::

<<< @/snippets/manifests/pod-hardening/namespace-psa.yaml yaml[namespace-psa.yaml]{none|6-7}{lines:true,at:5}

<v-space size="md"/>

<Directive v-click="5" name="pod-security.kubernetes.io/<mode>: <level>" :labels="[['labels','red']]">

Enables `PSA` enforcement on all `Pods` within the `Namespace`.  
Allows assigning a specific security level to each operational mode by defining separate labels

</Directive>
