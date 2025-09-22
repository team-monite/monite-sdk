import { components } from '@/api/schema';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { getMimetypeFromUrl } from '@/core/utils/files';
import { getUserDisplayName } from '@/core/utils/userUtils';
import { ImageFileViewer } from '@/ui/FileViewer/FileViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card';
import { Skeleton } from '@/ui/components/skeleton';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';

interface ReceiptCardProps {
  receipt: components['schemas']['ReceiptResponseSchema'];
  user: components['schemas']['EntityUserResponse'] | undefined;
}

export const ReceiptCard = ({ receipt, user }: ReceiptCardProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const userDisplayName = useMemo(() => getUserDisplayName(user || {}), [user]);

  const isMatched = !!receipt.transaction_id;
  const isImageFile =
    receipt.file_url &&
    getMimetypeFromUrl(receipt.file_url) !== 'application/pdf';

  const NBSP = '\u00A0'; // non-breaking space
  const formattedDate = i18n.date(receipt.created_at, locale.dateFormat);
  const formattedAmount =
    receipt.total_amount && receipt.currency
      ? formatCurrencyToDisplay(receipt.total_amount, receipt.currency)
      : NBSP;
  const formattedIssuedDate = receipt.issued_at
    ? i18n.date(receipt.issued_at, locale.dateFormat)
    : NBSP;

  return (
    <Card className="mtw:h-full mtw:w-full mtw:shadow-none mtw:hover:shadow-md mtw:transition-shadow mtw:gap-4 mtw:py-4 mtw:border-neutral-80 mtw:rounded-md">
      <CardHeader className="mtw:gap-1 mtw:px-5">
        <div className="mtw:flex mtw:justify-start mtw:items-center mtw:gap-1">
          <CardTitle className="mtw:font-medium">{formattedDate}</CardTitle>
          <span
            className={`mtw:inline-block mtw:rounded-sm mtw:px-2 mtw:py-0.5 mtw:text-[0.80rem] mtw:font-bold mtw:whitespace-nowrap ${
              isMatched
                ? 'mtw:bg-success-95 mtw:text-success-30'
                : 'mtw:bg-danger-100 mtw:text-danger-10'
            }`}
          >
            {isMatched ? t(i18n)`Matched` : t(i18n)`Unmatched`}
          </span>
        </div>
        <p className="mtw:text-sm mtw:text-muted-foreground mtw:overflow-hidden mtw:text-ellipsis mtw:whitespace-nowrap">
          {userDisplayName || NBSP}
        </p>
      </CardHeader>
      <CardContent className="mtw:h-full mtw:flex mtw:flex-col mtw:px-5 mtw:gap-4">
        <div className="mtw:bg-gray-100 mtw:rounded-md mtw:h-38 mtw:w-full mtw:flex mtw:items-center mtw:justify-center mtw:overflow-hidden">
          {isImageFile ? (
            <ImageFileViewer
              url={receipt.file_url!}
              name={receipt.document_id || ''}
              objectFit="cover"
            />
          ) : (
            <span className="mtw:text-gray-500 mtw:text-sm">{t(
              i18n
            )`Receipt ${receipt.document_id}`}</span>
          )}
        </div>
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <div className="mtw:flex mtw:items-start mtw:justify-between mtw:gap-1 mtw:text-sm mtw:font-medium mtw:whitespace-nowrap">
            <span
              className="mtw:overflow-hidden mtw:text-ellipsis"
              title={receipt.merchant_name ?? undefined}
            >
              {receipt.merchant_name || NBSP}
            </span>
            <span className="mtw:text-end">{formattedAmount}</span>
          </div>
          <div className="mtw:flex mtw:items-start mtw:justify-between mtw:gap-1 mtw:text-sm mtw:whitespace-nowrap">
            <span
              className="mtw:overflow-hidden mtw:text-ellipsis"
              title={receipt.merchant_location ?? undefined}
            >
              {receipt.merchant_location || NBSP}
            </span>
            <span className="mtw:text-end">{formattedIssuedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReceiptCardSkeleton = () => {
  return (
    <Card className="mtw:h-full mtw:w-full mtw:shadow-none mtw:gap-4 mtw:py-4 mtw:border-neutral-80 mtw:rounded-md">
      <CardHeader className="mtw:gap-1 mtw:px-5">
        <Skeleton className="mtw:w-3/4 mtw:h-5" />
        <Skeleton className="mtw:w-1/4 mtw:h-3" />
      </CardHeader>
      <CardContent className="mtw:h-full mtw:flex mtw:flex-col mtw:px-5 mtw:gap-4">
        <Skeleton className="mtw:w-full mtw:h-38" />
        <div className="mtw:flex mtw:flex-col mtw:gap-1">
          <Skeleton className="mtw:w-full mtw:h-4" />
          <Skeleton className="mtw:w-full mtw:h-3" />
        </div>
      </CardContent>
    </Card>
  );
};
