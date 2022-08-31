import { useQuery } from 'react-query';
import { CounterpartPaginationResponse } from '@monite/js-sdk';
import { useComponentsContext } from '../context/ComponentsContext';
import counterpartsMock from 'components/counterparts/fixtures/counterparts';

export const useCounterpartList = (debug?: boolean) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(['counterpart'], () => {
    if (debug) return counterpartsMock;

    return monite.api!.counterparts.getList();
  });
};
