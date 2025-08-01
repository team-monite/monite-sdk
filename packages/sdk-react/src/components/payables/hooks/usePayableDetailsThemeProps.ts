import { MonitePayableDetailsInfoProps } from '../PayableDetails/PayableDetailsForm/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';

export const usePayableDetailsThemeProps = (
  inProps?: Partial<MonitePayableDetailsInfoProps>
) => {
  const { componentSettings } = useMoniteContext();

  return {
    optionalFields:
      inProps?.optionalFields ?? componentSettings?.payables?.optionalFields,
    ocrRequiredFields:
      inProps?.ocrRequiredFields ??
      componentSettings?.payables?.ocrRequiredFields,
    ocrMismatchFields:
      inProps?.ocrMismatchFields ??
      componentSettings?.payables?.ocrMismatchFields,
    isTagsDisabled:
      inProps?.isTagsDisabled ?? componentSettings?.payables?.isTagsDisabled,
  };
};
