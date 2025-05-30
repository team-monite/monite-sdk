import { BaseProps, DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface EmptyStateProps extends BaseProps {
  isLoading: boolean;
  dataLength: number;
  isFiltering: boolean;
  isSearching: boolean;
  isError: boolean;
  onCreate?: (type: string) => void;
  refetch: () => void;
  entityName: string;
  noDataTitle?: string;
  noDataDescription1?: string;
  noDataDescription2?: string;
  filterTitle?: string;
  filterDescription1?: string;
  filterDescription2?: string | null;
  filterType?: string;
}

export const GetNoRowsOverlay = ({
  isLoading,
  dataLength,
  isFiltering,
  isSearching,
  isError,
  onCreate,
  refetch,
  entityName,
  noDataTitle,
  noDataDescription1,
  noDataDescription2,
  filterTitle,
  filterDescription1,
  filterDescription2,
  actionButtonLabel,
  actionOptions,
  onAction,
  className,
  type,
}: EmptyStateProps) => {
  const { i18n } = useLingui();

  if (!isLoading && dataLength === 0 && (isFiltering || isSearching)) {
    return (
      <DataGridEmptyState
        title={filterTitle || noDataTitle || t(i18n)`No ${entityName} Found`}
        descriptionLine1={filterDescription1 || ''}
        descriptionLine2={
          filterDescription2 === null
            ? undefined
            : filterDescription2 ||
              t(i18n)`Try adjusting your search or filter.`
        }
        type="no-filter"
        onAction={onAction}
        className={className}
      />
    );
  }

  if (!isLoading && dataLength === 0 && !isFiltering && !isSearching) {
    return (
      <DataGridEmptyState
        title={noDataTitle || t(i18n)`No ${entityName}`}
        descriptionLine1={
          noDataDescription1 ||
          t(i18n)`You don’t have any ${entityName.toLowerCase()} yet.`
        }
        descriptionLine2={
          noDataDescription2 ||
          t(i18n)`You can create your first ${entityName.toLowerCase()}.`
        }
        actionOptions={actionOptions}
        actionButtonLabel={actionButtonLabel}
        onAction={(action) => {
          if (!action) return;
          if (onCreate) onCreate(action);
        }}
        type={type || 'no-data'}
        className={className}
      />
    );
  }

  if (isError) {
    return (
      <DataGridEmptyState
        title={t(i18n)`Failed to Load ${entityName}`}
        descriptionLine1={t(
          i18n
        )`There was an error loading ${entityName.toLowerCase()}.`}
        descriptionLine2={t(i18n)`Please try again later.`}
        actionButtonLabel={t(i18n)`Reload`}
        onAction={refetch}
        type="error"
        className={className}
      />
    );
  }

  return null;
};
