import { ExpensesTable } from './ExpensesTable/ExpensesTable';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const Expenses = () => {
  const { i18n } = useLingui();

  return (
    <div className="mtw:flex mtw:flex-col mtw:h-full">
      <div className="mtw:flex-shrink-0">
        <PageHeader title={t(i18n)`Expenses`} />
      </div>
      <div className="mtw:flex-1 mtw:min-h-0">
        <ExpensesTable />
      </div>
    </div>
  );
};
