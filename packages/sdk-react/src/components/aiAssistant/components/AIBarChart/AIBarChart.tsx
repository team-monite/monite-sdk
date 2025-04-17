import type { FC } from 'react';

import { ChartLegend } from '@/components/aiAssistant/components/ChartLegend/ChartLegend';

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { COLORS } from '../../consts';
import { ChartData } from '../../types';
import { BarChartXTick } from '../BarChartXTick/BarChartXTick';

interface AIBarChartProps {
  data: ChartData[];
  metrics: string;
  parentWidth: number;
}

export const AIBarChart: FC<AIBarChartProps> = ({
  data,
  metrics,
  parentWidth,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <Bar
          name={metrics}
          dataKey="field_value"
          fill={COLORS[0]}
          isAnimationActive={false}
        />

        <XAxis
          interval={0}
          textAnchor="end"
          height={100}
          angle={-15}
          dataKey="field_name"
          tickMargin={12}
          tick={<BarChartXTick />}
        />
        <YAxis />

        {parentWidth > 383 && (
          <Legend
            content={<ChartLegend />}
            width={parentWidth > 447 ? 200 : 150}
            verticalAlign="top"
            align="right"
            layout="vertical"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
