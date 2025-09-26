export const OcrFileType = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
} as const;

export type OcrFileTypes = (typeof OcrFileType)[keyof typeof OcrFileType];

export const OcrFileTypesValues = Object.values(OcrFileType);

export const OcrFileTypesString = Object.values(OcrFileType).join(',');
