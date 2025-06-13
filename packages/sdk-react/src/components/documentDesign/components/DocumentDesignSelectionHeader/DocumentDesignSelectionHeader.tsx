import { PageHeader } from '@/components/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

export interface DocumentDesignSelectionHeaderProps {
  canSetDefault?: boolean;
  setDefault: () => void;
}

export const DocumentDesignSelectionHeader = ({
  canSetDefault = false,
  setDefault,
}: DocumentDesignSelectionHeaderProps) => {
  const { i18n } = useLingui();

  return (
    <PageHeader
      className={'-Header'}
      title={<>{t(i18n)`Document design`}</>}
      extra={
        <Button
          disabled={!canSetDefault}
          variant="contained"
          sx={{ marginLeft: 'auto' }}
          onClick={setDefault}
        >
          {t(i18n)`Set as default`}
        </Button>
      }
    />
  );
};
