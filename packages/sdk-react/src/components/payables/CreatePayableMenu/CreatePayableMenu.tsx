import { Button } from '@/ui/components/button';
import { FileUpload } from '@/ui/components/file-upload';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronDownIcon, ChevronUpIcon, Plus } from 'lucide-react';
import { useState } from 'react';

interface CreatePayableMenuProps {
  isCreateAllowed: boolean;
  onCreateInvoice: () => void;
  handleFileUpload: (files: File[]) => void;
}

export const CreatePayableMenu = ({
  isCreateAllowed,
  onCreateInvoice,
  handleFileUpload,
}: CreatePayableMenuProps) => {
  const { i18n } = useLingui();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="lg" disabled={!isCreateAllowed}>
          {t(i18n)`Add new bill`}
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="mtw:w-auto mtw:min-w-[550px] mtw:border-none"
      >
        <div className="mtw:p-4 mtw:w-[550px]">
          <div>
            <p className="mtw:text-xl mtw:font-semibold mtw:mb-2">
              {t(i18n)`Upload files`}
            </p>
            <FileUpload
              onFileUpload={handleFileUpload}
              multiple={true}
              height="200px"
            />
          </div>
          <div className="mtw:mt-4">
            <p className="mtw:text-xl mtw:font-semibold mtw:mb-2">
              {t(i18n)`Or add bill manually`}
            </p>
            <div>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  onCreateInvoice();
                }}
              >
                <Plus />
                {t(i18n)`Add new bill`}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
