import { ReactNode } from 'react';

import { components } from '@/api';
import { Skeleton } from '@mui/material';

import { ReminderDetails } from './ReminderDetails';

export const ReminderSelectLayout = ({
  children,
  reminder,
  isReminderLoading,
  updateDisabled,
  onUpdate,
}: {
  children: ReactNode;
  reminder:
    | components['schemas']['OverdueReminderResponse']
    | components['schemas']['PaymentReminderResponse']
    | undefined;
  isReminderLoading: boolean;
  updateDisabled: boolean;
  onUpdate?: () => void;
}) => {
  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-2 mtw:flex-1">
      {children}

      {(isReminderLoading || reminder) && (
        <>
          {isReminderLoading ? (
            <Skeleton variant="text" width="100%" />
          ) : reminder ? (
            <ReminderDetails
              reminder={reminder}
              updateDisabled={updateDisabled}
              onUpdate={onUpdate}
            />
          ) : null}
        </>
      )}
    </div>
  );
};
