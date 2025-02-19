import { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ConfirmDeleteMeasureUnitDialogue } from '@/components/products/ProductDetails/components/ConfirmDeleteMeasureUnitDialogue';
import { TableActions } from '@/components/TableActions';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import * as yup from 'yup';

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

const validationSchema = yup.object().shape({
  name: yup.string().required('Unit label is required'),
  description: yup.string(),
});

const MeasureUnitFormRow: React.FC<MeasureUnitFormRowProps> = ({
  id,
  isEditMode,
  initialValues = defaultValues,
  onCancel,
  onEdit,
}) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();
  const { getValues, handleSubmit, control, reset, setError } =
    useForm<MeasureUnitsForm>({
      defaultValues: initialValues,
      resolver: yupResolver(validationSchema),
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
        toast.error(getAPIErrorMessage(i18n, error));
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

  return (
    <TableRow>
      <TableCell colSpan={3} sx={{ width: '100%' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={createMutation.isPending || updateMutation.isPending}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    height: '32px',
                    minHeight: '32px!important',
                    width: '100%',
                  },
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
                disabled={createMutation.isPending || updateMutation.isPending}
                error={Boolean(error)}
                helperText={error?.message}
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    height: '32px',
                    minHeight: '32px!important',
                    width: '100%',
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
                sx={{
                  '&:hover': {
                    borderRadius: '8px',
                    background: '#F8F8FF',
                  },
                  background: '#EBEBFF',
                  color: '#3737FF',
                  borderRadius: '8px',
                  height: '32px',
                }}
                disabled={updateMutation.isPending}
                onClick={handleSubmit(handleEdit)}
              >
                <CheckIcon sx={{ fontSize: '16px' }} />
              </IconButton>
              <IconButton
                color="primary"
                sx={{
                  '&:hover': {
                    borderRadius: '8px',
                    background: '#F8F8FF',
                  },
                  background: '#EBEBFF',
                  color: '#3737FF',
                  borderRadius: '8px',
                  height: '32px',
                }}
                onClick={onCancel}
              >
                <CloseIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                '&:hover': {
                  borderRadius: '8px',
                  background: '#F8F8FF',
                },
                background: '#EBEBFF',
                color: '#3737FF',
                borderRadius: '8px',
              }}
              loading={createMutation.isPending}
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

export const ManageMeasureUnitsForm = () => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  const [editingUnit, setEditingUnit] = useState<MeasureUnitsForm | null>(null);

  const [search, setSearch] = useState<string>('');

  const { data: measureUnits, isLoading: measureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();

  const filteredUnits =
    measureUnits?.data?.filter(
      (unit) =>
        unit.name.toLowerCase().includes(search.toLowerCase()) ||
        (unit.description &&
          unit.description.toLowerCase().includes(search.toLowerCase()))
    ) || [];

  const deleteUnitMutation = api.measureUnits.deleteMeasureUnitsId.useMutation(
    undefined,
    {
      onSuccess: async (_, { name }) => {
        await api.measureUnits.getMeasureUnits.invalidateQueries(queryClient);
        toast.success(t(i18n)`Unit ${name} was deleted from the list.`);
      },
      onError: (error) => {
        console.error(error);
        toast.error(t(i18n)`Failed to delete Unit.`);
      },
    }
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleOpenDeleteDialog = useCallback((unit) => {
    setShowDeleteDialog(true);
    setEditingUnit(unit);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setEditingUnit(null);
  }, []);

  console.log('editinigUnit', editingUnit);

  const deleteUnit = useCallback(() => {
    if (!editingUnit) {
      return;
    }

    deleteUnitMutation.mutate(
      {
        path: {
          unit_id: editingUnit.id,
        },
        name: editingUnit.name,
      },
      {
        onSuccess: () => {
          handleCloseDeleteDialog();
        },
      }
    );
  }, [deleteUnitMutation, editingUnit, handleCloseDeleteDialog]);

  const isDeleteLoading = deleteUnitMutation.isPending;

  const handleCancelEdit = () => {
    setEditingUnit(null);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        height: '100%',
      }}
    >
      {measureUnitsLoading || isDeleteLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress size={40} color="secondary" />
        </Box>
      ) : (
        <>
          <TextField
            variant="outlined"
            placeholder="Search"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#666' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '20px',
                background: 'white',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: '#aaa',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#666',
                },
              },
            }}
          />

          <Paper variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t(i18n)`Unit label`}</TableCell>
                  <TableCell>{t(i18n)`Description (optional)`}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                <MeasureUnitFormRow isEditMode={false} />
                {filteredUnits.map((unit) =>
                  editingUnit?.id === unit.id ? (
                    <MeasureUnitFormRow
                      key={unit.id}
                      isEditMode={true}
                      initialValues={unit}
                      onCancel={handleCancelEdit}
                      onEdit={() => setEditingUnit(null)}
                      id={unit.id}
                    />
                  ) : (
                    <TableRow
                      key={unit.id}
                      hover
                      sx={{
                        '&.MuiTableRow-root': { cursor: 'pointer' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight={400}>
                          {unit.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="secondary"
                          fontWeight={400}
                        >
                          {unit.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TableActions
                          permissions={{
                            isUpdateAllowed: true,
                            isDeleteAllowed: true,
                          }}
                          onEdit={() => setEditingUnit(unit)}
                          onDelete={() => handleOpenDeleteDialog(unit)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      <ConfirmDeleteMeasureUnitDialogue
        open={showDeleteDialog}
        name={editingUnit?.name || ''}
        isLoading={isDeleteLoading}
        onClose={handleCloseDeleteDialog}
        onDelete={deleteUnit}
      />
    </Stack>
  );
};
