import { ReactElement, cloneElement, CSSProperties, ReactNode } from 'react';

import { Card, CardHeader, CardContent } from '@mui/material';

type IconVariant = 'info' | 'success' | 'critical';

interface DashboardCardProps {
  title: string;
  icon: ReactElement;
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
  icon,
  iconVariant,
  children,
}: DashboardCardProps) {
  const { icon: iconStyles, wrapper } = getIconStyles(iconVariant || 'info');

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        avatar={
          <div style={wrapper}>{cloneElement(icon, { style: iconStyles })}</div>
        }
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
