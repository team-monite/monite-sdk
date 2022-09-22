import React from 'react';
import { Modal } from '@monite/ui-kit-react';

import useCounterpartDetails, {
  COUNTERPART_VIEW,
  CounterpartsDetailsProps,
} from './useCounterpartDetails';

import CounterpartOrganizationForm from './CounterpartOrganizationForm';
import CounterpartIndividualForm from './CounterpartIndividualForm';
import CounterpartView from './CounterpartView';

const CounterpartsDetails = (props: CounterpartsDetailsProps) => {
  const {
    counterpartId,
    counterpartView,
    onCreate,
    onUpdate,
    onEdit,
    actions: { showView },
  } = useCounterpartDetails(props);

  if (!(props.id || props.type)) return null;

  return (
    <Modal onClose={props.onClose} anchor={'right'}>
      {counterpartView === COUNTERPART_VIEW.organizationForm && (
        <CounterpartOrganizationForm
          id={counterpartId}
          onClose={props.onClose}
          onCancel={showView}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}

      {counterpartView === COUNTERPART_VIEW.individualForm && (
        <CounterpartIndividualForm
          id={counterpartId}
          onClose={props.onClose}
          onCancel={showView}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}

      {counterpartId && counterpartView === COUNTERPART_VIEW.view && (
        <CounterpartView id={counterpartId} onEdit={onEdit} />
      )}
    </Modal>
  );
};

export default CounterpartsDetails;
