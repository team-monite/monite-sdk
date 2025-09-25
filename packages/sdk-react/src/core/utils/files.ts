import { OcrFileType, type OcrFileTypes } from '../types/filetypes';

/**
 * Helper function to determine mimetype from file URL
 */
export const getMimetypeFromUrl = (url: string): OcrFileTypes | 'other' => {
  const clean = url.split('#')[0].split('?')[0];
  const extension = clean.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return OcrFileType.PDF;
    case 'jpg':
    case 'jpeg':
      return OcrFileType.JPEG;
    case 'png':
      return OcrFileType.PNG;
    default:
      return 'other';
  }
};
