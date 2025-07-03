import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Chip, Skeleton, useTheme } from '@mui/material';

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export interface TemplateOptionProps {
  template: DocumentTemplate;
  onSelect: () => void;
  isSelected: boolean;
}

export const TemplateOption = ({
  template,
  onSelect,
  isSelected,
}: TemplateOptionProps) => {
  const { i18n } = useLingui();
  const theme = useTheme();

  if (!template) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ width: '100px', height: '142px' }}
      />
    );
  }

  return (
    <button
      className={`mtw:relative mtw:cursor-pointer mtw:w-[100px] mtw:h-[142px] mtw:rounded-[4px] mtw:border ${
        isSelected ? 'mtw:border-primary-50' : 'mtw:border-[#DEDEDE]'
      }`}
      data-testid={`documentTemplate-${template.name}`}
      type="button"
      onClick={onSelect}
    >
      {template.is_default && (
        <Chip
          label={t(i18n)`Default`}
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: 14,
            fontWeight: 500,
            position: 'absolute',
            top: 8,
            right: 8,
            borderRadius: '4px',
            border: '1px solid #DEDEDE',
            px: 1,
            py: 0,
            height: 24,
          }}
        />
      )}

      <img
        src={template?.preview?.url}
        alt={t(i18n)`Preview of ${template?.name || 'template'}`}
        className="mtw:w-full mtw:h-full mtw:rounded-[4px]"
      />
    </button>
  );
};
