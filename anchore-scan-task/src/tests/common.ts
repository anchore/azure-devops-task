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
        'mock/curl --silent --fail --show-error --output /tmp/inline_scan.sh https://ci-tools.anchore.io/inline_scan-v0.8.0': {
            'code': 0,
            'stdout': 'Download the inline scan script',
            'stderr': ''
        }
    }
};

//
// Mock the vulnerabilities.json file for the default printing of the vulns.
//
export let vulnerabilities: string = `
{
    "imageDigest": "sha256:12345",
    "vulnerabilities": [
        {
            "feed": "vulnerabilities",
            "feed_group": "debian:9",
            "fix": "None",
            "nvd_data": [
                {
                    "cvss_v2": {
                        "base_score": 4.3,
                        "exploitability_score": 8.6,
                        "impact_score": 2.9
                    },
                    "cvss_v3": {
                        "base_score": 3.7,
                        "exploitability_score": 2.2,
                        "impact_score": 1.4
                    },
                    "id": "CVE-2011-3374"
                }
            ],
            "package": "apt-1.4.10",
            "package_cpe": "None",
            "package_cpe23": "None",
            "package_name": "apt",
            "package_path": "pkgdb",
            "package_type": "dpkg",
            "package_version": "1.4.10",
            "severity": "Negligible",
            "url": "https://security-tracker.debian.org/tracker/CVE-2011-3374",
            "vendor_data": [],
            "vuln": "CVE-2011-3374"
        },
        {
            "feed": "nvdv2",
            "feed_group": "nvdv2:cves",
            "fix": "None",
            "nvd_data": [
                {
                    "cvss_v2": {
                        "base_score": 10.0,
                        "exploitability_score": 10.0,
                        "impact_score": 10.0
                    },
                    "cvss_v3": {
                        "base_score": 9.8,
                        "exploitability_score": 3.9,
                        "impact_score": 5.9
                    },
                    "id": "CVE-2017-1000116"
                }
            ],
            "package": "mercurial-4.0",
            "package_cpe": "cpe:/a:-:mercurial:4.0:-:~~~python~~",
            "package_cpe23": "cpe:2.3:a:-:mercurial:4.0:-:-:-:-:-:-:~~~python~~",
            "package_name": "mercurial",
            "package_path": "/usr/lib/python2.7/dist-packages/mercurial",
            "package_type": "python",
            "package_version": "4.0",
            "severity": "Critical",
            "url": "https://nvd.nist.gov/vuln/detail/CVE-2017-1000116",
            "vendor_data": [],
            "vuln": "CVE-2017-1000116"
        }
    ],
    "vulnerability_type": "all"
}`;

//
// Mock the policy results file to control the policy status for testing.
//
export let policyResults: string = `
[
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

    let mockjson = '';
    if (file.indexOf('vulnerabilities') != -1) {
        mockjson = vulnerabilities;
    }
    else {
        mockjson = policyResults;
    }
    return mockjson;
}

fsClone.writeFile = function(path: string, contents: string, options: Object|string) {
    console.log(`Writing ${contents} to ${path}`);
}
