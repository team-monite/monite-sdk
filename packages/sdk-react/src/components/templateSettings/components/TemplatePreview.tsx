import { components } from '@/api';
import { Skeleton } from '@mui/material';

export interface TemplatePreviewProps {
  template: components['schemas']['TemplateReceivableResponse'];
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  if (!template) {
    return (
      <Skeleton variant="rectangular" sx={{ width: '400px', height: '100%' }} />
    );
  }

  return (
    <img
      src={template?.preview?.url as string}
      className="mtw:w-[400px] mtw:h-[566px] mtw:border mtw:border-gray-200 mtw:shadow-[0_3px_13px_rgba(17,17,17,0.16)]"
    />
  );
};
