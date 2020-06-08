# Anchore Azure DevOps Task Plugins

Anchore Task Extensions for Azure DevOps Pipelines

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

## Building Locally

To build either extension locally just `cd` into the appropriate directory and run
```
npm install
npm run build
```

To run the extension locally use
```
npm run app
```

## Building the extensions

Please refer to [Microsoft documentation][2] for creating build and release
tasks.

Everything should be set up for building and publishing the tasks. To do so you
must increment the versions in

```
anchore-task/task.json
```

So that they match the next version of extension. Then when you are ready to
build the extension to publish it, use the following command in the root of
the project (where `vss-extension.json` is located).

```
tfx extension create --manifest-globs vss-extension.json --rev-version
```

This will create a `.vsix` file which can be published to the Marketplace.



[1]: https://docs.anchore.com/current/docs/engine/usage/integration/ci_cd/inline_analysis/
[2]: https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
