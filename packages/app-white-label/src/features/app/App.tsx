import React from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { MoniteProvider, MoniteApp } from '@monite/ui-widgets-react';

import Routes from 'features/app/routes';
import { store } from 'features/mobx';

import styles from './styles.module.scss';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const monite = new MoniteApp({
    // ex: en-52cefd74-c7f2-4e3b-8ba9-61b4cf405cce
    apiKey: store.auth.authUserToken || '',
    locale: 'en',
  });

  store.setMoniteApp(monite);

  return (
    <MoniteProvider
      monite={monite}
      theme={{
        // here we can override theme for the react-kit UI components
        colors: { grey: '#707070' },
      }}
    >
      <div className={styles.app}>
        <Routes />
      </div>
    </MoniteProvider>
  );
}

export default observer(App);
