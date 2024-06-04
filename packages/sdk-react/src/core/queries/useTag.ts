import { toast } from 'react-hot-toast';

import { api, useMoniteApiClient } from '@/api/client';
import { getAPIErrorMessage } from '@/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';

export const useTagListQuery = (
  query?: (typeof api.tags.getTags.types.parameters)['query']
) => {
  const { api, apiVersion, entityId } = useMoniteApiClient();
  return api.tags.getTags.useQuery({
    header: {
      'x-monite-version': apiVersion,
      'x-monite-entity-id': entityId,
    },
    query,
  });
};

export const useCreateTagMutation = () => {
  const { i18n } = useLingui();
  const { api, apiVersion, entityId } = useMoniteApiClient();
  const queryClient = useQueryClient();

  return api.tags.postTags.useMutation(
    {
      header: {
        'x-monite-version': apiVersion,
        'x-monite-entity-id': entityId,
      },
    },
    {
      onSuccess: () => api.tags.getTags.invalidateQueries(queryClient),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
};

export const useUpdateTagMutation = (tagId: string | undefined) => {
  const { i18n } = useLingui();
  const { api, apiVersion, entityId } = useMoniteApiClient();
  const queryClient = useQueryClient();

  return api.tags.patchTagsId.useMutation(
    {
      header: {
        'x-monite-version': apiVersion,
        'x-monite-entity-id': entityId,
      },
      path: {
        tag_id: tagId ?? '',
      },
    },
    {
      onSuccess: () =>
        Promise.all([
          api.tags.getTags.invalidateQueries(queryClient),
          api.tags.getTagsId.invalidateQueries(
            { parameters: { path: { tag_id: tagId } } },
            queryClient
          ),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
};

export const useDeleteTagMutation = (tagId: string | undefined) => {
  const { api, apiVersion, entityId } = useMoniteApiClient();
  const queryClient = useQueryClient();

  return api.tags.deleteTagsId.useMutation(
    {
      header: {
        'x-monite-version': apiVersion,
        'x-monite-entity-id': entityId,
      },
      path: {
        tag_id: tagId ?? '',
      },
    },
    {
      onSuccess: () => {
        api.tags.getTagsId.removeQueries(
          { parameters: { path: { tag_id: tagId } } },
          queryClient
        );

        return api.tags.getTags.invalidateQueries(queryClient);
      },
    }
  );
};
