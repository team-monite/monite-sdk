import { useMoniteContext } from '@monite/sdk-react';

export const CounterpartCellById = ({
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

  return <span style={{ color: '#999' }}>-</span>;
};
