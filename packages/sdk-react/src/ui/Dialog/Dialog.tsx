import { MoniteDialogProps } from './DialogProps.types';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { generatePayablesButtonCssVars } from '@/core/theme/utils/buttonStyleHelpers';
import { css } from '@emotion/react';
import { Fade, Dialog as MuiDialog, Slide } from '@mui/material';
import { SlideProps } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  createContext,
  forwardRef,
  ReactElement,
  Ref,
  useContext,
  useMemo,
} from 'react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  const { alignDialog, ...otherProps } = props;

  if (alignDialog) {
    let direction: SlideProps['direction'];
    switch (alignDialog) {
      case 'left':
        direction = 'right';
        break;
      case 'right':
        direction = 'left';
        break;
    }
    return <Slide direction={direction} ref={ref} {...otherProps} />;
  }

  return <Fade ref={ref} {...otherProps} />;
});

interface DialogContextType {
  isDialogContent: boolean;
  onClose?: (...args: any[]) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = (): DialogContextType | undefined => {
  return useContext(DialogContext);
};

export const Dialog = forwardRef<HTMLDivElement, MoniteDialogProps>(
  (props, ref) => {
    const { alignDialog, onClosed, ...otherProps } = props;
    const { root } = useRootElements();
    const { theme } = useMoniteContext();
    const parentDialog = useDialog();

    const buttonCssVars = useMemo(
      () =>
        generatePayablesButtonCssVars(
          theme.components?.styles?.payables?.button
        ),
      [theme.components?.styles?.payables?.button]
    );

    const handleClose = (
      event: { stopPropagation?: () => void },
      reason: 'backdropClick' | 'escapeKeyDown'
    ) => {
      // Disable closing through through backdrop clicks.
      // Only allow closing through explicit close actions (like close button) and ESC key.
      if (reason !== 'backdropClick') {
        // If this is a nested dialog and ESC was pressed, prevent the event from bubbling up
        if (reason === 'escapeKeyDown' && parentDialog) {
          event.stopPropagation?.();
        }
        props.onClose?.(event, reason);
      }
    };

    return (
      <DialogContext.Provider
        value={{
          isDialogContent: true,
          onClose: handleClose,
        }}
      >
        <MuiDialog
          ref={ref}
          {...otherProps}
          open={props.open}
          container={root}
          TransitionComponent={Transition}
          TransitionProps={{
            alignDialog: alignDialog,
            onExited: onClosed,
          }}
          onClose={handleClose}
          classes={{
            container: [
              ScopedCssBaselineContainerClassName,
              'Monite-Payables',
              alignDialog && `MuiDialog-container__align-${alignDialog}`,
            ]
              .filter(Boolean)
              .join(' '),
            paper: [
              'Monite-Payables',
              alignDialog && `MuiDialog-paper__align-${alignDialog}`,
            ]
              .filter(Boolean)
              .join(' '),
          }}
          sx={{
            '& .MuiDialogContent-root, & .MuiDialogActions-root, & .MuiDialogTitle-root': buttonCssVars,
          }}
          slotProps={
            props.fullScreen
              ? {
                  backdrop: {
                    style: {
                      background: 'none',
                    },
                  },
                }
              : {}
          }
          css={css`
            .MuiDialog-container__align-right {
              justify-content: right;
            }
            .MuiDialog-container__align-left {
              justify-content: left;
            }

            .MuiDialog-paper__align-left,
            .MuiDialog-paper__align-right {
              width: 50%;
              height: 100%;
              max-height: none;
              margin: 0;
              border-radius: 0;
            }
          `}
        >
          {props.children}
        </MuiDialog>
      </DialogContext.Provider>
    );
  }
);
