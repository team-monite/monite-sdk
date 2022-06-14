import React, { useEffect, useState } from 'react';

import { useComponentsContext } from '../../../core/context/ComponentsContext';

import './styles.less';
import {
  Table,
  TableProps,
  ColumnsType,
  Avatar,
  Tag,
  CallIcon,
  AccountIcon,
  MessageIcon,
  Space,
} from '../../../ui';

export interface CounterpartsTableProps extends TableProps<any> {
  data?: any;
  useMoniteApi?: boolean;
}

const columns: ColumnsType<any> = [
  {
    title: 'Name, country, city',
    key: 'name',
    render: (_: any, row: any) => {
      const data = row[row.type];

      if (row.type === 'organization') {
        return (
          <Space size={16}>
            <Avatar size={44}>{data?.legal_name[0]}</Avatar>
            <div>
              <div>{data.legal_name}</div>
              <div>
                {data?.registered_address?.country} •{' '}
                {data?.registered_address?.city}
              </div>
            </div>
          </Space>
        );
      }

      return (
        <Space size={16}>
          <Avatar size={44}>{data?.first_name[0]}</Avatar>
          <div>
            <div>{data?.first_name}</div>
            <div>
              {data?.residential_address?.country} •{' '}
              {data?.residential_address?.city}
            </div>
          </div>
        </Space>
      );
    },
  },
  {
    title: 'Type',
    key: 'type',
    width: 220,
    render: (_: any, row: any) => {
      const data = row[row.type];

      return (
        <Space size={8} wrap>
          {data.is_customer ? <Tag>Customer</Tag> : null}
          {data.is_vendor ? <Tag>Vendor</Tag> : null}
        </Space>
      );
    },
  },
  {
    title: 'Contact information',
    key: 'address',
    render: (_: any, row: any) => {
      const data = row[row.type];
      const contacts = (data.contacts || []).map((c: any) => c.first_name);
      return (
        <Space
          className="monite-counterparts-table--contacts"
          size={0}
          wrap
          direction="vertical"
        >
          <div>
            <MessageIcon width={16} height={16} />
            {data.email}
          </div>
          {contacts.length ? (
            <div>
              <AccountIcon width={16} height={16} />
              {contacts.join(', ')}
            </div>
          ) : null}
          <div>
            <CallIcon width={16} height={16} />
            {data.phone}
          </div>
        </Space>
      );
    },
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.id,
  }),
};

const CounterpartsTable = ({
  data: customData,
  useMoniteApi,
  ...otherProps
}: CounterpartsTableProps) => {
  const [data, setData] = useState<any>(customData || []);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      if (customData || !useMoniteApi) {
        return;
      }

      const data = await monite.api!.counterparts.getList();
      setData(
        (Array.isArray(data) ? data : []).filter(
          (row) => row.id && row.type && (row as any)[row.type]
        )
      );
    })();
  }, []);

  return (
    <Table
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      pagination={false}
      className="monite-counterparts-table"
      dataSource={data}
      columns={columns}
      {...otherProps}
    />
  );
};

export default CounterpartsTable;
