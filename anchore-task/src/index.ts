import path = require('path');
import fs = require('fs');
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanArgs } from './ScanArgs';
import { printVulnerabilityReport } from './PrintVulnReport';


//
//  Download inline scan.
//
function getInlineScan(): string {

    const fetch: InputFetch = new InputFetch();
    let script: string = '';
    let version = fetch.version;
    if (version != 'latest' && version.indexOf('v') < 0) {
         version = 'v'.concat(version);
    }

    if (!fetch.includepackages) {
        process.env.ANCHORE_CI_IMAGE = 'docker.io/anchore/inline-scan-slim:'.concat(version);
        console.log('ANCHORE_CI_IMAGE: ', process.env.ANCHORE_CI_IMAGE);
    }
    else {
        delete process.env.ANCHORE_CI_IMAGE;
    }

    // Location of inline_scan script
    const scanner: string = `/tmp/inline_scan.sh`;

    // Ensure curl is available
    let curlpath = tl.which('curl', true);
    let curl: tr.ToolRunner = tl.tool(curlpath).arg([
        '--silent',
        '--fail',
        '--show-error',
        '--output', scanner,
        'https://ci-tools.anchore.io/inline_scan-'.concat(version)
    ]);
    let out: tr.IExecSyncResult = curl.execSync();

    // Handle errors
    if (out.code != 0) {
        console.log(out.stderr);
        console.log(out.error);
        throw new Error('Curl command failed');
    }

    return scanner;
}


//
//  Build up all the options for inline scan.
//
function buildInlineScanCommand(scanner: string): string {

    const fetch: InputFetch = new InputFetch();
    let scan: ScanArgs = new ScanArgs(scanner);

    // Build the command string based off inputs
    scan.add(['scan']);
    if (fetch.policy) {
        scan.add(['-b', fetch.policy]);
    }

    if (fetch.dockerfile) {
        scan.add(['-d', fetch.dockerfile]);
    }
    // scan.add(['-v', fetch.archives]);

    if (fetch.timeout) {
        scan.add(['-t', fetch.timeout]);
    }

    // Generate report
    scan.add(['-r']);

    // Verbose Debugging
    if (fetch.debug) {
        scan.add(['-V']);
    }

    scan.add([fetch.image]);
    console.log('Scanning: ', scan.args);

    return scan.args;
}


//
//  Execute the inline scan script.
//
function runInlineScan(scanargs: string) {

    // Ensure docker is available
    tl.which('docker', true);

    let bash = tl.which('bash');
    let inlinescan: tr.ToolRunner = tl.tool(bash).line(scanargs);

    let out: tr.IExecSyncResult = inlinescan.execSync();

    // Handle errors
    if (out.code != 0) {
        console.log(out.stderr);
        console.log(out.error);
        throw new Error('Inline Scan command failed');
    }
}


//
//  Generate the content report and return the path.
//
function genContentReport(dir: string): string {

    let contents = []
    let reports = fs.readdirSync(dir)
    reports = reports.map(f => path.join(dir, f));

    for (let i = 0; i < reports.length; i++) {
        if (reports[i].indexOf('content-') != -1) {
            console.log(reports[i]);
            contents.push(JSON.parse(fs.readFileSync(reports[i]).toString()));
        }
    }

    let bom = contents.reduce((merged, n) => merged.concat(n.content), []);
    fs.writeFile(path.join(dir, 'contents.json'), JSON.stringify(bom), function(err) {
        if (err) {
            // TODO End task with warnings
            console.log(err);
            throw new Error('Could not create contents.json');
        }
        else {
            console.log('Created contents.json');
        }
    });

    return path.join(dir, 'contents.json');
}


//
//  Get the status of the policy evaluation.
//
function getPolicyStatus(dir: string): string {

    let reports = fs.readdirSync(dir)
    reports = reports.map(f => path.join(dir, f));

    let index = -1

    for (let i = 0; i < reports.length; i++) {
        if (reports[i].indexOf('-policy') != -1) {
            console.log(reports[i]);
            index = i;
        }
    }
    if (index < 0) {
        throw new Error('Could not find policy report');
    }
    let policyEval = JSON.parse(fs.readFileSync(reports[index]).toString());
    let imageId = Object.keys(policyEval[0]);
    let imageTag = Object.keys(policyEval[0][imageId[0]]);
    let policyStatus = policyEval[0][imageId[0]][imageTag[0]][0]['status'];

    if (policyStatus) {
        return policyStatus;
    }
    else {
        throw new Error('Could not retrieve status of policy scan');
    }

}


//
//  Get the path to the the vulnerabilities report.
//
function getVulnPath(dir: string): string {

    let reports = fs.readdirSync(dir)
    reports = reports.map(f => path.join(dir, f));

    let index = -1

    for (let i = 0; i < reports.length; i++) {
        if (reports[i].indexOf('-vuln') != -1) {
            console.log(reports[i]);
            index = i;
        }
    }
    if (index < 0) {
        throw new Error('Could not find vulnerability report');
    }
    tl.cp(reports[index], path.join(dir, 'vulnerabilities.json'), '-f');
    return path.join(dir, 'vulnerabilities.json');
}


//
// Main run function for task
//
async function run() {

    try {
        const fetch: InputFetch = new InputFetch();

        // Location of inline_scan script
        const scanner: string = getInlineScan();
        const scanargs: string = buildInlineScanCommand(scanner);
        runInlineScan(scanargs);

        // Get the proper path for anchore-reports
        let srcDir = tl.getVariable('BUILD_SOURCESDIRECTORY');
        if (!srcDir) {
            throw new Error('Could not get the report path');
        }
        let reportsPath: string = path.join(srcDir, 'anchore-reports');
        tl.checkPath(reportsPath, 'ReportPath');
        console.log('Report Path: %s', reportsPath);

        // Get outputs
        let policyStatus: string = getPolicyStatus(reportsPath);
        let billOfMaterialsPath: string = genContentReport(reportsPath);
        let vulnerabilitiesPath: string = getVulnPath(reportsPath);

        // Set outputs
        tl.setVariable('policyStatus', policyStatus);
        tl.setVariable('billOfMaterials', billOfMaterialsPath);
        tl.setVariable('vulnerabilities', vulnerabilitiesPath);

        let printVulns = true;
        if (printVulns) {
            console.log('\nAnchore Vulnerability Report [ %s ]', fetch.image);
            console.log();
            printVulnerabilityReport(vulnerabilitiesPath);
        }

        // Check the status of the policy scan
        if (fetch.failbuild && policyStatus == 'fail') {
            throw new Error("Anchore policy scan returned 'fail' result");
        }

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

// Run the task
run();
