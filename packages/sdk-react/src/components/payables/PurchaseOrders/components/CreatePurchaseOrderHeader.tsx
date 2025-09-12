import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { Button } from '@/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Typography } from '@mui/material';
import { memo } from 'react';

interface CreatePurchaseOrderHeaderProps {
  className: string;
  actualCurrency: string;
  isLoading: boolean;
  onCurrencyModalOpen: () => void;
  onTemplateModalOpen: () => void;
  onSave: () => void;
}

export const CreatePurchaseOrderHeader = memo(
  ({
    className,
    actualCurrency,
    isLoading,
    onCurrencyModalOpen,
    onTemplateModalOpen,
    onSave,
  }: CreatePurchaseOrderHeaderProps) => {
    const { i18n } = useLingui();

    return (
      <FullScreenModalHeader
        className={className + '-Title PurchaseOrder-Preview'}
        title={t(i18n)`Create purchase order`}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="mtw:mr-2"
                  disabled={isLoading}
                >
                  <SettingsOutlinedIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onCurrencyModalOpen}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Typography>{t(i18n)`Currency`}</Typography>
                    <Typography>{actualCurrency}</Typography>
                  </Box>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onTemplateModalOpen}>
                  <Typography>{t(i18n)`Edit template settings`}</Typography>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              onClick={onSave}
            >
              {t(i18n)`Save`}
            </Button>
          </>
        }
      />
    );
  }
);
