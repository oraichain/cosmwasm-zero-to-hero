import { createRoot } from 'react-dom/client';

import nb from './notebook';
import './index.css';
import { useEffect, useRef, useState } from 'react';

const options = [{ value: 'cw-starter', label: 'Cosmwasm Starter' }];

const url = new URL(location.href);

const App = () => {
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
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
      <button className="selected runall" disabled={disabled} onClick={runAll}>
        Run all
      </button>

      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
