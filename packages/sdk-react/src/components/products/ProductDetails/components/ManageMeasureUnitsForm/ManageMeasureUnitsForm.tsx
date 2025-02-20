import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

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

interface MeasureUnitsForm {
  id?: string;
  name: string;
  description?: string;
}

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
