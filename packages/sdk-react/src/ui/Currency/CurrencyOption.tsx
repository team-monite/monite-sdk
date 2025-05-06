import { useCurrencies } from '@/core/hooks';
import { CurrencyType } from '@/core/utils';
import { MenuItem, Box } from '@mui/material';

interface CurrencyOptionProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: CurrencyType;
  showCodeOnly?: boolean;
  showCurrencyCode?: boolean;
  showCurrencySymbol?: boolean;
}

export const CurrencyOption = ({
  props,
  option,
  showCodeOnly = false,
  showCurrencyCode = false,
  showCurrencySymbol = true,
}: CurrencyOptionProps) => {
  const { getSymbolFromCurrency } = useCurrencies();
  const label = showCodeOnly
    ? option.code
    : `${option.label}${showCurrencyCode ? ' (' + option.code + ')' : ''}`;

  return (
    <MenuItem
      {...props}
      key={option.code}
      value={option.label}
      sx={{
        width: '100%',
        py: 1.25,
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
        {showCurrencySymbol && !showCodeOnly && (
          <Box
            sx={{
              flexShrink: 0,
            }}
          >
            {getSymbolFromCurrency(option.code)}
          </Box>
        )}
      </Box>
    </MenuItem>
  );
};
