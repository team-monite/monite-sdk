import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { isIndividualCounterpart } from '@/components/counterparts/helpers';
import { useCounterpartById, useCounterpartContactList } from '@/core/queries';

interface UseValidateCounterpartResult {
  isEmailValid: boolean;
  areRemindersEnabled: boolean;
}

export const useValidateCounterpart = (): UseValidateCounterpartResult => {
  const { getValues } = useFormContext();

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [areRemindersEnabled, setAreRemindersEnabled] = useState(true);

  const counterpartId = getValues('counterpart_id'); //ToDo: Adjust this to match the field name of counterpart Form

  const counterpartQuery = useCounterpartById(counterpartId);
  const contactsQuery = useCounterpartContactList(counterpartId);

  const { data: counterpart } = counterpartQuery;
  const { data: contacts } = contactsQuery;

  useEffect(() => {
    if (!counterpartId || !counterpart) return;

    let counterpartEmail: string | undefined;

    if (
      counterpart.type === 'individual' &&
      isIndividualCounterpart(counterpart)
    ) {
      counterpartEmail = counterpart.individual.email;
    } else {
      counterpartEmail =
        contacts?.data.find((contact) => contact.is_default)?.email || '';
    }

    setIsEmailValid(!!counterpartEmail);
    setAreRemindersEnabled(counterpart.reminders_enabled !== false);
  }, [counterpartId, counterpart, contacts]);

  return { isEmailValid, areRemindersEnabled };
};
