import { COLORS } from '../../consts';
import { ChartData } from '../../types';
import { BarChartXTick } from '../BarChartXTick/BarChartXTick';
import { ChartLegend } from '@/components/aiAssistant/components/ChartLegend/ChartLegend';
import React, { FC } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
          right: parentWidth > 383 ? 30 : 5,
          left: parentWidth > 383 ? 20 : 5,
          bottom: 5,
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
          angle={-30}
          dataKey="field_name"
          tickMargin={12}
          tick={<BarChartXTick />}
        />
        <YAxis />

        <Tooltip isAnimationActive={false} />

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
