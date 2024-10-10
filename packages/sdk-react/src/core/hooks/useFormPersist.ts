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
    try {
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
    } catch (e) {
      // Error can be thrown by sessionStorage.getItem if it's blocked or JSON.parse
      console.error(e);
    }

    return () => {
      try {
        const values = getValues();
        if (Object.entries(values).length)
          storage.setItem(name, JSON.stringify(values));
        else storage.removeItem(name);
      } catch (e) {
        // Error can be thrown by sessionStorage.getItem if it's blocked in a particular browser
        console.error(e);
      }
    };
  }, [getValues, name, setValue]);
};
