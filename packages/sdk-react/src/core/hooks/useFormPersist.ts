import { useEffect } from 'react';
import { SetFieldValue } from 'react-hook-form';

// Persists form state between page reloads

export const useFormPersist = (
  name: string,
  getValues: () => { [key: string]: any },
  setValue: SetFieldValue<any>
) => {
  useEffect(() => {
    const storage = window.sessionStorage;
    const str = storage.getItem(name);

    if (str) {
      const values = JSON.parse(str);

      Object.keys(values).forEach((key) => {
        setValue(key, values[key], {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: true,
        });
      });
    }

    return () => {
      const values = getValues();
      if (Object.entries(values).length)
        storage.setItem(name, JSON.stringify(values));
      else storage.removeItem(name);
    };
  }, [getValues, name, setValue]);
};
