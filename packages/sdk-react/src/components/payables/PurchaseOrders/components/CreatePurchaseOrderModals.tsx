import { components } from '@/api';
import { TemplateSettings } from '@/components/templateSettings';

interface CreatePurchaseOrderModalsProps {
  isEditTemplateModalOpen: boolean;
  entity?: components['schemas']['EntityResponse'] | null;
  onTemplateModalClose: () => void;
}

export const CreatePurchaseOrderModals = ({
  isEditTemplateModalOpen,
  onTemplateModalClose,
}: CreatePurchaseOrderModalsProps) => {
  return (
    <>
      {isEditTemplateModalOpen && (
        <TemplateSettings
          isDialog={true}
          isOpen={isEditTemplateModalOpen}
          handleCloseDialog={onTemplateModalClose}
          documentType="purchase_order"
        />
      )}
    </>
  );
};
