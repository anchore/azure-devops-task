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
