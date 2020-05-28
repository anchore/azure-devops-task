import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
// Grab common answers
import { answers } from './common';


let taskPath = path.join(__dirname, '..', 'index.js');
let mock: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

mock.setInput('url',         'www.anchore.com');
mock.setInput('username',    'James');
mock.setInput('password',    'Foo');
mock.setInput('image',       'testimage:latest');
mock.setInput('stateful',    'false');
mock.setInput('dockerfile',  'mock/Dockerfile');
mock.setInput('remoteImage', 'false');

// Add test case to common answers
answers.exec[`mock/bash /tmp/inline_scan.sh scan -d mock/Dockerfile testimage:latest`] = {
    "code": 0,
    "stdout": "Scan the image",
    "stderr": ""
};

mock.setAnswers(answers)
mock.run();
