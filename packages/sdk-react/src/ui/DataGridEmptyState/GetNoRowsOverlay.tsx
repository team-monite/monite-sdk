import React from 'react';

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
  filterDescription1?: string;
  filterDescription2?: string;
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
  filterDescription1,
  filterDescription2,
  actionButtonLabel,
  actionOptions,
  onAction,
  className,
}: EmptyStateProps) => {
  const { i18n } = useLingui();

  if (!isLoading && dataLength === 0 && (isFiltering || isSearching)) {
    return (
      <DataGridEmptyState
        title={noDataTitle || t(i18n)`No ${entityName} Found`}
        descriptionLine1={
          filterDescription1 ||
          t(
            i18n
          )`No ${entityName.toLowerCase()} match your search or filter criteria.`
        }
        descriptionLine2={
          filterDescription2 || t(i18n)`Try adjusting your search or filter.`
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
        actionOptions={actionOptions || [t(i18n)`Create ${entityName}`]}
        actionButtonLabel={actionButtonLabel || t(i18n)`Create new`}
        onAction={(action) => {
          if (!action) return;
          if (onCreate) onCreate(action);
        }}
        type="no-data"
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
