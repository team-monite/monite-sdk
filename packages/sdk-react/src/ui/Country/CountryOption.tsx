import { CountryType } from '@/core/utils/countries';
import { Box, Typography } from '@mui/material';

import { CountryFlag } from './CountryFlag';

export interface CountryOptionProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: CountryType;
  state: {
    inputValue: string;
  };
  showFlag?: boolean;
}

export const CountryOption = ({
  props,
  option,
  state,
  showFlag = true,
}: CountryOptionProps) => {
  const { inputValue } = state;
  const parts = option.label.split(new RegExp(`(${inputValue})`, 'gi'));

  return (
    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      {showFlag && <CountryFlag code={option.code} label={option.label} />}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2">
          {parts.map((part, index) => {
            const isMatch = part.toLowerCase() === inputValue.toLowerCase();

            return (
              <Typography
                key={`${part}-${index}-${isMatch ? 'match' : 'nomatch'}`}
                component="span"
                sx={{
                  fontWeight: isMatch ? 'bolder' : 'regular',
                }}
              >
                {part}
              </Typography>
            );
          })}
        </Typography>
      </Box>
    </Box>
  );
};
