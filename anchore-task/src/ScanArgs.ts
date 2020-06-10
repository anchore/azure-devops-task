
export class ScanArgs {

    private _args: string;

    // Constructor should take the path to the command to run
    // In this case it will take the path to inline_scan.sh
    constructor (cmdpath: string) {
        this._args = cmdpath;
    }

    get args () : string {
        return this._args;
    }

    // Concatenate a list of commands to the private _args
    add (args: string[]) {

        let tmp: string = '';

        args.forEach(s => {

            if (s == '') {
                tmp = '';
                return;
            }

            tmp = tmp.concat(' ', s);
        })
        this._args = this._args.concat(tmp);
    }
}
