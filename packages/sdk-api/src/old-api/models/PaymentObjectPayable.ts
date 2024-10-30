/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentObjectPayable = {
  id: string;
  type: PaymentObjectPayable.type;
};

export namespace PaymentObjectPayable {
  export enum type {
    PAYABLE = 'payable',
  }
}
