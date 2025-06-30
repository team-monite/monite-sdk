import { DragEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useFileInput } from '@/core/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha, Box, Button, Stack, Typography } from '@mui/material';

interface CreatePayableMenuProps {
  isCreateAllowed: boolean;
  onCreateInvoice: () => void;
  handleFileUpload: (file: File | FileList) => void;
}

export const CreatePayableMenu = ({
  isCreateAllowed,
  onCreateInvoice,
  handleFileUpload,
}: CreatePayableMenuProps) => {
  const { i18n } = useLingui();
  const { FileInput, openFileInput, checkFileError } = useFileInput();
  const [dragIsOver, setDragIsOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    droppedFiles.forEach((file) => {
      const error = checkFileError(file);
      if (error) {
        toast.error(error);
        return;
      }

      handleFileUpload(file);
    });

    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="contained"
            disabled={!isCreateAllowed}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {t(i18n)`Add new bill`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mtw:w-[550px]" align="end">
          <Stack
            spacing={3}
            flexDirection="column"
            sx={{ p: 1.5, width: 550 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Box>
              <Typography variant="subtitle1" mb={1}>
                {t(i18n)`Upload files`}
              </Typography>
              <Box
                sx={{
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  width: '100%',
                  height: 170,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: 2,
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderColor: 'primary.main',
                  ...(dragIsOver
                    ? { backgroundColor: 'transparent' }
                    : {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.05),
                      }),
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => openFileInput()}
              >
                <Box
                  sx={{
                    margin: 'auto',
                  }}
                >
                  <CloudUploadOutlinedIcon color="primary" fontSize="large" />
                  <Typography color="primary" variant="subtitle2">
                    {t(i18n)`Drag and drop files or click to upload`}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t(i18n)`(.pdf, .png, .jpg supported)`}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle1" mb={1}>
                {t(i18n)`Or add bill manually`}
              </Typography>
              <Box flex={0}>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={() => {
                    setIsOpen(false);
                    onCreateInvoice();
                  }}
                >
                  {t(i18n)`Add new bill`}
                </Button>
              </Box>
            </Box>
          </Stack>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileInput
        aria-label={t(i18n)`Upload payable files`}
        multiple
        onChange={(event) => {
          const files = event.target.files;
          if (files) handleFileUpload(files);
          setIsOpen(false);
        }}
      />
    </>
  );
};
