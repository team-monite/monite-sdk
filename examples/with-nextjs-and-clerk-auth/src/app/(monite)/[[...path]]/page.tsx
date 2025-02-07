'use client';

import React, { type ReactNode, useMemo, useState } from 'react';

import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { useMoniteContext } from '@monite/sdk-react';
import {
  Box,
  Stack,
  Skeleton,
  Button,
  Container,
  TableHead,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Menu,
  MenuItem,
} from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import EmptyState from '@/components/EmptyState';
import {
  IconBolt,
  IconReceipt,
  IconPayable,
  IconChart,
  IconSmilyFace,
} from '@/icons';

import invoiceBg from './invoice-bg.svg';

export default function DefaultPage() {
  const { api } = useMoniteContext();
  const { data: duePayables, isLoading: duePayablesLoading } =
    api.payables.getPayables.useQuery({
      query: { status: 'waiting_to_be_paid' },
    });

  const { data: overdueInvoices, isLoading: overdueInvoicesLoading } =
    api.receivables.getReceivables.useQuery({
      query: { status: 'overdue' },
    });

  const { data: totalReceived, isLoading: totalReceivedLoading } =
    api.analytics.getAnalyticsReceivables.useQuery({
      query: {
        metric: 'total_amount',
        dimension: 'created_at',
        aggregation_function: 'summary',
        date_dimension_breakdown: 'daily',
        status: 'paid',
      },
    });

  return (
    <Container className="" sx={{ pt: '24px', pb: '24px' }}>
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          alignItems={'center'}
          sx={{ width: '100%', mb: '24px' }}
        >
          <h1>Dashboard</h1>
          {/*<Button*/}
          {/*  variant={'contained'}*/}
          {/*  size={'medium'}*/}
          {/*  sx={{*/}
          {/*    '&:hover': {*/}
          {/*      borderRadius: '8px',*/}
          {/*    },*/}
          {/*    borderRadius: '8px',*/}
          {/*    height: `40px`,*/}
          {/*    fontSize: `0.9rem`,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Quick actions*/}
          {/*</Button>*/}
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1 }}>
            <CreateInvoiceCard />
          </Box>
        </Stack>
        <Box sx={{ width: '100%', mt: 3 }}>
          {!totalReceivedLoading && totalReceived ? (
            <CashFlowCard totalReceived={totalReceived.data} />
          ) : (
            <Skeleton variant="rounded" width={'100%'} height={354} />
          )}
        </Box>
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          sx={{ width: '100%', mt: 3 }}
        >
          <Box sx={{ flex: 1 }}>
            {!overdueInvoicesLoading ? (
              <OutstandingInvoicesCard
                overdueInvoices={overdueInvoices?.data}
              />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={269} />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {!duePayablesLoading ? (
              <DuePayablesCard duePayables={duePayables?.data} />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={269} />
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

const CreateInvoiceCard = () => {
  return (
    <DashboardCard
      title="Create an invoice"
      action={
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
      }
      renderIcon={(props) => <IconReceipt {...props} />}
    >
      <Box
        sx={{
          padding: '24px 24px 64px',
          background: '#FAFAFA',
          borderRadius: '12px',
          backgroundImage: `url(${invoiceBg.src})`,
          backgroundRepeat: `no-repeat`,
          backgroundPosition: `bottom 0 right 80px`,
        }}
      >
        <p style={{ color: `rgba(0,0,0,0.68)`, margin: 0 }}>
          Quickly create, customize, and send an invoice
        </p>
        <p style={{ color: `rgba(0,0,0,0.38)`, margin: 0 }}>
          Choose your template, payment terms and methods, and send instantly
        </p>
      </Box>
    </DashboardCard>
  );
};

const RecomendedActionsCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good!
      <br />
      No recommended actions for you at the moment.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Recomended actions"
      renderIcon={(props) => <IconBolt {...props} />}
    >
      {emptyState}
    </DashboardCard>
  );
};

const CashFlowCard = ({
  totalReceived,
}: {
  totalReceived: { dimension_value?: string; metric_value: number }[];
}) => {
  // Process data for the chart
  const chartData = useMemo(() => {
    const minItems = 7;
    const emptyValue = {
      dimension_value: null,
      metric_value: 0,
    };

    return [
      ...Array(Math.max(0, minItems - totalReceived.length)).fill(emptyValue),
      ...totalReceived.reverse(),
    ];
  }, [totalReceived]);

  if (totalReceived.length === 0) {
    return (
      <DashboardCard
        title="Total received"
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
        <AreaChart data={chartData}>
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
              if (!value) return [``, 'No data'];

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
          <Area
            dataKey="metric_value"
            name={'Received'}
            type="bump"
            stroke="#562BD6"
            fill="#F4F0FE"
            fillOpacity={0.03}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
};

const DashboardTable = ({ children }: { children: ReactNode }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: '100%',
          'thead th': { fontWeight: '500' },
          '& td, & th': { fontSize: '0.9rem', padding: '4px', border: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell align="right">Due date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

const CounterpartCellById = ({
  counterpart_id,
}: {
  counterpart_id: string;
}) => {
  const { api } = useMoniteContext();
  const { data: counterpart } = api.counterparts.getCounterpartsId.useQuery(
    {
      path: {
        counterpart_id: counterpart_id ?? '',
      },
    },
    {
      enabled: !!counterpart_id,
    }
  );

  if (counterpart && counterpart.type === 'individual') {
    // @ts-ignore
    const { first_name, last_name } = counterpart.individual;
    return `${first_name} ${last_name}`;
  }

  if (counterpart && counterpart.type === 'organization') {
    // @ts-ignore
    const { legal_name } = counterpart.organization;
    return legal_name;
  }

  return '';
};

const OutstandingInvoicesCard = ({ overdueInvoices }: any) => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All invoices are collected.
    </EmptyState>
  );
  const totalOverdueInvoices = overdueInvoices?.length;

  return (
    <DashboardCard
      title="Overdue invoices"
      renderIcon={(props) => <IconReceipt {...props} />}
      iconVariant="success"
    >
      {totalOverdueInvoices ? (
        <div>
          <DashboardTable>
            {overdueInvoices
              .slice(0, 3)
              .map((receivable: Record<string, any>) => {
                return (
                  <TableRow
                    key={receivable.id}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {receivable.document_id}
                    </TableCell>
                    <TableCell>
                      <CounterpartCellById
                        counterpart_id={receivable.counterpart_id}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {format(new Date(receivable.due_date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: receivable.currency,
                      }).format(receivable.total_amount / 100)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </DashboardTable>
          <Link
            href={'/receivables'}
            sx={{
              display: 'inline-block',
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
              mt: 0.5,
              pl: 0.5,
            }}
          >
            See all ({totalOverdueInvoices})
          </Link>
        </div>
      ) : (
        emptyState
      )}
    </DashboardCard>
  );
};

const DuePayablesCard = ({
  duePayables,
}: {
  duePayables: Record<string, any>[] | undefined;
}) => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All bills are paid.
    </EmptyState>
  );
  const totalDuePayables = duePayables?.length;

  return (
    <DashboardCard
      title="Due payables"
      renderIcon={(props) => <IconPayable {...props} />}
      iconVariant="critical"
    >
      {totalDuePayables ? (
        <div>
          <DashboardTable>
            {duePayables.slice(0, 3).map((payable) => {
              return (
                <TableRow
                  key={payable.id}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {payable.document_id}
                  </TableCell>
                  <TableCell>
                    <CounterpartCellById
                      counterpart_id={payable.counterpart_id}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {format(new Date(payable.due_date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell align="right">
                    {' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payable.currency,
                    }).format(payable.total_amount / 100)}
                  </TableCell>
                </TableRow>
              );
            })}
          </DashboardTable>
          <Link
            href={'/payables'}
            sx={{
              display: 'inline-block',
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
              mt: 0.5,
              pl: 0.5,
            }}
          >
            See all ({totalDuePayables})
          </Link>
        </div>
      ) : (
        emptyState
      )}
    </DashboardCard>
  );
};
