import { useMoniteContext } from "@/core/context/MoniteContext";
import { useLingui } from "@lingui/react";
import { toast } from "react-hot-toast";

export const useCreateReceivablePaymentLink = () => {
    const { api, entityId } = useMoniteContext();
    const { i18n } = useLingui();

    const { data: paymentMethods } =
        api.entities.getEntitiesIdPaymentMethods.useQuery({
            path: { entity_id: entityId },
        });

    const { mutateAsync: createPaymentLinkAsync, isPending: isCreatingPaymentLink } =
        api.paymentLinks.postPaymentLinks.useMutation({});

    async function createPaymentLink(invoiceId: string) {
        const availablePaymentMethods = paymentMethods
        ? paymentMethods.data.filter(
            ({ status, direction }) =>
              status === 'active' && direction === 'receive'
          )
        : [];

        if (availablePaymentMethods.length === 0) {
            toast.error(
              i18n._(
                `You haven't onboarded for any payment method. Invoice is issued without a payment link.`
              )
            );
        } else {
            await createPaymentLinkAsync({
                recipient: { id: entityId, type: 'entity' },
                payment_methods: availablePaymentMethods.map(
                    (method) => method.type
                ),
                object: { id: invoiceId, type: 'receivable' },
            });
        }
    }

    return { createPaymentLink, isCreatingPaymentLink };
};