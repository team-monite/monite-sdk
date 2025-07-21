import type { QraftContextValue } from '@openapi-qraft/react';
import { createContext } from 'react';

export const MoniteQraftContext = createContext<QraftContextValue>(undefined);
