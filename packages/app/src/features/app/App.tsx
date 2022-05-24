import { Routes, Route, Navigate } from 'react-router-dom';

import PageCounterparts from 'features/counterparts/PageCounterparts';

import styles from './styles.module.scss';

const ROUTES = {
  counterparts: '/counterparts',
};

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
        <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
      </Routes>
    </div>
  );
}

export default App;
