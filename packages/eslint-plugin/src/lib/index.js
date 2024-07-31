module.exports = {
  configs: {
    react: require('../config/react'),
    vanilla: require('../config/vanilla'),
    lingui: require('../config/lingui'),
    mui: require('../config/mui'),
    use: require('../config/use'),
  },
  rules: {
    'lingui-require-argument-for-t-function': require('../rules/lingui-require-argument-for-t-function'),
    'mui-require-container-property': require('../rules/mui-require-container-property'),
    'use-boolean-for-enabled': require('../rules/use-boolean-for-enabled'),
  },
};
