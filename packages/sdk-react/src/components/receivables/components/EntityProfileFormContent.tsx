import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { components } from '@/api/schema';
import { defaultAvailableCountries, getCountries } from '@/core/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/ui/components/form';
import { Input } from '@/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import { CountryFlag } from '@/ui/Country/CountryFlag';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { getVatTypeList } from '../utils';
import { EntityProfileFormValues } from '../validation';

export const EntityProfileFormContent = ({
  entityType,
}: {
  entityType: components['schemas']['EntityTypeEnum'];
}) => {
  const { i18n } = useLingui();
  const { control, watch, setValue } =
    useFormContext<EntityProfileFormValues>();
  const vatTypeList = getVatTypeList(i18n);
  const countries = getCountries(i18n);

  const vatType = watch('vat_type');
  const vatCountry = watch('vat_country');
  const currentDisplayedVatTypes = useMemo(
    () => vatTypeList.filter((vatType) => vatCountry === vatType?.countryCode),
    [vatTypeList, vatCountry]
  );
  const selectedVatType = currentDisplayedVatTypes.find(
    (type) => type.value === vatType
  );

  return (
    <>
      {entityType === 'individual' ? (
        <>
          <FormField
            name="title"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(i18n)`Title`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mtw:flex mtw:justify-between mtw:gap-4">
            <FormField
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem className="mtw:flex mtw:flex-col mtw:flex-1">
                  <FormLabel>{t(i18n)`Name`}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="surname"
              control={control}
              render={({ field }) => (
                <FormItem className="mtw:flex mtw:flex-col mtw:flex-1">
                  <FormLabel>{t(i18n)`Surname`}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ) : (
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(i18n)`Legal name`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="mtw:flex mtw:justify-between mtw:gap-4">
        <div className="mtw:flex mtw:items-end mtw:flex-1/2 mtw:flex-shrink-0">
          <FormField
            name="vat_country"
            control={control}
            render={({ field }) => (
              <FormItem className="mtw:flex mtw:flex-col">
                <FormLabel>
                  {selectedVatType?.vatName ?? t(i18n)`VAT ID`}
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    const newAvailableVatTypes = vatTypeList.filter(
                      (vatType) => value === vatType?.countryCode
                    );

                    field.onChange(value);
                    setValue('vat_id', '');
                    setValue('vat_type', newAvailableVatTypes?.[0]?.value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="mtw:w-18 mtw:rounded-br-none mtw:rounded-tr-none">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {defaultAvailableCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        <CountryFlag
                          code={country}
                          label={t(i18n)`Country flag`}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="vat_id"
            control={control}
            render={({ field }) => (
              <FormItem className="mtw:flex mtw:flex-col mtw:flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className="mtw:rounded-bl-none mtw:rounded-tl-none"
                    placeholder={selectedVatType?.placeholderText}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {currentDisplayedVatTypes.length > 1 && (
          <FormField
            name="vat_type"
            control={control}
            render={({ field }) => (
              <FormItem className="mtw:flex mtw:flex-col mtw:flex-1/2 mtw:w-[45%]">
                <FormLabel>{t(i18n)`Type`}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="mtw:w-full">
                      <SelectValue className="mtw:max-w-4/5 mtw:text-ellipsis mtw:whitespace-nowrap" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currentDisplayedVatTypes.map((vatType) => (
                      <SelectItem key={vatType.value} value={vatType.value}>
                        {vatType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        name="tax_id"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(i18n)`Tax ID`}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(i18n)`Email`}</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="phone"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(i18n)`Contact phone number`}</FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="website"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(i18n)`Website`}</FormLabel>
            <FormControl>
              <Input {...field} type="url" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <section className="mtw:flex mtw:flex-col mtw:gap-2">
        <h3 className="mtw:text-lg mtw:font-semibold">{t(i18n)`Address`}</h3>

        <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:p-6 mtw:border mtw:border-border mtw:rounded-xl">
          <FormField
            name="address_line_1"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(i18n)`Address line 1`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="address_line_2"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(i18n)`Address line 2`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mtw:flex mtw:justify-between mtw:gap-4">
            <FormField
              name="city"
              control={control}
              render={({ field }) => (
                <FormItem className="mtw:flex mtw:flex-col mtw:flex-1">
                  <FormLabel>{t(i18n)`City`}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="postal_code"
              control={control}
              render={({ field }) => (
                <FormItem className="mtw:flex mtw:flex-col mtw:flex-1">
                  <FormLabel>{t(i18n)`Postal code`}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="state"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(i18n)`State / Area / Province`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="country"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(i18n)`Country`}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    value={countries[field.value ?? '']}
                  />
                </FormControl>
                <FormDescription>{t(
                  i18n
                )`You can't change the country the entity is registered in`}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </>
  );
};
