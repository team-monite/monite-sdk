import React from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Routes from 'features/app/routes';

import styles from './styles.module.scss';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={styles.app}>
      <Routes />
    </div>
  );
}

export default observer(App);
