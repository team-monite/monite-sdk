export enum PaymentProvidersEnum {
  STRIPE = 'stripe',
  YAPILY = 'yapily',
}

export type Provider = {
  type: PaymentProvidersEnum;
  secret: string;
};

export type URLData = {
  object: {
    id: string;
    type: string;
  };
  providers: Provider[];
  // TODO check with backend
  paymentMethods: string[];
};
