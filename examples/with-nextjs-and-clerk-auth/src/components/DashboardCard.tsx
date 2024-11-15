import { ReactElement, cloneElement, CSSProperties } from 'react';

import { Card, CardHeader, CardContent } from '@mui/material';

interface DashboardCardProps {
  title: string;
  icon: ReactElement;
  emptyState?: ReactElement;
  showEmptyState?: boolean;
}

const iconWrapperStyles: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  backgroundColor: '#F4F4FE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const iconStyles: CSSProperties = {
  width: 20,
  height: 20,
  fill: '#3737FF',
} as const;

export default function DashboardCard(props: DashboardCardProps) {
  return (
    <Card>
      <CardHeader
        title={props.title}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        avatar={
          <div style={iconWrapperStyles}>
            {cloneElement(props.icon, { style: iconStyles })}
          </div>
        }
      ></CardHeader>
      <CardContent>{props.showEmptyState && props.emptyState}</CardContent>
    </Card>
  );
}
