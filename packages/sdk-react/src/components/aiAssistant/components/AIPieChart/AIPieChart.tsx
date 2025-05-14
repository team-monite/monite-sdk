import React, { type FC } from 'react';

import { ChartLegend } from '@/components/aiAssistant/components/ChartLegend/ChartLegend';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { COLORS } from '../../consts';
import { ChartData } from '../../types';

interface AIPieChartProps {
  data: ChartData[];
  parentWidth: number;
}

export const AIPieChart: FC<AIPieChartProps> = ({ data, parentWidth }) => {
  const innerRadius = parentWidth > 511 ? 60 : parentWidth > 383 ? 40 : 20;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart
        margin={{
          top: 5,
          right: 30,
          left: 20,
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

        <Legend
          content={<ChartLegend />}
          width={parentWidth > 447 ? 200 : 150}
          verticalAlign="middle"
          align="right"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
