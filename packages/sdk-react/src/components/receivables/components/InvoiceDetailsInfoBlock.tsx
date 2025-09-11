import { components } from "@/api";
import { Button } from "@/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type InvoiceDetailsInfoBlockProps = {
    label: string;
    value: ReactNode | string;
    status?: components['schemas']['ReceivablesStatusEnum'];
    onClick?: () => void;
  };
  
export const InvoiceDetailsInfoBlock = ({ label, value, status, onClick }: InvoiceDetailsInfoBlockProps) => {
    return (
      <div className="mtw:flex mtw:flex-col">
        <h3 className="mtw:text-neutral-10 mtw:text-sm mtw:font-medium mtw:leading-5">
          {label}
        </h3>
        {onClick ? (
            <Button 
                variant="link" 
                onClick={onClick} 
                className="mtw:w-fit mtw:gap-1 mtw:h-5 mtw:hover:no-underline mtw:text-neutral-10 mtw:font-normal mtw:p-0 mtw:has-[>svg]:px-0"
            >
                <span className="mtw:underline">{value}</span>
                <ArrowUpRight />
            </Button>
        ) : (
            <p
                className={twMerge(
                    'mtw:text-sm mtw:font-normal mtw:leading-5 mtw:text-neutral-10',
                    status && status === 'overdue' && 'mtw:text-danger-10',
                    status && status === 'draft' && 'mtw:text-neutral-50',
                )}
            >
                {value}
            </p>
        )}
      </div>
    );
  };