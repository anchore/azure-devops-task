# Anchore Enterprise Azure DevOps Task Plugin

Anchore Enterprise Task Extension for Azure DevOps Pipelines

----

This pipelines extension is built off of the `anchore-cli` tool used to communicate with an instance of Anchore Engine or Enterprise. Currently it just takes an image, adds it to the running Anchore instance, then waits for it and checks the evaluation results once the image has finished scanning.

## Task usage

### Scanning an image
```
AnchoreEnterprise@0
  image: stagingrepo/imagename:tag
  dockerfile: Dockerfile
  url: myanchore.com:8228/v1
  username: fakeuser
  password: fakepass
```

## Variable descriptions

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

### url
```
default:
required: yes
```

### username
```
default:
required: yes
```

### password
```
default:
required: yes
```

## Notes

TODO: Add in testing suite
