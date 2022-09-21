import React from 'react';
import {
  CounterpartOrganizationResponse,
  CounterpartType,
} from '@monite/sdk-api';
import { CounterpartOrganizationForm } from './CounterpartOrganization';
import { Button, Modal } from '@monite/ui-kit-react';
import useCounterpartDetails, {
  COUNTERPART_VIEW,
} from './useCounterpartDetails';
import { StyledHeaderActions } from '../../payables/PayableDetails/PayableDetailsStyle';

type CounterpartsDetailsProps = {
  id?: string;
  type?: CounterpartType;
  onClose?: () => void;
};

const CounterpartsDetails = ({
  id,
  type,
  onClose,
}: CounterpartsDetailsProps) => {
  const {
    counterpartView,
    formRef,
    createCounterpart,
    counterpartCreateMutation,
    submitForm,
    counterpart,
  } = useCounterpartDetails({ id, type });

  if (!(id || type)) return null;

  if (counterpartView === COUNTERPART_VIEW.organizationForm)
    return (
      <Modal onClose={onClose} anchor={'right'}>
        <CounterpartOrganizationForm
          counterpart={counterpart as CounterpartOrganizationResponse}
          isLoading={counterpartCreateMutation.isLoading}
          error={counterpartCreateMutation.error}
          ref={formRef}
          onSubmit={createCounterpart}
          actions={
            <StyledHeaderActions>
              <Button onClick={onClose} variant={'link'} color={'secondary'}>
                Cancel
              </Button>
              <Button onClick={submitForm} type={'submit'}>
                Create
              </Button>
            </StyledHeaderActions>
          }
        />
      </Modal>
    );

  if (counterpartView === COUNTERPART_VIEW.readonly) return 123;

  return null;
};

export default CounterpartsDetails;
