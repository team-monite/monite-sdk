import { components } from '@/api';
import { getMimetypeFromUrl } from '@/core/utils/files';
import { FileViewer } from '@/ui/FileViewer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const ReceiptPreview = ({
  receipt,
  isOpen,
  setIsOpen,
}: {
  receipt: components['schemas']['ReceiptResponseSchema'];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { i18n } = useLingui();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="mtw:max-w-[90vw] mtw:sm:max-w-[720px] mtw:max-h-[90vh] mtw:p-0">
        <DialogHeader className="mtw:p-6 mtw:pb-0">
          <DialogTitle className="mtw:flex mtw:items-center mtw:justify-between">
            {t(i18n)`Receipt ${receipt.document_id}`}
          </DialogTitle>
          <DialogDescription hidden>{t(
            i18n
          )`Preview of receipt ${receipt.document_id}`}</DialogDescription>
        </DialogHeader>
        <div className="mtw:flex-1 mtw:p-6 mtw:pt-0 mtw:overflow-hidden">
          {receipt.file_url && (
            <div className="mtw:h-full mtw:w-full">
              <FileViewer
                url={receipt.file_url}
                mimetype={getMimetypeFromUrl(receipt.file_url)}
                name={receipt.document_id || ''}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
