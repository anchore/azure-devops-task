import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';

async function run() {
    try {
        const fetch = new InputFetch();
        console.log('URL',      fetch.url);
        console.log('Username', fetch.username);
        console.log('Password', fetch.password);
        console.log('Image',    fetch.image);

        var toolpath = tl.which('docker');
        console.log(toolpath);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
