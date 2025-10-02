import {
  FILTER_TYPE_IS_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from '../consts';
import { Filters as FiltersType, FilterValue } from '../types';
import { CounterpartShowCategories } from '@/components/counterparts/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
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
import { Building2, SearchIcon, User } from 'lucide-react';

interface Props extends CounterpartShowCategories {
  onChangeFilter: (field: keyof FiltersType, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter, showCategories }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-CounterpartFilters';

  const typeFilterOptions = [
    { label: t(i18n)`All types`, value: 'all' },
    {
      label: t(i18n)`Individuals`,
      value: 'individual',
      icons: <User />,
    },
    {
      label: t(i18n)`Companies`,
      value: 'organization',
      icons: <Building2 />,
    },
  ];

  const categoryFilterOptions = [
    { label: t(i18n)`All categories`, value: 'all' },
    { label: t(i18n)`Customers`, value: 'true' },
    { label: t(i18n)`Vendors`, value: 'false' },
  ];

  return (
    <FilterContainer
      className={className}
      searchField={
        <div className="mtw:relative">
          <SearchIcon className="mtw:absolute mtw:left-2 mtw:top-1/2 mtw:-translate-y-1/2 mtw:size-4 mtw:text-muted-foreground" />
          <Input
            placeholder={t(i18n)`Search by name`}
            className="mtw:w-[400px] mtw:pl-8"
            onChange={(event) => {
              onChangeFilter(FILTER_TYPE_SEARCH, event.target.value || null);
            }}
          />
        </div>
      }
    >
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          onChangeFilter(FILTER_TYPE_TYPE, value);
        }}
      >
        <SelectTrigger className="mtw:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeFilterOptions.map(({ label, value, icons }) => (
            <SelectItem value={value} key={value}>
              {icons} {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCategories && (
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            onChangeFilter(FILTER_TYPE_IS_CUSTOMER, value);
          }}
        >
          <SelectTrigger className="mtw:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryFilterOptions.map(({ label, value }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FilterContainer>
  );
};
