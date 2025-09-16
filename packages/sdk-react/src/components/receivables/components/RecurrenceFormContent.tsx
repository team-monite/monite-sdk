import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/components/form";
import { useLingui } from "@lingui/react";
import { useFormContext } from "react-hook-form";
import { type CreateRecurrenceFormProps } from '../InvoiceDetails/CreateReceivable/validation';
import { t } from "@lingui/macro";
import { DatePicker } from "@/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/components/select";

export const RecurrenceFormContent = ({ isUpdate = false }) => {
    const { control, watch, setValue } = useFormContext<CreateRecurrenceFormProps>();
    const { i18n } = useLingui();
    const recurrenceStartDateValue = watch('recurrence_start_date');
    const recurrenceIssueMode = watch('recurrence_issue_mode');
    const recurrenceStartDate = recurrenceStartDateValue ? new Date(recurrenceStartDateValue) : undefined;

    const isDateDisabled = (date: Date) => {
        if (!recurrenceIssueMode) return false;
        
        const dayOfMonth = date.getDate();
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        if (recurrenceIssueMode === 'first_day') {
            return dayOfMonth !== 1;
        } else if (recurrenceIssueMode === 'last_day') {
            return dayOfMonth !== lastDayOfMonth;
        }
        
        return false;
    };

    return (
        <div className="mtw:flex mtw:flex-col mtw:gap-6">
            <FormField
                control={control}
                name="recurrence_issue_mode"
                render={({ field }) => (
                    <FormItem className="mtw:flex-1">
                        <FormLabel>{t(i18n)`Issue at`}</FormLabel>
                        <Select
                            disabled={isUpdate}
                            onValueChange={(value) => {
                                field.onChange(value);
                                setValue('recurrence_start_date', undefined);
                                setValue('recurrence_end_date', undefined);
                            }}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="mtw:w-full">
                                    <SelectValue className="mtw:max-w-4/5 mtw:text-ellipsis mtw:whitespace-nowrap" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="first_day">{t(i18n)`Start of the month`}</SelectItem>
                                <SelectItem value="last_day">{t(i18n)`End of the month`}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <div className="mtw:flex mtw:items-start mtw:gap-4">
                <FormField
                    control={control}
                    name="recurrence_start_date"
                    render={({ field }) => (
                        <FormItem className="mtw:flex-1">
                            <FormLabel>{t(i18n)`Period starts on`}</FormLabel>
                            <FormControl>
                                <DatePicker 
                                    {...field} 
                                    selected={field.value ? new Date(field.value) : undefined} 
                                    onSelect={field.onChange}
                                    showOutsideDays={false}
                                    disabled={isDateDisabled}
                                    shouldDisableButton={isUpdate}
                                    startMonth={new Date()}
                                    endMonth={new Date(2050, 11)}
                                    {...(isUpdate && field.value ? { defaultMonth: new Date(field.value) } : {})}
                                />
                            </FormControl>  
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={control}
                    name="recurrence_end_date"
                    render={({ field }) => (
                        <FormItem className="mtw:flex-1">
                            <FormLabel>{t(i18n)`Period ends on`}</FormLabel>
                            <FormControl>
                                <DatePicker 
                                    {...field} 
                                    selected={field.value ? new Date(field.value) : undefined} 
                                    onSelect={field.onChange}
                                    showOutsideDays={false}
                                    disabled={isDateDisabled}
                                    startMonth={recurrenceStartDate ? 
                                        new Date(recurrenceStartDate.getFullYear(), recurrenceStartDate.getMonth() + 2, 0) : 
                                        new Date()
                                    }
                                    endMonth={new Date(2050, 11)}
                                    {...(isUpdate && field.value ? { defaultMonth: new Date(field.value) } : {})}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div> 
        </div>
    );
};