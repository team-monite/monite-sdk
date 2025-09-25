import { ReceiptPreview } from '../ReceiptPreview';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserById } from '@/core/queries/useEntityUsers';
import { getMimetypeFromUrl } from '@/core/utils/files';
import { getUserDisplayName } from '@/core/utils/userUtils';
import { ImageFileViewer } from '@/ui/FileViewer';
import { Button } from '@/ui/components/button';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetContentWrapper,
} from '@/ui/components/sheet';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DownloadIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

interface TagFormModalProps {
  transaction?: components['schemas']['TransactionResponse'];
  onClose?: () => void;
  open: boolean;
  isManagerView?: boolean;
}

export const TransactionDetails = (props: TagFormModalProps) => (
  <MoniteScopedProviders>
    <TransactionDetailsBase {...props} />
  </MoniteScopedProviders>
);

const TransactionDetailsBase = ({
  transaction,
  onClose,
  open,
  isManagerView = false,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const { api, locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);

  const { data: receiptsResponse } = api.receipts.getReceipts.useQuery(
    {
      query: {
        transaction_id: transaction?.id,
        limit: 1,
      },
    },
    {
      enabled: !!transaction?.id,
    }
  );
  const receipt = receiptsResponse?.data?.[0];

  const { data: transactionUser } = useEntityUserById(
    isManagerView ? transaction?.entity_user_id : undefined
  );

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isReceiptViewerOpen) {
            onClose?.();
          }
        }}
        modal={false}
      >
        <SheetContent className="mtw:w-[600px]">
          <SheetHeader>
            <SheetTitle>{t(i18n)`Expense`}</SheetTitle>
            <SheetDescription className="mtw:sr-only">
              {t(i18n)`Expense ${transaction?.id} details`}
            </SheetDescription>
          </SheetHeader>

          <SheetContentWrapper>
            <div className="mtw:flex mtw:flex-col mtw:gap-10">
              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Transaction details`}
                </h3>
                <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl">
                  <table className="mtw:w-full mtw:border-collapse">
                    <tbody className="mtw:divide-y mtw:divide-gray-200">
                      {isManagerView && (
                        <tr className="mtw:text-sm">
                          <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                            {t(i18n)`Employee`}
                          </td>
                          <td className="mtw:p-3 mtw:font-medium">
                            {getUserDisplayName({ ...transactionUser }) || '-'}
                          </td>
                        </tr>
                      )}
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Merchant`}
                        </td>
                        <td className="mtw:p-3 mtw:font-medium">
                          {transaction?.merchant_name || '-'}
                        </td>
                      </tr>
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Date`}
                        </td>
                        <td className="mtw:p-3 mtw:font-medium">
                          {transaction?.started_at
                            ? i18n.date(
                                transaction.started_at,
                                locale.dateTimeFormat
                              )
                            : '-'}
                        </td>
                      </tr>
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Location`}
                        </td>
                        <td className="mtw:p-3 mtw:font-medium">
                          {transaction?.merchant_location}
                        </td>
                      </tr>
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Amount`}
                        </td>
                        <td className="mtw:p-3 mtw:flex mtw:items-center mtw:justify-between">
                          <span className="mtw:font-medium">
                            {transaction?.amount && transaction?.currency
                              ? formatCurrencyToDisplay(
                                  transaction.merchant_amount,
                                  transaction.merchant_currency
                                )
                              : '-'}
                          </span>
                          {transaction?.currency !==
                            transaction?.merchant_currency && (
                            <span className="mtw:text-sm mtw:text-neutral-500">
                              ≈&nbsp;
                              {transaction?.amount && transaction?.currency
                                ? formatCurrencyToDisplay(
                                    transaction.amount,
                                    transaction.currency
                                  )
                                : '-'}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Receipt`}
                </h3>
                {receipt ? (
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
                        {i18n.date(receipt?.created_at, locale.dateFormat)}
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
                ) : (
                  <p className="mtw:text-sm mtw:text-gray-500">{t(
                    i18n
                  )`No matching receipt.`}</p>
                )}
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Expense details`}
                </h3>
                <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl">
                  <table className="mtw:w-full mtw:border-collapse">
                    <tbody className="mtw:divide-y mtw:divide-gray-200">
                      <tr className="mtw:text-sm">
                        <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                          {t(i18n)`Description`}
                        </td>
                        <td className="mtw:p-3 mtw:font-medium">
                          {transaction?.description || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SheetContentWrapper>
        </SheetContent>
      </Sheet>

      {receipt && (
        <ReceiptPreview
          receipt={receipt}
          isOpen={isReceiptViewerOpen}
          setIsOpen={setIsReceiptViewerOpen}
        />
      )}
    </>
  );
};
