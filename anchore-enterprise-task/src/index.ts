import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { AnchoreCli } from './AnchoreCli';

async function run() {
    try {

        const anchorecli: AnchoreCli = new AnchoreCli();
        anchorecli.scanImage();

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

