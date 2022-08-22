import { Buffer } from 'buffer';

export const ROUTES = {
  pay: 'pay/*',
  payResult: '/pay/result',
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
  console.log('paymentData__', paymentData);
  return paymentData;
};
