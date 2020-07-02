//
// Common answer structure for all the tests. It will ensure the basic running
// of the program during the test environment.
//
export let answers: any = {
    'checkPath': {
        ['mock/docker']: true,
        ['mock/curl']: true,
        ['mock/bash']: true,
        ['mock/Dockerfile']: true,
        ['mock/policy-bundle.json']: true,
        ['mock/anchore-reports']: true
    },
    'exist': {
        'mock/Dockerfile': true,
        'mock/policy-bundle.json': true,
        'mock/anchore-reports': true
    },
    'which': {
        'docker': 'mock/docker',
        'curl': 'mock/curl',
        'bash': 'mock/bash'
    },
    'exec': {
        'mock/curl --silent --fail --show-error --output /tmp/inline_scan.sh https://ci-tools.anchore.io/inline_scan-v0.7.1': {
            'code': 0,
            'stdout': 'Download the inline scan script',
            'stderr': ''
        }
    }
};

//
// Mock fs for the reports
//
// These are the base functions that must be mocked for testing to work. Each
// function can be overridden by individual tests if different behavior should
// be tested.
//
const fs = require('fs');
export const fsClone = Object.assign({}, fs);

fsClone.readdirSync = function(dir: string): string[] {
    return ['mock-vuln.json',
            'mock-content-os.json',
            'mock-content-file.json',
            'mock-details.json',
            'mock-policy.json'];
}

fsClone.readFileSync = function(file: string): string {
    return `[
                {
                    "sha256:12345": {
                        "localhost:5000/mock:local": [
                            {
                                "detail": {},
                                "last_evaluation": "mock-time",
                                "policyId": "mock-id",
                                "status": "pass"
                            }
                        ]
                    }
                }
            ]`;
}

fsClone.writeFile = function(path: string, contents: string, options: Object|string) {
    console.log(`Writing ${contents} to ${path}`);
}
