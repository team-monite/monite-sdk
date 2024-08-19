import { useCallback } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { CounterpartResponse, useCounterpartById } from '@/core/queries';
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material';

interface Props {
  counterpartId: components['schemas']['CounterpartResponse']['id'];
}

export const CounterpartCell = ({ counterpartId }: Props) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);

  const getCounterpartText = useCallback((counterpart: CounterpartResponse) => {
    return getCounterpartName(counterpart);
  }, []);

  if (!counterpartId || (!isLoading && !counterpart)) {
    return null;
  }

  const name = counterpart ? getCounterpartText(counterpart) : '';
  const nameParts = name.split(' ');
  const avatarLetters = (
    nameParts.length >= 2
      ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
      : name[0] || ''
  ).toUpperCase();
  return (
    <Box sx={{ width: '100%' }}>
      <Chip
        className="Monite-CounterpartCell"
        avatar={
          isLoading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={24}
              height={24}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <Avatar className={'MuiAvatar-letter' + avatarLetters[0]}>
              {avatarLetters}
            </Avatar>
          )
        }
        label={
          isLoading || !counterpart ? (
            <Skeleton
              animation="wave"
              height={10}
              width="100%"
              sx={{ flexShrink: 0, ml: 1, minWidth: '4em' }}
            />
          ) : (
            <Typography
              sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {name}
            </Typography>
          )
        }
        sx={{ backgroundColor: 'transparent', color: 'text.primary' }}
      />
    </Box>
  );
};
