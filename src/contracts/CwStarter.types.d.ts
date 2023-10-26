import { Addr } from "./types";
export interface InstantiateMsg {
    admin?: string | null;
}
export type ExecuteMsg = {
    create_poll: {
        options: string[];
        poll_id: string;
        question: string;
    };
} | {
    vote: {
        poll_id: string;
        vote: string;
    };
};
export type QueryMsg = {
    all_polls: {};
} | {
    poll: {
        poll_id: string;
    };
} | {
    vote: {
        address: string;
        poll_id: string;
    };
};
export type MigrateMsg = string;
export interface AllPollsResponse {
    polls: Poll[];
}
export interface Poll {
    creator: Addr;
    options: [string, number][];
    question: string;
}
export interface PollResponse {
    poll?: Poll | null;
}
export interface VoteResponse {
    vote?: Ballot | null;
}
export interface Ballot {
    option: string;
}
