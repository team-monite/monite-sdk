import { components } from '@/api';
import { ImageWithSkeleton } from '@/ui/imageWithSkeleton';
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
    borderColor: 'rgba(86, 43, 214, 1)',
  },
  [`& .${selectedtemplateThumbnailClassName}`]: {
    outline: '8px solid rgba(238, 235, 255, 1)',
    borderColor: 'rgba(86, 43, 214, 1)',
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
    <StyledLabel>
      <Box
        className={classNames(
          templateThumbnailClassName,
          isSelected && selectedtemplateThumbnailClassName
        )}
        sx={{
          height: 180,
          width: '100%',
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
        <ImageWithSkeleton url={template.preview?.url} alt={template.name} />
      </Box>
      <Typography
        variant="body2"
        sx={{
          marginTop: 2,
          color: isSelected ? 'rgba(63, 29, 165, 1)' : 'inherit',
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
