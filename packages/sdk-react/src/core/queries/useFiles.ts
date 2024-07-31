import { useMoniteContext } from '../context/MoniteContext';

export const useFileById = (fileId: string | undefined) => {
  const { api } = useMoniteContext();

  return api.files.getFilesId.useQuery(
    {
      path: { file_id: fileId ?? '' },
    },
    {
      enabled: Boolean(fileId),
    }
  );
};
