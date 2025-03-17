import type {
  PropsWithChildren,
  CSSProperties,
  ReactNode,
  FormEvent,
} from 'react';
import { Control, Controller } from 'react-hook-form';

import { DefaultEmail } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartOrganizationView';
import type { CounterpartOrganizationRootResponse } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useReceivableById,
  useReceivableContacts,
  useCounterpartById,
} from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getDefaultContact, getContactList } from './helpers/contacts';

export interface FormProps {
  formName: string;
  style?: CSSProperties;
  children: ReactNode;
  handleIssueAndSend: (e: FormEvent) => void;
}

export const Form = ({
  formName,
  style,
  children,
  handleIssueAndSend,
}: PropsWithChildren<FormProps>) => {
  return (
    <form id={formName} noValidate onSubmit={handleIssueAndSend} style={style}>
      {children}
    </form>
  );
};

export interface ControlProps {
  subject: string;
  body: string;
  to: string;
}

interface RecipientSelectorProps {
  invoiceId: string;
  control: Control<ControlProps>;
}

const RecipientSelector = ({ invoiceId, control }: RecipientSelectorProps) => {
  const { data: contacts, isLoading } = useReceivableContacts(invoiceId);
  const { data: receivable } = useReceivableById(invoiceId);
  const { data: counterpart } = useCounterpartById(receivable?.counterpart_id);

  const { root } = useRootElements();

  if (isLoading) return <CircularProgress />;

  const defaultContact = getDefaultContact(
    contacts,
    counterpart as CounterpartOrganizationRootResponse
  );

  return (
    <Controller
      name="to"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          variant="standard"
          required
          fullWidth
          error={Boolean(error)}
        >
          <Select
            MenuProps={{ container: root }}
            className="Monite-NakedField Monite-RecipientSelector"
            data-testid={`${field.name}-select`}
            {...field}
          >
            {getContactList(contacts, defaultContact).map((contact) => (
              <MenuItem key={contact.id} value={contact.email}>
                <DefaultEmail
                  email={contact.email ?? ''}
                  isDefault={contact.is_default}
                />
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

interface FormContentProps {
  invoiceId: string;
  control: Control<ControlProps>;
  isDisabled: boolean;
}

export const FormContent = ({
  invoiceId,
  control,
  isDisabled,
}: FormContentProps) => {
  const { i18n } = useLingui();

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            px: 3,
            pt: 1,
            pb: 1,
            '&:last-child': { pb: 1 }, // last-child is necessary to override default style of the MUI theme
          }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography variant="body2" sx={{ minWidth: '52px' }}>{t(
              i18n
            )`To`}</Typography>
            <RecipientSelector invoiceId={invoiceId} control={control} />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent
          sx={{
            px: 3,
            py: 1,
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'divider',
          }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography variant="body2">{t(i18n)`Subject`}</Typography>
            <Controller
              name="subject"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  data-testid={`${field.name}-input`}
                  variant="standard"
                  className="Monite-NakedField"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  required
                  {...field}
                  disabled={isDisabled}
                />
              )}
            />
          </Stack>
        </CardContent>
        <CardContent sx={{ pl: 3, pr: 3, pb: 3, pt: 1 }}>
          <Controller
            name="body"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={field.name}
                data-testid={`${field.name}-input`}
                variant="standard"
                className="Monite-NakedField"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                required
                multiline
                rows={8}
                {...field}
                disabled={isDisabled}
              />
            )}
          />
        </CardContent>
      </Card>
    </>
  );
};
