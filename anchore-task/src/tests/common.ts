
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
        "mock/curl -s https://ci-tools.anchore.io/inline_scan-latest -o /tmp/inline_scan.sh": {
            "code": 0,
            "stdout": "Download the inline scan script",
            "stderr": ""
        }
    }
};
