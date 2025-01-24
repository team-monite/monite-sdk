import { Box, Typography } from '@mui/material';
import { PageHeader } from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

const DocumentDesignBase = () => {
    const { i18n } = useLingui();

    return (
        <>
            <PageHeader title={t(i18n)`Documet design`}/>
            <Box
                padding={2}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'linear-gradient(rgb(244, 240, 254), rgb(255, 255, 255))'
                }}
            >
                <Typography variant="subtitle2">
                  {t(i18n)`Set your document style`}
                </Typography>
                <Typography variant="caption">
                  {t(i18n)`Various templates for your documents`}
                </Typography>
            </Box>
        </>
    );
};

export const DocumentDesign = () => (
    <MoniteScopedProviders>
        <DocumentDesignBase />
    </MoniteScopedProviders>
);