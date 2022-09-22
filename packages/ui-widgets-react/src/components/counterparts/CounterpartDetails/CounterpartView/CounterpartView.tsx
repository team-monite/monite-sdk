import React from 'react';
import { CounterpartType } from '@monite/sdk-api';
import {
  Box,
  Button,
  Header,
  ModalLayout,
  Text,
  UPen,
} from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useCounterpartById } from 'core/queries';
import CounterpartOrganizationView from './CounterpartOrganizationView';
import {
  getName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../../helpers';
import { prepareCounterpartOrganization } from '../CounterpartOrganizationForm';
import { CounterpartHeader } from '../CounterpartDetailsStyle';
import CounterpartIndividualView from './CounterpartIndividualView';
import { prepareCounterpartIndividual } from '../CounterpartIndividualForm';

type CounterpartViewProps = {
  id: string;
  onEdit: (type: CounterpartType) => void;
  onDelete?: () => void;
};

const CounterpartView = ({ id, onEdit }: CounterpartViewProps) => {
  const { t } = useComponentsContext();
  const { data: counterpart } = useCounterpartById(id);

  if (counterpart) {
    return (
      <ModalLayout
        scrollableContent
        size={'md'}
        isDrawer
        header={
          <CounterpartHeader>
            <Header>
              <Text textSize={'h3'}>{getName(counterpart)}</Text>
            </Header>
          </CounterpartHeader>
        }
      >
        <Box sx={{ padding: 24 }}>
          {isOrganizationCounterpart(counterpart) && (
            <CounterpartOrganizationView
              actions={
                <Button
                  onClick={() => onEdit(counterpart.type)}
                  size={'sm'}
                  variant={'text'}
                  leftIcon={<UPen />}
                >
                  {t('counterparts:actions.edit')}
                </Button>
              }
              counterpart={prepareCounterpartOrganization(
                counterpart.organization
              )}
            />
          )}

          {isIndividualCounterpart(counterpart) && (
            <CounterpartIndividualView
              actions={
                <Button
                  onClick={() => onEdit(counterpart.type)}
                  size={'sm'}
                  variant={'text'}
                  leftIcon={<UPen />}
                >
                  {t('counterparts:actions.edit')}
                </Button>
              }
              counterpart={prepareCounterpartIndividual(counterpart.individual)}
            />
          )}
        </Box>
      </ModalLayout>
    );
  }

  return null;
};

export default CounterpartView;
