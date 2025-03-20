import { components } from '@/api';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, styled, Chip, Skeleton } from '@mui/material';

const templateThumbnailClassName = 'Monite-DocumentTemplateThumbnail';
const selectedtemplateThumbnailClassName = `${templateThumbnailClassName}--selected`;

const StyledLabel = styled('label')({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [`& .${templateThumbnailClassName}`]: {
    border: '2px solid transparent',
  },
  [`&:hover .${templateThumbnailClassName}`]: {
    borderColor: '#562BD6',
  },
  [`& .${selectedtemplateThumbnailClassName}`]: {
    outline: '8px solid #EEEBFF',
    borderColor: '#562BD6',
  },
});

type DocumentTemplate = components['schemas']['TemplateReceivableResponse'];

export interface DocumentDesignTemplateProps {
  template: DocumentTemplate;
  onSelect: () => void;
  isSelected: boolean;
}

export const DocumentDesignTemplate = ({
  template,
  onSelect,
  isSelected,
}: DocumentDesignTemplateProps) => {
  const { i18n } = useLingui();

  return (
    <StyledLabel data-testId={`documentTemplate-${template.name}`}>
      <Box
        className={classNames(
          templateThumbnailClassName,
          isSelected && selectedtemplateThumbnailClassName
        )}
        sx={{
          height: 180,
          width: 'calc(100% + 1px)',
          textAlign: 'right',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {template.is_default && (
          <Chip
            label={t(i18n)`Default`}
            sx={{
              background: '#F7F5FF',
              color: '#562BD6',
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}
        {!template && (
          <Skeleton
            variant="rectangular"
            sx={{ width: '100%', height: '100%' }}
          />
        )}
        {template && (
          <img
            src={template?.preview?.url}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid  #E1E5EA',
            }}
          />
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{
          marginTop: 2,
          color: isSelected ? '#3F1DA5' : 'inherit',
        }}
      >
        {template.name}
      </Typography>
      <input
        type="radio"
        style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}
        name="default-document-template"
        value={template.id}
        onChange={onSelect}
      />
    </StyledLabel>
  );
};
