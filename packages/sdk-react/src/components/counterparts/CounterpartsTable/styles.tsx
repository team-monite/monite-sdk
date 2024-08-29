import { Box, styled } from '@mui/material';

export const MuiColContacts = styled(Box)`
  display: flex;
  align-items: center;

  > svg {
    width: auto;
    height: ${({ theme }) => theme.spacing(2)};
    margin-right: ${({ theme }) => theme.spacing(0.5)};
  }
`;
