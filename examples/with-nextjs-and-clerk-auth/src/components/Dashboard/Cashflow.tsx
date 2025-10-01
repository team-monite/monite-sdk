import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconChart } from '@/icons';
import { useMoniteContext } from '@monite/sdk-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
        date_dimension_breakdown: 'monthly',
        limit: 6,
        status: 'paid',
      },
    });

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!totalReceived?.data) return [];

    // total of dates to display
    const dimensionValues = [...totalReceived.data].map(
      (item) => item.dimension_value
    );

    // fill in dates with data
    const dataByDimension = dimensionValues.map((dimensionValue) => {
      const receivedData = totalReceived.data.find(
        (item) => item.dimension_value === dimensionValue
      );

      const received = receivedData ? receivedData.metric_value : 0;

      return {
        dimension_value: dimensionValue,
        received,
      };
    });

    const minItems = 6;

    const emptyValue = {
      received: 0,
      dimension_value: null,
    };

    return [
      ...Array(Math.max(0, minItems - totalReceived.data.length)).fill(
        emptyValue
      ),
      ...dataByDimension.reverse(),
    ];
  }, [totalReceived]);

  if (totalReceivedLoading) {
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
            <Link href="/receivables">Create invoice</Link>
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
              <stop offset="0%" stopColor="#3737FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
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
              if (date.getFullYear() === new Date().getFullYear()) {
                return date.toLocaleDateString('en-US', {
                  month: 'long',
                });
              } else {
                return date.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                });
              }
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
          <Area
            type="linear"
            dataKey="received"
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
