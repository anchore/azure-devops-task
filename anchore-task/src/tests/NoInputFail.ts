import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import { answers } from './common';

let taskPath = path.join(__dirname, '..', 'index.js');
let mock: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

// Don't set any inputs

answers.exec[`mock/bash /tmp/inline_scan.sh scan`] = {
    "code": 1,
    "stdout": "Scan image",
    "stderr": "Need an image to scan."
};
mock.setAnswers(answers)
mock.run();
