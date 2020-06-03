# Anchore Azure DevOps Task Plugins

Anchore Task Extensions for Azure DevOps Pipelines

---

Azure DevOps build and release tasks to run Anchore and scan container images.
The `anchore-task` uses the inline scan tool offered by Anchore while the
`anchore-enterprise-task` uses the `anchore-cli` tool to perform a CVE scan
and policy evaluation.


## Using the extensions

### Anchore Task

**Default behavior is a stateless local scan**

```
Anchore@0
  image: imagename:tag
```

**Scanning a local image - stateless**
```
- task: Anchore@0
  inputs:
    image: 'imagename:tag'
    dockerfile: 'Dockerfile'
```

**Scanning a local image - stateful**
```
- task: Anchore@0
  inputs:
    image: 'imagename:tag'
    stateful: true
    url: 'myanchore.com:8228/v1'
    username: 'fakeuser'
    password: 'fakepass'
    dockerfile: 'Dockerfile'
```

**Scanning a remote image - stateless**
```
- task: Anchore@0
  inputs:
    image: 'repo/imagename:tag'
    dockerfile: 'Dockerfile'
    remoteImage: true
```

**Scanning a remote image - stateful**
```
- task: Anchore@0
  inputs:
    image: 'repo/imagename:tag'
    stateful: true
    url: 'myanchore.com:8228/v1'
    username: 'fakeuser'
    password: 'fakepass'
    dockerfile: 'Dockerfile'
    remoteImage: true
```


### Anchore Enterprise Task

```
AnchoreEnterprise@0
  image: stagingrepo/imagename:tag
  dockerfile: Dockerfile
  url: myanchore.com:8228/v1
  username: fakeuser
  password: fakepass
```

