import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';

import { z } from 'zod';

interface MeasureUnitsForm {
  id?: string;
  name: string;
  description?: string;
}

const defaultValues: MeasureUnitsForm = {
  name: '',
  description: '',
};

interface MeasureUnitFormRowProps {
  isEditMode: boolean;
  initialValues?: MeasureUnitsForm;
  onCancel?: () => void;
  onEdit?: () => void;
  id?: string;
}

const buttonStyle = {
  '&:hover': { borderRadius: '8px', background: '#F8F8FF' },
  background: '#EBEBFF',
  color: '#3737FF',
  borderRadius: '8px',
  height: '32px',
};
export const MeasureUnitsFormRow = ({
  id,
  isEditMode,
  initialValues = defaultValues,
  onCancel,
  onEdit,
}: MeasureUnitFormRowProps) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  const validationSchema = z.object({
    name: z.string().min(1, t(i18n)`Unit label is required`),
    description: z.string().optional(),
  });

  const { getValues, handleSubmit, control, reset, setError } =
    useForm<MeasureUnitsForm>({
      defaultValues: initialValues,
      resolver: zodResolver(validationSchema),
    });

  const createMutation = api.measureUnits.postMeasureUnits.useMutation(
    {},
    {
      onSuccess: async (data) => {
        await api.measureUnits.getMeasureUnits.invalidateQueries(queryClient);
        toast.success(t(i18n)`Unit ${data.name} was added to the list`);
        reset();
      },
      onError: async (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        if (errorMessage.includes('already exists')) {
          setError('name', { type: 'custom', message: errorMessage });
          return;
        } else {
          toast.error(errorMessage);
        }
      },
    }
  );

  const updateMutation = api.measureUnits.patchMeasureUnitsId.useMutation(
    {
      path: {
        unit_id: id as string,
      },
    },
    {
      onSuccess: async (data) => {
        await Promise.all([
          api.measureUnits.getMeasureUnits.invalidateQueries(queryClient),
          api.measureUnits.getMeasureUnitsId.invalidateQueries(
            { parameters: { path: { unit_id: id } } },
            queryClient
          ),
        ]);
        toast.success(t(i18n)`Unit ${data.name} was updated`);
        onEdit?.();
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        if (errorMessage.includes('already exists')) {
          setError('name', { type: 'custom', message: errorMessage });
          return;
        } else {
          toast.error(errorMessage);
        }
      },
    }
  );

  const handleEdit = () => {
    updateMutation.mutate({
      name: getValues().name,
      description: getValues().description,
    });
  };

  const handleCreate = () => {
    createMutation.mutate(getValues());
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <TableRow>
      <TableCell colSpan={3} sx={{ width: '100%' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                disabled={isSubmitting}
                error={Boolean(error)}
                helperText={error?.message}
                sx={{ width: '30%' }}
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    height: '32px',
                    minHeight: '32px!important',
                  },
                }}
                FormHelperTextProps={{
                  sx: { margin: '4px' },
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                id={field.name}
                disabled={isSubmitting}
                error={Boolean(error)}
                helperText={error?.message}
                size="small"
                sx={{ width: '60%' }}
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    height: '32px',
                    minHeight: '32px!important',
                  },
                }}
              />
            )}
          />
          {isEditMode ? (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap={0.5}
            >
              <IconButton
                color="primary"
                sx={buttonStyle}
                disabled={updateMutation.isPending}
                onClick={handleSubmit(handleEdit)}
              >
                <CheckIcon sx={{ fontSize: '16px' }} />
              </IconButton>
              <IconButton color="primary" sx={buttonStyle} onClick={onCancel}>
                <CloseIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              size="small"
              sx={buttonStyle}
              onClick={handleSubmit(handleCreate)}
            >
              {t(i18n)`Add`}
            </Button>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
};
