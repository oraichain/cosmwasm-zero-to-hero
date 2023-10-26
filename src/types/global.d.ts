declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // config for ibc denom
      ATOM_ORAICHAIN_DENOM: string;
      OSMOSIS_ORAICHAIN_DENOM: string;

      // config for oraichain token
      AIRI_CONTRACT: string;
      ORAIX_CONTRACT: string;
      USDT_CONTRACT: string;

      // config for oraichain contract
      KWT_CONTRACT: string;
      MILKY_CONTRACT: string;
      SCORAI_CONTRACT: string;

      // config for ibc wasm contract (cw20-ics20)
      MULTICALL_CONTRACT: string;
      LCD: string;
    }
  }
}

export {};
