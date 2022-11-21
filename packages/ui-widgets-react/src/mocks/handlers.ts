import { counterpartHandlers, counterpartBankHandlers } from './counterparts';

export const handlers = [...counterpartHandlers, ...counterpartBankHandlers];
