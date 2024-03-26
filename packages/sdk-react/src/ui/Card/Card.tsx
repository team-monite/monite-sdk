import React, { useMemo } from 'react';

import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

interface ICardItem {
  label: string;
  value?: string | false | React.ReactNode;

  /**
   * If `true`, then the card item will be rendered
   *  with default `—` filler for the empty `value`
   *
   * If `false`, then the card item will be ignored
   *  and won't be rendered
   */
  withEmptyStateFiller?: boolean;
}

interface ICardItemProps extends ICardItem {
  divider: boolean;
}

const MoniteCardItem = (props: ICardItemProps) => {
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
    <>
      {props.divider && <Divider />}
      <Grid container direction="row" alignItems="center" sx={{ p: 1.5 }}>
        <Grid item xs={4}>
          <Typography variant="body2" color="text.secondary">
            {props.label}:
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{value}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export interface ICardProps extends MuiCardProps {
  /**
   * Items in the card. If `item.value` is `false` or `undefined`,
   *  then item will be ignored and won't be rendered
   */
  items: Array<ICardItem>;

  /** Children to be rendered after the items */
  children?: React.ReactNode;
}

/**
 * Card component which displays a list of items
 *  has a divider between each item and has common
 *  styles for all cards in the app
 */
export const MoniteCard = ({ items, children, ...cardProps }: ICardProps) => (
  <MuiCard sx={{ borderRadius: 3 }} variant="outlined" {...cardProps}>
    <Stack direction="column">
      {items.map((item, index) => {
        /**
         * The first item never should have a divider
         *
         * !!! Note !!! Divider renders before the item (on the top)
         */
        const notFirstItem = index !== 0;

        /**
         * We should safely get the previous item to check if it has value
         * because the first item has index = 0, and there is no item with index = -1
         */
        const previousItem = index - 1 >= 0 ? items[index - 1] : undefined;
        /**
         * We should render divider only if the item before has divider,
         * because ever second or third item might be without any data rendering
         */
        const previousItemHasValue = previousItem
          ? Boolean(previousItem.value) ||
            Boolean(previousItem.withEmptyStateFiller)
          : false;

        const shouldHaveDivider = notFirstItem && previousItemHasValue;

        return (
          <MoniteCardItem key={index} {...item} divider={shouldHaveDivider} />
        );
      })}
    </Stack>
    {children}
  </MuiCard>
);
