import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { GridColDef, useGridApiRef } from '@mui/x-data-grid';

// Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
// setTimeout and flushSync are necessary for call order control
// Docs say:
// The Data Grid can only autosize based on the currently rendered cells.
// DOM access is required to accurately calculate dimensions
export function useAutosizeGridColumns(rows: any, columns: GridColDef[]) {
  const gridApiRef = useGridApiRef();

  useEffect(() => {
    const grid = gridApiRef.current;
    if (!grid || !grid.autosizeColumns || !rows || !rows.length) return;
    const gridColumns = grid.getAllColumns();
    let columnsToAutoSize: string[] | undefined;
    for (const gridColumn of gridColumns) {
      // Skip columns that were already resized
      if (!gridColumn.hasBeenResized) {
        if (!columnsToAutoSize) columnsToAutoSize = [];
        columnsToAutoSize.push(gridColumn.field);
      }
    }
    if (!columnsToAutoSize) return;
    setTimeout(() => {
      ReactDOM.flushSync(() => {
        setTimeout(async () => {
          await grid.autosizeColumns({
            columns: columnsToAutoSize,
            includeHeaders: true,
            includeOutliers: true,
            expand: true,
          });
        }, 1);
      });
    }, 1);
  }, [gridApiRef, rows, columns]);

  return gridApiRef;
}
