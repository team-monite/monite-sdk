import { Controller, useForm } from 'react-hook-form';

import type { AuthCredentialsProviderForwardProps } from '@/components/AuthCredentialsProvider';
import { AuthCredentials } from '@/core/fetchToken';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { z } from 'zod';

const validationSchema = z.object({
  entity_user_id: z.string().min(1, 'Entity User ID is required'),
  client_id: z.string().min(1, 'Client ID is required'),
  client_secret: z.string().min(1, 'Client Secret is required'),
});

const StyledLogo = styled('img')(() => ({
  width: '32px',
  borderRadius: '5px',
}));

export const LoginForm = ({
  login,
}: Pick<AuthCredentialsProviderForwardProps, 'login'>) => {
  const { handleSubmit, control } = useForm<AuthCredentials>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      entity_user_id: '',
      client_id: '',
      client_secret: '',
    },
  });

  const { i18n } = useLingui();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px',
          minHeight: '100vh',
        }}
      >
        <form onSubmit={handleSubmit(login)}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <StyledLogo src={'/favicon.svg'} alt="Monite Logo" />
            <Typography variant="h2">{t(i18n)`Welcome back`}</Typography>
          </Box>

          <Box
            sx={{
              width: '430px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '32px',
            }}
          >
            <Controller
              name="client_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  id={field.name}
                  label={t(i18n)`Client ID`}
                  required
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  autoFocus
                />
              )}
            />

            <Controller
              name="client_secret"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  id={field.name}
                  label={t(i18n)`Client Secret`}
                  required
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="entity_user_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  id={field.name}
                  label={t(i18n)`Entity User ID`}
                  required
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />

            <Box sx={{ mt: 1, width: '100%' }}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                {t(i18n)`Login`}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};
