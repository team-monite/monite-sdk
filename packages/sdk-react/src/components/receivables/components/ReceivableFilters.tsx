import { counterpartsToSelect } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { ReceivableFilterType } from '@/components/receivables/types';
import { getCommonStatusLabel } from '@/components/receivables/utils';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { type ReadableReceivablesStatus } from '@/enums/ReadableReceivablesStatusEnum';
import { DatePicker } from '@/ui/DatePicker';
import { FilterContainer } from '@/ui/Filters/FilterContainer';
import { Input } from '@/ui/components/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/ui/components/select';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { formatISO } from 'date-fns';
import { SearchIcon } from 'lucide-react';

export type ReceivableFilter<T extends keyof ReceivableFilterType> =
  | {
      field: T;
      value: ReceivableFilterType[T];
      options?: never;
    }
  | {
      field: 'status';
      value: ReceivableFilterType[T];
      options: Array<ReadableReceivablesStatus>;
    };

type ReceivableFiltersProps<T extends keyof ReceivableFilterType> = {
  onChange: (field: T, value: ReceivableFilterType[T]) => void;
  filters: ReceivableFilter<T>[];
};

export const ReceivableFilters = <T extends keyof ReceivableFilterType>({
  onChange,
  filters,
}: ReceivableFiltersProps<T>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const { data: counterparts } = api.counterparts.getCounterparts.useQuery();
  const className = 'Monite-ReceivableFilters';

  const statusFilterOptions = filters.find(
    (filter) => filter.field === 'status'
  )?.options;

  const dueDateValue = filters.find(
    (filter) => filter.field === 'due_date__lte'
  )?.value;

  return (
    <FilterContainer
      className={className}
      searchField={
        <div className="relative">
          <SearchIcon className="mtw:absolute mtw:left-2 mtw:top-1/2 mtw:-translate-y-1/2 mtw:size-4 mtw:text-muted-foreground" />
          <Input
            placeholder={t(i18n)`Search`}
            className="mtw:w-[400px] mtw:pl-8"
            onChange={(event) => {
              onChange(
                'document_id__contains' as T,
                (event.target.value || undefined) as ReceivableFilterType[T]
              );
            }}
          />
        </div>
      }
    >
      {statusFilterOptions &&
        statusFilterOptions.length > 1 &&
        filters.some((filter) => filter.field === 'status') && (
          <Select
            defaultValue={undefined}
            onValueChange={(value) => {
              onChange(
                'status' as T,
                (value || undefined) as ReceivableFilterType[T]
              );
            }}
          >
            <SelectTrigger className="mtw:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined as any}>{t(
                i18n
              )`All statuses`}</SelectItem>

              {statusFilterOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {getCommonStatusLabel(i18n, status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

      {filters.some((filter) => filter.field === 'counterpart_id') && (
        <Select
          defaultValue={undefined}
          onValueChange={(value) => {
            onChange(
              'counterpart_id' as T,
              (value || undefined) as ReceivableFilterType[T]
            );
          }}
        >
          <SelectTrigger className="mtw:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined as any}>{t(
              i18n
            )`All customers`}</SelectItem>

            {counterpartsToSelect(counterparts?.data ?? []).map(
              ({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        // <MuiFormControl
        //   variant="standard"
        //   fullWidth
        //   className="Monite-ReceivableCounterpartFilter Monite-FilterControl"
        // >
        //   <Select
        //     labelId="counterpart_id"
        //     label={t(i18n)`Customer`}
        //     defaultValue={undefined}
        //     MenuProps={{ container: root }}
        //     displayEmpty
        //     onChange={(event) => {
        //       onChange(
        //         'counterpart_id' as T,
        //         (event.target.value || undefined) as ReceivableFilterType[T]
        //       );
        //     }}
        //   >
        //     <MenuItem value={undefined}>{t(i18n)`All customers`}</MenuItem>

        //     {counterpartsToSelect(counterparts?.data ?? [])
        //       .sort((a, b) => a.label.localeCompare(b.label))
        //       .map(({ value, label }) => (
        //         <MenuItem key={value} value={value}>
        //           {label}
        //         </MenuItem>
        //       ))}
        //   </Select>
        // </MuiFormControl>
      )}

      {filters.some((filter) => filter.field === 'due_date__lte') && (
        <DatePicker
          className="mtw:w-[160px]"
          selected={dueDateValue ? new Date(dueDateValue) : undefined}
          label={t(i18n)`Due date`}
          calendarProps={{
            endMonth: new Date(new Date().getFullYear() + 10, 11, 31),
          }}
          showClearButton
          onClear={() => {
            onChange('due_date__lte' as T, undefined);
          }}
          onSelect={(value: Date | undefined) => {
            if (value === null || value === undefined) {
              onChange('due_date__lte' as T, undefined);
            } else {
              onChange(
                'due_date__lte' as T,
                formatISO(new Date(value), {
                  representation: 'date',
                }) as ReceivableFilterType[T]
              );
            }
          }}
        />
      )}
    </FilterContainer>
  );
};
