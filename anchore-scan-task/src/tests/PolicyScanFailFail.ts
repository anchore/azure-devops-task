import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
// Grab common answers and fsClone
import { answers, fsClone, vulnerabilities } from './common';


let taskPath = path.join(__dirname, '..', 'index.js');
let mock: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

mock.setInput('image', 'testimage:latest');
mock.setInput('failBuild', 'true');

// Add the test case to common answers
answers.exec[`mock/bash /tmp/inline_scan.sh scan -r testimage:latest`] = {
    'code': 0,
    'stdout': 'Scan the image [base case]',
    'stderr': ''
};

fsClone.readFileSync = function(file: string): string {
    let mockjson = '';
    if (file.indexOf('vulnerabilities') != -1) {
        mockjson = vulnerabilities;
    }
    else {
        mockjson = `
        [
            {
                "sha256:12345": {
                    "localhost:5000/mock:local": [
                        {
                            "detail": {},
                            "last_evaluation": "mock-time",
                            "policyId": "mock-id",
                            "status": "fail"
                        }
                    ]
                }
            }
        ]`;
    }
    return mockjson;
}
// Register fsClone from common.ts
mock.registerMock('fs', fsClone);

mock.setAnswers(answers)
mock.run();
