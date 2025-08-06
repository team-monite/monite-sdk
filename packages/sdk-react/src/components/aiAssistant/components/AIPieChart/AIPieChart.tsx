import { COLORS } from '../../consts';
import { ChartData } from '../../types';
import { ChartLegend } from '@/components/aiAssistant/components/ChartLegend/ChartLegend';
import React, { type FC } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface AIPieChartProps {
  data: ChartData[];
  parentWidth: number;
}

export const AIPieChart: FC<AIPieChartProps> = ({ data, parentWidth }) => {
  const innerRadius = parentWidth > 511 ? 60 : 40;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart
        margin={{
          top: 5,
          right: parentWidth > 383 ? 30 : 5,
          left: parentWidth > 383 ? 20 : 5,
          bottom: 5,
        }}
      >
        <Pie
          dataKey="field_value"
          data={data}
          innerRadius={innerRadius}
          isAnimationActive={false}
          stroke=""
        >
          {data.map(({ field_name }, index) => (
            <Cell
              name={field_name}
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip isAnimationActive={false} />

        {parentWidth > 383 && (
          <Legend
            content={<ChartLegend />}
            width={parentWidth > 447 ? 200 : 150}
            verticalAlign="middle"
            align="right"
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
