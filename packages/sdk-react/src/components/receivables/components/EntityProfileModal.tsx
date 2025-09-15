import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
import {
  useGetEntityVatIds,
  usePatchEntityById,
  usePatchEntityVatById,
} from '@/components/receivables/hooks';
import { useEntityUserByAuthToken, useMyEntity } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestrictionModal } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog';
import { Form } from '@/ui/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  getEntityProfileValidationSchema,
  EntityProfileFormValues,
} from '../validation';
import { EntityProfileFormContent } from './EntityProfileFormContent';
import { useCreateEntityVatId } from '../hooks/useCreateEntityVatId';

type EntityProfileFormComponentProps = EntityProfileModalProps & {
  entity:
    | components['schemas']['EntityOrganizationResponse']
    | components['schemas']['EntityIndividualResponse'];
  vatIds: components['schemas']['EntityVatIDResponse'][];
};

export interface EntityProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const getDefaultValues = (
  entity:
    | components['schemas']['EntityOrganizationResponse']
    | components['schemas']['EntityIndividualResponse'],
  vatId: components['schemas']['EntityVatIDResponse']
) => {
  const commonValues = {
    email: entity.email || undefined,
    tax_id: entity.tax_id || undefined,
    vat_id: vatId?.value || undefined,
    vat_type: vatId?.type || undefined,
    vat_country: vatId?.country || entity.address.country || undefined,
    address_line_1: entity.address.line1 || undefined,
    address_line_2: entity.address.line2 || undefined,
    city: entity.address.city || undefined,
    postal_code: entity.address.postal_code || undefined,
    state: entity.address.state || undefined,
    country: entity.address.country || undefined,
    phone: entity.phone || undefined,
    website: entity.website || undefined,
  };

  if ('organization' in entity) {
    return {
      name: entity.organization.legal_name || undefined,
      ...commonValues,
    };
  }

  return {
    title: entity.individual.title || undefined,
    name: entity.individual.first_name || undefined,
    surname: entity.individual.last_name || undefined,
    ...commonValues,
  };
};

const EntityProfileForm = ({
  open,
  onClose,
  entity,
  vatIds,
}: EntityProfileFormComponentProps) => {
  const { i18n } = useLingui();
  const vatId = vatIds?.[0];
  const { mutate: patchEntity } = usePatchEntityById();
  const { mutate: patchEntityVat } = usePatchEntityVatById(vatId?.id ?? '');
  const { mutate: createEntityVatId } = useCreateEntityVatId();

  const defaultValues = useMemo(
    () => getDefaultValues(entity, vatId),
    [entity, vatId]
  );
  const formName = 'entity-profile-form';

  const methods = useForm<EntityProfileFormValues>({
    resolver: zodResolver(getEntityProfileValidationSchema(i18n)),
    defaultValues,
  });

  const { handleSubmit, formState } = methods;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Form {...methods}>
        <form
          id={formName}
          name={formName}
          onSubmit={handleSubmit(async (values) => {
            patchEntity({
              email: values.email || null,
              website: values.website || null,
              phone: values.phone || null,
              tax_id: values.tax_id || null,
              address: {
                line1: values.address_line_1 || null,
                line2: values.address_line_2 || null,
                city: values.city || null,
                postal_code: values.postal_code || null,
                state: values.state || null,
              },
              ...(entity.type === 'individual'
                ? {
                    title: values.title || null,
                    first_name: values.name || null,
                    last_name: values.surname || null,
                  }
                : {
                    organization: {
                      legal_name: values.name || null,
                    },
                  }),
            });

            if (!vatId && values.vat_id && values.vat_id?.trim() !== '') {
              createEntityVatId({
                value: values.vat_id,
                type: values.vat_type as components['schemas']['VatIDTypeEnum'],
                country:
                  values.vat_country as components['schemas']['AllowedCountries'],
              }, { 
                onSuccess: () => {
                  onClose();
                }
              });
            } else {
              patchEntityVat({
                value: values.vat_id,
                type: values.vat_type as components['schemas']['VatIDTypeEnum'],
                country:
                  values.vat_country as components['schemas']['AllowedCountries'],
              }, {
                onSuccess: () => {
                  onClose();
                }
              });
            }
          })}
        >
          <DialogContent className="mtw:max-h-4/5 mtw:overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="mtw:text-2xl mtw:font-semibold mtw:leading-8">{t(
                i18n
              )`Edit my entity profile`}</DialogTitle>
              <DialogDescription hidden>
                {t(i18n)`Edit your entity profile to update your information.`}
              </DialogDescription>
            </DialogHeader>

            <div className="mtw:flex mtw:flex-col mtw:gap-6">
              <EntityProfileFormContent entityType={entity.type} />
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={onClose}>
                {t(i18n)`Cancel`}
              </Button>
              <Button
                type="submit"
                form={formName}
                disabled={!formState.isDirty}
              >
                {t(i18n)`Save`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export const EntityProfileModal = (props: EntityProfileModalProps) => {
  const { data: entity, isLoading } = useMyEntity();
  const { data: vatIds, isLoading: isVatIdsLoading } = useGetEntityVatIds(
    entity?.id ?? ''
  );
  const { data: user } = useEntityUserByAuthToken();
  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'entity',
    action: 'update',
    entityUserId: user?.id ?? '',
  });

  if (!isUpdateAllowed)
    return <AccessRestrictionModal open={props.open} onClose={props.onClose} />;

  if (isLoading || isVatIdsLoading || !entity) return null;

  return (
    <EntityProfileForm {...props} entity={entity} vatIds={vatIds?.data ?? []} />
  );
};
