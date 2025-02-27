import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { ConfirmDeleteMeasureUnitDialogue } from '@/components/products/ProductDetails/components/ConfirmDeleteMeasureUnitDialogue';
import { TableActions } from '@/components/TableActions';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
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

import { MeasureUnitsFormRow } from './components/MeasureUnitsFormRow';

type UnitResponse = components['schemas']['UnitResponse'];

export const ManageMeasureUnitsForm = () => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  const [editingUnit, setEditingUnit] = useState<UnitResponse | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<UnitResponse | null>(null);
  const showDeleteDialog = !!deletingUnit;
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
      onSuccess: async () => {
        if (deletingUnit) {
          await api.measureUnits.getMeasureUnits.invalidateQueries(queryClient);
          toast.success(
            t(i18n)`Unit ${deletingUnit.name} was deleted from the list.`
          );
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(t(i18n)`Failed to delete Unit.`);
      },
    }
  );

  const handleOpenDeleteDialog = useCallback((unit: UnitResponse) => {
    setDeletingUnit(unit);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeletingUnit(null);
  }, []);

  const deleteUnit = useCallback(() => {
    if (!deletingUnit) {
      return;
    }
    deleteUnitMutation.mutate(
      { path: { unit_id: deletingUnit.id } },
      {
        onSuccess: () => handleCloseDeleteDialog(),
      }
    );
  }, [deleteUnitMutation, deletingUnit, handleCloseDeleteDialog]);

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
            placeholder={t(i18n)`Search`}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <Paper variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '30%' }}>{t(
                    i18n
                  )`Unit label`}</TableCell>
                  <TableCell sx={{ width: '60%' }}>{t(
                    i18n
                  )`Description (optional)`}</TableCell>
                  <TableCell sx={{ width: '10%' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                <MeasureUnitsFormRow isEditMode={false} />
                {filteredUnits.map((unit) =>
                  editingUnit?.id === unit.id ? (
                    <MeasureUnitsFormRow
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
                      <TableCell sx={{ width: '30%' }}>
                        <Typography variant="body1" fontWeight={400}>
                          {unit.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '60%' }}>
                        <Typography
                          variant="body1"
                          color="secondary"
                          fontWeight={400}
                        >
                          {unit.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
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
        id={deletingUnit?.id}
        name={deletingUnit?.name || ''}
        isLoading={isDeleteLoading}
        onClose={handleCloseDeleteDialog}
        onDelete={deleteUnit}
      />
    </Stack>
  );
};
