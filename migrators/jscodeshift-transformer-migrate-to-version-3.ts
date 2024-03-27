import type { FileInfo, API, Options } from 'jscodeshift';

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@team-monite/ui-widgets-react',
      },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      node.source = j.literal('@monite/sdk-react');
      return node;
    });

  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@team-monite/sdk-api',
      },
    })
    .replaceWith((nodePath) => {
      const { node } = nodePath;
      node.source = j.literal('@monite/sdk-api');
      return node;
    });

  return root.toSource();
}
