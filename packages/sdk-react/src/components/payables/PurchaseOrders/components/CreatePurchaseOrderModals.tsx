import { TemplateSettings } from '@/components/templateSettings';

interface CreatePurchaseOrderModalsProps {
  isEditTemplateModalOpen: boolean;
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
