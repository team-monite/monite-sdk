import { Buffer } from 'buffer';

export const ROUTES = {
  payResult: '/result',
  card: 'card/*',
  bank: 'bank/*',
  other: 'other/*',
};

export const fromBase64 = (data: string) => {
  let paymentData;
  if (data) {
    try {
      paymentData = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    } catch (e) {
      paymentData = '';
    }
  }
  return paymentData;
};
