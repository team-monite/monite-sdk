import { authenticationHandlers } from './authentication';
import { receivablesHandlers } from './receivables';

export const handlers = [...authenticationHandlers, ...receivablesHandlers];
