import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

const faqs = [
  {
    id: 1,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    question: 'Does enrolling in the program affect my credit score?',
    answer:
      // eslint-disable-next-line lingui/no-unlocalized-strings
      'Nope! During the onboarding process we will only conduct a soft pull on your credit report, which will not affect your personal credit score.',
  },
  {
    id: 2,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    question: 'Why do I need to provide my bank connection details?',
    answer:
      // eslint-disable-next-line lingui/no-unlocalized-strings
      'Securely connecting your business bank account allows us to review your cashflow and determine your best loan offers.',
  },
  {
    id: 3,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    question: 'When should I expect to receive a loan offer?',
    answer:
      // eslint-disable-next-line lingui/no-unlocalized-strings
      'Once you are enrolled into the program, we will be actively analyzing your financials and creating pre-approved offers that work best for your business needs. We do this to help you avoid debt trap. Loan offers are usually provided within less than 48 hours.',
  },
  {
    id: 4,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    question: 'How do I repay the loan?',
    answer:
      // eslint-disable-next-line lingui/no-unlocalized-strings
      'At the moment we support monthly loan repayment once you agree to the loan payment schedule. A fixed amount will be automatically deducted from the bank you linked during the onboarding.In the near future, you can also choose to pay back the loan as a fixed percentage of your daily sales until the loan is fully repaid.',
  },
];

export const FinanceFaqDetails = () => {
  const { i18n } = useLingui();
  return (
    <Box p={4}>
      <Box>
        <Typography variant="h3">
          {t(i18n)`Simplified, fast funding for your growing business`}
        </Typography>
        <Typography variant="subtitle2" mt={2}>
          {t(
            i18n
          )`Get your business moving and accelerate growth with quick and easy access to funding. Multiple options available.`}
        </Typography>
      </Box>
      <Box mt={5}>
        <Typography mb={1} variant="h3">{t(i18n)`FAQ`}</Typography>
        {faqs.map((faq) => (
          <Box key={faq.id} mt={3}>
            <Typography variant="subtitle2">{t(
              i18n
            )`${faq.question}`}</Typography>
            <Typography variant="body1" mt={1}>
              {t(i18n)`${faq.answer}`}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box mt={5}>
        <Typography variant="body2">
          {t(
            i18n
          )`All loans are subject to credit approval. Your terms may vary. Flourish Capital loans are issued by Kanmon. California Loans are made pursuant to a Department of Financial Protection and Innovation California Lenders Law License. Read more about Kanmon here.`}
        </Typography>
      </Box>
    </Box>
  );
};
