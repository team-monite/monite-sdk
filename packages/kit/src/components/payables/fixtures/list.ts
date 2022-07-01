import {
  CurrencyEnum,
  PayableOriginEnum,
  PayableResponseSchema,
  PayableStateEnum,
  SourceOfPayableDataEnum,
} from '@monite/js-sdk';

const data: PayableResponseSchema[] = [
  {
    id: 'eca6c85b-0a45-4164-a1dd-82f0b05ff7a9',
    entity_id: 'd219e7ce-862e-4113-8306-644360c8dfaa',
    status: PayableStateEnum.NEW,
    source_of_payable_data: SourceOfPayableDataEnum.OCR,
    currency: CurrencyEnum.EUR,
    amount: 117,
    description: undefined,
    due_date: '2019-05-15',
    issued_at: '2019-05-15',
    counterpart_bank_id: undefined,
    counterpart_id: undefined,
    counterpart_account_id: undefined,
    counterpart_name: 'Agorapulse',
    payable_origin: PayableOriginEnum.UPLOAD,
    was_created_by_user_id: undefined,
    was_created_by_external_user_name: undefined,
    was_created_by_external_user_id: undefined,
    currency_exchange: undefined,
    file: {
      id: '9a64a1e9-cafe-456c-a835-73a612006e8f',
      created_at: '2022-06-23T20:13:27.215449+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/9a64a1e9-cafe-456c-a835-73a612006e8f/7d2bd7f5-2822-45e0-bd1c-1b7b936e8ca7.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'af037b74-ccf9-4944-9a98-f05efd6e0853',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/b1f972c1-8057-4efa-bb0b-4c9d4fdec217/a0269ea9-8502-417e-9d7a-b91fd2fc3160.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-06-28T15:52:06.303646+00:00',
    updated_at: '2022-06-28T15:52:06.303655+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: undefined,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: undefined,
          },
          value: {
            text: 'EUR',
            confidence: 100.0,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: undefined,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: undefined,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 117,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: undefined,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: undefined,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: undefined,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: undefined,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: undefined,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: undefined,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 18,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: undefined,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: undefined,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: undefined,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: undefined,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'item',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'quantity',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 117,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: undefined,
          },
          value: {
            text: 'EUR',
            confidence: 100.0,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: undefined,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: undefined,
          },
        },
      ],
    },
    applied_policy: undefined,
  },
  {
    id: '745c890f-a251-47e2-81ca-f7decc2beff7',
    entity_id: 'd219e7ce-862e-4113-8306-644360c8dfaa',
    status: PayableStateEnum.WAITING_TO_BE_PAID,
    source_of_payable_data: SourceOfPayableDataEnum.USER_SPECIFIED,
    currency: CurrencyEnum.EUR,
    amount: 11781,
    description: undefined,
    due_date: '2019-06-15',
    issued_at: '2019-05-15',
    counterpart_bank_id: undefined,
    counterpart_id: undefined,
    counterpart_account_id: undefined,
    counterpart_name: 'Agorapulse',
    payable_origin: PayableOriginEnum.UPLOAD,
    was_created_by_user_id: '25f1f8a7-b1af-45a7-93f9-2c90d6b23686',
    was_created_by_external_user_name: undefined,
    was_created_by_external_user_id: undefined,
    currency_exchange: undefined,
    file: {
      id: '9a64a1e9-cafe-456c-a835-73a612006e8f',
      created_at: '2022-06-23T20:13:27.215449+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/9a64a1e9-cafe-456c-a835-73a612006e8f/7d2bd7f5-2822-45e0-bd1c-1b7b936e8ca7.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'af037b74-ccf9-4944-9a98-f05efd6e0853',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/b1f972c1-8057-4efa-bb0b-4c9d4fdec217/a0269ea9-8502-417e-9d7a-b91fd2fc3160.png',
        },
      ],
    },
    tags: [],
    created_at: '2022-06-28T15:57:25.698604+00:00',
    updated_at: '2022-06-28T15:57:25.698613+00:00',
    other_extracted_data: undefined,
    applied_policy: 'Events',
  },
  {
    id: '75c84dd2-433b-4780-a22d-1624e968c619',
    entity_id: 'd219e7ce-862e-4113-8306-644360c8dfaa',
    status: PayableStateEnum.REJECTED,
    source_of_payable_data: SourceOfPayableDataEnum.OCR,
    currency: CurrencyEnum.EUR,
    amount: 117,
    description: undefined,
    due_date: '2019-05-15',
    issued_at: '2019-05-15',
    counterpart_bank_id: undefined,
    counterpart_id: undefined,
    counterpart_account_id: undefined,
    counterpart_name: 'Agorapulse',
    payable_origin: PayableOriginEnum.UPLOAD,
    was_created_by_user_id: '25f1f8a7-b1af-45a7-93f9-2c90d6b23686',
    was_created_by_external_user_name: undefined,
    was_created_by_external_user_id: undefined,
    currency_exchange: undefined,
    file: {
      id: '9a64a1e9-cafe-456c-a835-73a612006e8f',
      created_at: '2022-06-23T20:13:27.215449+00:00',
      file_type: 'payables',
      name: 'upload',
      region: 'eu-central-1',
      md5: '81fef36c95545d32a62ea9c1f5e57f68',
      mimetype: 'application/pdf',
      url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/9a64a1e9-cafe-456c-a835-73a612006e8f/7d2bd7f5-2822-45e0-bd1c-1b7b936e8ca7.pdf',
      size: 94997,
      previews: [],
      pages: [
        {
          id: 'af037b74-ccf9-4944-9a98-f05efd6e0853',
          mimetype: 'image/png',
          size: 379409,
          number: 0,
          url: 'https://monite-payables-eu-central-1-develop.s3.amazonaws.com/b1f972c1-8057-4efa-bb0b-4c9d4fdec217/a0269ea9-8502-417e-9d7a-b91fd2fc3160.png',
        },
      ],
    },
    tags: undefined,
    created_at: '2022-06-28T16:51:41.149350+00:00',
    updated_at: '2022-06-28T16:51:41.149359+00:00',
    other_extracted_data: {
      summary: [
        {
          label: {
            text: 'vendor_name',
            confidence: 99.94140625,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse',
            confidence: 99.85847473144531,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'amount_due',
            confidence: 93.99242401123047,
            processed_text: undefined,
          },
          value: {
            text: '€0.00',
            confidence: 93.92412567138672,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: undefined,
          },
          value: {
            text: 'EUR',
            confidence: 100.0,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'paid',
            confidence: 38.474143981933594,
            processed_text: undefined,
          },
          value: {
            text: 'on 15 May 2019',
            confidence: 38.481632232666016,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'qty',
            confidence: 44.491024017333984,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: 'billing@agorapulse.com',
            confidence: 44.48389434814453,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 43.49162292480469,
            processed_text: undefined,
          },
          value: {
            text: '19.00%',
            confidence: 43.46201705932617,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.88420867919922,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 99.85221099853516,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 42.99454116821289,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 42.974586486816406,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'total',
            confidence: 99.77241516113281,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 99.52468872070312,
            processed_text: 117,
          },
        },
        {
          label: {
            text: 'siret',
            confidence: 42.33837890625,
            processed_text: undefined,
          },
          value: {
            text: '43232296400060',
            confidence: 42.35505294799805,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'description',
            confidence: 40.4956169128418,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 38.882476806640625,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'payments',
            confidence: 37.98452377319336,
            processed_text: undefined,
          },
          value: {
            text: '15 May 2019',
            confidence: 37.219764709472656,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'rcs_paris',
            confidence: 35.96524429321289,
            processed_text: undefined,
          },
          value: {
            text: '43232296400052',
            confidence: 35.85190963745117,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'date',
            confidence: 31.997758865356445,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 31.606220245361328,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'all_amounts_in_euros',
            confidence: 28.993120193481445,
            processed_text: undefined,
          },
          value: {
            text: '(EUR)',
            confidence: 28.988882064819336,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'eur',
            confidence: 21.490055084228516,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 21.477813720703125,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'receiver_address',
            confidence: 99.92192840576172,
            processed_text: undefined,
          },
          value: {
            text: 'Ivan Maryasin Penta Fintech Ltd. Hardenbergstraße 32 Berlin 10623 Germany',
            confidence: 99.66654205322266,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'invoice_receipt_date',
            confidence: 99.12384796142578,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: 'DE3398',
            confidence: 99.9661636352539,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'payment_terms',
            confidence: 99.93232727050781,
            processed_text: undefined,
          },
          value: {
            text: 'On-Receipt',
            confidence: 99.06175994873047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'due_date',
            confidence: 99.51178741455078,
            processed_text: undefined,
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
            processed_text: undefined,
          },
          value: {
            text: '€18.81',
            confidence: 76.26715087890625,
            processed_text: 18,
          },
        },
        {
          label: {
            text: 'tax_payer_id',
            confidence: 98.67991638183594,
            processed_text: undefined,
          },
          value: {
            text: 'FR43432322964',
            confidence: 98.65225219726562,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'agorapulse',
            confidence: 99.5265121459961,
            processed_text: undefined,
          },
          value: {
            text: '132 Rue de Rivoli Paris 75001 France Phone: +33 1 44 61 18 48 Email: billing@agorapulse.com VAT #: FR43432322964',
            confidence: 98.94965362548828,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'phone',
            confidence: 87.97938537597656,
            processed_text: undefined,
          },
          value: {
            text: '+33 1 44 61 18 48',
            confidence: 87.56417846679688,
            processed_text: undefined,
          },
        },
      ],
      line_items: [
        {
          label: {
            text: 'date',
            confidence: 99.7780990600586,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019',
            confidence: 98.75414276123047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'item',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: 'Agorapulse-Medium-99',
            confidence: 95.99124908447266,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'quantity',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: '1',
            confidence: 99.74884033203125,
            processed_text: 1,
          },
        },
        {
          label: {
            text: 'price',
            confidence: 70.0,
            processed_text: undefined,
          },
          value: {
            text: '€117.81',
            confidence: 99.79421997070312,
            processed_text: 117,
          },
        },
        {
          label: {
            text: 'currency',
            confidence: 100.0,
            processed_text: undefined,
          },
          value: {
            text: 'EUR',
            confidence: 100.0,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'subtotal',
            confidence: 99.77070617675781,
            processed_text: undefined,
          },
          value: {
            text: '€99.00',
            confidence: 99.96166229248047,
            processed_text: 99,
          },
        },
        {
          label: {
            text: 'tax',
            confidence: 99.765869140625,
            processed_text: undefined,
          },
          value: {
            text: '19.00%',
            confidence: 99.89720916748047,
            processed_text: undefined,
          },
        },
        {
          label: {
            text: 'expense_row',
            confidence: 99.98451232910156,
            processed_text: undefined,
          },
          value: {
            text: '15 May - 15 Jun 2019 Agorapulse-Medium-99 1 €99.00 €99.00 19.00% €117.81',
            confidence: 98.98133087158203,
            processed_text: undefined,
          },
        },
      ],
    },
    applied_policy: 'Business trips',
  },
];

export default data;
