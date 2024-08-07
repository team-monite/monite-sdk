import { components } from '@/api';

const schema: {
  [key in components['schemas']['VatIDTypeEnum']]: key;
} = {
  ae_trn: 'ae_trn',
  au_abn: 'au_abn',
  au_arn: 'au_arn',
  bg_uic: 'bg_uic',
  br_cnpj: 'br_cnpj',
  br_cpf: 'br_cpf',
  ca_bn: 'ca_bn',
  ca_gst_hst: 'ca_gst_hst',
  ca_pst_bc: 'ca_pst_bc',
  ca_pst_mb: 'ca_pst_mb',
  ca_pst_sk: 'ca_pst_sk',
  ca_qst: 'ca_qst',
  ch_vat: 'ch_vat',
  cl_tin: 'cl_tin',
  es_cif: 'es_cif',
  eu_oss_vat: 'eu_oss_vat',
  eu_vat: 'eu_vat',
  gb_vat: 'gb_vat',
  ge_vat: 'ge_vat',
  hk_br: 'hk_br',
  hu_tin: 'hu_tin',
  id_npwp: 'id_npwp',
  il_vat: 'il_vat',
  in_gst: 'in_gst',
  is_vat: 'is_vat',
  jp_cn: 'jp_cn',
  jp_rn: 'jp_rn',
  kr_brn: 'kr_brn',
  li_uid: 'li_uid',
  mx_rfc: 'mx_rfc',
  my_frp: 'my_frp',
  my_itn: 'my_itn',
  my_sst: 'my_sst',
  no_vat: 'no_vat',
  nz_gst: 'nz_gst',
  ru_inn: 'ru_inn',
  ru_kpp: 'ru_kpp',
  sa_vat: 'sa_vat',
  sg_gst: 'sg_gst',
  sg_uen: 'sg_uen',
  si_tin: 'si_tin',
  th_vat: 'th_vat',
  tw_vat: 'tw_vat',
  ua_vat: 'ua_vat',
  us_ein: 'us_ein',
  za_vat: 'za_vat',
  unknown: 'unknown',
};

export const VatIDTypeEnum = Object.values(schema);
