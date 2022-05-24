import { Box, styled } from '@mui/material';

export const MuiColContacts = styled(Box)`
  display: flex;
  align-items: 'center';

  > svg {
    margin-right: ${({ theme }) => theme.spacing(1)};
  }
`;
