import { StyledLabelTableCell } from '@/ui/Card/Card';
import { TableCell, TableRow } from '@mui/material';

interface ProductTableItemProps {
  label: string;
  value?: string | number | React.ReactElement | null;
}

export const ProductDetailsTableCell = (props: ProductTableItemProps) => {
  return (
    <TableRow key="name">
      <StyledLabelTableCell component="th" scope="row">
        {props.label}
      </StyledLabelTableCell>
      <TableCell>{props.value ? props.value : '—'}</TableCell>
    </TableRow>
  );
};
