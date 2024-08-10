import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { useGridApiRef } from '@mui/x-data-grid';

// Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
// setTimeout and flushSync are necessary for call order control
// Docs say:
// The Data Grid can only autosize based on the currently rendered cells.
// DOM access is required to accurately calculate dimensions
export function useAutosizeGridColumns(rows: any) {
  const gridApiRef = useGridApiRef();

  useEffect(() => {
    setTimeout(() => {
      ReactDOM.flushSync(() => {
        setTimeout(() => {
          if (gridApiRef.current?.autosizeColumns) {
            // noinspection JSIgnoredPromiseFromCall
            gridApiRef.current?.autosizeColumns({
              includeHeaders: true,
              includeOutliers: true,
              expand: true,
            });
          }
        }, 1);
      });
    }, 1);
  }, [gridApiRef, rows]);

  return gridApiRef;
}
