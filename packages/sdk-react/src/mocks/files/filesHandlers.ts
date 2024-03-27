import { delay } from '@/mocks/utils';
import { SUPPORTED_MIME_TYPES } from '@/ui/FileViewer';
import { getRandomItemFromArray } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import { ApiError, type FileResponse, type UploadFile } from '@monite/sdk-api';

import { rest } from 'msw';

type CreateFileParams = { fileId: string };

export enum FileNames {
  file_bird = 'file_bird',
  file_snake = 'file_snake',
  file_dog = 'file_dog',
  file_avatar = 'file_avatar',
  file_avatar2 = 'file_avatar2',
  file_avatar3 = 'file_avatar3',
}

const file_bird =
  'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png';
const file_snake = 'https://cdn-icons-png.flaticon.com/512/1303/1303472.png';
const file_dog = 'https://cdn-icons-png.flaticon.com/512/616/616554.png';
const file_avatar =
  'https://spng.pngfind.com/pngs/s/114-1146554_girl-avatar-png-pic-female-avatar-icon-transparent.png';
const file_avatar2 =
  'https://p7.hiclipart.com/preview/980/304/8/computer-icons-user-profile-avatar.jpg';
const file_avatar3 =
  'https://www.pngkit.com/png/detail/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png';

function getFileUrl(fileId: string): string {
  switch (fileId) {
    case FileNames.file_bird:
      return file_bird;
    case FileNames.file_snake:
      return file_snake;
    case FileNames.file_dog:
      return file_dog;
    case FileNames.file_avatar:
      return file_avatar;
    case FileNames.file_avatar2:
      return file_avatar2;
    case FileNames.file_avatar3:
      return file_avatar3;
    default:
      return '';
  }
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
  rest.post<UploadFile, {}, FileResponse | ApiError>(
    filePath,
    async (_, res, ctx) => {
      return res(delay(1500), ctx.status(200), ctx.json(fileFixture()));
    }
  ),

  rest.get<undefined, CreateFileParams, FileResponse>(
    fileIdPath,
    (_, res, ctx) => {
      return res(delay(), ctx.json(fileFixture()));
    }
  ),

  rest.delete<undefined, CreateFileParams, undefined>(
    fileIdPath,
    (_, res, ctx) => {
      return res(delay(), ctx.status(204));
    }
  ),
];
