import tl = require('azure-pipelines-task-lib/task');


export class InputFetch {

    constructor() { }

    //
    // Getters
    //
    // Return each corresponding input.
    //
    get url(): string  {
        return this.fetchString('url', false);
    }

    get username(): string  {
        return this.fetchString('username', false);
    }

    get password(): string  {
        return this.fetchString('password', false);
    }

    get image(): string  {
        return this.fetchString('image', true);
    }

    get stateful(): boolean {
        return tl.getBoolInput('stateful');
    }

    get dockerfile(): string  {
        return this.fetchPath('dockerfile', false, true);
    }

    get remote(): boolean {
        return tl.getBoolInput('remoteImage');
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
