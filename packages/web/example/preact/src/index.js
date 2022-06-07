import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import MoniteApp from '@monite/web-kit';
import '@monite/web-kit/dist/monite.css';

import './style';

export default function App() {
  const divRef = useRef(null);

  useEffect(() => {
    (async () => {
      const monite = MoniteApp({
        apiKey: 'en-52cefd74-c7f2-4e3b-8ba9-61b4cf405cce',
      });

      const data =
        await monite.api.counterparts.getCounterpartsCounterpartsGet();

      monite
        .create('CounterpartsTable', {
          useMoniteApi: true,
        })
        .mount('#mydiv');

      console.log(monite, data);
    })();
  }, []);

  return (
    <div>
      <h1>Hello, World!</h1>
      <div id="mydiv" ref={divRef} />
    </div>
  );
}
