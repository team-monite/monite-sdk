import { useMyEntity } from '@/core/queries';
import { CircularProgress } from '@mui/material';

import { useGetEntitySettings } from '../hooks';
import { DocumentNumberForm } from './DocumentNumberForm';

export const DocumentNumber = () => {
  const { data: entity } = useMyEntity();
  const entityId = entity?.id ?? '';
  const { data: entitySettings, isLoading } = useGetEntitySettings(entityId);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!entitySettings) return null;

  return (
    <DocumentNumberForm entityId={entityId} entitySettings={entitySettings} />
  );
};
