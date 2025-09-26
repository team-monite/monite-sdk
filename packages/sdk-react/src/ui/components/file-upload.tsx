import { useFileInput } from '@/core/hooks';
import { OcrFileTypesString, OcrFileTypesValues } from '@/core/types/filetypes';
import { Button } from '@/ui/components/button';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CloudUpload, Upload } from 'lucide-react';
import {
  DragEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

export interface FileUploadProps {
  // Callback function called when files are uploaded
  onFileUpload: (files: File[]) => void;

  // Whether multiple files are allowed
  multiple?: boolean;

  // Custom className for the upload area
  className?: string;

  // Height of the upload area
  height?: string;

  // Whether to show the upload button
  showUploadButton?: boolean;

  // Custom upload button text
  uploadButtonText?: string;

  // Custom drag and drop text
  dragText?: string;

  // Custom supported formats text
  supportedFormatsText?: string;

  // Whether the component is disabled
  disabled?: boolean;

  // Custom error message for file validation
  customErrorMessage?: (error: string) => string;
}

export const FileUpload = forwardRef<
  {
    clearFiles: () => void;
    resetInput: () => void;
  },
  FileUploadProps
>(
  (
    {
      onFileUpload,
      multiple = false,
      className,
      height = '170px',
      dragText,
      supportedFormatsText,
      showUploadButton = false,
      uploadButtonText,
      disabled = false,
      customErrorMessage,
      ...props
    },
    ref
  ) => {
    const { i18n } = useLingui();
    const { FileInput, openFileInput, checkFileError, resetInput } =
      useFileInput();
    const [dragIsOver, setDragIsOver] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      clearFiles: () => {
        onFileUpload([]);
        resetInput();
      },
      resetInput: () => {
        resetInput();
      },
    }));

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) {
        setDragIsOver(true);
      }
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragIsOver(false);

      if (disabled) return;

      const droppedFiles = Array.from(event.dataTransfer.files);
      processFiles(droppedFiles);
    };

    const processFiles = (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const error = checkFileError(file);
        if (error) {
          const errorMessage = customErrorMessage
            ? customErrorMessage(error)
            : error;
          errors.push(errorMessage);
        } else {
          validFiles.push(file);
        }
      });

      errors.forEach((error) => {
        toast.error(error);
      });

      if (validFiles.length > 0) {
        onFileUpload(validFiles);
        resetInput();
      }
    };

    const handleFileInputChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = event.target.files;
      if (files) {
        processFiles(Array.from(files));
      }
    };

    const defaultDragText = multiple
      ? t(i18n)`Drag and drop files or click to upload`
      : t(i18n)`Drag and drop file or click to upload`;

    const defaultSupportedFormatsText = t(
      i18n
    )`(${OcrFileTypesValues.map((format) => format.split('/')[1]).join(', ')} files up to 20 MB)`;

    const defaultUploadButtonText = multiple
      ? t(i18n)`Choose files`
      : t(i18n)`Choose file`;

    return (
      <div ref={divRef} className={cn('mtw:w-full', className)} {...props}>
        {/* Upload Area */}
        <div
          className={cn(
            'mtw:box-border mtw:cursor-pointer mtw:w-full mtw:flex mtw:flex-col mtw:items-center mtw:justify-center mtw:text-center mtw:border-2 mtw:rounded-xl mtw:border-dashed mtw:border-neutral-80 mtw:bg-white mtw:hover:bg-neutral-95 mtw:transition-colors',
            dragIsOver && 'mtw:bg-primary-5 mtw:border-primary-30',
            disabled &&
              'mtw:cursor-not-allowed mtw:opacity-50 mtw:hover:bg-white',
            className
          )}
          style={{ height }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={
            disabled
              ? undefined
              : (event) => {
                  event.stopPropagation();
                  openFileInput();
                }
          }
        >
          <div className="mtw:mx-auto mtw:px-4">
            <CloudUpload className="mtw:text-primary-30 mtw:w-10 mtw:h-10 mtw:mx-auto mtw:mb-2" />
            <p className="mtw:text-lg mtw:font-semibold mtw:text-neutral-30 mtw:mb-1">
              {dragText || defaultDragText}
            </p>
            <p className="mtw:text-sm mtw:text-neutral-50">
              {supportedFormatsText || defaultSupportedFormatsText}
            </p>
            {showUploadButton && (
              <Button
                variant="outline"
                size="sm"
                className="mtw:mt-3"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  openFileInput();
                }}
              >
                <Upload className="mtw:w-4 mtw:h-4 mtw:mr-2" />
                {uploadButtonText || defaultUploadButtonText}
              </Button>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <FileInput
          multiple={multiple}
          accept={OcrFileTypesString}
          onChange={handleFileInputChange}
          disabled={disabled}
          aria-label={t(i18n)`File upload input`}
        />
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
