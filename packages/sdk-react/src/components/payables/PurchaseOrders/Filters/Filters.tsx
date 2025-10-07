import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_VENDOR,
} from '../consts';
import { PurchaseOrderFilterTypes, PurchaseOrderFilterValue } from '../types';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { PurchaseOrderStatusEnum } from '@/enums/PurchaseOrderStatusEnum';
import { FilterContainer } from '@/ui/Filters/FilterContainer';
import { SearchField } from '@/ui/SearchField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import type { SxProps } from '@mui/material';
import type { Theme } from 'mui-styles';

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
        paddingTop: 0,
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
      <div className="Monite-PurchaseOrderStatusFilter Monite-FilterControl">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            onChangeFilter(FILTER_TYPE_STATUS, value);
          }}
        >
          <SelectTrigger className="mtw:w-full">
            <SelectValue placeholder={t(i18n)`Status`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t(i18n)`All statuses`}</SelectItem>
            {PurchaseOrderStatusEnum.map((status) => {
              const map = getStatusTextMap(i18n);
              return (
                <SelectItem value={status} key={status}>
                  {map[status as keyof typeof map]}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="Monite-PurchaseOrderVendorFilter Monite-FilterControl">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            onChangeFilter(FILTER_TYPE_VENDOR, value);
          }}
        >
          <SelectTrigger className="mtw:w-full">
            <SelectValue placeholder={t(i18n)`Vendor`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t(i18n)`All vendors`}</SelectItem>
            {(vendors?.data || []).map((vendor) => (
              <SelectItem value={vendor.id} key={vendor.id}>
                {getCounterpartName(vendor)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FilterContainer>
  );
};
