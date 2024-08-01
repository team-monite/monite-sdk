import { components } from '@/api';
import { SUPPORTED_MIME_TYPES } from '@/ui/FileViewer';
import { getRandomItemFromArray } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

type CreateFileParams = { fileId: string };

export enum FileNames {
  file_bird = 'file_bird',
  file_snake = 'file_snake',
  file_dog = 'file_dog',
  file_avatar = 'file_avatar',
  file_avatar2 = 'file_avatar2',
  file_avatar3 = 'file_avatar3',
}

const filePath = `*/files`;
const fileIdPath = `${filePath}/:fileId`;

const fileFixture = (): FileResponse => {
  const mimetype = getRandomItemFromArray(SUPPORTED_MIME_TYPES);
  const isPdf = mimetype === 'application/pdf';

  return {
    id: faker.string.uuid(),
    file_type: 'image',
    name: 'test.png',
    region: 'us-east-1',
    md5: '123456789',
    mimetype,
    url: isPdf
      ? 'https://www.africau.edu/images/default/sample.pdf'
      : faker.image.url(),
    size: 123456,
    s3_bucket: 'test',
    s3_file_path: 'test',
    created_at: '2021-01-01T00:00:00.000Z',
    updated_at: '2021-01-01T00:00:00.000Z',
  };
};

export const filesHandlers = [
  http.post<{}, UploadFile, FileResponse>(filePath, async () => {
    await delay();

    return HttpResponse.json(fileFixture());
  }),

  http.get<CreateFileParams, undefined, FileResponse>(fileIdPath, async () => {
    await delay();

    return HttpResponse.json(fileFixture());
  }),

  http.delete<CreateFileParams, undefined, undefined>(fileIdPath, async () => {
    await delay();

    return HttpResponse.json(fileFixture(), {
      status: 204,
    });
  }),
];

type UploadFile = {
  file: Blob;
  file_type: AllowedFileTypes;
};

type AllowedFileTypes = components['schemas']['AllowedFileTypes'];
type FileResponse = components['schemas']['FileResponse'];
