import { useCallback, useEffect, useState } from 'react';
import { CounterpartType } from '@monite/sdk-api';

export type CounterpartsDetailsProps = {
  id?: string;
  type?: CounterpartType;
  onClose?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: () => void;
  onEdit?: (type: CounterpartType) => void;
};

export enum COUNTERPART_VIEW {
  view = 'view',
  organizationForm = 'organizationForm',
  individualForm = 'individualForm',
  contactForm = 'contactForm',
  bankAccountForm = 'bankAccountForm',
}

export default function useCounterpartDetails(props: CounterpartsDetailsProps) {
  const [counterpartView, setCounterpartView] =
    useState<COUNTERPART_VIEW | null>(null);

  const [counterpartId, setCounterpartId] = useState<string | undefined>(
    props.id
  );

  const actions = {
    showView: () => setCounterpartView(COUNTERPART_VIEW.view),
    showOrganizationForm: () =>
      setCounterpartView(COUNTERPART_VIEW.organizationForm),
    showIndividualForm: () =>
      setCounterpartView(COUNTERPART_VIEW.individualForm),
    showContactForm: () => setCounterpartView(COUNTERPART_VIEW.contactForm),
    showBankAccountForm: () =>
      setCounterpartView(COUNTERPART_VIEW.bankAccountForm),
  };

  useEffect(() => {
    if (props.id) {
      return actions.showView();
    }

    if (props.type === CounterpartType.INDIVIDUAL) {
      return actions.showIndividualForm();
    }

    if (props.type === CounterpartType.ORGANIZATION) {
      return actions.showOrganizationForm();
    }
  }, [props.id, props.type]);

  const onCreate = useCallback(
    (id: string) => {
      actions.showView();
      props.onCreate && props.onCreate(id);
      setCounterpartId(id);
    },
    [props.onCreate]
  );

  const onUpdate = useCallback(() => {
    actions.showView();
    props.onUpdate && props.onUpdate();
  }, [props.onUpdate]);

  const onEdit = useCallback(
    (type: CounterpartType) => {
      if (type === CounterpartType.ORGANIZATION) {
        actions.showOrganizationForm();
      }

      if (type === CounterpartType.INDIVIDUAL) {
        actions.showIndividualForm();
      }

      props.onEdit && props.onEdit(type);
    },
    [props.onEdit]
  );

  return {
    counterpartId,
    counterpartView,
    actions,
    onCreate,
    onUpdate,
    onEdit,
  };
}
