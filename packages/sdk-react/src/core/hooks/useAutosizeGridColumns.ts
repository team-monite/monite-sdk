import { useEffect } from 'react';
import { flushSync } from 'react-dom';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { GridColDef, useGridApiRef } from '@mui/x-data-grid';

export const defaultCounterpartColumnWidth = 250;
const maximumDocumentIdColumnWidth = 200;

export function useAreCounterpartsLoading(
  rows?: { counterpart_id?: string }[]
) {
  const { api } = useMoniteContext();
  const result = !!api.counterparts.getCounterpartsId.useIsFetching({
    infinite: false,
    exact: false,
    predicate: (query) =>
      !!rows?.some(
        ({ counterpart_id }) =>
          !query.state.isInvalidated &&
          counterpart_id === query.queryKey[1].path.counterpart_id
      ),
  });
  return !rows ? true : result;
}

// Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
// setTimeout and flushSync are necessary for call order control
// Docs say:
// The Data Grid can only autosize based on the currently rendered cells.
// DOM access is required to accurately calculate dimensions
export function useAutosizeGridColumns(
  rows: any,
  columns: GridColDef[],
  areCounterpartsLoading = false
) {
  const gridApiRef = useGridApiRef();

  useEffect(() => {
    const grid = gridApiRef.current;
    if (
      !rows ||
      !rows.length ||
      !grid ||
      !grid.autosizeColumns || // Will be undefined in test environment
      !grid.getRowsCount() || // Make sure the grid was already rendered so that autosizeColumns function will work
      !grid.getCellElement(rows[0].id, grid.getAllColumns()[0].field) || // Make sure the grid was already rendered so that autosizeColumns function will work
      areCounterpartsLoading // Skip autosize until counterparts are loaded
    ) {
      return;
    }
    setTimeout(() => {
      flushSync(() => {
        setTimeout(async () => {
          const previousColumnsState = grid.getAllColumns();
          await grid.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
          });
          previousColumnsState.forEach((previousColumnState) => {
            const currentColumnState = grid.getColumn(
              previousColumnState.field
            );
            if (
              currentColumnState?.width &&
              previousColumnState?.width &&
              (currentColumnState.width < previousColumnState.width ||
                currentColumnState.width > 600)
            ) {
              grid.setColumnWidth(
                previousColumnState.field,
                previousColumnState.width
              );
            }
          });

          // Some scanned documents may have a very long document ids.
          // Limit width of the document_id column
          const documentColumn = grid.getColumn('document_id');
          if (
            documentColumn &&
            (documentColumn?.width || 0) > maximumDocumentIdColumnWidth
          )
            grid.setColumnWidth('document_id', maximumDocumentIdColumnWidth);
        }, 1);
      });
    }, 1);
  }, [gridApiRef, rows, columns, areCounterpartsLoading]);

  return gridApiRef;
}
