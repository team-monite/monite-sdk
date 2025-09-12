import { DragEvent, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { PayablesTabEnum } from '../types';
import { useFileInput } from '@/core/hooks';
import { Button } from '@/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/ui/components/tabs-underline';
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
  isCreatePurchaseOrderAllowed?: boolean;
  activeTab: PayablesTabEnum;
  onCreateInvoice: () => void;
  onCreatePurchaseOrder: () => void;
  handleFileUpload: (file: File | FileList) => void;
}

export const CreatePayableMenu = ({
  isCreateAllowed,
  isCreatePurchaseOrderAllowed,
  activeTab,
  onCreateInvoice,
  onCreatePurchaseOrder,
  handleFileUpload,
}: CreatePayableMenuProps) => {
  const { i18n } = useLingui();
  const [open, setOpen] = useState(false);
  const { FileInput, openFileInput, checkFileError } = useFileInput();
  const [dragIsOver, setDragIsOver] = useState(false);
  
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTab === PayablesTabEnum.PurchaseOrders ? 'purchase-order' : 'bill'
  );

  useEffect(() => {
    if (open) {
      setSelectedTab(
        activeTab === PayablesTabEnum.PurchaseOrders ? 'purchase-order' : 'bill'
      );
    }
  }, [activeTab, open]);

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

  const anyCreateAllowed = isCreateAllowed || isCreatePurchaseOrderAllowed;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="default" size="lg" disabled={!anyCreateAllowed}>
            {t(i18n)`Create new`}
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="mtw:w-auto mtw:min-w-[550px] mtw:border-none mtw:p-0"
        >
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mtw:w-[550px]"
          >
            <div className="mtw:px-8 mtw:pt-4 mtw:border-b mtw:border-[#dce2eb]">
              <TabsList className="mtw:bg-transparent mtw:p-0 mtw:h-11 mtw:w-auto mtw:justify-start mtw:gap-6 mtw:rounded-none mtw:relative mtw:inline-flex">
                <TabsTrigger 
                  value="bill"
                  className="mtw:bg-transparent mtw:rounded-none mtw:px-3 mtw:h-11 mtw:border-0 mtw:shadow-none mtw:data-[state=active]:bg-transparent mtw:data-[state=active]:shadow-none mtw:font-medium mtw:text-sm mtw:text-[#666666] mtw:data-[state=active]:text-[#212126] mtw:relative mtw:pb-0 mtw:flex mtw:items-center mtw:after:absolute mtw:after:bottom-0 mtw:after:left-0 mtw:after:right-0 mtw:after:h-1 mtw:after:bg-[#3737ff] mtw:after:rounded-[10px] mtw:after:opacity-0 mtw:data-[state=active]:after:opacity-100"
                >
                  {t(i18n)`Bill`}
                </TabsTrigger>
                <TabsTrigger
                  value="purchase-order"
                  className="mtw:bg-transparent mtw:rounded-none mtw:px-3 mtw:h-11 mtw:border-0 mtw:shadow-none mtw:data-[state=active]:bg-transparent mtw:data-[state=active]:shadow-none mtw:font-medium mtw:text-sm mtw:text-[#666666] mtw:data-[state=active]:text-[#212126] mtw:relative mtw:pb-0 mtw:flex mtw:items-center mtw:after:absolute mtw:after:bottom-0 mtw:after:left-0 mtw:after:right-0 mtw:after:h-1 mtw:after:bg-[#3737ff] mtw:after:rounded-[10px] mtw:after:opacity-0 mtw:data-[state=active]:after:opacity-100"
                >
                  {t(i18n)`Purchase order`}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="bill" className="mtw:px-8 mtw:py-6 mtw:pb-8 mtw:space-y-6">
              <div>
                <p className="mtw:text-base mtw:font-semibold mtw:mb-2">
                  {t(i18n)`Upload files`}
                </p>
                <div
                  className={cn(
                    'mtw:box-border mtw:cursor-pointer mtw:w-full mtw:h-40 mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:text-center mtw:border-2 mtw:rounded-xl mtw:border-dashed mtw:border-gray-300 mtw:bg-white mtw:hover:bg-gray-50',
                    dragIsOver && 'mtw:bg-gray-100'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFileInput}
                >
                  <CloudUpload className="mtw:text-gray-400 mtw:w-8 mtw:h-8 mtw:mb-2" />
                  <p className="mtw:text-sm mtw:font-semibold mtw:text-gray-900">
                    {t(i18n)`Drag and drop files or click to upload`}
                  </p>
                  <p className="mtw:text-sm mtw:text-gray-500">
                    {t(i18n)`PDF, JPEG, or PNG files up to 10MB`}
                  </p>
                </div>
              </div>
              <div>
                <p className="mtw:text-base mtw:font-semibold mtw:mb-2">
                  {t(i18n)`Or create manually`}
                </p>
                <Button
                  variant="secondary"
                  className="mtw:bg-blue-50 mtw:text-blue-600 mtw:hover:bg-blue-100 mtw:border-0 mtw:font-medium"
                  disabled={!isCreateAllowed}
                  onClick={() => {
                    setOpen(false);
                    onCreateInvoice();
                  }}
                >
                  <Plus className="mtw:w-4 mtw:h-4 mtw:mr-1" />
                  {t(i18n)`Create new bill`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="purchase-order" className="mtw:px-8 mtw:py-6 mtw:pb-8 mtw:space-y-6">
              <div>
                <p className="mtw:text-base mtw:font-semibold mtw:mb-2">
                  {t(i18n)`Create manually`}
                </p>
                <Button
                  variant="secondary"
                  className="mtw:bg-blue-50 mtw:text-blue-600 mtw:hover:bg-blue-100 mtw:border-0 mtw:font-medium"
                  disabled={!isCreatePurchaseOrderAllowed}
                  onClick={() => {
                    setOpen(false);
                    onCreatePurchaseOrder();
                  }}
                >
                  <Plus className="mtw:w-4 mtw:h-4 mtw:mr-1" />
                  {t(i18n)`Create new purchase order`}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
    </>
  );
};
