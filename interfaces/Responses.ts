import { Candidate, UsageMetadata } from "./Appinterfaces";

export interface APIResponse {
    candidates:    Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion:  string;
}

