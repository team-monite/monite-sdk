import { components } from '@/api';
import { faker } from '@faker-js/faker';

type TemplateReceivableResponse =
  components['schemas']['TemplateReceivableResponse'];

export const generateDocumentTemplate = (): TemplateReceivableResponse => ({
  id: faker.string.uuid(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.past().toISOString(),
  document_type: 'invoice',
  is_default: false,
  language: 'en',
  name: faker.word.noun(),
  template: '',
  template_type: 'source_object',
});

export const generateDocumentTemplateList =
  (): TemplateReceivableResponse[] => {
    const list = [...Array(5)].map(() => generateDocumentTemplate());

    list[0].is_default = true;

    return list;
  };
