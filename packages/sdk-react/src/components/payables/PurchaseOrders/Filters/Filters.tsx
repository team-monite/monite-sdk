import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_VENDOR,
} from '../consts';
import { PurchaseOrderFilterTypes, PurchaseOrderFilterValue } from '../types';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { PurchaseOrderStatusEnum } from '@/enums/PurchaseOrderStatusEnum';
import { FilterContainer } from '@/ui/Filters/FilterContainer';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FormControl, MenuItem, Select, SxProps } from '@mui/material';
import { Theme } from 'mui-styles';

interface PurchaseOrderFiltersProps {
  onChangeFilter: (
    field: keyof PurchaseOrderFilterTypes,
    value: PurchaseOrderFilterValue
  ) => void;
  sx?: SxProps<Theme>;
}

const getStatusTextMap = (i18n: ReturnType<typeof useLingui>['i18n']) => ({
  draft: t(i18n)`Draft`,
  issued: t(i18n)`Issued`,
});

export const Filters = ({ onChangeFilter, sx }: PurchaseOrderFiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();
  const className = 'Monite-PurchaseOrderFilters';

  const { data: vendors } = api.counterparts.getCounterparts.useQuery({
    query: {
      is_vendor: true,
      limit: 100,
    },
  });

  return (
    <FilterContainer
      className={className}
      sx={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        ...sx,
      }}
      searchField={
        <SearchField
          placeholder={t(i18n)`Search by number or vendor`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      }
    >
      <FormControl
        variant="standard"
        className="Monite-PurchaseOrderStatusFilter Monite-FilterControl"
      >
        <Select
          labelId="status"
          label={t(i18n)`Status`}
          defaultValue="all"
          MenuProps={{ container: root }}
          onChange={(selected) => {
            onChangeFilter(
              FILTER_TYPE_STATUS,
              selected && selected.target.value
            );
          }}
        >
          {[
            { label: t(i18n)`All statuses`, value: 'all' },
            ...PurchaseOrderStatusEnum.map((status) => ({
              label:
                getStatusTextMap(i18n)[status as keyof typeof getStatusTextMap],
              value: status,
            })),
          ].map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="standard"
        className="Monite-PurchaseOrderVendorFilter Monite-FilterControl"
      >
        <Select
          labelId="vendor"
          label={t(i18n)`Vendor`}
          defaultValue="all"
          MenuProps={{ container: root }}
          onChange={(selected) => {
            onChangeFilter(
              FILTER_TYPE_VENDOR,
              selected && selected.target.value
            );
          }}
        >
          {[
            { label: t(i18n)`All vendors`, value: 'all' },
            ...(vendors?.data?.map((vendor) => ({
              label: getCounterpartName(vendor),
              value: vendor.id,
            })) || []),
          ].map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FilterContainer>
  );
};
