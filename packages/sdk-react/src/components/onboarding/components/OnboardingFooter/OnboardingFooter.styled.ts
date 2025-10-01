import { Box, styled } from '@mui/material';

export const StyledFooter = styled(Box)`
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;


export const StyledText = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const StyledList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: row;
    justify-content: space-between;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    flex-direction: column;
  }
`;

export const StyledFooterWrapper = styled('div')`
  margin-top: auto;
`;
