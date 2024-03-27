import React from 'react';

import { PayableDetailsAttachFile } from '@/components/payables/PayableDetails/PayableDetailsAttachFile';
import { PayableDetailsHeader } from '@/components/payables/PayableDetails/PayableDetailsHeader';
import { PayableDetailsInfo } from '@/components/payables/PayableDetails/PayableDetailsInfo';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { FileViewer } from '@/ui/FileViewer';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { PayableActionEnum } from '@monite/sdk-api';
import { Backdrop, Box, DialogContent, Divider, Grid } from '@mui/material';

import { OptionalFields } from '../types';
import { PayableDetailsForm } from './PayableDetailsForm';
import { usePayableDetails, UsePayableDetailsProps } from './usePayableDetails';

export interface PayablesDetailsProps extends UsePayableDetailsProps {
  onClose?: () => void;
  optionalFields?: OptionalFields;
}

export const PayableDetails = ({
  id,
  optionalFields,
  onClose,
  onSave,
  onCancel,
  onSubmit,
  onReject,
  onApprove,
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onPay,
}: PayablesDetailsProps) => {
  const {
    payable,
    payableQueryError,
    permissions,
    lineItems,
    isEdit,
    isLoading,
    actions: {
      setEdit,
      createInvoice,
      saveInvoice,
      submitInvoice,
      payInvoice,
      rejectInvoice,
      approveInvoice,
      cancelInvoice,
    },
  } = usePayableDetails({
    id,
    onSave,
    onCancel,
    onSubmit,
    onReject,
    onApprove,
    onSaved,
    onCanceled,
    onSubmitted,
    onRejected,
    onApproved,
    onPay,
  });
  const { i18n } = useLingui();

  const { data: isReadAvailable, isInitialLoading: isReadAvailableLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: PayableActionEnum.READ,
      entityUserId: payable?.was_created_by_user_id,
    });

  if (isReadAvailableLoading) {
    return <LoadingPage />;
  }

  if (!isReadAvailable) {
    return (
      <MoniteStyleProvider>
        <AccessRestriction />
      </MoniteStyleProvider>
    );
  }

  if (payableQueryError) {
    return (
      <NotFound
        title={t(i18n)`Payable not found`}
        description={t(i18n)`There is no payable by provided id: ${id}`}
      />
    );
  }

  return (
    <MoniteStyleProvider>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
        }}
      >
        <Backdrop
          open={isLoading}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <LoadingPage />
        </Backdrop>
        <PayableDetailsHeader
          payable={payable}
          permissions={permissions}
          setEdit={setEdit}
          submitInvoice={submitInvoice}
          rejectInvoice={rejectInvoice}
          approveInvoice={approveInvoice}
          cancelInvoice={cancelInvoice}
          payInvoice={payInvoice}
          onClose={onClose}
        />
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            flexGrow={1}
            height="100%"
          >
            <Grid
              item
              container
              xs={6}
              flexDirection="column"
              height="100%"
              overflow="auto"
            >
              {payable?.file && (
                <FileViewer
                  name={payable.file.name}
                  mimetype={payable.file.mimetype}
                  url={payable.file.url}
                />
              )}
              {!isLoading && payable?.id && !payable?.file && (
                <PayableDetailsAttachFile payableId={payable.id} />
              )}
            </Grid>
            <Grid
              item
              container
              xs={6}
              flexDirection="column"
              height="100%"
              overflow="auto"
            >
              {isEdit ? (
                <PayableDetailsForm
                  setEdit={setEdit}
                  savePayable={saveInvoice}
                  createPayable={createInvoice}
                  payable={payable}
                  optionalFields={optionalFields}
                  lineItems={lineItems}
                />
              ) : (
                payable && (
                  <PayableDetailsInfo
                    payable={payable}
                    optionalFields={optionalFields}
                  />
                )
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </MoniteStyleProvider>
  );
};
