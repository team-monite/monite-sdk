// @ts-nocheck
import {
  ReceivableResponse,
  CurrencyEnum,
  ReceivablesStatusEnum,
} from '@monite/js-sdk';

const data: ReceivableResponse[] = [
  {
    id: '45587301-9783-4c29-bc16-79cfb2c9cdb8',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:07:22.122690+00:00',
    updated_at: '2022-08-11T12:07:22.122701+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: '959f583c-4e81-4435-ad4d-a1c79e908562',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:12.364013+00:00',
    updated_at: '2022-08-11T12:09:12.364023+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'c29e3714-b5c3-49bd-a11e-49f115554320',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:26.756135+00:00',
    updated_at: '2022-08-11T12:09:26.756145+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'bafd9025-8ca9-4332-a85b-e1648bd021bd',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:28.069841+00:00',
    updated_at: '2022-08-11T12:09:28.069852+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: '2cf71128-27cc-4147-a81f-9837c393c3ae',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:29.446339+00:00',
    updated_at: '2022-08-11T12:09:29.446350+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'e49f6a3d-2aaf-47a6-a0a2-c4aa38845f5e',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:30.944144+00:00',
    updated_at: '2022-08-11T12:09:30.944154+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'c9548248-4977-4331-a52c-bf15f67fc708',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:47.520308+00:00',
    updated_at: '2022-08-11T12:09:47.520319+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: '8cd8d18d-33ae-40d5-8313-1025466abfd3',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:48.773446+00:00',
    updated_at: '2022-08-11T12:09:48.773456+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'ad50849f-b2e9-4c71-88ae-40ba6e690ed8',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:49.947096+00:00',
    updated_at: '2022-08-11T12:09:49.947107+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: 'a8aa7f08-b07c-4324-b100-76c68b97b095',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:51.207433+00:00',
    updated_at: '2022-08-11T12:09:51.207444+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: '05c96c05-43da-4cd6-a5a8-3fe8167aaacb',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:52.515494+00:00',
    updated_at: '2022-08-11T12:09:52.515505+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
  {
    id: '01b79bfa-573f-4b00-924c-7db6c4ff7eda',
    entity_id: '766b0f6f-2eef-4fa6-a72f-15cea3b7b343',
    status: ReceivablesStatusEnum.ACCEPTED,
    source_of_payable_data: 'ocr',
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: null,
    due_date: '2019-05-15',
    payment_terms: undefined,
    suggested_payment_term: null,
    issued_at: '2019-05-15',
    counterpart_bank_id: null,
    counterpart_id: null,
    counterpart_account_id: null,
    counterpart_name: 'Agorapulse',
    payable_origin: 'upload',
    was_created_by_user_id: null,
    was_created_by_external_user_name: null,
    was_created_by_external_user_id: null,
    currency_exchange: null,
    file: {
      id: '618d6197-16d6-4ccc-81bb-a1fccbdc4f8e',
      created_at: '2022-06-28T21:52:17.748638+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/dba6eda1-6dca-4442-ad4e-a4457b1a822c.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'aca462a6-1853-40d1-9b48-cd0ecd55dc5b',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/618d6197-16d6-4ccc-81bb-a1fccbdc4f8e/978815e5-ea5f-4ba8-9cff-4d4419b8c542.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-08-11T12:09:53.623642+00:00',
    updated_at: '2022-08-11T12:09:53.623652+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: null,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: null,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: null,
          },
          value: {
            text: '1',
            confidence: 44.395111083984375,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'email',
            confidence: 44.442378997802734,
            processed_text: null,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: null,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: null,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: null,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: null,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: null,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: null,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.39759826660156,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'invoice_receipt_id',
            confidence: 99.98136901855469,
            processed_text: null,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: null,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: null,
          },
          value: {
            text: '15 May 2019',
            confidence: 98.60009765625,
            processed_text: '2019-05-15T00:00:00',
          },
        },
        {
          label: {
            text: 'de_vat_19%',
            confidence: 76.12174987792969,
            processed_text: null,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 1880,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: null,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: null,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: null,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: null,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: null,
          },
        },
        {
          label: { text: 'item', confidence: 70.0, processed_text: null },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: null,
          },
        },
        {
          label: { text: 'quantity', confidence: 70.0, processed_text: null },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: { text: 'price', confidence: 70.0, processed_text: null },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 11781,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: null,
          },
          value: { text: 'EUR', confidence: 100.0, processed_text: null },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: null,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 9900,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: null,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: null,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: null,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: null,
          },
        },
      ],
    },
    applied_policy: null,
    document_id: 'DE3398',
  },
];

export default data;
