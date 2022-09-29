import { useCallback, useEffect, useState } from 'react';
import { CounterpartType } from '@monite/sdk-api';

export type CounterpartsDetailsProps = {
  id?: string;
  type?: CounterpartType;
  onClose?: () => void;

  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;

  onContactCreate?: (id: string) => void;
  onContactUpdate?: (id: string) => void;
  onContactEdit?: (id: string) => void;
  onContactDelete?: (id: string) => void;

  onBankCreate?: (id: string) => void;
  onBankUpdate?: (id: string) => void;
  onBankEdit?: (id: string) => void;
  onBankDelete?: (id: string) => void;
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

  const [contactId, setContactId] = useState<string | undefined>();

  const [bankId, setBankId] = useState<string | undefined>();

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
    [props.onCreate, actions]
  );

  const onUpdate = useCallback(
    (id: string) => {
      actions.showView();
      props.onUpdate && props.onUpdate(id);
    },
    [props.onUpdate, actions]
  );

  const onEdit = useCallback(
    (id: string, type: CounterpartType) => {
      if (type === CounterpartType.ORGANIZATION) {
        actions.showOrganizationForm();
      }

      if (type === CounterpartType.INDIVIDUAL) {
        actions.showIndividualForm();
      }

      props.onEdit && props.onEdit(id);
    },
    [props.onEdit, actions]
  );

  const onContactCancel = useCallback(() => {
    actions.showView();
    setContactId(undefined);
  }, [actions]);

  const onContactCreate = useCallback(
    (id: string) => {
      actions.showView();
      props.onContactCreate && props.onContactCreate(id);
      setContactId(undefined);
    },
    [props.onContactCreate, actions]
  );

  const onContactUpdate = useCallback(
    (id: string) => {
      actions.showView();
      props.onContactUpdate && props.onContactUpdate(id);
      setContactId(undefined);
    },
    [props.onContactUpdate, actions]
  );

  const onContactEdit = useCallback(
    (id: string) => {
      setContactId(id);
      actions.showContactForm();
      props.onContactEdit && props.onContactEdit(id);
    },
    [props.onContactEdit, actions]
  );

  const onBankCancel = useCallback(() => {
    actions.showView();
    setBankId(undefined);
  }, [actions]);

  const onBankCreate = useCallback(
    (id: string) => {
      actions.showView();
      props.onBankCreate && props.onBankCreate(id);
      setBankId(undefined);
    },
    [props.onBankCreate, actions]
  );

  const onBankUpdate = useCallback(
    (id: string) => {
      actions.showView();
      props.onBankUpdate && props.onBankUpdate(id);
      setBankId(undefined);
    },
    [props.onBankUpdate, actions]
  );

  const onBankEdit = useCallback(
    (id: string) => {
      setBankId(id);
      actions.showBankAccountForm();
      props.onBankEdit && props.onBankEdit(id);
    },
    [props.onBankEdit, actions]
  );

  return {
    counterpartId,
    contactId,
    bankId,
    counterpartView,
    actions,
    onCreate,
    onUpdate,
    onEdit,
    onContactCreate,
    onContactUpdate,
    onContactEdit,
    onContactCancel,
    onBankCreate,
    onBankUpdate,
    onBankEdit,
    onBankCancel,
  };
}
