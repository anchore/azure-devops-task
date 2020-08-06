import tl = require('azure-pipelines-task-lib/task');


export class InputFetch {

    constructor() { }

    //
    // Getters
    //
    // Return each corresponding input.
    //
    get image(): string  {
        return this.fetchString('image', true);
    }

    get dockerfile(): string  {
        return this.fetchPath('dockerfile', false, true);
    }

    get policy(): string  {
        return this.fetchPath('customPolicyPath', false, true);
    }

    get failbuild(): boolean {
        return tl.getBoolInput('failBuild');
    }

    get debug(): boolean {
        return tl.getBoolInput('debug');
    }

    get includepackages(): boolean {
        return tl.getBoolInput('includeAppPackages');
    }

    get timeout(): string {
        return this.fetchString('timeout', false);
    }

    get version(): string {
        return this.fetchString('anchoreVersion', false);
    }

    get printvulnreport(): boolean {
        return tl.getBoolInput('printVulnerabilityReport');
    }

    //
    // Error function for the 'fetch*' functions.
    //
    private error (input: string, required: boolean): string {
        if (required) {
            tl.setResult(tl.TaskResult.Failed, input.toUpperCase().concat(' fetch failed.'));
        }
        return '';
    }


    //
    // Fetch a path input from the task.
    //
    private fetchPath (input: string, required: boolean, check: boolean): string {

        const ti: string | undefined = tl.getPathInput(input, required, check);

        if (ti === undefined || ti.length == 0) {
            return this.error(input, required);
        }
        return ti;
    }

    //
    // Fetch a string input from the task.
    //
    private fetchString (input: string, required: boolean): string {

        const ti: string | undefined = tl.getInput(input, required);

        if (ti === undefined || ti.length == 0) {
            return this.error(input, required);
        }
        return ti;
    }

}
