
//
//  Interface to parse the `evaluate check` json into.
//
export interface EvaluateCheckResults {
    detail: string;
    last_evaluation: string;
    policyId: string;
    status: string;
}


//
//  Interface to parse the EvaluateCheckResults interface into. This is used
//  to return results in a nicer way so it's easier to print out.
//
export interface EvaluateCheckReport {
    results: EvaluateCheckResults;
    sha: string;
    image: string;
    url: string;
}

