import React from 'react';
import { useLocation } from 'react-router-dom';
import { MoniteProvider, MoniteApp } from '@monite/react-kit';

import Routes from 'features/app/routes';

import styles from './styles.module.scss';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const monite = new MoniteApp({
    apiKey: '',
    locale: 'en',
  });

  return (
    <MoniteProvider monite={monite}>
      <div className={styles.app}>
        <Routes />
      </div>
    </MoniteProvider>
  );
}

export default App;
