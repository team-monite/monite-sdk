import React from 'react';
import { useLocation } from 'react-router-dom';
import { MoniteProvider, MoniteApp } from '@team-monite/ui-widgets-react';

import Routes from 'features/app/routes';

import styles from './styles.module.scss';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const monite = new MoniteApp({
    entityId: '805622a2-3926-4eae-92ec-3d9bd375cfa9',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6IjU5YTIzMGUyLWRjMzctNGNmMC04Njk3LTNiMDBhMjM3NTY0MSIsImNyZWF0ZWRfYXQiOiIyMDIyLTA5LTE1VDE2OjEyOjAzLjAwMjQ4NiJ9LCJleHAiOjE2NjMyNjAxMjN9.VsazsTnL3IelhSJGrIHuVqSJVhDM5NXjBJGpu0lkRSI',
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
