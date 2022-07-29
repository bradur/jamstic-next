const ghpages = require('gh-pages');
const config = require('./../config/config.json');

ghpages.publish(
  `__sapper__/export/${config.repository}`,
  config.deploy,
  () => {
    console.log('Deploy Complete!')
  }
)