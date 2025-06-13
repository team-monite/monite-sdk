import React, { useMemo } from 'react';

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useMoniteContext } from '@monite/sdk-react';

import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconChart } from '@/icons';

export const CashFlowCard = () => {
  const { api, entityId } = useMoniteContext();

  const { data: entitySettings } = api.entities.getEntitiesIdSettings.useQuery({
    path: { entity_id: entityId },
  });
  const currency: string = entitySettings?.currency?.default ?? 'USD';

  const { data: totalReceived, isLoading: totalReceivedLoading } =
    api.analytics.getAnalyticsReceivables.useQuery({
      query: {
        metric: 'total_amount',
        dimension: 'created_at',
        aggregation_function: 'summary',
        date_dimension_breakdown: 'daily',
        limit: 7,
        status: 'paid',
      },
    });

  const { data: totalPaid, isLoading: totalPaidLoading } =
    api.analytics.getAnalyticsPayables.useQuery({
      query: {
        metric: 'total_amount',
        dimension: 'created_at',
        aggregation_function: 'summary',
        date_dimension_breakdown: 'daily',
        status: 'paid',
      },
    });

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!totalReceived?.data || !totalPaid?.data) return [];

    // total of dates to display
    const dimensionValues = Array.from(
      new Set(
        [...totalReceived.data, ...totalPaid.data].map(
          (item) => item.dimension_value
        )
      )
    );

    // fill in dates with data
    const dataByDimension = dimensionValues.map((dimensionValue) => {
      const receivedData = totalReceived.data.find(
        (item) => item.dimension_value === dimensionValue
      );
      const paidData = totalPaid.data.find(
        (item) => item.dimension_value === dimensionValue
      );
      const received = receivedData ? receivedData.metric_value : 0;
      const paid = paidData ? -paidData.metric_value : 0;
      const trend = received + paid;

      return {
        dimension_value: dimensionValue,
        received,
        paid,
        trend,
      };
    });

    const minItems = 7;
    const emptyValue = {
      received: 0,
      paid: 0,
      trend: 0,
      dimension_value: null,
    };

    return [
      ...Array(Math.max(0, minItems - totalReceived.data.length)).fill(
        emptyValue
      ),
      ...dataByDimension.reverse(),
    ];
  }, [totalReceived, totalPaid]);

  if (totalReceivedLoading || totalPaidLoading) {
    return <Skeleton className="w-full h-[354px] rounded-lg" />;
  }

  if (chartData.length === 0) {
    return (
      <DashboardCard
        title="Cashflow"
        renderIcon={(props) => <IconChart {...props} />}
      >
        <div className="h-[250px] flex flex-col justify-center items-center">
          <IconChart style={{ fill: '#B8B8B8' }} />
          <p>
            Invoice analysis will appear when enough transaction data is
            available
          </p>
          <Button
            asChild
            className="bg-[#EBEBFF] text-[#3737FF] rounded-lg h-10 text-[0.9rem] font-medium transition-colors hover:bg-[#F8F8FF]"
          >
            <a href="/receivables">Create invoice</a>
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Total received"
      renderIcon={(props) => <IconChart sx={{ height: 20, width: 20 }} />}
    >
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient
              id="colorTrend"
              x1="0"
              y1="0"
              x2="0"
              y2="200"
              gradientUnits="userSpaceOnUse"
              spreadMethod="pad"
            >
              <stop offset="0%" stop-color="#3737FF" stop-opacity="0.2" />
              <stop offset="100%" stop-color="white" stop-opacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EAEAEA" vertical={false} />
          <XAxis
            dataKey="dimension_value"
            name={'Date'}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              if (!value) return '-';
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
          />
          <Tooltip
            separator={' '}
            formatter={(value) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
              }).format(Number(value) / 100);
            }}
            labelFormatter={(value) => {
              if (!value) return '-';
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
            contentStyle={{ color: 'rgba(0, 0, 0, 0.74)' }}
            itemStyle={{ color: 'rgba(0, 0, 0, 0.74)' }}
            labelStyle={{ color: 'rgba(0, 0, 0, 0.74)', fontWeight: 600 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
                style: 'currency',
                currency,
              }).format(Number(value) / 100);
            }}
          />

          <ReferenceLine y={0} stroke="#eee" />
          <Bar dataKey="paid" fill="transparent" />
          <Bar dataKey="received" fill="transparent" />
          <Area
            type="linear"
            dataKey="trend"
            dot={{ stroke: '#3737FF', strokeWidth: 2, r: 3, fill: '#fff' }}
            strokeWidth={3}
            stroke="#3737FF"
            fill="url(#colorTrend)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};
