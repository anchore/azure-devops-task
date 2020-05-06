
import tl = require('azure-pipelines-task-lib/task');



export class InputFetch {

    private _url      : string;
    private _username : string;
    private _password : string;
    private _image    : string;

    constructor() {
        this._url      = this.fetch('url',      false);
        this._username = this.fetch('username', false);
        this._password = this.fetch('password', false);
        this._image    = this.fetch('image',    true);

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



    //
    // Error function for the 'fetch' function
    //
    private error(input: string, required: boolean): string {
        if (required) {
            tl.setResult(tl.TaskResult.Failed, input.toUpperCase().concat(' fetch failed.'));
            return "(failed)";
        }
        else {
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

}
