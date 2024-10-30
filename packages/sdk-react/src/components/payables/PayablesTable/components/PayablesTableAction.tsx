import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import { Button } from '@mui/material';

interface PayablesTableActionProps {
  payable: components['schemas']['PayableResponseSchema'];

  /**
   * The event handler for the pay action
   *
   * @param id - The identifier of the row to perform the pay action on, a string.
   */
  onPay?: (id: string) => void;
}

export const PayablesTableAction = ({
  payable,
  onPay,
}: PayablesTableActionProps) => {
  const { i18n } = useLingui();
  const { data: isPayAllowed } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable.was_created_by_user_id,
  });

  if (isPayAllowed && payable.status === 'waiting_to_be_paid') {
    return (
      <Button
        variant="outlined"
        size="small"
        onClick={(e) => {
          /**
           * We have to stop propagation to disable
           *  `onRowClick` callback when the user
           *  clicks on the `Pay` button
           */
          e.stopPropagation();

          onPay?.(payable.id);
        }}
      >
        {t(i18n)`Pay`}
      </Button>
    );
  }

  return null;
};
