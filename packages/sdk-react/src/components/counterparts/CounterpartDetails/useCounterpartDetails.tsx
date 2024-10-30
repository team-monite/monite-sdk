import { useCallback, useEffect, useState } from 'react';
import { useLatest } from 'react-use';

import { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { CounterpartsFormProps } from '@/components/counterparts/CounterpartDetails/CounterpartForm/useCounterpartForm';
import { components } from '@monite/sdk-api/src/api';

type CounterpartId = string;
type BankAccountId = string;
type VatId = string;

/**
 * `ExistingCounterpartDetail` is used when we have an `id`
 *  for existing counterpart and want to display it
 *  for editing or removing
 */
interface ExistingCounterpartDetail extends CommonCounterpartDetailsProps {
  id: CounterpartId;
  type?: undefined;
}

/**
 * `NewCounterpartDetail` is used when we DO NOT have an `id`
 *  and want to create a new counterpart. But we must provide
 *  a `type` field
 */
interface NewCounterpartDetail
  extends CommonCounterpartDetailsProps,
    Pick<CounterpartsFormProps, 'defaultValues'> {
  id?: undefined;
  type: components['schemas']['CounterpartType'];
}

interface CommonCounterpartDetailsProps
  extends Partial<CounterpartShowCategories> {
  /** Should bank accounts data be displayed. By default, set to `true` */
  showBankAccounts?: boolean;

  /**
   * Triggers only when the user updated address information
   *  successfully (it's saved on back-end side with no errors)
   */
  onAddressUpdate?: (id: CounterpartId) => void;

  /**
   * Triggers when the user filled and submitted
   *  new counterpart information
   *  and Monite saved the data on back-end side
   */
  onCreate?: (id: CounterpartId) => void;

  /**
   * Triggers when the user updated and submitted
   *  counterpart information
   *  and Monite saved the data on back-end side
   */
  onUpdate?: (id: CounterpartId) => void;

  /**
   * Triggers when we click on `delete` button,
   *  and we saved these the data on back-end side
   */
  onDelete?: (id: CounterpartId) => void;

  onContactCreate?: (id: CounterpartId) => void;
  onContactUpdate?: (id: CounterpartId) => void;
  onContactDelete?: (id: CounterpartId) => void;

  onBankCreate?: (id: BankAccountId) => void;
  onBankUpdate?: (id: BankAccountId) => void;
  onBankDelete?: (id: BankAccountId) => void;

  onVatCreate?: (id: VatId) => void;
  onVatUpdate?: (id: VatId) => void;
  onVatDelete?: (id: VatId) => void;
}

export type CounterpartsDetailsProps =
  | ExistingCounterpartDetail
  | NewCounterpartDetail;

export enum COUNTERPART_VIEW {
  /** Used when we need to show for already created counterpart individual / organization */
  view = 'view',

  /** Used when we need to show form to create new organization */
  organizationForm = 'organizationForm',

  /** Used when we need to show form to create new individual */
  individualForm = 'individualForm',

  /** Used when we need to show form to create / update customer address */
  addressForm = 'addressForm',

  /** Used when we need to show form to create / update contact information */
  contactForm = 'contactForm',

  /** Used when we need to show form to create / update bank accounts information */
  bankAccountForm = 'bankAccountForm',

  /** Used when we need to show form to create / update vat information */
  vatForm = 'vatForm',
}

export function useCounterpartDetails(props: CounterpartsDetailsProps) {
  const [counterpartView, setCounterpartView] =
    useState<COUNTERPART_VIEW | null>(null);

  const [counterpartId, setCounterpartId] = useState<CounterpartId | undefined>(
    props.id
  );

  useEffect(() => {
    setCounterpartId(props.id);
  }, [props.id]);

  const [addressId, setAddressId] = useState<string | undefined>();

  const [contactId, setContactId] = useState<string | undefined>();

  const [bankId, setBankId] = useState<string | undefined>();

  const [vatId, setVatId] = useState<string | undefined>();

  const [actions] = useState(() => ({
    showView: () => setCounterpartView(COUNTERPART_VIEW.view),
    showAddressForm: () => setCounterpartView(COUNTERPART_VIEW.addressForm),
    showOrganizationForm: () =>
      setCounterpartView(COUNTERPART_VIEW.organizationForm),
    showIndividualForm: () =>
      setCounterpartView(COUNTERPART_VIEW.individualForm),
    showContactForm: () => setCounterpartView(COUNTERPART_VIEW.contactForm),
    showBankAccountForm: () =>
      setCounterpartView(COUNTERPART_VIEW.bankAccountForm),
    showVatForm: () => setCounterpartView(COUNTERPART_VIEW.vatForm),
  }));

  useEffect(() => {
    if (props.id) {
      return actions.showView();
    }

    if (props.type === 'individual') {
      return actions.showIndividualForm();
    }

    if (props.type === 'organization') {
      return actions.showOrganizationForm();
    }
  }, [actions, props.id, props.type]);

  const onCreateImmutable = useLatest(props.onCreate);
  const onCreate = useCallback(
    (id: string) => {
      actions.showView();
      onCreateImmutable.current?.(id);
      setCounterpartId(id);
    },
    [actions, onCreateImmutable]
  );

  const onUpdateImmutable = useLatest(props.onUpdate);
  const onUpdate = useCallback(
    (id: string) => {
      actions.showView();
      onUpdateImmutable.current?.(id);
    },
    [actions, onUpdateImmutable]
  );

  const onEdit = useCallback(
    (_id: string, type: components['schemas']['CounterpartType']) => {
      if (type === 'organization') {
        actions.showOrganizationForm();
      }

      if (type === 'individual') {
        actions.showIndividualForm();
      }
    },
    [actions]
  );

  const onAddressCancel = useCallback(() => {
    actions.showView();
    setAddressId(undefined);
  }, [actions]);

  const onAddressEdit = useCallback(
    (id: string) => {
      setAddressId(id);
      actions.showAddressForm();
    },
    [actions]
  );

  const onAddressUpdateImmutable = useLatest(props.onAddressUpdate);
  const onAddressUpdate = useCallback(
    (id: string) => {
      actions.showView();
      onAddressUpdateImmutable.current?.(id);
      setAddressId(undefined);
    },
    [actions, onAddressUpdateImmutable]
  );

  const onContactCancel = useCallback(() => {
    actions.showView();
    setContactId(undefined);
  }, [actions]);

  const onContactCreateImmutable = useLatest(props.onContactCreate);
  const onContactCreate = useCallback(
    (id: string) => {
      actions.showView();
      onContactCreateImmutable.current?.(id);
      setContactId(undefined);
    },
    [actions, onContactCreateImmutable]
  );

  const onContactUpdateImmutable = useLatest(props.onContactUpdate);
  const onContactUpdate = useCallback(
    (id: string) => {
      actions.showView();
      onContactUpdateImmutable.current?.(id);
      setContactId(undefined);
    },
    [actions, onContactUpdateImmutable]
  );

  const onContactEdit = useCallback(
    (id: string) => {
      setContactId(id);
      actions.showContactForm();
    },
    [actions]
  );

  const onBankCancel = useCallback(() => {
    actions.showView();
    setBankId(undefined);
  }, [actions]);

  const onBankCreateImmutable = useLatest(props.onBankCreate);
  const onBankCreate = useCallback(
    (id: string) => {
      actions.showView();
      onBankCreateImmutable.current?.(id);
      setBankId(undefined);
    },
    [actions, onBankCreateImmutable]
  );

  const onBankUpdateImmutable = useLatest(props.onBankUpdate);
  const onBankUpdate = useCallback(
    (id: string) => {
      actions.showView();
      onBankUpdateImmutable.current?.(id);
      setBankId(undefined);
    },
    [actions, onBankUpdateImmutable]
  );

  const onBankEdit = useCallback(
    (id: string) => {
      setBankId(id);
      actions.showBankAccountForm();
    },
    [actions]
  );

  const onVatCreateImmutable = useLatest(props.onVatCreate);
  const onVatCreate = useCallback(
    (id: string) => {
      actions.showView();
      onVatCreateImmutable.current?.(id);
      setVatId(undefined);
    },
    [actions, onVatCreateImmutable]
  );

  const onVatUpdateImmutable = useLatest(props.onVatUpdate);
  const onVatUpdate = useCallback(
    (id: string) => {
      actions.showView();
      onVatUpdateImmutable.current?.(id);
      setVatId(undefined);
    },
    [actions, onVatUpdateImmutable]
  );

  const onVatCancel = useCallback(() => {
    actions.showView();
    setVatId(undefined);
  }, [actions]);

  const onVatEdit = useCallback(
    (id: string) => {
      setVatId(id);
      actions.showVatForm();
    },
    [actions]
  );

  return {
    counterpartId,
    addressId,
    contactId,
    bankId,
    vatId,
    counterpartView,
    actions,
    onCreate,
    onUpdate,
    onEdit,
    onAddressCancel,
    onAddressEdit,
    onAddressUpdate,
    onContactCreate,
    onContactUpdate,
    onContactEdit,
    onContactCancel,
    onBankCreate,
    onBankUpdate,
    onBankEdit,
    onBankCancel,
    onVatCreate,
    onVatUpdate,
    onVatEdit,
    onVatCancel,
  };
}
