const ghpages = require('gh-pages');
const config = require('./../config/config.json');

ghpages.publish(
  `out`,
  {
    ...config.deploy,
    src: ['**/*', '.nojekyll']
  },
  () => {
    console.log('Deploy Complete!')
  }
)