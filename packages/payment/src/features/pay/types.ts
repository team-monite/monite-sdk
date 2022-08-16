export type URLData = {
  object: {
    id: string;
    type: string;
  };
  stripe: { secret: string; publishable: string };
  payment_methods: string[];
  payment_intent_id: string;
  amount: number;
  currency: string;
  success_url: string;
  cancel_url: string;
};
