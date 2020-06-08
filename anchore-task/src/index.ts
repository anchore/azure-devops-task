import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanArgs } from './ScanArgs';


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
