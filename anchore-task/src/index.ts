import path = require('path');
import fs = require('fs');
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanArgs } from './ScanArgs';


//
// Main run function for task
//
function getInlineScan(): string {

    // Location of inline_scan script
    const scanner: string = `/tmp/inline_scan.sh`;

    // Ensure curl is available
    let curlpath = tl.which('curl', true);
    let curl: tr.ToolRunner = tl.tool(curlpath).arg([
        '--silent',
        '--fail',
        '--show-error',
        '--output', scanner,
        'https://ci-tools.anchore.io/inline_scan-v0.7.0'
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
// Main run function for task
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
    // scan.add(['-t', fetch.timeout]);

    // Exit on fail
    if (fetch.failbuild) {
        scan.add(['-f']);
    }

    if (fetch.remote) {
        scan.add(['-p']);
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
// Main run function for task
//
function runInlineScan(scanargs: string) {
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
// Main run function for task
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
            // TODO End task with errors
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
// Main run function for task
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
    tl.mv(reports[index], path.join(dir, 'vulnerabilities.json'), '-f');
    return path.join(dir, 'vulnerabilities.json');
}


//
// Main run function for task
//
async function run() {
    try {

        // Ensure docker is available
        tl.which('docker', true);

        // Location of inline_scan script
        const scanner: string = getInlineScan();
        const scanargs: string = buildInlineScanCommand(scanner);
        runInlineScan(scanargs);



        let reportsPath: string = path.join( __dirname, '..', 'anchore-reports');
        tl.checkPath(reportsPath, 'ReportPath');
        console.log('Report Path: %s', reportsPath);

        let policyStatus: string = getPolicyStatus(reportsPath);
        let billOfMaterialsPath: string = genContentReport(reportsPath);
        let vulnerabilitiesPath: string = getVulnPath(reportsPath);

        tl.setVariable('policyStatus', policyStatus);
        tl.setVariable('billOfMaterials', billOfMaterialsPath);
        tl.setVariable('vulnerabilities', vulnerabilitiesPath);

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

// Run the task
run();
