
export interface EvaluateCheckResults {
    detail: string;
    last_evaluation: string;
    policyId: string;
    status: string;
}

export interface EvaluateCheckReport {
    results: EvaluateCheckResults;
    sha: string;
    image: string;
    url: string;
}

