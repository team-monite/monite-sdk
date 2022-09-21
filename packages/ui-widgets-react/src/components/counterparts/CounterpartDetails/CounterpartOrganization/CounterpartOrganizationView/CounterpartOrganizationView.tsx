import React, { forwardRef } from 'react';

import { CounterpartOrganizationResponse } from '@monite/sdk-api';

// import { useComponentsContext } from 'core/context/ComponentsContext';

import useCounterpartDetails from '../../useCounterpartDetails';

export type CounterpartOrganizationViewProps = {
  counterpart?: CounterpartOrganizationResponse;
  onSubmit?: () => void;
};

const CounterpartOrganizationView = forwardRef<
  HTMLFormElement,
  CounterpartOrganizationViewProps
>(({ onSubmit, counterpart }, ref) => {
  // const { t } = useComponentsContext();

  const { counterpartCreateMutation } = useCounterpartDetails({});

  // const { data } = useCounterpartList();
  // console.log(data);

  console.log(counterpartCreateMutation.isLoading);

  return <div>123</div>;
});

export default CounterpartOrganizationView;
