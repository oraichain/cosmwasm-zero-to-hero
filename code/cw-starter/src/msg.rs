use cosmwasm_schema::{cw_serde, QueryResponses};

// 13 Query
// + use crate::state:{Poll, Ballot};
use crate::state::{Ballot, Poll};

// 06 Instantiate
// - #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// - #[serde(rename_all = "snake_case")]
// - pub struct InstantiateMsg {
// -     pub val: String,
// - }
// + #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// + #[serde(rename_all = "snake_case")]
// + pub struct InstantiateMsg {
// +     pub admin: Option<String>,
// + }
#[cw_serde]
pub struct InstantiateMsg {
    pub admin: Option<String>,
}

// 08 ExecuteMsg
// - #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// - #[serde(rename_all = "snake_case")]
// - pub enum ExecuteMsg {
// -     CustomMsg { val: String },
// - }
// + #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// + #[serde(rename_all = "snake_case")]
// + pub enum ExecuteMsg {
// +     CreatePoll {
// +         poll_id: String,
// +         question: String,
// +         options: Vec<String>,
// +     },
// +     Vote {
// +         poll_id: String,
// +         vote: String,
// +     },
// + }
#[cw_serde]
pub enum ExecuteMsg {
    CreatePoll {
        poll_id: String,
        question: String,
        options: Vec<String>,
    },
    Vote {
        poll_id: String,
        vote: String,
    },
}

// 12 Query
// - #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// - #[serde(rename_all = "snake_case")]
// - pub enum QueryMsg {
// -     CustomMsg { val: String },
// - }
// + #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// + #[serde(rename_all = "snake_case")]
// + pub enum QueryMsg {
// +     AllPolls {},
// +     Poll {
// +         poll_id: String,
// +     },
// +     Vote {
// +         poll_id: String,
// +         address: String,
// +     },
// + }
#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(AllPollsResponse)]
    AllPolls {},
    #[returns(PollResponse)]
    Poll { poll_id: String },
    #[returns(VoteResponse)]
    Vote { poll_id: String, address: String },
}

// 12 QueryMsg
// - #[cw_serde]
// - #[serde(rename_all = "snake_case")]
// - pub struct CustomResponse {
// -     val: String,
// - }

// 13 Query
// + #[cw_serde]
// + pub struct AllPollsResponse {
// +     pub polls: Vec<Poll>,
// + }
#[cw_serde]
pub struct AllPollsResponse {
    pub polls: Vec<Poll>,
}

// 13 Query
// + #[cw_serde]
// + pub struct PollResponse {
// +     pub poll: Option<Poll>,
// + }
#[cw_serde]
pub struct PollResponse {
    pub poll: Option<Poll>,
}

// 13 Query
// + #[cw_serde]
// + pub struct VoteResponse {
// +     pub vote: Option<Ballot>,
// + }
#[cw_serde]
pub struct VoteResponse {
    pub vote: Option<Ballot>,
}

#[cw_serde]
pub enum MigrateMsg {}
