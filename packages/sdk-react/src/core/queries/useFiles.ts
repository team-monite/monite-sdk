import type {
  ApiError,
  FileResponse,
  FilesResponse,
  UploadFile,
} from '@monite/sdk-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const fileQueryKeys = {
  all: () => ['files'],
  list: (idIn: Array<string>) => [...fileQueryKeys.all(), 'list', idIn],
  detail: (id?: string) => {
    const detailKey = [...fileQueryKeys.all(), 'detail'];
    if (!id) return detailKey;
    return [...detailKey, id];
  },
};

export const useFiles = (idIn: Array<string>) => {
  const { monite } = useMoniteContext();

  return useQuery<FilesResponse, ApiError>({
    queryKey: fileQueryKeys.list(idIn),

    queryFn: () => monite.api.files.getAll(idIn),
  });
};

export const useFileById = (fileId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<FileResponse | undefined, ApiError>({
    queryKey: fileQueryKeys.detail(fileId),

    queryFn: () => {
      if (!fileId) {
        throw new Error(
          `Make sure you have called useFileById with a valid file id.`
        );
      }

      return monite.api.files.getById(fileId);
    },

    enabled: !!fileId,
  });
};

export const useCreateFile = () => {
  const { monite } = useMoniteContext();
  const queryClient = useQueryClient();

  return useMutation<FileResponse, ApiError, UploadFile>({
    mutationFn: async (payload) => {
      const response = await monite.api.files.create(payload);

      queryClient.setQueryData(
        [...fileQueryKeys.detail(response.id)],
        response
      );

      return response;
    },
  });
};

export const useDeleteFile = () => {
  const { monite } = useMoniteContext();

  return useMutation<void, ApiError, string>({
    mutationFn: (fileId) => monite.api.files.deleteById(fileId),
  });
};
