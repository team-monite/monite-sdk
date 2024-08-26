import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material';

interface CounterpartCellProps {
  counterpartId: components['schemas']['CounterpartResponse']['id'];
}

const calculateColorIndex = (name: string) => {
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
  if (!name) return null;
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
              width={40}
              height={40}
              sx={{ flexShrink: 0 }}
            />
          ) : (
            <Avatar
              className={'MuiAvatar-' + calculateColorIndex(avatarLetters)}
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
            <Typography
              variant="body2"
              sx={{ ml: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}
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

export const CounterpartCellById = ({ counterpartId }: Props) => {
  const { data: counterpart, isLoading } = useCounterpartById(counterpartId);
  if (!counterpartId || (!isLoading && !counterpart)) {
    return null;
  }

  const name = counterpart ? getCounterpartName(counterpart) : '';
  return <CounterPartCellByName name={name} isLoading={isLoading} />;
};
