# Anchore Azure DevOps Task Plugins

Anchore Task Extensions for Azure DevOps Pipelines

---

This is an Azure DevOps Pipeline task for scanning images using
[Anchore Engine][1]. It is used to scan container images and will return the
vulnerabilities found, a software bill of materials, and the result of a policy
evaluation. The task can be provided a custom policy which can be used to fail
the pipeline if so desired.

**No data is sent to a remote service to execute the scan , and no credentials
are required**

## Task usage

#### Getting the results only
```
- task: Anchore@0
  inputs:
    image: 'localbuild/imagename:tag'
    dockerfile: 'Dockerfile'
```

By default, the Anchore task will simply scan a local image using Anchore
Engine and will provide files that contain a list of all the contents in the
image as well as a list of all the vulnerabilities detected by Anchore. Both
of these files will be output as pipeline variables along with the result of
the policy evaluation. Under default behavior, the pipeline will not fail when
the container does not pass the Anchore policy scan. The fail result will be
published as a variable in the pipeline and can be used in subsequent tasks.

*Note: While the dockerfile option is not required, it is recommended if the
Dockerfile is available as it adds metadata for Anchore Engine.*


### Failing the pipeline when Anchore Policy scan fails
```
- task: Anchore@0
  inputs:
    image: 'localbuild/imagename:tag'
    dockerfile: 'Dockerfile'
    failBuild: true
```

## Inputs Description

| Input Name | Description | Required | Default Value |
|------------|-------------|:--------:|---------------|
| image | The image to scan | :heavy_check_mark: | N/A |
| dockerfile | Path to the dockerfile used to build `image`. Adds metadata for the policy evaluation | | |
| failBuild | Fail the build if policy evaluation returns a fail. | | false |
| customPolicyPath | Path to a local policy bundle. | | |
| debug | More verbose logging output from the scanner. | | false |
| timeout | Set the scan timeout. | | |
| includeAppPackages | Include application packages for vulnerability matches. Requires more vuln data and thus scan will be slower but better results. | | false |
| anchoreVersion | An optional parameter to specify a specific version of anchore to use for the scan. | | v0.7.1 |
| printVulnerabilityReport | Print the vulnerability report to the screen. | | true |

## Outputs Description

| Output Name     | Description                                                      | Type   |
|-----------------|------------------------------------------------------------------|--------|
| billOfMaterials | Path to a json file with the list of packages found in the image | string |
| vulnerabilities | Path to a json file with list of vulnerabilities found in image  | string |
| policyCheck     | Policy evaluation status of the image, either 'pass' or 'fail'   | string |

## Building Locally (Developer Notes)

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



[1]: https://docs.anchore.com/current/docs/engine/
[2]: https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
