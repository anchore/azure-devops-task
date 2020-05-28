//
// Common answer structure for all the tests. It will ensure the basic running
// of the program during the test environment.
//
export let answers: any = {
    "checkPath": {
        ['mock/docker']: true,
        ['mock/curl']: true,
        ['mock/bash']: true,
        ['mock/Dockerfile']: true
    },
    "exist": {
        'mock/Dockerfile': true
    },
    "which": {
        "docker": "mock/docker",
        "curl": "mock/curl",
        "bash": "mock/bash"
    },
    "exec": {
        "mock/curl --silent --fail --show-error --output /tmp/inline_scan.sh https://ci-tools.anchore.io/inline_scan-latest": {
            "code": 0,
            "stdout": "Download the inline scan script",
            "stderr": ""
        }
    }
};
