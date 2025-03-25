import { CSSProperties, ReactNode } from 'react';

import { Card, CardHeader, CardContent, SvgIconProps } from '@mui/material';

type IconVariant = 'info' | 'success' | 'critical';

interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  renderIcon: (props: SvgIconProps) => ReactNode;
  iconVariant?: IconVariant;
  children?: ReactNode;
  sx?: CSSProperties;
  backgroundColor?: string;
}

const iconWrapperStyles: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const iconStyles: CSSProperties = {
  width: 20,
  height: 20,
} as const;

const getIconStyles = (variant: IconVariant) => {
  const { fill, backgroundColor } = {
    backgroundColor: '#000000',
    fill: '#fff',
  };

  return {
    icon: { ...iconStyles, fill },
    wrapper: { ...iconWrapperStyles, backgroundColor, borderRadius: '100%' },
  };
};

export default function DashboardCard({
  title,
  renderIcon,
  iconVariant,
  children,
  action,
  sx = {},
}: DashboardCardProps) {
  const { icon: iconStyles, wrapper } = getIconStyles(iconVariant || 'info');

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
        avatar={<div style={wrapper}>{renderIcon({ style: iconStyles })}</div>}
      />
      <CardContent sx={{ padding: '0 24px 24px' }}>{children}</CardContent>
    </Card>
  );
}
