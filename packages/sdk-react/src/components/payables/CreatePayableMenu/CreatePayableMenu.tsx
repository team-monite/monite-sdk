import { DragEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFileInput } from '@/core/hooks';
import { Button } from '@/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloudUpload,
  Plus,
} from 'lucide-react';

interface CreatePayableMenuProps {
  isCreateAllowed: boolean;
  onCreateInvoice: () => void;
  handleFileUpload: (file: File | FileList) => void;
}

export const CreatePayableMenu = ({
  isCreateAllowed,
  onCreateInvoice,
  handleFileUpload,
}: CreatePayableMenuProps) => {
  const { i18n } = useLingui();
  const [open, setOpen] = useState(false);
  const { FileInput, openFileInput, checkFileError } = useFileInput();
  const [dragIsOver, setDragIsOver] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    droppedFiles.forEach((file) => {
      const error = checkFileError(file);
      if (error) {
        toast.error(error);
        return;
      }

      handleFileUpload(file);
    });

    setOpen(false);
  };

  return (
    <div className="Monite-Payables">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="default" size="lg" disabled={!isCreateAllowed}>
            {t(i18n)`Add new bill`}
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="Monite-Payables mtw:w-auto mtw:min-w-[550px] mtw:border-none"
        >
          <div
            className="mtw:p-4 mtw:w-[550px]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div>
              <p className="mtw:text-xl mtw:font-semibold mtw:mb-2">
                {t(i18n)`Upload files`}
              </p>
              <div
                className={cn(
                  'mtw:box-border mtw:cursor-pointer mtw:w-full mtw:h-[170px] mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:text-center mtw:border-2 mtw:rounded-xl mtw:border-dashed mtw:border-neutral-80 mtw:bg-white mtw:hover:bg-neutral-95',
                  dragIsOver && 'mtw:bg-transparent'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileInput}
              >
                <div className="mtw:mx-auto">
                  <CloudUpload className="mtw:text-primary-30 mtw:w-10 mtw:h-10 mtw:mx-auto" />
                  <p className="mtw:text-lg mtw:font-semibold mtw:text-neutral-30">
                    {t(i18n)`Drag and drop files or click to upload`}
                  </p>
                  <p className="mtw:text-sm mtw:text-neutral-50">
                    {t(i18n)`(.pdf, .png, .jpg supported)`}
                  </p>
                </div>
              </div>
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
          <FileInput
            aria-label={t(i18n)`Upload payable files`}
            multiple
            onChange={(event) => {
              const files = event.target.files;
              if (files) handleFileUpload(files);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* <Button
        {...buttonProps}
        variant="contained"
        disabled={!isCreateAllowed}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {t(i18n)`Add new bill`}
      </Button>
      <Menu {...menuProps} sx={{ '& > .MuiPaper-root': { width: 550 } }}>

      </Menu>*/}
    </div>
  );
};
