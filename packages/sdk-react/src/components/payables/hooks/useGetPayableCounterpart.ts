import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';
import { useMemo } from 'react';

export const useGetPayableCounterpart = ({
  payable,
}: {
  payable?: components['schemas']['PayableResponseSchema'];
}) => {
  // Heuristic to get the Counterpart (data or name) for the Payable
  // A) Get Counterpart data from Payable data, if payable.counterpart_id
  // also, if Payable status is 'draft' or 'new':
  // B) Get Cunterpart data from AI suggestions, if !payable.counterpart_id
  // C) Get Counterpart matching name from raw OCR, if !payable.counterpart_id && !aiSuggestions?.suggested_counterpart?.id

  const { api } = useMoniteContext();

  // Get AI suggestions for the Payable, if not set payable.counterpart_id
  const shouldFetchAISuggestions = useMemo(
    () =>
      payable &&
      !payable.counterpart_id &&
      (payable.status === 'draft' || payable.status === 'new'),
    [payable]
  );
  const { data: AISuggestions, isLoading: isAISuggestionsLoading } =
    api.payables.getPayablesIdSuggestions.useQuery(
      {
        path: { payable_id: payable?.id ?? '' },
      },
      {
        enabled: !!shouldFetchAISuggestions && !!payable?.id,
      }
    );

  // Determine the Counterpart ID to use, based on the AI suggestions and the Payable data
  const counterpartId = useMemo(
    () =>
      payable?.counterpart_id ??
      AISuggestions?.suggested_counterpart?.id ??
      null,
    [payable?.counterpart_id, AISuggestions?.suggested_counterpart?.id]
  );

  // Get the Counterpart data, based on the determined Counterpart ID
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId ?? undefined);

  // Get Counterpart that matches raw OCR data name
  const counterpartRawName = useMemo(
    () => payable?.counterpart_raw_data?.name,
    [payable?.counterpart_raw_data?.name]
  );
  const shouldCheckOCRMatching = useMemo(
    () =>
      Boolean(!counterpartId) &&
      Boolean(counterpartRawName) &&
      !isAISuggestionsLoading &&
      payable &&
      (payable.status === 'draft' || payable.status === 'new'),
    [payable, counterpartId, counterpartRawName, isAISuggestionsLoading]
  );
  const {
    data: counterpartMatchingToOCR,
    isLoading: isCounterpartMatchingToOCRLoading,
  } = api.counterparts.getCounterparts.useQuery(
    {
      query: {
        counterpart_name__icontains: counterpartRawName,
        is_vendor: true,
        limit: 1,
      },
    },
    {
      enabled: shouldCheckOCRMatching,
      select: (data) => data.data.at(0),
    }
  );

  const isCounterpartAIMatched = useMemo(
    () =>
      Boolean(AISuggestions?.suggested_counterpart?.id) &&
      shouldFetchAISuggestions,
    [AISuggestions?.suggested_counterpart?.id, shouldFetchAISuggestions]
  );
  const isCounterpartMatchingToOCRFound = useMemo(
    () => Boolean(counterpartMatchingToOCR?.id) && shouldCheckOCRMatching,
    [counterpartMatchingToOCR?.id, shouldCheckOCRMatching]
  );
  const isCounterpartLoadingCombined = useMemo(
    () =>
      isAISuggestionsLoading ||
      isCounterpartMatchingToOCRLoading ||
      isCounterpartLoading,
    [
      isAISuggestionsLoading,
      isCounterpartMatchingToOCRLoading,
      isCounterpartLoading,
    ]
  );

  return {
    counterpart: counterpartMatchingToOCR ?? counterpart,
    counterpartRawName,
    isCounterpartAIMatched,
    isCounterpartMatchingToOCRFound,
    isCounterpartLoading: isCounterpartLoadingCombined,
  };
};
