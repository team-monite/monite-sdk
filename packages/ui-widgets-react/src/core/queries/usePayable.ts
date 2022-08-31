import { useQuery } from 'react-query';
import { PayableResponseSchema } from '@monite/sdk-api';
import payableMock from 'components/payables/fixtures/getById';
import { useComponentsContext } from '../context/ComponentsContext';

export const usePayableById = (id: string, debug?: boolean) => {
  const { monite } = useComponentsContext();

  return useQuery<PayableResponseSchema, Error>(
    ['payable', id],
    () => (debug ? payableMock : monite.api!.payable.getById(id)),
    {
      staleTime: Infinity,
    }
  );
};
