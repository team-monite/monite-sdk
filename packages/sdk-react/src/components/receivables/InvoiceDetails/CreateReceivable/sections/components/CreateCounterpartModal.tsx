import { CounterpartDetails } from '@/components';
import { useRootElements } from '@/core/context/RootElementsProvider/RootElementsProvider';
import { Box, Modal } from '@mui/material';

interface CreateCounterpartModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCounterpartModal = ({
  open,
  onClose,
  onCreate,
}: CreateCounterpartModalProps) => {
  const { root } = useRootElements();

  return (
    <Modal open={open} container={root} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          maxHeight: '90%', //could be better to keep 90% to laptop screens but change to 600px to larger screens
          overflowY: 'scroll',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <CounterpartDetails
          type={'individual'}
          onClose={onClose}
          onCreate={(counterpartId) => {
            onCreate(counterpartId);
            onClose();
          }}
        />
      </Box>
    </Modal>
  );
};
