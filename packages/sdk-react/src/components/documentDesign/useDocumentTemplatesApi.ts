import { useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const useDocumentTemplatesApi = () => {
  const { api, queryClient } = useMoniteContext();
  const { data: documentTemplates, isLoading } =
    api.documentTemplates.getDocumentTemplates.useQuery({});

  const [invoiceTemplates, defaultInvoiceTemplate] = useMemo(() => {
    const filtered =
      documentTemplates?.data?.filter(
        (template) => template.document_type === 'invoice'
      ) || [];

    return [filtered, filtered.find((template) => template.is_default)];
  }, [documentTemplates]);

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
          toast.success(
            t(i18n)`${name} document template has been set as the default.`
          );
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
