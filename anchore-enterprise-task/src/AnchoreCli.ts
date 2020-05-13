
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';

export class AnchoreCli {

    private _args: string[];
    private _path: string;
    private _image: string;

    constructor() {
        const fetch: InputFetch = new InputFetch();
        this._args = new Array('--json',
                               '--u', fetch.username,
                               '--p', fetch.password,
                               '--url', fetch.url);

        this._path = tl.which('anchore-cli', true);
        this._image = fetch.image;
    }

    run(arg: string[]): any {
        const args = this._args
                         .concat(arg);

        var out: tr.IExecSyncResult = tl.execSync(this._path, args, {"silent": true});
        // if (out.code != 0) {
        //     console.log(out.stderr);
        //     console.log(out.error);
        //     throw new Error(this._path + args.join(' ') + ' operation failed');
        // }
        //
        // return JSON.parse(out.stdout);
        return out;

    }

    image(cmd: string[]): any {


        var out: tr.IExecSyncResult = this.run(
            new Array('image').concat(cmd)
        );

        if (out.code != 0) {
            console.log(out.stderr);
            console.log(out.error);
            throw new Error('image operation failed');
        }

        return JSON.parse(out.stdout);

    }

    scanImage() {

        console.log(this.run(['image', 'add', this._image]));
        console.log(this.run(['image', 'wait', this._image]));
        console.log(this.run(['image', 'vuln', this._image, 'all']));
        console.log(this.run(['evaluate', 'check', this._image]));

    }
}
