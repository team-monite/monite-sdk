import type { FC } from 'react';

import { Text, type TextProps } from 'recharts';

interface Payload {
  value: string | number;
}

interface BarChartXTickProps {
  x?: number;
  y?: number;
  payload?: Payload;
  maxWidth?: number;
  textAnchor?: TextProps['textAnchor'];
  angle?: number;
}

export const BarChartXTick: FC<BarChartXTickProps> = ({
  x = 0,
  y = 0,
  payload,
  textAnchor = 'end',
  angle,
}) => {
  const { value = '' } = payload || {};

  return (
    <Text
      angle={angle}
      x={x}
      y={y}
      textAnchor={textAnchor}
      width={150}
      maxLines={1}
      className="mtw:text-sm"
    >
      {value}
    </Text>
  );
};
