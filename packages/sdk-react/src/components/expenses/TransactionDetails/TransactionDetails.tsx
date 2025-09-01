import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { FileViewer } from '@/ui/FileViewer';
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

interface TagFormModalProps {
  transaction?: components['schemas']['TransactionResponse'];
  onClose?: () => void;
  open: boolean;
}

export const TransactionDetails = (props: TagFormModalProps) => (
  <MoniteScopedProviders>
    <TransactionDetailsBase {...props} />
  </MoniteScopedProviders>
);

/**
 * Helper function to determine mimetype from file URL
 */
const getMimetypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'image/jpeg';
  }
};

const TransactionDetailsBase = ({
  transaction,
  onClose,
  open,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const { api, locale } = useMoniteContext();
  const { root } = useRootElements();
  const { formatFromMinorUnits } = useCurrencies();

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

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose?.();
          }
        }}
      >
        <SheetContent container={root} className="mtw:w-[600px]">
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
                <DetailsTable
                  detailsData={[
                    {
                      label: t(i18n)`Merchant`,
                      value: transaction?.merchant_name,
                    },
                    {
                      label: t(i18n)`Date`,
                      value: transaction?.started_at
                        ? i18n.date(
                            transaction?.started_at,
                            locale.dateTimeFormat
                          )
                        : '-',
                    },
                    {
                      label: t(i18n)`Location`,
                      value: transaction?.merchant_location,
                    },
                    {
                      label: t(i18n)`Amount`,
                      value: transaction?.amount
                        ? i18n.number(
                            formatFromMinorUnits(
                              transaction?.amount,
                              transaction?.currency
                            ) || 0,
                            {
                              style: 'currency',
                              currency: transaction?.currency,
                            }
                          )
                        : '-',
                    },
                  ]}
                />
              </div>

              <div className="mtw:flex mtw:flex-col mtw:gap-4">
                <h3 className="mtw:text-lg mtw:font-semibold">
                  {t(i18n)`Receipt`}
                </h3>
                {receipt ? (
                  <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl mtw:p-4 mtw:flex mtw:items-center mtw:gap-6">
                    {receipt.file_url && (
                      <div className="mtw:w-14 mtw:h-14 mtw:overflow-hidden mtw:rounded-lg mtw:border mtw:border-gray-200 mtw:flex mtw:items-center mtw:justify-center">
                        <FileViewer
                          url={receipt.file_url}
                          mimetype={getMimetypeFromUrl(receipt.file_url)}
                        />
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
                        {/* TODO: Replace with button link to inline preview overlay, once implemented */}
                        <a
                          href={receipt.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mtw:text-primary mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1"
                        >
                          <EyeIcon className="mtw:size-4" /> {t(i18n)`View`}
                        </a>
                        <a
                          href={receipt.file_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mtw:text-primary mtw:font-medium mtw:text-sm mtw:flex mtw:items-center mtw:gap-1"
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
                <DetailsTable
                  detailsData={[
                    {
                      label: t(i18n)`Description`,
                      value: transaction?.description,
                    },
                  ]}
                />
              </div>
            </div>
          </SheetContentWrapper>
        </SheetContent>
      </Sheet>
    </>
  );
};

const DetailsTable = ({
  detailsData,
}: {
  detailsData: Array<{
    label: string | undefined;
    value: string | undefined;
  }>;
}) => {
  return (
    <div className="mtw:border mtw:border-gray-200 mtw:rounded-xl">
      <table className="mtw:w-full mtw:border-collapse">
        <tbody className="mtw:divide-y mtw:divide-gray-200">
          {detailsData.map((item, index) => (
            <tr key={index} className="mtw:text-sm">
              <td className="mtw:p-3 mtw:min-w-[120px] mtw:w-[35%]">
                {item.label || '-'}
              </td>
              <td className="mtw:p-3 mtw:font-medium">{item.value || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
