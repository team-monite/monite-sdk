import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntitySettings, usePatchEntitiesIdSettings } from '@/core/queries';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';

export type UseTagsProps = {
  setNameError?: (error: string) => void;
  onTagCreated?: (tag: components['schemas']['TagReadSchema']) => void;
  onTagUpdated?: (tag: components['schemas']['TagReadSchema']) => void;
};

export const useTags = ({
  setNameError,
  onTagCreated,
  onTagUpdated,
}: UseTagsProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const { data: settings } = useEntitySettings();
  const { mutateAsync } = usePatchEntitiesIdSettings();

  const tagsWithKeywords = settings?.payables_ocr_auto_tagging || [];

  const tagCreateMutation = api.tags.postTags.useMutation(
    {},
    {
      onSuccess: () => api.tags.getTags.invalidateQueries(queryClient),
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        if (errorMessage === 'This tag already exists.') {
          setNameError?.(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      },
    }
  );

  const tagUpdateMutation = api.tags.patchTagsId.useMutation(undefined, {
    onSuccess: (tag) => {
      Promise.all([
        api.tags.getTags.invalidateQueries(queryClient),
        api.tags.getTagsId.invalidateQueries(
          { parameters: { path: { tag_id: tag.id } } },
          queryClient
        ),
      ]);
      onTagUpdated?.(tag);
    },
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  return {
    tagsWithKeywords: Object.fromEntries(
      tagsWithKeywords.map((tag) => [tag.tag_id, tag.keywords])
    ),
    inProgress: tagCreateMutation.isPending || tagUpdateMutation.isPending,
    createTag: (values: components['schemas']['TagCreateSchema']) =>
      tagCreateMutation.mutateAsync(
        { ...values },
        {
          onSuccess: (tag) => onTagCreated?.(tag),
        }
      ),
    updateTag: (id: string, values: components['schemas']['TagUpdateSchema']) =>
      tagUpdateMutation.mutateAsync({
        path: {
          tag_id: id,
        },
        body: values,
      }),
    updateOcrAutoTagging: (tag_id: string, keywords: string[] = []) => {
      const filteredTags = tagsWithKeywords.filter(
        (tag) => tag.tag_id !== tag_id
      );

      if (filteredTags.length === tagsWithKeywords.length && !keywords.length) {
        return;
      }

      const autoTagging = keywords.length
        ? [
            ...filteredTags,
            {
              tag_id,
              keywords: [...new Set(keywords)],
              enabled: true,
            },
          ]
        : filteredTags;

      if (autoTagging.length) {
        mutateAsync({
          vat_mode: settings!.vat_mode,
          payment_priority: settings!.payment_priority,
          quote_signature_required: settings!.quote_signature_required,
          receivable_edit_flow: settings!.receivable_edit_flow,
          allow_purchase_order_autolinking:
            settings!.allow_purchase_order_autolinking,
          generate_paid_invoice_pdf: settings!.generate_paid_invoice_pdf,
          payables_ocr_auto_tagging: autoTagging,
          payables_skip_approval_flow: settings!.payables_skip_approval_flow,
          vat_inclusive_discount_mode: settings!.vat_inclusive_discount_mode,
        });
      }
    },
  };
};
