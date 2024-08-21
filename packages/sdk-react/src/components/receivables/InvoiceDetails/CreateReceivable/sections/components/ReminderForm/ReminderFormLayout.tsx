import { ReactNode } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, Stack, Typography } from '@mui/material';

interface ReminderFormLayoutProps {
  title: string;
  subTitle?: string;
  daysBefore: ReactNode;
  subject: ReactNode;
  body: ReactNode;
  onDelete: () => void;
}

export const ReminderFormLayout = ({
  title,
  subTitle,
  daysBefore,
  subject,
  body,
  onDelete,
}: ReminderFormLayoutProps) => {
  const { i18n } = useLingui();

  return (
    <Card variant="outlined">
      <Stack useFlexGap spacing={3} p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <Button
            aria-label="delete"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDelete}
          >
            {t(i18n)`Delete`}
          </Button>
        </Box>
        {subTitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subTitle}
          </Typography>
        )}
        <Box display="flex" alignItems="center" gap={1}>
          {daysBefore}
        </Box>
        {subject}
        {body}
      </Stack>
    </Card>
  );
};
