import React, { useCallback } from 'react';

import { useCounterpartById } from '@/core/queries';
import {
  PayableResponseSchema,
  CounterpartResponse,
  CounterpartType,
  CounterpartOrganizationRootResponse,
  CounterpartIndividualRootResponse,
} from '@monite/sdk-api';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PersonIcon from '@mui/icons-material/Person';
import { Chip, Box, Avatar, Skeleton, Typography } from '@mui/material';

interface Props {
  counterpartId: PayableResponseSchema['counterpart_id'];
}

export const CounterpartCell = ({ counterpartId }: Props) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);

  const getCounterpartText = useCallback((counterpart: CounterpartResponse) => {
    return counterpart.type === CounterpartType.ORGANIZATION
      ? (counterpart as CounterpartOrganizationRootResponse).organization
          .legal_name
      : `${
          (counterpart as CounterpartIndividualRootResponse).individual
            .first_name
        } ${
          (counterpart as CounterpartIndividualRootResponse).individual
            .last_name
        }`;
  }, []);

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
              {counterpart?.type === CounterpartType.ORGANIZATION ? (
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
