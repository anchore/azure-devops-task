# Anchore Azure DevOps Task Plugin

Anchore Task Extension for Azure DevOps Pipelines

## Task usage

**Default behavior is a stateless local scan**

#### Scanning a remote image - stateless
```
Anchore@0
  image: jpetersenames/ipserver:latest
  dockerfile: ./Dockerfile
  timeout: 300
  verbose: true
  remote: true
  policybundle: ./policy.json
  stateful: false
```

#### Scanning a remote image - stateful
```
Anchore@0
  image: jpetersenames/ipserver:latest
  dockerfile: ./Dockerfile
  timeout: 300
  verbose: true
  remote: true
  stateful: true
  url: www.anchore-engine.com:8228/v1
  username: james
  password: foo
```

#### Scanning a local image - stateless
```
Anchore@0
  image: ipserver:latest
  dockerfile: ./Dockerfile
  timeout: 300
  verbose: true
  remote: false
  policybundle: ./policy.json
  stateful: false
```

#### Scanning a local image - stateful
```
Anchore@0
  image: jpetersenames/ipserver:latest
  dockerfile: ./Dockerfile
  timeout: 300
  verbose: true
  remote: false
  stateful: true
  url: www.anchore-engine.com:8228/v1
  username: james
  password: foo
```



### image
```
default:
required: yes
```

### dockerfile
```
default:
required: no
```

### timeout
```
default: 300
required: no
```

### verbose
```
default: false
required: no
```

### remote
```
default: false
required: no
```

### stateful
```
default: false
required: no
```

### url
```
default:
required: stateful == true
group: engine

* Also need a port
```

### username
```
default:
required: stateful == true
group: engine
```

### password
```
default:
required: stateful == true
group: engine
```

### policybundle
```
default:
required: no
```

