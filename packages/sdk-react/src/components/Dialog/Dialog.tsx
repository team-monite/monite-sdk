'use client';

import { forwardRef, createContext, useContext } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { css } from '@emotion/react';
import { Fade, Dialog as MuiDialog, Slide } from '@mui/material';
import { SlideProps } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { MoniteDialogProps } from './DialogProps.types';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
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

export const Dialog = (props: MoniteDialogProps) => (
  <MoniteScopedProviders>
    <DialogBase {...props} />
  </MoniteScopedProviders>
);

export const DialogBase = (props: MoniteDialogProps) => {
  const { alignDialog, onClosed, ...otherProps } = props;
  const { root } = useRootElements();

  return (
    <DialogContext.Provider
      value={{ isDialogContent: true, onClose: props.onClose }}
    >
      <MuiDialog
        {...otherProps}
        open={props.open}
        container={root}
        TransitionComponent={Transition}
        TransitionProps={{
          alignDialog: alignDialog,
          onExited: onClosed,
        }}
        onClose={props.onClose}
        classes={{
          container: [
            ScopedCssBaselineContainerClassName,
            alignDialog && `MuiDialog-container__align-${alignDialog}`,
          ]
            .filter(Boolean)
            .join(' '),
          paper: alignDialog && `MuiDialog-paper__align-${alignDialog}`,
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
};
