import { components } from '@/api';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useCallback } from 'react';

type Props = {
  description: string;
  isTypeSelected?: boolean;
  title: string;
  type: components['schemas']['CounterpartType'];
  onClick: (type: components['schemas']['CounterpartType']) => void;
};

export const CounterpartTypeItem = ({
  description,
  isTypeSelected,
  title,
  type,
  onClick,
}: Props) => {
  const handleClick = useCallback(() => {
    onClick(type);
  }, [onClick, type]);

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: 'pointer',
        border: 'none',
      }}
      onClick={handleClick}
    >
      <CardActionArea
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'start',
          bgcolor: isTypeSelected
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(0, 0, 0, 0.02)',
          borderColor: 'transparent',
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
