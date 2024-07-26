import React, { ReactNode } from 'react';

import { Typography, styled } from '@mui/material';
import { red } from '@mui/material/colors';

import { OnboardingField } from '../../types';

const StyledRow = styled('tr')`
  display: flex;
`;

const StyledErrorRow = styled(StyledRow, {
  shouldForwardProp: (prop) => prop !== 'error',
})<{ error?: boolean }>`
  color: ${({ theme, error }) =>
    error ? theme.palette.error.dark : theme.palette.text.primary};
`;

const StyledCell = styled('td')`
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  tr:last-child & {
    border-bottom: none;
  }
`;

const StyledLabel = styled(StyledCell)`
  width: 100%;
`;

const StyledErrorCell = styled(StyledCell)`
  padding: ${({ theme }) => theme.spacing(0.75)};
  width: 100%;
`;

const StyledValue = styled(StyledCell)`
  width: 60%;
  word-break: break-all;
`;

const StyledKey = styled(StyledCell)`
  width: 40%;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const StyledErrorValue = styled('div')`
  padding: ${({ theme }) => theme.spacing(1)};
  border-radius: 4px;
  width: calc(100% - ${({ theme }) => theme.spacing(2)});
  word-break: break-all;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? theme.palette.error.light : red[50]};
`;

export const StyledTable = styled('table')`
  border: 1px solid ${({ theme }) => theme.palette.divider};
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
  field?: OnboardingField;
};

export const OnboardingViewRow = ({ label, field }: OnboardingViewRowProps) => {
  if (!field || !field.value) return null;

  const errorMessage = field.error?.message;

  return (
    <>
      <StyledErrorRow error={!!errorMessage}>
        <StyledKey>
          <Typography variant="body2">{label}</Typography>
        </StyledKey>
        <StyledValue>
          <Typography variant="body2">{field.value}</Typography>
        </StyledValue>
      </StyledErrorRow>
      {errorMessage && (
        <StyledErrorRow error={!!errorMessage}>
          <StyledErrorCell>
            <StyledErrorValue>
              <Typography variant="body2">{errorMessage}</Typography>
            </StyledErrorValue>
          </StyledErrorCell>
        </StyledErrorRow>
      )}
    </>
  );
};
