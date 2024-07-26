import { ReactNode } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, Stack, Typography } from '@mui/material';

interface ReminderFormLayoutProps {
  title: string;
  daysBeforeInput: ReactNode;
  subjectInput: ReactNode;
  bodyInput: ReactNode;
  onDelete: () => void;
}

export const ReminderFormLayout = ({
  title,
  daysBeforeInput,
  subjectInput,
  bodyInput,
  onDelete,
}: ReminderFormLayoutProps) => {
  const { i18n } = useLingui();

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2} mt={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">{title}</Typography>
          <Button
            aria-label="delete"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDelete}
          >
            {t(i18n)`Delete`}
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {daysBeforeInput}
        </Box>
        {subjectInput}
        {bodyInput}
      </Stack>
    </Card>
  );
};
