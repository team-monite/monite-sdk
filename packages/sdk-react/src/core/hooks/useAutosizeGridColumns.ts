import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { useGridApiRef } from '@mui/x-data-grid';

// Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
// setTimeout and flushSync are necessary for call order control
// Docs say:
// The Data Grid can only autosize based on the currently rendered cells.
// DOM access is required to accurately calculate dimensions
export function useAutosizeGridColumns(rows: any) {
  const gridApiRef = useGridApiRef();
  const [columnWidths, setColumnWidths] = useState<
    { field: string; width: number }[]
  >([]);

  useEffect(() => {
    const grid = gridApiRef.current;
    if (!grid || !grid.autosizeColumns) return;
    if (columnWidths && columnWidths.length > 0) {
      for (const column of columnWidths) {
        grid.setColumnWidth(column.field, column.width ?? 100);
      }
    } else {
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setTimeout(async () => {
            await grid.autosizeColumns({
              includeHeaders: true,
              includeOutliers: true,
              expand: true,
            });
            if (rows && rows.length > 0) {
              const columns = grid.getAllColumns();
              setColumnWidths(
                columns.map((c) => ({
                  field: c.field,
                  width: c.width ?? 100,
                }))
              );
              console.log(columns.map((c) => c.width));
            }
          }, 1);
        });
      }, 1);
    }
  }, [gridApiRef, rows, columnWidths]);

  return gridApiRef;
}
