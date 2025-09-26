/* eslint-env node */
/* eslint-disable lingui/no-unlocalized-strings */
/**
 * Custom Jest transform to handle CSS files with @import statements
 *
 * Strips @import statements that Jest can't parse (like font imports).
 * Note: This excludes CSS modules (.module.css) so identity-obj-proxy can handle them.
 */
module.exports = {
  process(_src, filename) {
    if (filename.match(/\.css$/) && !filename.match(/\.module\.css$/)) {
      return { code: 'module.exports = {};' };
    }
    return { code: _src };
  },
};
