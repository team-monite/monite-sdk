import { ReactNode, useMemo } from 'react';

import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  Table,
  TableBody,
  TableRow,
  TableCell,
  styled,
  TableCellProps,
} from '@mui/material';

interface StyledLabelTableCellProps extends TableCellProps {
  isRequired?: boolean;
}

export const StyledLabelTableCell = styled(
  TableCell
)<StyledLabelTableCellProps>(({ theme, isRequired }) => ({
  color: isRequired ? theme.palette.error.main : theme.palette.text.secondary,
  minWidth: 120,
  width: '35%',
}));

interface ICardItem {
  label: string;
  value?: string | false | ReactNode;

  /**
   * If `true`, then the card item will be rendered
   *  with default `—` filler for the empty `value`
   *
   * If `false`, then the card item will be ignored
   *  and won't be rendered
   */
  withEmptyStateFiller?: boolean;
}

export const MoniteCardItem = (props: ICardItem) => {
  const value = useMemo(() => {
    if (!props.value && props.withEmptyStateFiller) {
      return '—';
    }

    return props.value;
  }, [props.value, props.withEmptyStateFiller]);

  if (!value) {
    return null;
  }

  return (
    <TableRow>
      <StyledLabelTableCell component="th" scope="row">
        {props.label}
      </StyledLabelTableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
};

interface ICardProps extends MuiCardProps {
  /**
   * Items in the card. If `item.value` is `false` or `undefined`,
   *  then item will be ignored and won't be rendered
   */
  items: Array<ICardItem>;

  /** Children to be rendered after the items. E.g.: action buttons */
  children?: ReactNode;
}

/**
 * Card component which displays a list of items in a table format
 */
export const MoniteCard = ({ items, children, ...cardProps }: ICardProps) => (
  <MuiCard variant="outlined" {...cardProps}>
    <Table>
      <TableBody>
        {items.map((item, index) => {
          return <MoniteCardItem key={index} {...item} />;
        })}
      </TableBody>
    </Table>
    {children}
  </MuiCard>
);
