import tl = require('azure-pipelines-task-lib/task');

import { InputFetch } from './InputFetch';

async function run() {
    try {
        const fetch = new InputFetch();
        // console.log('URL',      fetch.url);
        // console.log('Username', fetch.username);
        // console.log('Password', fetch.password);
        // console.log('Image',    fetch.image);
        console.log('Command',  fetch.command);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
