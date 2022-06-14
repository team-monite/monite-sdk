import { Routes, Route, Navigate } from 'react-router-dom';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PageCounterpartsCreate from 'features/counterparts/PageCounterpartsCreate';

import styles from './styles.module.scss';

export const ROUTES = {
  counterparts: '/counterparts',
  counterpartsCreate: '/counterparts/create',
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
        <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
      </Routes>
    </div>
  );
}

export default App;
