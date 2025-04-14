import { ComponentProps, forwardRef, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

const maxFileSizeInMB = 20;
const maxFileSizeInKB = 1024 * 1024 * maxFileSizeInMB;

const OCR_SUPPORTED_FORMATS = [
  'application/pdf',
  'image/jpg',
  'image/png',
  'image/gif',
];

/**
 * `useFileInput` is a React hook that creates an invisible `<input type="file" />` and `open()` method for interacting with it.
 *
 * @returns {Object} An object containing two properties:
 *  - `FileInput`: A component that renders an invisible file input element. It takes all the standard HTML input attributes and forwardRefs the underlying input element.
 *  - `openFileInput`: A function that programmatically opens the file input dialog. It can be used to open the file input dialog when another element is clicked.
 *  - `checkFileError`: A function that checks for file errors based on type and size. It returns an error message if there is an issue, or null if the file is valid.
 *
 * @example
 * ```jsx
 * const { FileInput, openFileInput, checkFileError } = useFileInput();
 *
 * return (
 *   <>
 *     <button onClick={openFileInput}>Upload File</button>
 *     <FileInput
 *       onChange={(event) => {
 *         const file = event.target.files?.item(0);
 *         const error = checkFileError(file);
 *         if (error) {
 *           // handle the error (e.g., show a message)
 *           console.error(error);
 *         } else {
 *           // handle the selected file
 *         }
 *       }}
 *     />
 *   </>
 * );
 * ```
 */
export const useFileInput = () => {
  const { i18n } = useLingui();

  const fileInputRef = useRef<{ node: HTMLInputElement | null }>({
    node: null,
  });

  const [FileInput] = useState(() =>
    forwardRef<HTMLInputElement, ComponentProps<'input'>>((props, ref) => (
      <input
        type="file"
        accept={OCR_SUPPORTED_FORMATS.join(',')}
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

  const checkFileError = (file: File): string | null => {
    if (!file) {
      return t(i18n)`No file provided`;
    }

    if (!OCR_SUPPORTED_FORMATS.includes(file.type)) {
      return t(i18n)`Unsupported file type for ${file.name}`;
    }

    if (file.size > maxFileSizeInKB) {
      return t(
        i18n
      )`File ${file.name} size exceeds ${maxFileSizeInMB} MB limit.`;
    }

    return null;
  };

  return {
    FileInput,
    openFileInput: () => {
      fileInputRef.current.node?.click();
    },
    checkFileError,
  };
};
