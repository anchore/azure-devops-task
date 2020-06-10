import path = require('path');
import fs = require('fs');
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanArgs } from './ScanArgs';


function getInlineScan(): string {

    // Location of inline_scan script
    const scanner: string = `/tmp/inline_scan.sh`;

    // Ensure curl is available
    var curlpath = tl.which('curl', true);
    var curl: tr.ToolRunner = tl.tool(curlpath).arg([
        '--silent',
        '--fail',
        '--show-error',
        '--output', scanner,
        'https://ci-tools.anchore.io/inline_scan-v0.7.0'
    ]);
    var out: tr.IExecSyncResult = curl.execSync();

    // Handle errors
    if (out.code != 0) {
        console.log(out.stderr);
        console.log(out.error);
        throw new Error('Curl command failed');
    }

    return scanner;
}


function buildInlineScanCommand(scanner: string): string {

    const fetch: InputFetch = new InputFetch();
    var scan: ScanArgs = new ScanArgs(scanner);

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


function runInlineScan(scanargs: string) {
    var bash = tl.which('bash');
    var inlinescan: tr.ToolRunner = tl.tool(bash).line(scanargs);

    var out: tr.IExecSyncResult = inlinescan.execSync();

    // Handle errors
    if (out.code != 0) {
        console.log(out.stderr);
        console.log(out.error);
        throw new Error('Inline Scan command failed');
    }
}


// Main run function for task
async function run() {
    try {

        // Ensure docker is available
        tl.which('docker', true);

        // Location of inline_scan script
        const scanner: string = getInlineScan();
        const scanargs: string = buildInlineScanCommand(scanner);
        runInlineScan(scanargs);



        var reportPath: string = path.join( __dirname, '..', 'anchore-reports');
        tl.checkPath(reportPath, "ReportPath");
        console.log("Report Path: %s", reportPath);

        getContent(reportPath);

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

function getContent(dir: string) {

    let contents = []
    let reports = fs.readdirSync(dir)
    reports = reports.map(f => path.join(dir, f));

    for (var i = 0; i < reports.length; i++) {
        if (reports[i].indexOf("content-") != -1) {
            console.log(reports[i]);
            contents.push(JSON.parse(fs.readFileSync(reports[i]).toString()));
        }
    }

    return contents.reduce((merged, n) => merged.concat(n.content), []);
}

// Run the task
run();
