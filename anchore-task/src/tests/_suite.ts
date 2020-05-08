import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Input tests', function () {

    before (function() {
        process.env['INPUT_URL'] = '';
        process.env['INPUT_USERNAME'] = '';
        process.env['INPUT_PASSWORD'] = '';
        process.env['INPUT_STATEFUL'] = '';
        process.env['INPUT_DOCKERFILE'] = '';
        process.env['INPUT_REMOTEIMAGE'] = '';
        process.env['INPUT_IMAGE'] = '';

    });

    after (() => {

    });

    it ('[SUCCEED] With only required inputs', function(done: MochaDone) {
        // Add success test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'DefaultCaseSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('[command]mock/bash /tmp/inline_scan.sh scan testimage:latest') >= 0, true, "Command is correct");

        assert.equal(tr.stdout.indexOf('image=testimage:latest') >= 0, true, "Input for image is correct");

        done();
    });

    it ('[SUCCEED] With scan inputs', function(done: MochaDone) {
        // Add success test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'ScanSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('[command]mock/bash /tmp/inline_scan.sh scan -d mock/Dockerfile testimage:latest') >= 0, true, "Command is correct");
        done();
    });

    it ('[FAIL] With no inputs given', function(done: MochaDone) {
        // Add failure test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'NoInputFail.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: image', 'error issue output');

        done();
    });
});
