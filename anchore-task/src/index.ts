import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanString } from './ScanString';


// Main run function for task
async function run() {
    try {
        const fetch: InputFetch = new InputFetch();

        // Location of inline_scan script
        const scanner: string = `/tmp/inline_scan.sh`;

        // Ensure docker is available
        tl.which('docker', true);

        var curl = tl.which('curl', true);
        var curltool: tr.ToolRunner = tl.tool(curl).arg([
            '--silent',
            '--fail',
            '--show-error',
            '--output', scanner,
            'https://ci-tools.anchore.io/inline_scan-latest'
        ]);
        await curltool.exec();

        var scan: ScanString = new ScanString(scanner);

        // Build the command string based off inputs
        if (fetch.stateful) { // Analyze command
            scan.add(['analyze']);
            scan.add(['-r', fetch.url]);
            scan.add(['-u', fetch.username]);
            scan.add(['-p', fetch.password]);
            // scan.add(['-a', fetch.annotations]);
            // scan.add(['-d', fetch.digest]);
            scan.add(['-f', fetch.dockerfile]);
            // scan.add(['-i', fetch.imageID]);
            // scan.add(['-m', fetch.manifest]);
            // scan.add(['-t', fetch.timeout]);
            scan.add(['-g']); // Generate the manifest
            if (fetch.remote) {
                scan.add(['-P']);
            }
            // scan.add(['-V']);
        }
        else { // Scan command
            scan.add(['scan']);
            // scan.add(['-b', fetch.policybundle]);
            scan.add(['-d', fetch.dockerfile]);
            // scan.add(['-v', fetch.archives]);
            // scan.add(['-t', fetch.timeout]);
            // scan.add(['-f']);
            if (fetch.remote) {
                scan.add(['-p']);
            }
            // scan.add(['-r']);
            // scan.add(['-V']);
        }

        scan.add([fetch.image]);
        console.log('Scanning: ', scan.args);

        var bash = tl.which('bash');
        var inlinescan: tr.ToolRunner = tl.tool(bash).line(scan.args);
        var code = await inlinescan.exec();
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

// Run the task
run();
