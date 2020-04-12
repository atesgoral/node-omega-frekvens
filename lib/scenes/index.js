const manifest = require('./manifest.json');

module.exports = manifest.map((entry) => ({
  ...entry,
  ...require(`./${entry.id}`)
}));
