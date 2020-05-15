
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import { InputFetch } from './InputFetch';
import { EvaluateCheckResults, EvaluateCheckReport } from './EvaluateCheckOutput';

export class AnchoreCli {

    private _args: string[];
    private _path: string;
    private _image: string;
    private _dockerfile: string;

    constructor() {
        const fetch: InputFetch = new InputFetch();
        this._args = new Array('--json',
                               '--u', fetch.username,
                               '--p', fetch.password,
                               '--url', fetch.url);

        this._path = tl.which('anchore-cli', true);
        this._image = fetch.image;
        this._dockerfile = fetch.dockerfile;
    }

    run(arg: string[]): any {
        const args = this._args
                         .concat(arg);

        console.log(this._path, args.join(' '));

        return tl.execSync(this._path, args, {"silent": false});
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

        var ret: any;
        try {
            ret = JSON.parse(out.stdout);
        }
        catch {
            ret = out.stdout;
        }
        return ret;

    }

    scanImage() {
        console.log("DOCKERFILE:", this._dockerfile);

        var addCmd: string[] = ['add', this._image];
        if (this._dockerfile) {
            addCmd = addCmd.concat(['--dockerfile', this._dockerfile]);
        }

        console.log(addCmd);

        console.log(this.image(addCmd));
        console.log(this.image(['wait', this._image]));
        const out: tr.IExecSyncResult = this.run(['evaluate', 'check', this._image]);

        console.log(out.stdout);

        try {
            const json = JSON.parse(out.stdout);

            const ecr = this.getScanResults(json);

            console.log("-----------------------------");
            console.log("");
            console.log("Last Evaluation: ", ecr.results.last_evaluation);
            console.log("Policy ID:       ", ecr.results.policyId);
            console.log("Status:          ", ecr.results.status);
            console.log("");
            console.log("To see the full report please visit:");
            console.log("    ", ecr.url);
            console.log("");
            console.log("-----------------------------");
            console.log("");
        }
        catch {}

        if (out.code != 0) {// || ecr.results.status == "fail") {
            // Image fails policy check, generate report and fail pipeline
            throw new Error("Image did not pass inspection");
        }
    }

    //
    //  Traverse into the json and return the results
    //
    private getScanResults(json: any): EvaluateCheckReport {

        var j = json[0];
        var keys = Object.keys(j);
        var found: boolean = false;
        var image: string = "";
        var sha: string = "";
        while ( keys.length > 0 ) {


            keys.forEach( k => {
                if (k.indexOf('sha256:') >= 0) {
                    sha = k;
                }
                else if (k.indexOf(this._image) >= 0) {
                    found = true;
                    image = k;
                }
            });

            if ( found ) {
                break;
            }

            if (keys[0] == '0') {
                // Step into the array
                j = j[0];
            }
            else {
                j = j[keys[0]];
            }
            keys = Object.keys(j);

        }

        var fnd = <EvaluateCheckResults[]>j[image];

        const fetch: InputFetch = new InputFetch();

        const uu = fetch.url.split('/');
        const urlArray = new Array((uu[0] + '//' + uu[2]),
                                 'image')
                                 .concat(image.split(':'))
                                 .concat(sha);


        const ecr: EvaluateCheckReport = {
            results : fnd[0],
            sha     : sha,
            image   : image,
            url     : urlArray.join('/')
        }


        return ecr;
    }
}

