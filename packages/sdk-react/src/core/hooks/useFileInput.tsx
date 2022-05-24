import { ComponentProps, forwardRef, useRef, useState } from 'react';

import { css } from '@emotion/react';

/**
 * `useFileInput` is a React hook that creates an invisible `<input type="file" />` and `open()` method for interacting with it.
 *
 * @returns {Object} An object containing two properties:
 *  - `FileInput`: A component that renders an invisible file input element. It takes all the standard HTML input attributes and forwardRefs the underlying input element.
 *  - `openFileInput`: A function that programmatically opens the file input dialog. It can be used to open the file input dialog when another element is clicked.
 *
 * @example
 * ```jsx
 * const { FileInput, openFileInput } = useFileInput();
 *
 * return (
 *   <>
 *     <button onClick={openFileInput}>Upload File</button>
 *     <FileInput
 *       onChange={(event) => {
 *         const file = event.target.files?.item(0);
 *         // handle the selected file
 *       }}
 *     />
 *   </>
 * );
 * ```
 */
export const useFileInput = () => {
  const fileInputRef = useRef<{ node: HTMLInputElement | null }>({
    node: null,
  });

  const [FileInput] = useState(() =>
    forwardRef<HTMLInputElement, ComponentProps<'input'>>((props, ref) => (
      <input
        type="file"
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          fileInputRef.current.node = node;
        }}
        css={css`
          position: absolute;
          opacity: 0;
          width: 1px;
          height: 1px;
          font-size: 0;
        `}
        {...props}
      />
    ))
  );

  return {
    FileInput,
    openFileInput: () => {
      fileInputRef.current.node?.click();
    },
  };
};
