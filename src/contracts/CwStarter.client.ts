/**
* This file was automatically generated by @oraichain/ts-codegen@0.35.8.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @oraichain/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {InstantiateMsg, ExecuteMsg, QueryMsg, MigrateMsg, Addr, AllPollsResponse, Poll, PollResponse, VoteResponse, Ballot} from "./CwStarter.types";
export interface CwStarterReadOnlyInterface {
  contractAddress: string;
  allPolls: () => Promise<AllPollsResponse>;
  poll: ({
    pollId
  }: {
    pollId: string;
  }) => Promise<PollResponse>;
  getVote: ({
    address,
    pollId
  }: {
    address: string;
    pollId: string;
  }) => Promise<VoteResponse>;
}
export class CwStarterQueryClient implements CwStarterReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.allPolls = this.allPolls.bind(this);
    this.poll = this.poll.bind(this);
    this.getVote = this.getVote.bind(this);
  }

  allPolls = async (): Promise<AllPollsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_polls: {}
    });
  };
  poll = async ({
    pollId
  }: {
    pollId: string;
  }): Promise<PollResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      poll: {
        poll_id: pollId
      }
    });
  };
  getVote = async ({
    address,
    pollId
  }: {
    address: string;
    pollId: string;
  }): Promise<VoteResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      vote: {
        address,
        poll_id: pollId
      }
    });
  };
}
export interface CwStarterInterface extends CwStarterReadOnlyInterface {
  contractAddress: string;
  sender: string;
  createPoll: ({
    options,
    pollId,
    question
  }: {
    options: string[];
    pollId: string;
    question: string;
  }, _fee?: number | StdFee | "auto", _memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  vote: ({
    pollId,
    vote
  }: {
    pollId: string;
    vote: string;
  }, _fee?: number | StdFee | "auto", _memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class CwStarterClient extends CwStarterQueryClient implements CwStarterInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.createPoll = this.createPoll.bind(this);
    this.vote = this.vote.bind(this);
  }

  createPoll = async ({
    options,
    pollId,
    question
  }: {
    options: string[];
    pollId: string;
    question: string;
  }, _fee: number | StdFee | "auto" = "auto", _memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      create_poll: {
        options,
        poll_id: pollId,
        question
      }
    }, _fee, _memo, _funds);
  };
  vote = async ({
    pollId,
    vote
  }: {
    pollId: string;
    vote: string;
  }, _fee: number | StdFee | "auto" = "auto", _memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      vote: {
        poll_id: pollId,
        vote
      }
    }, _fee, _memo, _funds);
  };
}