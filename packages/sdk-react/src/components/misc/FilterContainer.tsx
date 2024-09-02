import { ReactNode } from 'react';

import { classNames } from '@/utils/css-utils';
import { Stack } from '@mui/material';

interface FilterContainerProps {
  className?: string;
  searchField?: ReactNode;
  children: ReactNode;
}

export const FilterContainer = ({
  className,
  searchField,
  children,
}: FilterContainerProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classNames('Monite-Filters', className)}
      sx={{
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
      }}
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
