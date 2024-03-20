import { createRoot } from 'react-dom/client';

import nb from '@oraichain/notebookjs';
import './index.css';
import { useEffect, useRef, useState } from 'react';

const options = [
  { value: 'custom', label: 'Custom Scripts' },
  { value: 'cw-starter', label: 'Cosmwasm Starter' },
  { value: 'cw-cw20', label: 'Cosmwasm CW20 Contract' },
  { value: 'perpetual', label: 'Cosmwasm Perpetual Contract' },
  { value: 'transfer-perpetual', label: 'Cosmwasm Perpetual Transfer List' }
];

nb.sandboxFrame.simulate = true;
window.onload = async () => {
  if (window.keplr) {
    nb.sandboxFrame.window.keplr = window.keplr;
    const OraiToken = {
      coinDenom: 'ORAI',
      coinMinimalDenom: 'orai',
      coinDecimals: 6,
      coinGeckoId: 'oraichain-token',
      gasPriceStep: {
        low: 0.003,
        average: 0.005,
        high: 0.007
      }
    };
    const defaultBech32Config = (mainPrefix, validatorPrefix = 'val', consensusPrefix = 'cons', publicPrefix = 'pub', operatorPrefix = 'oper') => {
      return {
        bech32PrefixAccAddr: mainPrefix,
        bech32PrefixAccPub: mainPrefix + publicPrefix,
        bech32PrefixValAddr: mainPrefix + validatorPrefix + operatorPrefix,
        bech32PrefixValPub: mainPrefix + validatorPrefix + operatorPrefix + publicPrefix,
        bech32PrefixConsAddr: mainPrefix + validatorPrefix + consensusPrefix,
        bech32PrefixConsPub: mainPrefix + validatorPrefix + consensusPrefix + publicPrefix
      };
    };

    await window.keplr.experimentalSuggestChain({
      rpc: 'https://rpc.orai.io',
      rest: 'https://lcd.orai.io',
      chainId: 'Oraichain',
      chainName: 'Oraichain',
      stakeCurrency: OraiToken,
      bip44: {
        coinType: 118
      },
      bech32Config: defaultBech32Config('orai'),
      feeCurrencies: [OraiToken],
      features: ['ibc-transfer', 'cosmwasm', 'wasmd_0.24+'],
      currencies: [OraiToken]
    });
    await window.keplr.experimentalSuggestChain({
      rpc: 'https://testnet.rpc.orai.io',
      rest: 'https://testnet.lcd.orai.io',
      chainId: 'Oraichain-testnet',
      chainName: 'Oraichain Testnet',
      stakeCurrency: OraiToken,
      bip44: {
        coinType: 118
      },
      bech32Config: defaultBech32Config('orai'),
      feeCurrencies: [OraiToken],
      features: ['ibc-transfer', 'cosmwasm', 'wasmd_0.24+'],
      currencies: [OraiToken]
    });
  }
};

// depedencies
nb.updateDepedencies({
  'ts-results': require('ts-results'),
  bech32: require('bech32'),
  '@oraichain/oraimargin-contracts-sdk': require('@oraichain/oraimargin-contracts-sdk'),
  '@oraichain/oraidex-common': require('@oraichain/oraidex-common'),
  'cosmjs-types': require('cosmjs-types'),
  '@cosmjs/stargate': require('@cosmjs/stargate'),
  '@cosmjs/cosmwasm-stargate': require('@cosmjs/cosmwasm-stargate'),
  '@oraichain/cw-simulate': require('@oraichain/cw-simulate'),
  '@oraichain/common-contracts-sdk': require('@oraichain/common-contracts-sdk'),
  '@cosmjs/tendermint-rpc': require('@cosmjs/tendermint-rpc'),
  './contracts': require('./contracts')
});

const url = new URL(location.href);

const App = () => {
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
  const [simulate, setSimulate] = useState(true);
  const ref = useRef();

  useEffect(() => {
    const defaultOpt = options.find((opt) => opt.value === url.searchParams.get('nb')) ?? options[0];
    changeNotebook(defaultOpt.value);
  }, []);

  const runAll = async () => {
    setDisabled(true);
    await nb.runAll();
    setDisabled(false);
  };

  const switchSimulate = (event) => {
    document.getElementById('sandboxFrame').contentWindow.simulate = event.target.checked;
    setSimulate(event.target.checked);
  };

  const changeNotebook = async (value) => {
    setValue(value);
    window.scrollTo(0, 0);
    url.searchParams.set('nb', value);
    history.pushState({}, null, url.toString());
    const notebook = await nb.fetch(value);
    if (ref.current.lastElementChild) {
      ref.current.replaceChild(notebook.render(), ref.current.lastElementChild);
    } else {
      ref.current.appendChild(notebook.render());
    }
  };

  return (
    <div>
      <div className="nb-list">
        {options.map((opt, ind) => (
          <button className={value === opt.value ? 'selected' : ''} key={opt.value} onClick={() => changeNotebook(opt.value)}>
            {ind + 1}.{opt.label}
          </button>
        ))}
      </div>

      <h2 className="simulate">
        <label htmlFor="simulate">
          Simulate <small>(simulate === true)</small>
        </label>
        <input id="simulate" type="checkbox" checked={simulate} onChange={switchSimulate} />
      </h2>

      <a style={{ marginLeft: 20 }} target="_blank" href="https://faucet.orai.io/">
        <strong>Testnet Faucet</strong>
      </a>

      <button className="selected runall" disabled={disabled} onClick={runAll}>
        Run all
      </button>

      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
