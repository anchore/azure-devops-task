import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Input tests', function () {

    beforeEach (function() {
        process.env['INPUT_IMAGE'] = '';
        process.env['INPUT_DOCKERFILE'] = '';
        process.env['INPUT_CUSTOMPOLICYPATH'] = '';
        process.env['INPUT_TIMEOUT'] = '';
        process.env['INPUT_INCLUDEAPPPACKAGES'] = '';

        // Setting up the default behavior (as seen in Azure DevOps)
        process.env['INPUT_ANCHOREVERSION'] = '0.8.0';
        process.env['INPUT_FAILBUILD'] = 'false';
        process.env['INPUT_DEBUG'] = 'false';
        process.env['INPUT_PRINTVULNERABILITYREPORT'] = 'true';

        // These two variables must be set for local testing.
        process.env['BUILD_SOURCESDIRECTORY'] = 'mock';
    });

    after (() => {

    });

    //
    // Testing required inputs
    //
    it ('[SUCCEED] With only required inputs', function(done: MochaDone) {
        // Add success test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'DefaultCaseSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('[command]mock/bash /tmp/inline_scan.sh scan -r testimage:latest') >= 0, true, "Command is correct");

        assert.equal(tr.stdout.indexOf('image=testimage:latest') >= 0, true, "Input for image is correct");

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

    //
    // Testing a successful scan run
    //
    it ('[SUCCEED] With scan inputs', function(done: MochaDone) {
        // Add success test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'ScanSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('[command]mock/bash /tmp/inline_scan.sh scan -b mock/policy-bundle.json -d mock/Dockerfile -r testimage:latest') >= 0, true, "Command is correct");
        done();
    });

    //
    // Testing failBuild behavior
    //
    it ('[SUCCEED] With failBuild=false and policy scan fail result', function(done: MochaDone) {
        // Add success test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'PolicyScanFailSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('[task.setvariable variable=vulnerabilities;issecret=false;]mock/anchore-reports/vulnerabilities.json') >= 0, true, "Output is correct");
        assert.equal(tr.stdout.indexOf('[task.setvariable variable=billOfMaterials;issecret=false;]mock/anchore-reports/contents.json') >= 0, true, "Output is correct");
        done();
    });

    it ('[FAIL] With failBuild=true and a policy fail result', function(done: MochaDone) {
        // Add failure test here
        this.timeout(2000);

        let tp = path.join(__dirname, 'PolicyScanFailFail.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], "Anchore policy scan returned 'fail' result", 'error issue output');

        done();
    });
});
