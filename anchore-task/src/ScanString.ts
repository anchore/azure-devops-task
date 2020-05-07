
export class ScanString {

    private _args: string;

    constructor(cmdpath: string) {
        this._args = cmdpath;
    }

    get args() : string {
        return this._args;
    }

    add(args: string[]) {

        var tmp: string = '';

        args.forEach(s => {

            console.log('Adding: ', s);
            if (s == '') {
                // throw new Error("Scanner argument is empty.");
                tmp = '';
                return;
            }

            tmp = tmp.concat(' ', s);
        })
        this._args = this._args.concat(tmp);
    }
}


