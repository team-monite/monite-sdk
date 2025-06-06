import { CSSProperties, ReactNode } from 'react';

import { Card, CardHeader, CardContent, SvgIconProps } from '@mui/material';

type IconVariant = 'info' | 'success' | 'critical';

interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  iconVariant?: IconVariant;
  children?: ReactNode;
  sx?: CSSProperties;
  backgroundColor?: string;
  // eslint-disable-next-line no-unused-vars
  renderIcon?: (props: SvgIconProps) => ReactNode;
}

const getIconStyles = () => {
  const backgroundColor = '#F6F7F8';
  // const fill = '#292929';

  return {
    icon: {
      width: 20,
      height: 20,
      // fill,
    },
    wrapper: {
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      borderRadius: '100%',
    },
  };
};

export default function DashboardCard({
  title,
  renderIcon,
  children,
  action,
  sx = {},
}: DashboardCardProps) {
  const { icon: iconStyles, wrapper } = getIconStyles();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '12px',
        border: '1px solid #EEE',
        boxShadow: 'none',
        ...sx,
      }}
    >
      <CardHeader
        sx={{ padding: '24px 24px 16px' }}
        title={title}
        titleTypographyProps={{
          variant: 'subtitle1',
          fontWeight: 400,
        }}
        action={action}
        avatar={
          renderIcon ? (
            <div style={wrapper}>{renderIcon({ style: iconStyles })}</div>
          ) : null
        }
      />
      <CardContent sx={{ padding: '0 24px 24px' }}>{children}</CardContent>
    </Card>
  );
}
