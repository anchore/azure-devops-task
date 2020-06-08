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

    get remote(): boolean {
        return tl.getBoolInput('remoteImage');
    }

    get policy(): string  {
        return this.fetchPath('policyBundle', false, true);
    }

    get failbuild(): boolean {
        return tl.getBoolInput('failBuild');
    }

    //
    // Error function for the 'fetch*' functions.
    //
    private error (input: string, required: boolean): string {
        if (required) {
            tl.setResult(tl.TaskResult.Failed, input.toUpperCase().concat(' fetch failed.'));
        }
        return "";
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
