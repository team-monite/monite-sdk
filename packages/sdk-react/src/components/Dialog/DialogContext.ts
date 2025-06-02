import { createContext, useContext } from 'react';

export interface DialogContextType {
  isDialogContent: boolean;
  onClose?: (...args: any[]) => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = (): DialogContextType | undefined => {
  return useContext(DialogContext);
};