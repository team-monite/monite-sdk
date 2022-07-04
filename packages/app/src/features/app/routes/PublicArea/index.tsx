import { Routes, Route, Navigate } from 'react-router-dom';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PageCounterpartsCreate from 'features/counterparts/PageCounterpartsCreate';
import PagePayables from 'features/payables/PagePayables';

import { ROUTES } from 'features/app/consts';

const PublicArea = () => {
  return (
    <Routes>
      <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
      <Route
        path={ROUTES.counterpartsCreate}
        element={<PageCounterpartsCreate />}
      />
      <Route path={ROUTES.payables} element={<PagePayables />} />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};

export default PublicArea;
