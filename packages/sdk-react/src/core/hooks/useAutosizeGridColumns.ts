import { useEffect, useRef } from 'react';
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
  areCounterpartsLoading: boolean,
  columnSerializationKey: string
) {
  const gridApiRef = useGridApiRef();

  const autoSizePerformed = useRef(false); // useRef instead of useState to avoid re-renders on value changes
  const columnsRestored = useRef<GridColDef[] | null>(null);

  // Autosize columns
  // use useEffect since we need this code to be executed after isFirstRender / useEffect in useGridColumns.js
  useEffect(() => {
    const grid = gridApiRef.current;
    const timeouts: number[] = [];
    if (
      rows && // Do not autosize until rows are loaded
      rows.length &&
      grid &&
      grid.autosizeColumns && // Will be undefined in test environment
      grid.getRowsCount() && // Make sure the grid was already rendered so that autosizeColumns function will work
      grid.getCellElement(rows[0].id, grid.getAllColumns()[0].field) && // Make sure the grid was already rendered so that autosizeColumns function will work
      columns.length > 0 && // Subscribe to column count since we need to execute this code on every column set change
      !areCounterpartsLoading && // Skip autosize until counterparts are loaded
      !autoSizePerformed.current && // Do not perform autosize twice
      !columnsRestored.current // Do not perform autosize after columns were deserialized
    ) {
      timeouts.push(
        window.setTimeout(() => {
          flushSync(() => {
            timeouts.push(
              window.setTimeout(async () => {
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

                // Some Payables may have a very long document numbers.
                // Limit width of the document_id column
                const documentColumn = grid.getColumn('document_id');
                if (
                  documentColumn &&
                  (documentColumn?.width || 0) > maximumDocumentIdColumnWidth
                ) {
                  grid.setColumnWidth(
                    'document_id',
                    maximumDocumentIdColumnWidth
                  );
                }

                autoSizePerformed.current = true;
              }, 1)
            );
          });
        }, 1)
      );
    }

    return () => {
      timeouts.forEach(window.clearTimeout); // Cancel pending timeouts on unmount
    };
  }, [gridApiRef, rows, columns, areCounterpartsLoading]);

  // Save columns width when switching between pages
  // use useEffect since we need this code to be executed after isFirstRender / useEffect in useGridColumns.js
  useEffect(() => {
    const grid = gridApiRef.current;
    const serializationKey = 'Monite-DataGridColumns-' + columnSerializationKey;
    const serializedColumnsStr = localStorage.getItem(serializationKey);
    if (
      serializedColumnsStr &&
      grid &&
      columnsRestored.current != columns // Do not restore column widths twice
    ) {
      const serializedColumns: {
        width: number;
        field: string;
      }[] = JSON.parse(serializedColumnsStr);
      for (const serializedColumn of serializedColumns) {
        if (typeof grid.setColumnWidth === 'function') {
          grid.setColumnWidth(serializedColumn.field, serializedColumn.width);
        }
      }
      columnsRestored.current = columns; // Allow serialization of updated column widths
    }

    return () => {
      // Save columns only after restoring them or performing autosize
      if (
        grid &&
        typeof grid.getAllColumns === 'function' &&
        (columnsRestored.current || autoSizePerformed.current)
      ) {
        const columnsState = grid
          .getAllColumns()
          .map(({ field, width }) => ({ field, width }));
        localStorage.setItem(serializationKey, JSON.stringify(columnsState));
      } else {
        if (!grid) {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          console.warn('Grid object is not defined.');
        } else if (typeof grid.getAllColumns !== 'function') {
          // eslint-disable-next-line lingui/no-unlocalized-strings
          console.warn('getAllColumns is not a function on the grid object.');
        }
        //Todo: Handle the situation where getAllColumns is not available or grid is undefined
      }
    };
  }, [gridApiRef, columnSerializationKey, columns]);

  return gridApiRef;
}
