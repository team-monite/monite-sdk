import { Box, BoxProps } from '@mui/material';

export interface CountryFlagProps {
  code: string;
  label: string;
  width?: string;
  className?: string;
  boxProps?: BoxProps;
}

export const CountryFlag = ({
  code,
  label,
  width = '20',
  className,
  boxProps,
}: CountryFlagProps) => {
  const imgProps = {
    className,
    loading: 'lazy' as const,
    width,
    src: `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    srcSet: `https://flagcdn.com/w${
      parseInt(width) * 2
    }/${code.toLowerCase()}.png 2x`,
    alt: label,
  };

  if (boxProps) {
    return <Box component="img" {...imgProps} {...boxProps} />;
  }

  return <img {...imgProps} />;
};
