import { useCallback } from 'react';

import { components } from '@/api';
import { useCounterpartById } from '@/core/queries';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PersonIcon from '@mui/icons-material/Person';
import { Chip, Box, Avatar, Skeleton, Typography } from '@mui/material';

interface Props {
  counterpartId: components['schemas']['CounterpartResponse']['id'];
}

export const CounterpartCell = ({ counterpartId }: Props) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);

  const getCounterpartText = useCallback(
    (counterpart: components['schemas']['CounterpartResponse']) => {
      return counterpart.type === 'organization'
        ? (
            counterpart as components['schemas']['CounterpartOrganizationRootResponse']
          ).organization.legal_name
        : `${
            (
              counterpart as components['schemas']['CounterpartIndividualRootResponse']
            ).individual.first_name
          } ${
            (
              counterpart as components['schemas']['CounterpartIndividualRootResponse']
            ).individual.last_name
          }`;
    },
    []
  );

  if (!counterpartId || (!isLoading && !counterpart)) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Chip
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
            <Avatar sx={{ width: 24, height: 24 }}>
              {counterpart?.type === 'organization' ? (
                <CorporateFareIcon sx={{ fontSize: 16 }} />
              ) : (
                <PersonIcon sx={{ fontSize: 20 }} />
              )}
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
              variant="body2"
              sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {getCounterpartText(counterpart)}
            </Typography>
          )
        }
        sx={{ backgroundColor: 'transparent', color: 'text.primary' }}
      />
    </Box>
  );
};
