import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ApprovalPolicies,
  Counterparts,
  Payables,
  Receivables,
  Products,
  Tags,
  Onboarding,
} from '@monite/sdk-react';

import { ROUTES } from './consts';

export const Base = () => {
  return (
    <Routes>
      <Route path={ROUTES.counterparts} element={<Counterparts />} />
      <Route path={`${ROUTES.payables}/*`}>
        <Route index element={<Payables />} />
        <Route path=":id" element={<Payables />} />
      </Route>

      <Route path={ROUTES.settings} element={<Navigate to={ROUTES.tags} />} />
      <Route path={ROUTES.approvalPolicies} element={<ApprovalPolicies />} />
      <Route path={ROUTES.tags} element={<Tags />} />
      <Route path={ROUTES.receivables} element={<Receivables />} />
      <Route path={ROUTES.products} element={<Products />} />
      <Route path={ROUTES.onboarding} element={<Onboarding />} />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};
