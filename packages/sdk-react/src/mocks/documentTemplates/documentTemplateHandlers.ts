import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { generateDocumentTemplateList } from './documentTemplatesFixtures';

const documentTemplatePath = '*/document_templates';

export const documentTemplateList = { data: generateDocumentTemplateList() };

export const documentTemplateHandlers = [
  http.get<{}, undefined, components['schemas']['TemplateListResponse']>(
    documentTemplatePath,
    () => HttpResponse.json(documentTemplateList)
  ),

  http.post<
    { id: components['schemas']['TemplateReceivableResponse']['id'] },
    undefined,
    undefined
  >(`${documentTemplatePath}/:id/make_default`, async ({ params }) => {
    await delay();

    documentTemplateList.data = documentTemplateList.data.map((template) => ({
      ...template,
      is_default: template.id === params.id,
    }));

    return HttpResponse.json(undefined, {
      status: 200,
    });
  }),

  http.get<
    { id: components['schemas']['TemplateReceivableResponse']['id'] },
    undefined,
    undefined
  >(`${documentTemplatePath}/:id/preview`, async () => {
    await delay();

    const buffer = await fetch(`/static/images/1`).then((response) =>
      response.arrayBuffer()
    );

    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  }),
];
