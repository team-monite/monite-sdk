import { ReactNode } from 'react';

import { classNames } from '@/utils/css-utils';
import { Stack, SxProps } from '@mui/material';

import { Theme } from 'mui-styles';

interface FilterContainerProps {
  className?: string;
  searchField?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const FilterContainer = ({
  className,
  searchField,
  children,
  sx,
}: FilterContainerProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classNames('Monite-Filters', className)}
      sx={Object.assign(
        {
          '& > *': {
            flexBasis: 'fit-content',
            flexGrow: 1,
          },
          '& > .Monite-SearchField': {
            maxWidth: '400px',
            width: '100%',
          },
          '& > .Monite-Filters-Group': {
            overflow: 'auto',
          },
        },
        sx || {}
      )}
    >
      {searchField}
      <Stack
        gap={1}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        className="Monite-Filters-Group"
        sx={{
          ml: 2,
          '& .Monite-FilterControl': {
            maxWidth: '160px',
            width: '100%',
          },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
