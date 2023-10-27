import { createRoot } from 'react-dom/client';

import nb from './notebook';
import './index.css';
import { useEffect, useRef, useState } from 'react';

const options = [
  { value: 'cw-starter', label: 'Cosmwasm Starter' },
  { value: 'cw-cw20', label: 'Cosmwasm CW20 Contract' }
];

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
