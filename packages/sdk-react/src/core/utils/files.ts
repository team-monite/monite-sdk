/**
 * Helper function to determine mimetype from file URL
 */
export const getMimetypeFromUrl = (url: string): string => {
  const clean = url.split('#')[0].split('?')[0];
  const extension = clean.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'image/jpeg';
  }
};
