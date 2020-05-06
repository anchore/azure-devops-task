
import tl = require('azure-pipelines-task-lib/task');

export class InputFetch {

    private _url      : string;
    private _username : string;
    private _password : string;
    private _image    : string;
    private _command  : string;

    constructor() {
        this._url      = this.fetch('url',      true);
        this._username = this.fetch('username', true);
        this._password = this.fetch('password', true);
        this._image    = this.fetch('image',    false);

        this._command  = this.fetchCommand();
    }


    //
    // Getters
    //
    // Return all the inputs
    //
    get url()      : string { return this._url; }
    get username() : string { return this._username; }
    get password() : string { return this._password; }
    get image()    : string { return this._image; }
    get command()  : string { return this._command; }



    //
    // Error function for the 'fetch' function
    //
    private error(input: string, required: boolean): string {
        if (required) {
            throw new Error(input.toUpperCase().concat(' fetch failed.'));
            return "(failed)";
        }
        else {
            tl.setResult(tl.TaskResult.Skipped, input.toUpperCase().concat(' fetch failed.'));
            return "(skipped)";
        }
    }

    //
    // Fetch the inputs from the task
    //
    private fetch(input: string, required: boolean): string {

        const ti: string | undefined = tl.getInput(input, required);

        if (ti === undefined || ti.length == 0) {
            return this.error(input, required);
        }

        return ti;
    }



    //
    // Fetch the command input and ensure it is valid
    //
    private fetchCommand(): string {

        const ti: string = this.fetch('command', true);

        const commands: Array<string> = [
            'get',
            'add'
        ];

        if (!commands.includes(ti)) {
            throw new Error(ti.toUpperCase().concat(' command is invalid.'));
            return "(invalid)";
        }

        return ti;
    }

}
