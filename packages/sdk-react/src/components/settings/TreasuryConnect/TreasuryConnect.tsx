import { useState, useCallback, useMemo } from 'react';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Card, CardContent } from '@/ui/components/card';
import { Button } from '@/ui/components/button';
import { Badge } from '@/ui/components/badge';
import { Dialog, DialogContent } from '@/ui/components/dialog';
import { useTreasuryEligibility } from '@/components/onboarding/hooks/useTreasuryEligibility';
import { useMyEntity } from '@/core/queries/useMe';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { OnboardingTreasuryTerms } from '@/components/onboarding/OnboardingTreasuryTerms';
import type { components } from '@/api';

type EntityResponse = components['schemas']['EntityResponse'];

/**
 * Extended EntityResponse with Treasury onboarding data.
 * TODO: Remove once OpenAPI schema includes onboarding_data.
 */
type ExtendedEntityResponse = EntityResponse & {
  onboarding_data?: {
    treasury_tos_acceptance?: {
      date?: string;
      ip?: string;
    };
    [key: string]: unknown;
  };
};

/**
 * Treasury connection management component for settings page.
 * Only shown for eligible US entities with active us_ach payment methods.
 */
export function TreasuryConnect() {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const { isEligible, isLoading: isLoadingEligibility } = useTreasuryEligibility();
  const { data: entity, isLoading: isLoadingEntity } = useMyEntity();
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const isConnected = useMemo(() => {
    const extendedEntity = entity as ExtendedEntityResponse | undefined;
    return Boolean(extendedEntity?.onboarding_data?.treasury_tos_acceptance?.date);
  }, [entity]);

  const handleConnect = useCallback(() => {
    setShowTermsDialog(true);
  }, []);

  const handleTermsAccepted = useCallback(() => {
    setShowTermsDialog(false);
    api.entityUsers.getEntityUsersMyEntity.invalidateQueries(queryClient);
  }, [api, queryClient]);

  const isLoading = isLoadingEligibility || isLoadingEntity;

  if (isLoading || !isEligible) {
    return null;
  }

  return (
    <>
      <div className="mtw:space-y-5">
        <h2 className="mtw:text-xl mtw:font-semibold mtw:text-gray-950">
          <Trans>Direct debits via Stripe</Trans>
        </h2>

        <Card className="mtw:bg-white mtw:border mtw:border-[#e1e5ea] mtw:shadow-sm">
          <CardContent className="mtw:flex mtw:items-center mtw:justify-between mtw:gap-8 mtw:p-4">
            <div className="mtw:flex-1 mtw:text-base mtw:leading-6">
              <p className="mtw:text-[#181b20]">
                <Trans>
                  Pay invoices directly from your bank account and track when payments are made and automatically matched on this platform via Stripe
                </Trans>
              </p>
            </div>

            {!isConnected ? (
              <Button
                onClick={handleConnect}
                className="mtw:bg-[#155dfc] mtw:text-slate-50 mtw:px-3 mtw:py-2 mtw:text-sm mtw:font-medium mtw:rounded-md hover:mtw:bg-[#1250e0]"
              >
                <Trans>Connect</Trans>
              </Button>
            ) : (
              <Badge 
                variant="default"
                className="mtw:bg-[#f4fdf8] mtw:text-[#51de92] mtw:px-2 mtw:py-0.5 mtw:text-sm mtw:font-medium mtw:rounded-lg mtw:border-0"
              >
                <Trans>Connected</Trans>
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="mtw:max-w-2xl">
          <OnboardingTreasuryTerms 
            standalone={true}
            onSuccess={handleTermsAccepted}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
