import { Routes, Route, Navigate } from 'react-router-dom';

import PageCounterparts from 'features/counterparts/PageCounterparts';
import PagePayables from 'features/payables/PagePayables';
import PageReceivables from 'features/receivables/PageReceivables';
import PageApprovalPolicies from 'features/approvalPolicies/PageApprovalPolicies';
import PageTags from 'features/tags/PageTags';
import EmptyPage from 'features/app/Layout/EmptyPage';

import { ROUTES } from 'consts';
import { navigationData } from 'features/app/Layout/Menu/consts';

const AuthorizedArea = () => {
  return (
    <Routes>
      <Route path={ROUTES.counterparts} element={<PageCounterparts />} />
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
      <Route path={ROUTES.tags} element={<PageTags />} />
      <Route
        path={ROUTES.dashboard}
        element={
          <EmptyPage
            label={navigationData.dashboard.label}
            renderIcon={navigationData.dashboard.renderIcon}
            apiLink={navigationData.dashboard.apiLink}
          />
        }
      />
      <Route path={ROUTES.receivables} element={<PageReceivables />} />
      <Route
        path={ROUTES.products}
        element={
          <EmptyPage
            label={navigationData.products.label}
            renderIcon={navigationData.products.renderIcon}
            apiLink={navigationData.products.apiLink}
          />
        }
      />
      <Route
        path={ROUTES.audit}
        element={
          <EmptyPage
            label={navigationData.audit.label}
            renderIcon={navigationData.audit.renderIcon}
            apiLink={navigationData.audit.apiLink}
          />
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};

export default AuthorizedArea;
