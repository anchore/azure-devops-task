# Anchore Azure DevOps Task Plugins

Anchore Task Extensions for Azure DevOps Pipelines

---

Azure DevOps build and release tasks to run Anchore and scan container images.
The `anchore-task` uses the inline scan tool offered by Anchore while the
`anchore-enterprise-task` uses the `anchore-cli` tool to perform a CVE scan
and policy evaluation.


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

Please refer to [Microsoft documentation][1] for creating build and release
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



[1]: https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops
