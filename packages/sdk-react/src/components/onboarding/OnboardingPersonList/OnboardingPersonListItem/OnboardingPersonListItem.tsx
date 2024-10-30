import { ReactNode } from 'react';

import { components } from '@monite/sdk-api/src/api';
import { Box, Typography, styled } from '@mui/material';

export const OnboardingPersonListItem = ({
  person: { first_name, last_name, email },
  deleteButton,
}: {
  person: components['schemas']['OnboardingPerson'];
  deleteButton: ReactNode;
}) => (
  <StyledPerson>
    <StyledPersonBio>
      <Typography>
        <b>{`${first_name.value} ${last_name.value}`}</b>
      </Typography>
      <Typography variant="body2">{email.value}</Typography>
    </StyledPersonBio>
    {deleteButton}
  </StyledPerson>
);

const StyledPerson = styled(Box)`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.typography.body2.color};
  border-radius: ${({ theme }) => theme.spacing(1)};
  background-color: ${'rgba(36, 111, 255, 0.04)'};
  padding: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const StyledPersonBio = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;
