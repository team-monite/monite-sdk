import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';

const StyledRow = styled('tr')`
  display: flex;
`;

const StyledCell = styled('td')`
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid ${palette.neutral80};
  display: flex;
  align-items: center;
  flex: 0 0 auto;

  tr:last-child & {
    border-bottom: none;
  }
`;

const StyledLabel = styled(StyledCell)`
  width: 100%;
  color: ${palette.neutral30};
  font-weight: 500;
  font-size: 15px;
`;

const StyledKey = styled(StyledCell)`
  color: ${palette.neutral30};
  width: 40%;
`;

const StyledValue = styled(StyledCell)`
  font-weight: 500;
  width: 60%;
`;

export const StyledWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledTable = styled('table')`
  border: 1px solid ${palette.neutral80};
  border-radius: 8px;
  table-layout: fixed;
  border-spacing: 0;
`;

export const OnboardingViewTable = ({ children }: { children: ReactNode }) => (
  <StyledTable>
    <tbody>{children}</tbody>
  </StyledTable>
);

type OnboardingViewLabelProps = {
  children: ReactNode;
};

export const OnboardingViewLabel = ({ children }: OnboardingViewLabelProps) => (
  <StyledRow>
    <StyledLabel colSpan={2}>{children}</StyledLabel>
  </StyledRow>
);

type OnboardingViewRowProps = {
  label: string;
  value?: string;
};

export const OnboardingViewRow = ({ label, value }: OnboardingViewRowProps) => {
  if (!value) return null;

  return (
    <StyledRow>
      <StyledKey>{label}</StyledKey>
      <StyledValue>{value}</StyledValue>
    </StyledRow>
  );
};
