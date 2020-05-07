import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { ScanString } from './ScanString';


async function run() {
    try {
        const fetch: InputFetch = new InputFetch();


        const scanner: string = `/tmp/inline_scan.sh`;

        var docker = tl.which('docker', true);
        var curl = tl.which('curl', true);
        var curltool: tr.ToolRunner = tl.tool(curl).arg([
            '-s', 'https://ci-tools.anchore.io/inline_scan-latest',
            '-o', scanner
        ]);
        var code: number = await curltool.exec();

        var scanstr: ScanString = new ScanString(scanner);

        // Build the string based off inputs
        if (fetch.stateful) {
            scanstr.add(['analyze']);
            scanstr.add(['-r', fetch.url]);
            scanstr.add(['-u', fetch.username]);
            scanstr.add(['-p', fetch.password]);
            // scanstr.add(['-a', fetch.annotations]);
            // scanstr.add(['-d', fetch.digest]);
            scanstr.add(['-f', fetch.dockerfile]);
            // scanstr.add(['-i', fetch.imageID]);
            // scanstr.add(['-m', fetch.manifest]);
            // scanstr.add(['-t', fetch.timeout]);
            scanstr.add(['-g']); // Generate the manifest
            if (fetch.remote) {
                scanstr.add(['-P']);
            }
            // scanstr.add(['-V']);
        }
        else {
            scanstr.add(['scan']);
            // scanstr.add(['-b', fetch.policybundle]);
            scanstr.add(['-d', fetch.dockerfile]);
            // scanstr.add(['-v', fetch.archives]);
            // scanstr.add(['-t', fetch.timeout]);
            scanstr.add(['-f']);
            if (fetch.remote) {
                scanstr.add(['-p']);
            }
            // scanstr.add(['-r']);
            // scanstr.add(['-V']);
        }

        if (fetch.dockerfile != "") {
            console.log(fetch.dockerfile);
        }


        scanstr.add([fetch.image]);
        console.log('SCANNING: ', scanstr.args);

        var bash = tl.which('bash');
        var inlinescan: tr.ToolRunner = tl.tool(bash).line(scanstr.args);
        code = await inlinescan.exec();
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

