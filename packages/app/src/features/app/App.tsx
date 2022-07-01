import { Routes, Route, Navigate } from 'react-router-dom';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PageCounterpartsCreate from 'features/counterparts/PageCounterpartsCreate';

import PagePayables from 'features/payables/PagePayables';

import styles from './styles.module.scss';

export const ROUTES = {
  counterparts: '/counterparts',
  counterpartsCreate: '/counterparts/create',
  payables: '/payables',
};

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
        <Route
          path={ROUTES.counterpartsCreate}
          element={<PageCounterpartsCreate />}
        />
        <Route path={ROUTES.payables} element={<PagePayables />} />
        <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
      </Routes>
    </div>
  );
}

export default App;
