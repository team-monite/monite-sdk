import { useMemo } from 'react';

import { Alert, Collapse, List, ListItem, ListItemText } from '@mui/material';

type ErrorDisplayProps = {
  generalError?: string | null;
  fieldErrors: {
    name?: string | null;
    quantity?: string | null;
    price?: string | null;
    tax?: string | null;
    measureUnit?: string | null;
    productType?: string | null;
    [key: string]: string | null | undefined;
  };
};

export const FormErrorDisplay = ({
  generalError,
  fieldErrors,
}: ErrorDisplayProps) => {
  const hasFieldErrors = useMemo(() => {
    for (const error of Object.values(fieldErrors)) {
      if (error) return true;
    }
    return false;
  }, [fieldErrors]);

  const hasErrors = Boolean(generalError) || hasFieldErrors;

  if (!hasErrors) return null;

  return (
    <Collapse
      in={true}
      sx={{
        ':not(.MuiCollapse-hidden)': {
          marginBottom: 1,
        },
      }}
    >
      <Alert
        severity="error"
        sx={{
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        }}
      >
        {generalError && <div>{generalError}</div>}

        {hasFieldErrors && (
          <List dense disablePadding sx={{ mt: generalError ? 1 : 0 }}>
            {Object.entries(fieldErrors).map(([key, error]) =>
              error ? (
                <ListItem key={key} disablePadding>
                  <ListItemText
                    primary={error}
                    primaryTypographyProps={{
                      sx: { color: 'inherit' },
                    }}
                  />
                </ListItem>
              ) : null
            )}
          </List>
        )}
      </Alert>
    </Collapse>
  );
};

export { useFormErrors } from '@/components/shared/ItemsSection/useFormErrors';
