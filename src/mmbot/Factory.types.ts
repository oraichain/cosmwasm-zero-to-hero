import {Addr} from "./types";
export interface InstantiateMsg {
  admin?: Addr | null;
}
export type ExecuteMsg = {
  update_strategy: {
    code_id: number;
    strategy: STRAGEGY;
  };
} | {
  update_config: {
    admin?: Addr | null;
  };
} | {
  create_bot: {
    instantiate_msg: Binary;
    label: string;
    strategy: STRAGEGY;
  };
};
export type STRAGEGY = "make_profit" | "draw_chart";
export type Binary = string;
export type QueryMsg = {
  get_config: {};
} | {
  get_bot_by_id: {
    bot_id: number;
  };
} | {
  get_bots_by_owner: {
    limit?: number | null;
    owner: Addr;
    start_after?: number | null;
  };
} | {
  get_bots_by_strategy: {
    limit?: number | null;
    start_after?: number | null;
    strategy: STRAGEGY;
  };
};
export type MigrateMsg = string;
export interface MarketMakerBotContractProperties {
  contract_address: Addr;
  owner: Addr;
  strategy: number;
}
export interface BotsByOwnerResponse {
  bots: MarketMakerBotContractProperties[];
}
export type ConfigResponse = Config;
export interface Config {
  admin: Addr;
}