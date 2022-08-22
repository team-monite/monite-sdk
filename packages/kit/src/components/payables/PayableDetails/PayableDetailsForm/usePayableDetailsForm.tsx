import { useEffect, useState } from 'react';
import {
  PayableResponseSchema,
  TagReadSchema,
  CounterpartResponse as Counterpart,
} from '@monite/js-sdk';

import { useComponentsContext } from '../../../../core/context/ComponentsContext';

import counterpartsMock from '../../../counterparts/fixtures/counterparts';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  debug?: boolean;
};

const tagsMock: TagReadSchema[] = [
  {
    id: 'test1',
    name: 'test 1',
  },
  {
    id: 'test2',
    name: 'test 2',
  },
];

export default function usePayableDetailsForm({
  payable,
  debug,
}: UsePayableDetailsFormProps) {
  const [isLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<TagReadSchema[]>([]);
  const [counterparts, setCounterparts] = useState<Counterpart[]>([]);

  const { monite } = useComponentsContext();

  useEffect(() => {
    // TODO fetch counterparts and tags
    setTags(tagsMock);
    setCounterparts(counterpartsMock);
  }, [monite, debug, payable]);

  return {
    isLoading,
    tags,
    counterparts,
  };
}
