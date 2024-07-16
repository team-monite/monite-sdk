import React, { ReactNode } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import EmailIcon from '@mui/icons-material/MailOutline';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import {
  Box,
  Card,
  CardContent,
  darken,
  Stack,
  Typography,
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';

enum DeliveryMethod {
  Email = 'email',
  Download = 'download',
}

const DeliveryMethodView = ({
  icon,
  title,
  description,
  checked,
  disabled,
  deliveryMethod,
  setDeliveryMethod,
}: {
  checked: boolean;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  title: string;
  description: string;
  disabled?: boolean;
  icon: ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        borderColor: checked
          ? 'primary.main'
          : lighten(theme.palette.secondary.main, 0.95),
        backgroundColor:
          theme.palette.mode === 'dark'
            ? checked
              ? darken(theme.palette.primary.main, 0.4)
              : lighten(theme.palette.secondary.main, 0.1)
            : checked
            ? lighten(theme.palette.primary.main, 0.95)
            : lighten(theme.palette.secondary.main, 0.95),
        cursor: 'pointer',
        maxWidth: 200,
        transition: 'all 0.2s ease',
      }}
      variant="outlined"
    >
      <CardContent
        onClick={() => !disabled && setDeliveryMethod(deliveryMethod)}
      >
        <Stack direction="column" spacing={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 1,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : lighten(theme.palette.primary.main, 0.9),
                borderRadius: '50%',
              }}
            >
              {icon}
            </Box>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export interface SubmitInvoiceProps {
  disabled: boolean;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChanged: (method: DeliveryMethod) => void;
}

export const SubmitInvoice = ({
  disabled,
  deliveryMethod,
  onDeliveryMethodChanged,
}: SubmitInvoiceProps) => {
  const { i18n } = useLingui();

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
          i18n
        )`Submit invoice`}</Typography>
        <Stack direction="row" spacing={1}>
          <DeliveryMethodView
            deliveryMethod={DeliveryMethod.Email}
            setDeliveryMethod={onDeliveryMethodChanged}
            checked={deliveryMethod === DeliveryMethod.Email}
            title={t(i18n)`Issue and send`}
            description={t(i18n)`Issue invoice and email it to a customer`}
            disabled={disabled}
            icon={<EmailIcon color="primary" />}
          />
          <DeliveryMethodView
            deliveryMethod={DeliveryMethod.Download}
            setDeliveryMethod={onDeliveryMethodChanged}
            checked={deliveryMethod === DeliveryMethod.Download}
            title={t(i18n)`Issue only`}
            description={t(i18n)`Deliver invoice later or download PDF`}
            disabled={disabled}
            icon={<TaskOutlinedIcon color="primary" />}
          />
        </Stack>
      </Box>
    </Stack>
  );
};
