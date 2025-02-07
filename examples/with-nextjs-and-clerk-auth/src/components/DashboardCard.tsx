import { CSSProperties, ReactNode } from 'react';

import { Card, CardHeader, CardContent, SvgIconProps } from '@mui/material';

type IconVariant = 'info' | 'success' | 'critical';

interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  renderIcon: (props: SvgIconProps) => ReactNode;
  iconVariant?: IconVariant;
  children?: ReactNode;
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

const iconVariantStyles: Record<IconVariant, CSSProperties> = {
  info: {
    backgroundColor: '#f4f4fe',
    fill: '#3737ff',
  },
  success: {
    backgroundColor: '#eefbf9',
    fill: '#0daa8e',
  },
  critical: {
    backgroundColor: '#fff8f9',
    fill: '#ff475d',
  },
} as const;

const getIconStyles = (variant: IconVariant) => {
  const { fill, backgroundColor } = iconVariantStyles[variant];

  return {
    icon: { ...iconStyles, fill },
    wrapper: { ...iconWrapperStyles, backgroundColor },
  };
};

export default function DashboardCard({
  title,
  renderIcon,
  iconVariant,
  children,
  action,
}: DashboardCardProps) {
  const { icon: iconStyles, wrapper } = getIconStyles(iconVariant || 'info');

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        sx={{ padding: '24px 24px 16px' }}
        title={title}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={action}
        avatar={<div style={wrapper}>{renderIcon({ style: iconStyles })}</div>}
      />
      <CardContent sx={{ padding: '0 24px 24px' }}>{children}</CardContent>
    </Card>
  );
}
