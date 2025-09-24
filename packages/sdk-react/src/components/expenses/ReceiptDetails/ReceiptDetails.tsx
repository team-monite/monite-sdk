import { ReceiptPreview } from '../ReceiptPreview';
import { ReceiptStatusChip } from '../ReceiptsInbox/ReceiptCard';
import { useDeleteReceipt } from '../hooks/useDeleteReceipt';
import { useGetTransaction } from '../hooks/useGetTransaction';
import { useUpdateReceipt } from '../hooks/useUpdateReceipt';
import { components } from '@/api/schema';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserById } from '@/core/queries';
import { getUserDisplayName } from '@/core/utils';
import { getMimetypeFromUrl } from '@/core/utils/files';
import { ConfirmationModal } from '@/ui/ConfirmationModal/ConfirmationModal';
import { ImageFileViewer } from '@/ui/FileViewer';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { Button } from '@/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import { Input } from '@/ui/components/input';
import { Separator } from '@/ui/components/separator';
import {
  Sheet,
  SheetContent,
  SheetContentWrapper,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/ui/components/sheet';
import { Skeleton } from '@/ui/components/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers';
import {
  EyeIcon,
  DownloadIcon,
  ArrowLeftRightIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const getValidationSchema = (i18n: I18n) =>
  z.object({
    merchantName: z
      .string()
      .min(1, t(i18n)`Required`)
      .max(255, t(i18n)`Value must be at most '255' characters`),
    merchantLocation: z
      .string()
      .min(1, t(i18n)`Required`)
      .max(255, t(i18n)`Value must be at most '255' characters`),
    totalAmount: z.number().min(1, t(i18n)`Required`),
    date: z.date(),
  });

type FormFields = z.infer<ReturnType<typeof getValidationSchema>>;

export const ReceiptDetails = ({
  receipt,
  onClose,
  open,
}: {
  receipt: components['schemas']['ReceiptResponseSchema'];
  open: boolean;
  onClose?: () => void;
}) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { root } = useRootElements();
  const {
    formatCurrencyToDisplay,
    getSymbolFromCurrency,
    formatFromMinorUnits,
    formatToMinorUnits,
  } = useCurrencies();

  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: receiptUser } = useEntityUserById(
    receipt.created_by_entity_user_id
  );

  const { data: transaction, isLoading: isTransactionLoading } =
    useGetTransaction(receipt.transaction_id);

  const { mutate: updateReceipt, isPending: isUpdateReceiptPending } =
    useUpdateReceipt(receipt.id);
  const { mutate: deleteReceipt, isPending: isDeleteReceiptPending } =
    useDeleteReceipt(receipt.id);

  const form = useForm<FormFields>({
    resolver: zodResolver(getValidationSchema(i18n)),
    defaultValues: {
      merchantName: receipt.merchant_name || '',
      merchantLocation: receipt.merchant_location || '',
      totalAmount:
        formatFromMinorUnits(
          receipt.total_amount || 0,
          receipt.currency ?? 'EUR'
        ) ?? 0,
      date: new Date(receipt.issued_at || ''),
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const formattedReceiptDate = i18n.date(receipt.created_at, locale.dateFormat);

  const NBSP = '\u00A0'; // non-breaking space
  const formattedTransactionAmount =
    transaction?.amount && transaction.currency
      ? formatCurrencyToDisplay(transaction.amount, transaction.currency)
      : NBSP;
  const formattedTransactionDate = transaction?.started_at
    ? i18n.date(transaction.started_at, locale.dateTimeFormat)
    : NBSP;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-receipt-${useId()}`;

  const handleReceiptUpdateSubmit = handleSubmit((values) => {
    const totalAmount =
      formatToMinorUnits(values.totalAmount, receipt.currency ?? 'EUR') ?? 0;
    const date = values.date.toISOString();
    updateReceipt({
      merchant_name: values.merchantName,
      merchant_location: values.merchantLocation,
      total_amount: totalAmount,
      issued_at: date,
    });
    reset(values);
  });

  const handleReceiptDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteReceipt(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        onClose?.();
      },
    });
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isReceiptViewerOpen && !isDeleteModalOpen) {
            onClose?.();
          }
        }}
        modal={false}
      >
        <SheetContent container={root} className="mtw:flex mtw:flex-col">
          <SheetHeader>
            <SheetTitle className="mtw:flex mtw:justify-start mtw:items-center mtw:gap-2">
              {formattedReceiptDate}
              <ReceiptStatusChip isMatched={Boolean(receipt.transaction_id)} />
            </SheetTitle>
            <SheetDescription className="mtw:sr-only">
              {t(i18n)`Receipt ${receipt.document_id} details`}
            </SheetDescription>
          </SheetHeader>
          <Separator decorative />

          <SheetContentWrapper onWheel={(e) => e.stopPropagation()}>
            <div className="mtw:flex mtw:flex-col mtw:gap-10">
              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Sender`}
                </h3>
                <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl">
                  <table className="mtw:w-full mtw:border-collapse">
                    <tbody className="mtw:divide-y mtw:divide-gray-200">
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Employee`}
                        </td>
                        <td className="mtw:p-3 mtw:font-medium">
                          {getUserDisplayName({ ...receiptUser }) || '-'}
                        </td>
                      </tr>
                      {receipt.sender && (
                        <tr className="mtw:text-sm">
                          <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                            {t(i18n)`Sender`}
                          </td>
                          <td className="mtw:p-3 mtw:font-medium">
                            {receipt.sender || '-'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Receipt`}
                </h3>
                <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl mtw:p-4 mtw:flex mtw:items-center mtw:gap-6">
                  {receipt.file_url && (
                    <div
                      className="mtw:w-14 mtw:h-14 mtw:overflow-hidden mtw:rounded-lg mtw:border mtw:bg-gray-200 mtw:border-gray-200 mtw:flex mtw:items-center mtw:justify-center mtw:cursor-pointer"
                      onClick={() => {
                        setIsReceiptViewerOpen(true);
                      }}
                    >
                      {/* // TODO: only show image if not pdf; once PDF image previews are implemented, refactor the condition */}
                      {getMimetypeFromUrl(receipt.file_url) !==
                        'application/pdf' && (
                        <ImageFileViewer
                          url={receipt.file_url}
                          name={receipt.document_id || ''}
                        />
                      )}
                    </div>
                  )}
                  <div className="mtw:flex mtw:flex-col mtw:gap-1 mtw:flex-1">
                    <p className="mtw:font-medium">{receipt.document_id}</p>
                    <p className="mtw:text-sm mtw:text-gray-500">
                      {receipt.created_at
                        ? i18n.date(receipt.created_at, locale.dateFormat)
                        : '-'}
                    </p>
                  </div>
                  {receipt.file_url ? (
                    <div className="mtw:flex mtw:gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsReceiptViewerOpen(true);
                        }}
                        className="mtw:text-primary mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1"
                      >
                        <EyeIcon className="mtw:size-4" /> {t(i18n)`View`}
                      </Button>
                      <a
                        href={receipt.file_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mtw:text-primary mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1 mtw:hover:bg-gray-100 mtw:rounded-md mtw:p-1"
                      >
                        <DownloadIcon className="mtw:size-4" />
                        {t(i18n)`Download`}
                      </a>
                    </div>
                  ) : (
                    <p className="mtw:text-sm mtw:text-gray-500">
                      {t(i18n)`No receipt file`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Details`}
                </h3>
                <Form {...form}>
                  <form
                    id={formName}
                    name={formName}
                    onSubmit={handleReceiptUpdateSubmit}
                    className="mtw:border mtw:border-gray-200 mtw:rounded-xl mtw:p-6 mtw:flex mtw:flex-col mtw:gap-6"
                  >
                    <FormField
                      name="merchantName"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t(i18n)`Merchant name`}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="merchantLocation"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t(i18n)`Merchant location`}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mtw:flex mtw:gap-4">
                      <FormField
                        name="date"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <MuiDateTimePicker
                            label={t(i18n)`Receipt date`}
                            views={['year', 'month', 'day', 'hours', 'minutes']}
                            slotProps={{
                              actionBar: {
                                actions: ['clear', 'today'],
                              },
                              textField: {
                                id: field.name,
                                variant: 'outlined',
                                fullWidth: true,
                                error: Boolean(error),
                                helperText: error?.message,
                              },
                            }}
                            {...field}
                          />
                        )}
                      />
                      <FormField
                        name="totalAmount"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <RHFTextField
                            {...field}
                            id={field.name}
                            label={t(i18n)`Total amount`}
                            variant="standard"
                            type="number"
                            inputProps={{ min: 0 }}
                            error={Boolean(error)}
                            helperText={error?.message}
                            fullWidth
                            InputProps={{
                              endAdornment: getSymbolFromCurrency(
                                receipt.currency ?? 'EUR'
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="mtw:flex mtw:gap-4">
                      <Button
                        type="submit"
                        form={formName}
                        disabled={!isDirty || isUpdateReceiptPending}
                      >
                        {t(i18n)`Save`}
                      </Button>
                      <Button
                        type="reset"
                        form={formName}
                        variant="ghost"
                        onClick={() => reset()}
                        disabled={!isDirty || isUpdateReceiptPending}
                      >
                        {t(i18n)`Cancel`}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Transaction`}
                </h3>
                {!receipt.transaction_id ? (
                  <div>
                    {/* TODO: implement match to transaction logic */}
                    <Button disabled className="mtw:w-full">
                      <ArrowLeftRightIcon className="mtw:size-4" />
                      {t(i18n)`Match to transaction`}
                    </Button>
                  </div>
                ) : isTransactionLoading ? (
                  <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl mtw:flex mtw:flex-col mtw:gap-1 mtw:p-4">
                    <Skeleton className="mtw:w-full mtw:h-4" />
                    <Skeleton className="mtw:w-full mtw:h-3" />
                  </div>
                ) : (
                  <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl mtw:flex mtw:flex-col mtw:gap-1 mtw:p-4">
                    <div className="mtw:flex mtw:gap-1">
                      <div className="mtw:flex-1">
                        <div className="mtw:flex mtw:items-start mtw:justify-between mtw:gap-1 mtw:text-sm mtw:font-medium mtw:whitespace-nowrap">
                          <span
                            className="mtw:overflow-hidden mtw:text-ellipsis"
                            title={transaction?.merchant_name ?? undefined}
                          >
                            {transaction?.merchant_name || NBSP}
                          </span>
                          <span className="mtw:text-end">
                            {formattedTransactionAmount}
                          </span>
                        </div>
                        <div className="mtw:flex mtw:items-start mtw:justify-between mtw:gap-1 mtw:text-sm mtw:whitespace-nowrap">
                          <span
                            className="mtw:overflow-hidden mtw:text-ellipsis mtw:text-muted-foreground"
                            title={transaction?.merchant_location ?? undefined}
                          >
                            {transaction?.merchant_location || NBSP}
                          </span>
                          <span className="mtw:text-end mtw:text-muted-foreground">
                            {formattedTransactionDate}
                          </span>
                        </div>
                      </div>
                      <div>
                        {/* TODO: implement unmatch transaction logic */}
                        <Button
                          variant="ghost"
                          title={t(i18n)`Unmatch transaction`}
                          size="icon"
                          disabled
                        >
                          <XIcon className="mtw:size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SheetContentWrapper>

          <Separator decorative />
          <SheetFooter>
            <div className="mtw:flex mtw:justify-between mtw:items-center">
              <Button
                variant="destructiveGhost"
                onClick={(event) => handleReceiptDelete(event)}
                disabled={isDeleteReceiptPending}
              >
                <Trash2Icon className="mtw:size-4" />
                {t(i18n)`Delete`}
              </Button>
              {!receipt.transaction_id && (
                // TODO: implement match to transaction logic
                <Button disabled variant="default">
                  <ArrowLeftRightIcon className="mtw:size-4" />
                  {t(i18n)`Match to transaction`}
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ReceiptPreview
        receipt={receipt}
        isOpen={isReceiptViewerOpen}
        setIsOpen={setIsReceiptViewerOpen}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        title={t(i18n)`Delete receipt`}
        message={t(i18n)`This action can't be undone.`}
        confirmLabel={t(i18n)`Delete`}
        cancelLabel={t(i18n)`Cancel`}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleteReceiptPending}
      />
    </>
  );
};
