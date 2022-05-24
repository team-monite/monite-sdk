const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@layout-sider-background': '#F3F3F3',
              '@layout-header-background': '#fff',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
