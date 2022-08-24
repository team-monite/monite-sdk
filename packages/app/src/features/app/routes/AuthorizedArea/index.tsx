import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PageCounterpartsCreate from 'features/counterparts/PageCounterpartsCreate';
import PagePayables from 'features/payables/PagePayables';
import PageApprovalPolicies from 'features/approvalPolicies/PageApprovalPolicies';

import { ROUTES } from 'features/app/consts';

const AuthorizedArea = () => {
  return (
    <Routes>
      <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
      <Route
        path={ROUTES.counterpartsCreate}
        element={<PageCounterpartsCreate />}
      />
      <Route path={ROUTES.payables}>
        <Route index element={<PagePayables />} />
        <Route path=":id" element={<PagePayables />} />
      </Route>
      <Route
        path={ROUTES.settings}
        element={<Navigate to={ROUTES.approvalPolicies} />}
      />
      <Route
        path={ROUTES.approvalPolicies}
        element={<PageApprovalPolicies />}
      />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};

export default observer(AuthorizedArea);
