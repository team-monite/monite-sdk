import { components } from "@/api";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { InvoiceDetailsInfoBlock } from "./InvoiceDetailsInfoBlock";
import { Button } from "@/ui/components/button";
import { SquarePen } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/ui/components/sheet";
import { useMemo, useState } from "react";
import { RecurrenceFormContent } from "./RecurrenceFormContent";
import { Form } from "@/ui/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreateRecurrenceValidationSchema, CreateRecurrenceFormProps } from "../InvoiceDetails/CreateReceivable/validation";
import { useUpdateRecurrenceById } from "../hooks/useUpdateRecurrenceById";
import { format } from "date-fns";
import { InvoiceRecurrenceStatusChip } from "./InvoiceRecurrenceStatusChip";

type InvoiceDetailsOverviewRecurrenceSectionProps = {
  recurrence: components['schemas']['RecurrenceResponse'];
  handleTabChange: (value: string) => void;
  openInvoiceDetails?: (invoiceId: string) => void;
  isCreatedFromRecurrence: boolean;
};

export const InvoiceDetailsOverviewRecurrenceSection = ({ 
    recurrence,
    handleTabChange,
    openInvoiceDetails,
    isCreatedFromRecurrence,
}: InvoiceDetailsOverviewRecurrenceSectionProps) => {
    const { i18n } = useLingui();
    const [isEditRecurrenceOpen, setIsEditRecurrenceOpen] = useState(false);
    const startDay = new Date(recurrence?.start_date).getDate();
    const issuedDocuments = useMemo(() => recurrence?.iterations?.filter(iteration => iteration.status === 'completed'), [recurrence]);
    const { mutateAsync: updateRecurrence, isPending: isUpdatingRecurrence } = useUpdateRecurrenceById(recurrence?.id, recurrence?.invoice_id);

  const formName = 'edit-recurrence-form';
  const methods = useForm<CreateRecurrenceFormProps>({
    resolver: zodResolver(getCreateRecurrenceValidationSchema(i18n)),
    defaultValues: {
        recurrence_start_date: new Date(recurrence?.start_date),
        recurrence_end_date: recurrence?.end_date ? new Date(recurrence?.end_date) : undefined,
        recurrence_issue_mode: startDay === 1 ? 'first_day' : 'last_day',
    },
  });

  const onSubmit = async (values: CreateRecurrenceFormProps) => {
    await updateRecurrence({
        end_date: values.recurrence_end_date ? format(new Date(values.recurrence_end_date), 'yyyy-MM-dd') : undefined,
        start_date: values.recurrence_start_date ? format(new Date(values.recurrence_start_date), 'yyyy-MM-dd') : undefined,
    });
    setIsEditRecurrenceOpen(false);
  };

  return (
    <>
        {isEditRecurrenceOpen && (
            <Sheet open={isEditRecurrenceOpen} onOpenChange={setIsEditRecurrenceOpen}>
                <Form {...methods}>
                    <form id={formName} name={formName} onSubmit={methods.handleSubmit(onSubmit)}>
                        <SheetContent className="mtw:gap-0" showCloseButton={false}>
                            <SheetHeader className="mtw:border-b mtw:border-border">
                                <SheetTitle>
                                    {t(i18n)`Edit recurrence settings`}
                                </SheetTitle>
                                <SheetDescription hidden>{t(i18n)`Edit the settings for this recurring invoice`}</SheetDescription>
                            </SheetHeader>

                            <div className="mtw:p-8 mtw:flex mtw:flex-col mtw:gap-10">
                                <p className="mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-foreground">
                                    {t(i18n)`You can set a different period length and the date of issuance. The starting date cannot be updated.`}
                                </p>

                                <RecurrenceFormContent isUpdate />
                            </div>

                            <SheetFooter className="mtw:border-t mtw:border-border mtw:flex-row mtw:justify-end">
                                <Button variant="outline" size="sm" onClick={() => setIsEditRecurrenceOpen(false)}>
                                    {t(i18n)`Cancel`}
                                </Button>
                                <Button size="sm" type="submit" form={formName} disabled={isUpdatingRecurrence}>
                                    {t(i18n)`Save`}
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </form>
                </Form>
            </Sheet>
        )}

        <div className="mtw:flex mtw:flex-col mtw:gap-4">
            {isCreatedFromRecurrence ? (
                <div className="mtw:flex mtw:justify-between mtw:items-center mtw:gap-4">
                    <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
                        {t(i18n)`Created from recurrence`}
                    </h2>
                    <InvoiceRecurrenceStatusChip status={recurrence?.status} />
                </div>
            ) : (
                <div className="mtw:flex mtw:flex-col mtw:gap-0.5">
                    <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
                        {t(i18n)`Recurrence`}
                    </h2>
                    <p className="mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-muted-foreground">
                        {t(i18n)`All future invoices will be issued based on this invoice`}
                    </p>
                </div>
            )}

            <div className="mtw:grid mtw:grid-cols-2 mtw:gap-4">
                <InvoiceDetailsInfoBlock
                    label={t(i18n)`Start`}
                    value={recurrence?.start_date ? i18n.date(recurrence?.start_date, { month: 'long', year: 'numeric' }) : '-'}
                />
                <InvoiceDetailsInfoBlock
                    label={t(i18n)`End`}
                    value={recurrence?.end_date ? i18n.date(recurrence?.end_date, { month: 'long', year: 'numeric' }) : '-'}
                />
                <InvoiceDetailsInfoBlock
                    label={t(i18n)`Frequency`}
                    value={t(i18n)`Every ${startDay === 1 ? 'first' : 'last'} day of month`}
                />
                <InvoiceDetailsInfoBlock
                    label={t(i18n)`Issued documents`}
                    value={t(i18n)`${issuedDocuments.length} / ${recurrence?.iterations.length} issued`}
                    onClick={() => {
                        if (isCreatedFromRecurrence) {
                            openInvoiceDetails?.(recurrence?.invoice_id);
                        }
                        handleTabChange('scheduled-invoices');
                    }}
                />
            </div>

            {isCreatedFromRecurrence ? (
                <Button variant="outline" size="sm" className="mtw:w-fit" onClick={() => openInvoiceDetails?.(recurrence?.invoice_id)}>
                    {t(i18n)`View recurrence`}
                </Button>
            ) : (
                <Button variant="outline" size="sm" className="mtw:w-fit" onClick={() => setIsEditRecurrenceOpen(true)}>
                    <SquarePen /> {t(i18n)`Edit settings`}
                </Button>
            )}
        </div>
    </>
  );
};