import { TableCell, TableRow, Typography } from '@mui/material';

interface ProductTableItemProps {
  label: string;
  value?: string | number | React.ReactElement | null;
}

export const ProductDetailsTableCell = (props: ProductTableItemProps) => {
  return (
    <TableRow key="name">
      <TableCell
        component="th"
        scope="row"
        sx={{ minWidth: 120, width: '35%' }}
      >
        <Typography color="text.secondary">{props.label}</Typography>
      </TableCell>
      <TableCell>{props.value ? props.value : '—'}</TableCell>
    </TableRow>
  );
};
