import {Addr} from "./types";
export type AssetInfo = {
  token: {
    contract_addr: Addr;
  };
} | {
  native_token: {
    denom: string;
  };
};
export type Uint128 = string;
export interface InstantiateMsg {
  config: Config;
  make_orders_config: MakeOrdersConfigInstantiate;
}
export interface Config {
  executors: Addr[];
  factory_v1_contract: Addr;
  factory_v2_contract: Addr;
  oracle_contract: Addr;
  orderbook_contract: Addr;
  owner: Addr;
  router_contract: Addr;
}
export interface MakeOrdersConfigInstantiate {
  base_asset: AssetInfo;
  base_threshold: Uint128;
  buy_depth: Uint128;
  depth_percentage: string;
  key_oracle: string;
  min_base_volume_order: Uint128;
  min_quote_volume_order: Uint128;
  oracle_diff_percentage: string;
  quote_asset: AssetInfo;
  quote_threshold: Uint128;
  sell_depth: Uint128;
  spread_range: string;
  step_size: string;
  total_orders: number;
}
export type ExecuteMsg = {
  set_pause: {
    permission: boolean;
  };
} | {
  update_make_orders_config: {
    make_orders_config: MakeOrdersConfig;
  };
} | {
  update_config: {
    cancel_all_orders?: boolean | null;
    config: Config;
  };
} | {
  cancel_all_orders: {};
} | {
  cancel_all_differ_orders: {
    index_price: Decimal;
  };
} | {
  make_orders: {};
} | {
  generate_orders: {
    index_price: Decimal;
    oracle_price: Decimal;
  };
} | {
  withdraw: {};
};
export type Decimal = string;
export type IndexPriceType = "a_m_m" | "mid_price" | "oracle_price";
export interface MakeOrdersConfig {
  base_asset: AssetInfo;
  base_threshold: Uint128;
  depth_percentage: Decimal;
  expected_buy_depth: Uint128;
  expected_sell_depth: Uint128;
  first_time_create_orders_mode: IndexPriceType;
  is_first_time_create_order: boolean;
  key_oracle: string;
  min_base_volume_order: Uint128;
  min_quote_volume_order: Uint128;
  oracle_diff_percentage: Decimal;
  pause: boolean;
  quote_asset: AssetInfo;
  quote_threshold: Uint128;
  spread_range: Decimal;
  step_size: Decimal;
  total_orders: number;
}
export type QueryMsg = {
  get_config: {};
} | {
  get_make_orders_config: {};
} | {
  get_balances: {};
};
export interface MigrateMsg {}
export interface GetBalancesResponse {
  base_asset: Asset;
  quote_asset: Asset;
}
export interface Asset {
  amount: Uint128;
  info: AssetInfo;
}