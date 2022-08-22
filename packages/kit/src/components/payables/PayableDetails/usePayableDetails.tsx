import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableResponseSchema } from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import payableMock from '../fixtures/getById';
import { PayableDetailsFormFields } from './PayableDetailsForm';

export type UsePayableDetailsProps = {
  id: string;
  debug?: boolean;
  onSubmit?: () => void;
  onSave?: () => void;
  onPay?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
};

export default function usePayableDetails({
  id,
  debug,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onPay,
}: UsePayableDetailsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [isEdit] = useState<boolean>(true);
  const [isLoading] = useState<boolean>(false);
  const [payable, setPayable] = useState<PayableResponseSchema | null>(null);

  const { monite } = useComponentsContext();

  const [canSave] = useState<boolean>(true);
  const [canSubmit] = useState<boolean>(true);
  const [canPay] = useState<boolean>(false);
  const [canApprove] = useState<boolean>(false);
  const [canReject] = useState<boolean>(false);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const submitInvoice = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const saveInvoice = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const approveInvoice = useCallback(() => {
    onApprove && onApprove();
  }, []);

  const rejectInvoice = useCallback(() => {
    onReject && onReject();
  }, []);

  const payInvoice = useCallback(() => {
    onPay && onPay();
  }, []);

  const onFormSubmit = useCallback(
    (data: PayableDetailsFormFields) => {
      // TODO separate onSubmit and onSave after fetch
      onSubmit && onSubmit();
      onSave && onSave();

      console.log(data);
    },
    [formRef]
  );

  useEffect(() => {
    (async () => {
      // TODO fetch payable and user roles

      if (debug) {
        setPayable(payableMock);
      } else {
        const payables = await monite.api!.payable.getList();
        console.log(payables);

        // const payable = await monite.api!.payable.getById(id);
        // setPayable(payable);

        Promise.all([
          monite.api!.payable.getById(id),
          // monite.api!.role.getList(),
        ]).then(([payable]) => {
          setPayable(payable);

          // console.log(roles);
        });
      }
    })();
  }, [monite, id, debug]);

  return {
    payable,
    formRef,
    isLoading,
    isEdit,
    permissions: {
      canSave,
      canApprove,
      canSubmit,
      canPay,
      canReject,
    },
    actions: {
      onFormSubmit,
      submitInvoice,
      saveInvoice,
      approveInvoice,
      rejectInvoice,
      payInvoice,
    },
  };
}
