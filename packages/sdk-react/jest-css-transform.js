/* eslint-env node */
/* eslint-disable lingui/no-unlocalized-strings */
/**
 * Custom Jest transform to handle CSS files
 *
 * Returns empty export for all CSS files to avoid parsing errors.
 * CSS modules are handled by identity-obj-proxy via moduleNameMapper.
 */
module.exports = {
  process(_src, filename) {
    if (filename.match(/\.css$/)) {
      return { code: 'module.exports = {};' };
    }
    return { code: _src };
  },
};
