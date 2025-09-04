import { useMoniteContext } from "@/core/context/MoniteContext";

export const useCreateInvoiceEmailPreview = (receivable_id: string) => {
  const { api } = useMoniteContext();

  return api.receivables.postReceivablesIdPreview.useMutation({
    path: {
      receivable_id,
    },
  });
};