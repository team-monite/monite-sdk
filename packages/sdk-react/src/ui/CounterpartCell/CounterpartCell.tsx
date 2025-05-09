import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import {
  useCounterpartById,
  useCounterpartAddressesById,
} from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Avatar, Skeleton, Stack, Typography } from '@mui/material';

interface CounterpartCellByIdProps {
  counterpartId: components['schemas']['CounterpartResponse']['id'];
}

export const calculateAvatarColorIndex = (name: string) => {
  let sum = 0;
  for (let i = name.length - 1; i >= 0; i--) {
    sum += name.charCodeAt(i);
  }
  return sum % 5;
};

export const CounterPartCellByData = ({
  name,
  country,
  city,
  isLoading,
}: {
  name: string;
  country?: string;
  city?: string;
  isLoading?: boolean;
}) => {
  const { i18n } = useLingui();

  if (!name && !isLoading) name = t(i18n)`Unspecified`;
  const nameParts = name.split(' ');
  // Split name into parts by ' ' and take first letters from the first and last parts of the name
  // For example, Mike Borough -> MB
  // Ambercombie -> A
  const avatarLetters = (
    nameParts.length >= 2
      ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
      : name[0] || ''
  ).toUpperCase();
  return (
    <Stack
      className="Monite-CounterpartCell"
      direction="row"
      alignItems="center"
      spacing={1.5}
      justifyContent="stretch"
      sx={{ maxWidth: '100%', overflow: 'hidden' }}
    >
      {isLoading ? (
        <Skeleton
          animation="wave"
          variant="circular"
          width={40}
          height={40}
          sx={{ flexShrink: 0 }}
        />
      ) : (
        <Avatar
          className={
            'MuiAvatar-colored MuiAvatar-' +
            calculateAvatarColorIndex(avatarLetters)
          }
        >
          {avatarLetters}
        </Avatar>
      )}
      {isLoading || !name ? (
        <Skeleton
          animation="wave"
          height={10}
          width="100%"
          sx={{ flexShrink: 0, minWidth: '4em' }}
        />
      ) : (
        <Stack
          direction="column"
          alignItems="stretch"
          gap={0}
          sx={{
            maxWidth: '100%',
            flexBasis: 0,
            flexShrink: 2,
            flexGrow: 2,
            overflow: 'hidden',
          }}
        >
          <Typography variant="body1" className="Monite-TextOverflowContainer">
            {name}
          </Typography>
          {country && city && (
            <Typography
              variant="body2"
              className="Monite-TextOverflowContainer"
            >
              {country} &#x2022; {city}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export const CounterpartNameCountryAddressCellById = ({
  counterpartId,
}: CounterpartCellByIdProps) => {
  const { data: counterpart, isLoading: isLoadingCounterpart } =
    useCounterpartById(counterpartId);
  const { data: addresses } = useCounterpartAddressesById(counterpartId);

  if (isLoadingCounterpart) {
    return <Skeleton animation="wave" height={26} width="20ch" />;
  }

  return (
    <CounterPartCellByData
      name={getCounterpartName(counterpart)}
      country={addresses?.data[0]?.country}
      city={addresses?.data[0]?.city}
    />
  );
};

export const CounterpartNameCellById = ({
  counterpartId,
}: CounterpartCellByIdProps) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);
  const name = counterpart ? getCounterpartName(counterpart) : '';

  if (isLoading) {
    return <Skeleton animation="wave" height={26} width="100%" />;
  }

  if (!name) {
    return <span style={{ opacity: 0.4 }}>-</span>;
  }

  return <span>{name}</span>;
};
