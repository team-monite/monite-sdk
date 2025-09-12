import { SelectableDocumentType } from '../types';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';

export const useDocumentTemplatesApi = (
  documentType?: SelectableDocumentType
) => {
  const { api, queryClient, componentSettings } = useMoniteContext();
  const { i18n } = useLingui();
  const { data: documentTemplates, isLoading } =
    api.documentTemplates.getDocumentTemplates.useQuery(
      {},
      {
        enabled: componentSettings?.templateSettings?.showTemplateSection,
      }
    );

  const [invoiceTemplates, defaultInvoiceTemplate] = useMemo(() => {
    const documentTypeMap: Record<
      SelectableDocumentType | 'default',
      TemplateDocumentType[]
    > = {
      purchase_order: ['purchase_order'],
      receivable: ['invoice', 'receivable'],
      default: ['invoice', 'receivable'],
    };

    const allowedTypes =
      documentTypeMap[documentType ?? 'default'] ?? documentTypeMap.default;

    let filtered: TemplateDocument[] =
      documentTemplates?.data?.filter((template) =>
        allowedTypes.includes(template.document_type)
      ) || [];

    if (
      componentSettings?.templateSettings?.availableTemplateIds &&
      componentSettings?.templateSettings?.availableTemplateIds?.length > 0
    ) {
      filtered = filtered.filter(
        (template) =>
          componentSettings?.templateSettings?.availableTemplateIds?.includes(
            template?.id
          ) || template.is_default
      );
    }

    return [filtered, filtered.find((template) => template.is_default)];
  }, [
    documentTemplates,
    componentSettings?.templateSettings?.availableTemplateIds,
    documentType,
  ]);

  const updateMutation =
    api.documentTemplates.postDocumentTemplatesIdMakeDefault.useMutation(
      undefined,
      {
        onSuccess: () => {
          api.documentTemplates.getDocumentTemplates.invalidateQueries(
            queryClient
          );
        },
      }
    );

  const setDefaultTemplate = async (
    id: components['schemas']['TemplateReceivableResponse']['id'],
    name: components['schemas']['TemplateReceivableResponse']['name']
  ) => {
    await updateMutation.mutateAsync(
      {
        path: {
          document_template_id: id,
        },
      },
      {
        onSuccess: () => {
          toast.success(t(i18n)`${name} template has been set as the default.`);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );
  };

  return {
    invoiceTemplates,
    defaultInvoiceTemplate,
    isLoading,
    setDefaultTemplate,
  };
};

type TemplateDocumentType =
  | components['schemas']['TemplateReceivableResponse']['document_type']
  | 'invoice';
type TemplateDocument = components['schemas']['TemplateReceivableResponse'];
