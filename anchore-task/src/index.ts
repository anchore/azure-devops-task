import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';


async function run() {
    try {
        const fetch = new InputFetch();
        console.log('Image',    fetch.image);

        var docker = tl.which('docker', true);
        // var dockertool: tr.ToolRunner = tl.tool(docker).arg(['pull', 'docker.io/anchore/inline-scan:v0.7.1']);
        // var code: number = await dockertool.exec();

        var curl = tl.which('curl', true);
        var curltool: tr.ToolRunner = tl.tool(curl).line('-s https://ci-tools.anchore.io/inline_scan-latest -o /tmp/inline_scan.sh');
        var code: number = await curltool.exec();

        var bash = tl.which('bash');
        var inlinescan: tr.ToolRunner = tl.tool(bash).arg(['/tmp/inline_scan.sh', fetch.image]);
        code = await inlinescan.exec();
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
