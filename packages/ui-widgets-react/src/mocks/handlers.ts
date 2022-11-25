import {
  counterpartHandlers,
  counterpartBankHandlers,
  counterpartContactHandlers,
} from './counterparts';
import { payableHandlers } from './payables';
import { tagsHandlers } from './tags';
import { receivableHandlers } from './receivables';

export const handlers = [
  ...counterpartHandlers,
  ...counterpartBankHandlers,
  ...counterpartContactHandlers,
  ...payableHandlers,
  ...tagsHandlers,
  ...receivableHandlers,
];
