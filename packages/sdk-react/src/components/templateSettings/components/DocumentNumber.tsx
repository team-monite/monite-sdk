import { useMyEntity } from '@/core/queries';
import { CircularProgress } from '@mui/material';

import { useGetEntitySettings, useGetEntityDocumentNumber } from '../hooks';
import { DocumentNumberForm } from './DocumentNumberForm';

export const DocumentNumber = () => {
  const { data: entity } = useMyEntity();
  const entityId = entity?.id ?? '';
  const { data: entitySettings, isLoading: isLoadingSettings } =
    useGetEntitySettings(entityId);
  const { data: nextNumbers, isLoading: isLoadingNextNumbers } =
    useGetEntityDocumentNumber(entityId);

  if (isLoadingSettings || isLoadingNextNumbers) {
    return <CircularProgress />;
  }

  if (!entitySettings || !nextNumbers) return null;

  return (
    <DocumentNumberForm
      entityId={entityId}
      entitySettings={entitySettings}
      nextNumbers={nextNumbers}
    />
  );
};
