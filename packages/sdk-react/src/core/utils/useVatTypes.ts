import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TaxIDTypeEnum } from '@monite/sdk-api';

type VatType = {
  code: components['schemas']['VatIDTypeEnum'];
  label: string;
};

export const useVatTypeLabelByCode = (
  code?: components['schemas']['VatIDTypeEnum']
): string => {
  const { i18n } = useLingui();
  const vatType = useVatTypes();

  if (!code) return t(i18n)`Unknown`;

  return vatType.find((type) => type.code === code)?.label || t(i18n)`Unknown`;
};

export const useVatTypes = (): VatType[] => {
  const { i18n } = useLingui();

  return [
    {
      code: TaxIDTypeEnum.AE_TRN,
      label: t(i18n)`Tax Registration Number (UAE)`,
    },
    {
      code: TaxIDTypeEnum.AU_ABN,
      label: t(i18n)`Australian Business Number (Australia)`,
    },
    {
      code: TaxIDTypeEnum.AU_ARN,
      label: t(i18n)`Australian Registered Body Number (Australia)`,
    },
    {
      code: TaxIDTypeEnum.BG_UIC,
      label: t(i18n)`Unified Identification Code (Bulgaria)`,
    },
    {
      code: TaxIDTypeEnum.BR_CNPJ,
      label: t(i18n)`National Registry of Legal Entities (Brazil)`,
    },
    {
      code: TaxIDTypeEnum.BR_CPF,
      label: t(i18n)`Natural Persons Register (Brazil)`,
    },
    {
      code: TaxIDTypeEnum.CA_BN,
      label: t(i18n)`Business Number (Canada)`,
    },
    {
      code: TaxIDTypeEnum.CA_GST_HST,
      label: t(i18n)`Goods and Services Tax/Harmonized Sales Tax (Canada)`,
    },
    {
      code: TaxIDTypeEnum.CA_PST_BC,
      label: t(i18n)`Provincial Sales Tax (British Columbia, Canada)`,
    },
    {
      code: TaxIDTypeEnum.CA_PST_MB,
      label: t(i18n)`Provincial Sales Tax (Manitoba, Canada)`,
    },
    {
      code: TaxIDTypeEnum.CA_PST_SK,
      label: t(i18n)`Provincial Sales Tax (Saskatchewan, Canada)`,
    },
    {
      code: TaxIDTypeEnum.CA_QST,
      label: t(i18n)`Quebec Sales Tax (Canada)`,
    },
    {
      code: TaxIDTypeEnum.CH_VAT,
      label: t(i18n)`Value Added Tax (Switzerland)`,
    },
    {
      code: TaxIDTypeEnum.CL_TIN,
      label: t(i18n)`Tax Identification Number (Chile)`,
    },
    {
      code: TaxIDTypeEnum.ES_CIF,
      label: t(i18n)`Tax Identification Code (Spain)`,
    },
    {
      code: TaxIDTypeEnum.EU_OSS_VAT,
      label: t(i18n)`One Stop Shop Value Added Tax (EU)`,
    },
    {
      code: TaxIDTypeEnum.EU_VAT,
      label: t(i18n)`Value Added Tax (EU)`,
    },
    {
      code: TaxIDTypeEnum.GB_VAT,
      label: t(i18n)`Value Added Tax (United Kingdom)`,
    },
    {
      code: TaxIDTypeEnum.GE_VAT,
      label: t(i18n)`Value Added Tax (Georgia)`,
    },
    {
      code: TaxIDTypeEnum.HK_BR,
      label: t(i18n)`Business Registration (Hong Kong)`,
    },
    {
      code: TaxIDTypeEnum.HU_TIN,
      label: t(i18n)`Tax Identification Number (Hungary)`,
    },
    {
      code: TaxIDTypeEnum.ID_NPWP,
      label: t(i18n)`Taxpayer Identification Number (Indonesia)`,
    },
    {
      code: TaxIDTypeEnum.IL_VAT,
      label: t(i18n)`Value Added Tax (Israel)`,
    },
    {
      code: TaxIDTypeEnum.IN_GST,
      label: t(i18n)`Goods and Services Tax (India)`,
    },
    {
      code: TaxIDTypeEnum.IS_VAT,
      label: t(i18n)`Value Added Tax (Iceland)`,
    },
    {
      code: TaxIDTypeEnum.JP_CN,
      label: t(i18n)`Corporate Number (Japan)`,
    },
    {
      code: TaxIDTypeEnum.JP_RN,
      label: t(i18n)`Registered Number (Japan)`,
    },
    {
      code: TaxIDTypeEnum.KR_BRN,
      label: t(i18n)`Business Registration Number (South Korea)`,
    },
    {
      code: TaxIDTypeEnum.LI_UID,
      label: t(i18n)`Business Identification Number (Liechtenstein)`,
    },
    {
      code: TaxIDTypeEnum.MX_RFC,
      label: t(i18n)`Federal Taxpayers Registry (Mexico)`,
    },
    {
      code: TaxIDTypeEnum.MY_FRP,
      label: t(i18n)`Federal Retailers Permit (Malaysia)`,
    },
    {
      code: TaxIDTypeEnum.MY_ITN,
      label: t(i18n)`Income Tax Number (Malaysia)`,
    },
    {
      code: TaxIDTypeEnum.MY_SST,
      label: t(i18n)`Sales and Service Tax (Malaysia)`,
    },
    {
      code: TaxIDTypeEnum.NO_VAT,
      label: t(i18n)`Value Added Tax (Norway)`,
    },
    {
      code: TaxIDTypeEnum.NZ_GST,
      label: t(i18n)`Goods and Services Tax (New Zealand)`,
    },
    {
      code: TaxIDTypeEnum.RU_INN,
      label: t(i18n)`Taxpayer Identification Number (Russia)`,
    },
    {
      code: TaxIDTypeEnum.RU_KPP,
      label: t(i18n)`Reason for Payment Code (Russia)`,
    },
    {
      code: TaxIDTypeEnum.SA_VAT,
      label: t(i18n)`Value Added Tax (Saudi Arabia)`,
    },
    {
      code: TaxIDTypeEnum.SG_GST,
      label: t(i18n)`Goods and Services Tax (Singapore)`,
    },
    {
      code: TaxIDTypeEnum.SG_UEN,
      label: t(i18n)`Unique Entity Number (Singapore)`,
    },
    {
      code: TaxIDTypeEnum.SI_TIN,
      label: t(i18n)`Tax Identification Number (Slovenia)`,
    },
    {
      code: TaxIDTypeEnum.TH_VAT,
      label: t(i18n)`Value Added Tax (Thailand)`,
    },
    {
      code: TaxIDTypeEnum.TW_VAT,
      label: t(i18n)`Value Added Tax (Taiwan)`,
    },
    {
      code: TaxIDTypeEnum.UA_VAT,
      label: t(i18n)`Value Added Tax (Ukraine)`,
    },
    {
      code: TaxIDTypeEnum.US_EIN,
      label: t(i18n)`Employer Identification Number (USA)`,
    },
    {
      code: TaxIDTypeEnum.ZA_VAT,
      label: t(i18n)`Value Added Tax (South Africa)`,
    },
    {
      code: TaxIDTypeEnum.UNKNOWN,
      label: t(i18n)`Unknown`,
    },
  ];
};
