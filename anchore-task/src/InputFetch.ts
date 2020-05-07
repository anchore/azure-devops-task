
import tl = require('azure-pipelines-task-lib/task');



export class InputFetch {

    private _url        : string;
    private _username   : string;
    private _password   : string;
    private _image      : string;
    private _stateful   : boolean;
    private _dockerfile : string;
    private _remote     : boolean;

    constructor() {
        this._url      = this.fetchString('url',      false);
        this._username = this.fetchString('username', false);
        this._password = this.fetchString('password', false);
        this._image    = this.fetchString('image',    true);

        this._stateful = tl.getBoolInput('stateful');

        this._dockerfile = this.fetchPath('dockerfile', false, true);
        this._remote = tl.getBoolInput('remoteImage');

    }


    //
    // Getters
    //
    // Return all the inputs
    //
    get url()        : string  { return 'http://'.concat(this._url.concat(':8228/v1')); }
    get username()   : string  { return this._username; }
    get password()   : string  { return this._password; }
    get image()      : string  { return this._image; }
    get stateful()   : boolean { return this._stateful; }
    get dockerfile() : string  { return this._dockerfile; }
    get remote()     : boolean { return this._remote; }



    //
    // Error function for the 'fetchstring' function
    //
    private error(input: string, required: boolean): string {
        if (required) {
            tl.setResult(tl.TaskResult.Failed, input.toUpperCase().concat(' fetch failed.'));
        }
        return "";
    }


    //
    // Fetch the inputs from the task
    //
    private fetchPath(input: string, required: boolean, check: boolean): string {

        const ti: string | undefined = tl.getPathInput(input, required, check);

        if (ti === undefined || ti.length == 0) {
            return this.error(input, required);
        }

        return ti;
    }

    //
    // Fetch the inputs from the task
    //
    private fetchString(input: string, required: boolean): string {

        const ti: string | undefined = tl.getInput(input, required);

        if (ti === undefined || ti.length == 0) {
            return this.error(input, required);
        }

        return ti;
    }

}
