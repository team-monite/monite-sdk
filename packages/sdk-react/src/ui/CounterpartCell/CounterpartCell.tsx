import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Avatar, Box, Chip, Skeleton } from '@mui/material';

interface CounterpartCellProps {
  counterpartId: components['schemas']['CounterpartResponse']['id'];
}

export const calculateAvatarColorIndex = (name: string) => {
  let sum = 0;
  for (let i = name.length - 1; i >= 0; i--) {
    sum += name.charCodeAt(i);
  }
  return sum % 5;
};

export const CounterPartCellByName = ({
  name,
  isLoading,
}: {
  name: string;
  isLoading?: boolean;
}) => {
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
    <Box sx={{ width: '100%' }}>
      <Chip
        className="Monite-CounterpartCell"
        avatar={
          isLoading ? (
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
                'MuiAvatar-' + calculateAvatarColorIndex(avatarLetters)
              }
            >
              {avatarLetters}
            </Avatar>
          )
        }
        label={
          isLoading || !name ? (
            <Skeleton
              animation="wave"
              height={10}
              width="100%"
              sx={{ flexShrink: 0, ml: 1.5, minWidth: '4em' }}
            />
          ) : (
            <span
              style={{
                marginLeft: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </span>
          )
        }
        sx={{ backgroundColor: 'transparent', color: 'text.primary' }}
      />
    </Box>
  );
};

export const CounterpartCellById = ({
  counterpartId,
}: CounterpartCellProps) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);
  const name = counterpart ? getCounterpartName(counterpart) : '';
  return <CounterPartCellByName name={name} isLoading={isLoading} />;
};
