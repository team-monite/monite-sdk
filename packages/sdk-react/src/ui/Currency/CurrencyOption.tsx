import { useCurrencies } from '@/core/hooks';
import { CurrencyType } from '@/core/utils';
import { MenuItem, Box } from '@mui/material';

interface CurrencyOptionProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: CurrencyType;
  displayCode?: boolean;
}

export const CurrencyOption = ({
  props,
  option,
  displayCode,
}: CurrencyOptionProps) => {
  const { getSymbolFromCurrency } = useCurrencies();
  const symbol = getSymbolFromCurrency(option.code);
  const label = displayCode ? option.code : option.label;

  return (
    <MenuItem
      {...props}
      key={option.code}
      value={option.label}
      sx={{
        width: '100%',
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            flexShrink: 0,
          }}
        >
          {symbol}
        </Box>
      </Box>
    </MenuItem>
  );
};
