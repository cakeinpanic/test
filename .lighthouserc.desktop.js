const baseConfig = require('./.lighthouserc.mobile.js');

baseConfig.ci.collect.url = baseConfig.ci.collect.url.map(url => url + '?desktop');
baseConfig.ci.collect.settings.preset = 'desktop'

module.exports = baseConfig
