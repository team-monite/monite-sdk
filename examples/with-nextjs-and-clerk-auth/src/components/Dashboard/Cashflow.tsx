import React, { useMemo } from 'react';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { useMoniteContext } from '@monite/sdk-react';
import { Button, Skeleton } from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import { IconChart } from '@/icons';

export const CashFlowCard = () => {
  const { api } = useMoniteContext();

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
    return <Skeleton variant="rounded" width={'100%'} height={354} />;
  }

  if (chartData.length === 0) {
    return (
      <DashboardCard
        title="Cashflow"
        renderIcon={(props) => <IconChart {...props} />}
      >
        <div
          style={{
            height: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconChart style={{ fill: '#B8B8B8' }} />
          <p>
            Invoice analysis will appear when enough transaction data is
            available
          </p>
          <Button
            href={'/receivables'}
            variant={'contained'}
            size={'medium'}
            sx={{
              '&:hover': {
                borderRadius: '8px',
                background: '#F8F8FF',
              },
              background: '#EBEBFF',
              color: '#3737FF',
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
            }}
          >
            Create invoice
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Total received"
      renderIcon={(props) => <IconChart {...props} />}
    >
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData}>
          <CartesianGrid stroke="#F0F2F4" vertical={false} />
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
            formatter={(value, name, props) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
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
          />

          <ReferenceLine y={0} stroke="#eee" />
          <Bar dataKey="paid" fill="#ece2f4" />
          <Bar dataKey="received" fill="#d2f2ec" />
          <Line type="linear" dataKey="trend" stroke="#562BD6" />
        </ComposedChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};
