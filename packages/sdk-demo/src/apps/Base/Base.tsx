import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  ApprovalRequests,
  Counterparts,
  Payables,
  Receivables,
  Products,
  Tags,
  Onboarding,
  RolesAndApprovalPolicies,
} from '@monite/sdk-react';
import { Box } from '@mui/material';

import { ROUTES } from './consts';

export const Base = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.counterparts}
        element={
          <Gutter>
            <Counterparts />
          </Gutter>
        }
      />
      <Route path={`${ROUTES.payables}/*`}>
        <Route
          index
          element={
            <Gutter>
              <Payables />
            </Gutter>
          }
        />
        <Route
          path=":id"
          element={
            <Gutter>
              <Payables />
            </Gutter>
          }
        />
      </Route>

      <Route
        path={ROUTES.settings}
        element={
          <Gutter>
            <Navigate to={ROUTES.tags} />
          </Gutter>
        }
      />
      <Route
        path={ROUTES.approvalRequests}
        element={
          <Gutter>
            <ApprovalRequests />
          </Gutter>
        }
      />
      <Route
        path={ROUTES.rolesApprovals}
        element={
          <Gutter>
            <RolesAndApprovalPolicies />
          </Gutter>
        }
      />
      <Route
        path={ROUTES.tags}
        element={
          <Gutter>
            <Tags />
          </Gutter>
        }
      />
      <Route
        path={ROUTES.receivables}
        element={
          <Gutter>
            <Receivables />
          </Gutter>
        }
      />
      <Route
        path={ROUTES.products}
        element={
          <Gutter>
            <Products />
          </Gutter>
        }
      />
      <Route path={ROUTES.onboarding} element={<Onboarding />} />
      <Route path="*" element={<Navigate to={ROUTES.counterparts} />} />
    </Routes>
  );
};

const Gutter = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: 'inherit',
      flex: 'inherit',
      flexDirection: 'inherit',
      minWidth: 'inherit',
      height: 'inherit',
      padding: 4,
    }}
  >
    {children}
  </Box>
);
