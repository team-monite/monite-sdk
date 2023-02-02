import {
  counterpartHandlers,
  counterpartBankHandlers,
  counterpartContactHandlers,
} from './counterparts';
import { counterpartsAddressesHandlers } from './counterpartsAddresses';
import { payableHandlers } from './payables';
import { tagsHandlers } from './tags';
import { workflowsHandlers } from './workflows';
import { receivableHandlers } from './receivables';
import { entityUsersHandlers } from './entityUsers';

export const handlers = [
  ...counterpartHandlers,
  ...counterpartBankHandlers,
  ...counterpartContactHandlers,
  ...counterpartsAddressesHandlers,
  ...payableHandlers,
  ...tagsHandlers,
  ...workflowsHandlers,
  ...receivableHandlers,
  ...entityUsersHandlers,
];
