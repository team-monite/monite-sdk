import { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { isIndividualCounterpart } from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';

interface UseValidateCounterpartResult {
  isEmailValid: boolean;
  areRemindersEnabled: boolean;
}

export const useValidateCounterpart = (): UseValidateCounterpartResult => {
  const { getValues } = useFormContext();
  const { api } = useMoniteContext();

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [areRemindersEnabled, setAreRemindersEnabled] = useState(true);

  const counterpartId = getValues('counterpart_id'); //ToDo: Adjust this to match the field name of counterpart Form

  const counterpartQuery = useCounterpartById(counterpartId);
  const { data: counterpart } = counterpartQuery;

  const validateEmailAndReminders = useCallback(async () => {
    if (!counterpartId || !counterpartQuery.data || !counterpart) return;

    let counterpartEmail: string | undefined;

    if (
      counterpartQuery.data.type === 'individual' &&
      isIndividualCounterpart(counterpartQuery.data)
    ) {
      counterpartEmail = counterpartQuery.data.individual.email;
    } else {
      const contacts = api.counterparts.getCounterpartsIdContacts.useQuery({
        path: {
          counterpart_id: counterpartId,
        },
      }).data;

      counterpartEmail =
        contacts?.data.find((contact) => contact.is_default)?.email || '';
    }

    setIsEmailValid(!!counterpartEmail);
    setAreRemindersEnabled(counterpart.reminders_enabled !== false);
  }, [api, counterpartId, counterpartQuery.data, counterpart]);

  useEffect(() => {
    validateEmailAndReminders();
  }, [validateEmailAndReminders]);

  return { isEmailValid, areRemindersEnabled };
};
