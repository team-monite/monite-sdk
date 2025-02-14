import { useMemo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { TableActions } from '@/components/TableActions';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  TextField,
  Paper,
  TableCell,
  Checkbox,
  CircularProgress,
} from '@mui/material';

import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('Unit label is required'),
  description: yup.string(),
});

interface ManageMeasureUnitsFormFormProps {
  // /** Triggered when the form is submitted */
  // onSubmit: (values: IProductFormSubmitValues) => void;
  // /**
  //  * Default values for the form fields
  //  */
  // defaultValues: ProductFormValues;
  // /** The `<form />` id attribute to submit the form using external button */
  // formId: string;
  // /** Triggered when form values are changed or set back to defaults */
  // onChanged?: (isDirty: boolean) => void;
  /**
   * Opens a form where users can manage measurement units.
   * Allows creating, editing, and deleting units.
   */
  // onManageMeasureUnits: () => void;
}

interface MeasureUnitsForm {
  name: string;
  description?: string;
}

export const ManageMeasureUnitsForm = () => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { handleSubmit, control } = useForm<MeasureUnitsForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { data: measureUnits, isLoading } =
    api.measureUnits.getMeasureUnits.useQuery();
  return (
    <>
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
            <TableRow key={'add_unit'}>
              <TableCell>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      id={field.name}
                      required
                      variant="filled"
                      error={Boolean(error)}
                      helperText={error?.message}
                      autoFocus
                      fullWidth
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      id={field.name}
                      variant="filled"
                      error={Boolean(error)}
                      helperText={error?.message}
                      autoFocus
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: '8px' }}
                  onClick={() => console.log('add')}
                >
                  {t(i18n)`Add`}
                </Button>
              </TableCell>
            </TableRow>
            {measureUnits?.data?.map((unit) => (
              <TableRow
                key={unit.id}
                hover
                sx={{
                  '&.MuiTableRow-root': { cursor: 'pointer' },
                }}
              >
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.description}</TableCell>
                <TableCell>
                  <TableActions
                    permissions={{
                      isUpdateAllowed: true,
                      isDeleteAllowed: true,
                    }}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </TableCell>
              </TableRow>
            ))}
            {/* <TableRow>
              <TableCell colSpan={3}>
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={onAddRule}
                  disabled={
                    Boolean(rules.single_user) &&
                    (rules.users_from_list?.length ?? 0) > 0 &&
                    (rules.roles_from_list?.length ?? 0) > 0 &&
                    (rules.approval_chain?.length ?? 0) > 0
                  }
                >
                  {t(i18n)`Add new condition`}
                </Button>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};
