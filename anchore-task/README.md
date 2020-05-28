# Anchore Azure DevOps Task Plugin

Anchore Task Extension for Azure DevOps Pipelines

---

This task uses the [Anchore Inline Scan][1] container to scan images in a Continuous Integration pipeline.

## Task usage

**Default behavior is a stateless local scan**

```
Anchore@0
  image: imagename:tag
```

### Scanning a local image - stateless
```
- task: Anchore@0
  inputs:
    image: 'imagename:tag'
    dockerfile: 'Dockerfile'
```

### Scanning a local image - stateful
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

### Scanning a remote image - stateless
```
- task: Anchore@0
  inputs:
    image: 'repo/imagename:tag'
    dockerfile: 'Dockerfile'
    remoteImage: true
```

### Scanning a remote image - stateful
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


# Variable Description

### image
```
Default:
Required: yes
```

### dockerfile
```
Default:
Required: no
```

### timeout (not implemented yet)
```
Default: 300
Required: no
```

### verbose (not implemented yet)
```
Default: false
Required: no
```

### remoteImage
```
Default: false
Required: no
```

### stateful
```
Default: false
Required: no
```

### url
```
Default:
Required: stateful == true

* Also need a port
```

### username
```
Default:
Required: stateful == true
```

### password
```
Default:
Required: stateful == true
```

### policyBundle (not implemented yet)
```
Default:
Required: no
```

[1]: https://docs.anchore.com/current/docs/engine/usage/integration/ci_cd/inline_analysis/
