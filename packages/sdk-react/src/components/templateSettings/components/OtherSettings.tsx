import { useMyEntity } from '@/core/queries';
import { CircularProgress } from '@mui/material';

import { useGetEntitySettings } from '../hooks';
import { OtherSettingsForm } from './OtherSettingsForm';

export const OtherSettings = () => {
  const { data: entity } = useMyEntity();
  const entityId = entity?.id ?? '';
  const { data: entitySettings, isLoading } = useGetEntitySettings(entityId);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!entitySettings) return null;

  return (
    <OtherSettingsForm entityId={entityId} entitySettings={entitySettings} />
  );
};
