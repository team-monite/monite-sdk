import { useEffect, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
import { useWindowSize } from 'react-use';

import { GridColDef, useGridApiRef } from '@mui/x-data-grid';

// Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
// setTimeout and flushSync are necessary for call order control
// Docs say:
// The Data Grid can only autosize based on the currently rendered cells.
// DOM access is required to accurately calculate dimensions
export function useAutosizeGridColumns(
  rows: any,
  columns: GridColDef[],
  isCounterpartsLoading: boolean = false
) {
  const gridApiRef = useGridApiRef();

  useLayoutEffect(() => {
    const grid = gridApiRef.current;
    if (!grid || !grid.autosizeColumns || !rows || !rows.length) return;

    const columnsToAutoSize = Array.from(gridApiRef.current.getAllColumns())
      .filter(
        ({ hasBeenResized, field, width }) =>
          !hasBeenResized || field === 'counterpart_name'
      )
      .map(({ field }) => field);

    if (!columnsToAutoSize.length) return;

    if (typeof window === 'undefined') return;
    if (typeof document === 'undefined') return;
    const animationFrames = [
      setTimeout(() => {
        flushSync(() => {
          animationFrames.push(
            setTimeout(async () => {
              await grid
                .autosizeColumns({
                  columns: columnsToAutoSize,
                  includeHeaders: true,
                  includeOutliers: true,
                  expand: true,
                })
                .then(
                  () => void grid.scrollToIndexes({ rowIndex: 0, colIndex: 0 })
                );
            }, 1)
          );
        });
      }, 1),
    ];

    return () => void animationFrames.forEach(clearTimeout);
  }, [gridApiRef, rows, columns, isCounterpartsLoading]);

  // useEffect(() => {
  //   todo::add in future??
  //   document.addEventListener('resize', handleResizeDebounced);
  // }, []);

  return gridApiRef;
}
