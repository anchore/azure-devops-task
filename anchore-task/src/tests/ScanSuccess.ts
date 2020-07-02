import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
// Grab common answers
import { answers, fsClone } from './common';


let taskPath = path.join(__dirname, '..', 'index.js');
let mock: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

mock.setInput('image',              'testimage:latest');
mock.setInput('dockerfile',         'mock/Dockerfile');
mock.setInput('failBuild',          'true');
mock.setInput('customPolicyPath',   'mock/policy-bundle.json');


// Add test case to common answers
answers.exec[`mock/bash /tmp/inline_scan.sh scan -b mock/policy-bundle.json -d mock/Dockerfile -r testimage:latest`] = {
    'code': 0,
    'stdout': 'Scan the image',
    'stderr': ''
};

// Register fsClone from common.ts
mock.registerMock('fs', fsClone);
mock.setAnswers(answers)
mock.run();
