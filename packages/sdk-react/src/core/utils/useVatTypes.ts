import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';

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
      code: 'ae_trn',
      label: t(i18n)`Tax Registration Number (UAE)`,
    },
    {
      code: 'au_abn',
      label: t(i18n)`Australian Business Number (Australia)`,
    },
    {
      code: 'au_arn',
      label: t(i18n)`Australian Registered Body Number (Australia)`,
    },
    {
      code: 'bg_uic',
      label: t(i18n)`Unified Identification Code (Bulgaria)`,
    },
    {
      code: 'br_cnpj',
      label: t(i18n)`National Registry of Legal Entities (Brazil)`,
    },
    {
      code: 'br_cpf',
      label: t(i18n)`Natural Persons Register (Brazil)`,
    },
    {
      code: 'ca_bn',
      label: t(i18n)`Business Number (Canada)`,
    },
    {
      code: 'ca_gst_hst',
      label: t(i18n)`Goods and Services Tax/Harmonized Sales Tax (Canada)`,
    },
    {
      code: 'ca_pst_bc',
      label: t(i18n)`Provincial Sales Tax (British Columbia, Canada)`,
    },
    {
      code: 'ca_pst_mb',
      label: t(i18n)`Provincial Sales Tax (Manitoba, Canada)`,
    },
    {
      code: 'ca_pst_sk',
      label: t(i18n)`Provincial Sales Tax (Saskatchewan, Canada)`,
    },
    {
      code: 'ca_qst',
      label: t(i18n)`Quebec Sales Tax (Canada)`,
    },
    {
      code: 'ch_vat',
      label: t(i18n)`Value Added Tax (Switzerland)`,
    },
    {
      code: 'cl_tin',
      label: t(i18n)`Tax Identification Number (Chile)`,
    },
    {
      code: 'es_cif',
      label: t(i18n)`Tax Identification Code (Spain)`,
    },
    {
      code: 'eu_oss_vat',
      label: t(i18n)`One Stop Shop Value Added Tax (EU)`,
    },
    {
      code: 'eu_vat',
      label: t(i18n)`Value Added Tax (EU)`,
    },
    {
      code: 'gb_vat',
      label: t(i18n)`Value Added Tax (United Kingdom)`,
    },
    {
      code: 'ge_vat',
      label: t(i18n)`Value Added Tax (Georgia)`,
    },
    {
      code: 'hk_br',
      label: t(i18n)`Business Registration (Hong Kong)`,
    },
    {
      code: 'hu_tin',
      label: t(i18n)`Tax Identification Number (Hungary)`,
    },
    {
      code: 'id_npwp',
      label: t(i18n)`Taxpayer Identification Number (Indonesia)`,
    },
    {
      code: 'il_vat',
      label: t(i18n)`Value Added Tax (Israel)`,
    },
    {
      code: 'in_gst',
      label: t(i18n)`Goods and Services Tax (India)`,
    },
    {
      code: 'is_vat',
      label: t(i18n)`Value Added Tax (Iceland)`,
    },
    {
      code: 'jp_cn',
      label: t(i18n)`Corporate Number (Japan)`,
    },
    {
      code: 'jp_rn',
      label: t(i18n)`Registered Number (Japan)`,
    },
    {
      code: 'kr_brn',
      label: t(i18n)`Business Registration Number (South Korea)`,
    },
    {
      code: 'li_uid',
      label: t(i18n)`Business Identification Number (Liechtenstein)`,
    },
    {
      code: 'mx_rfc',
      label: t(i18n)`Federal Taxpayers Registry (Mexico)`,
    },
    {
      code: 'my_frp',
      label: t(i18n)`Federal Retailers Permit (Malaysia)`,
    },
    {
      code: 'my_itn',
      label: t(i18n)`Income Tax Number (Malaysia)`,
    },
    {
      code: 'my_sst',
      label: t(i18n)`Sales and Service Tax (Malaysia)`,
    },
    {
      code: 'no_vat',
      label: t(i18n)`Value Added Tax (Norway)`,
    },
    {
      code: 'nz_gst',
      label: t(i18n)`Goods and Services Tax (New Zealand)`,
    },
    {
      code: 'ru_inn',
      label: t(i18n)`Taxpayer Identification Number (Russia)`,
    },
    {
      code: 'ru_kpp',
      label: t(i18n)`Reason for Payment Code (Russia)`,
    },
    {
      code: 'sa_vat',
      label: t(i18n)`Value Added Tax (Saudi Arabia)`,
    },
    {
      code: 'sg_gst',
      label: t(i18n)`Goods and Services Tax (Singapore)`,
    },
    {
      code: 'sg_uen',
      label: t(i18n)`Unique Entity Number (Singapore)`,
    },
    {
      code: 'si_tin',
      label: t(i18n)`Tax Identification Number (Slovenia)`,
    },
    {
      code: 'th_vat',
      label: t(i18n)`Value Added Tax (Thailand)`,
    },
    {
      code: 'tw_vat',
      label: t(i18n)`Value Added Tax (Taiwan)`,
    },
    {
      code: 'ua_vat',
      label: t(i18n)`Value Added Tax (Ukraine)`,
    },
    {
      code: 'us_ein',
      label: t(i18n)`Employer Identification Number (USA)`,
    },
    {
      code: 'za_vat',
      label: t(i18n)`Value Added Tax (South Africa)`,
    },
    {
      code: 'unknown',
      label: t(i18n)`Unknown`,
    },
  ];
};
