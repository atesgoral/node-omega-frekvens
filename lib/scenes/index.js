const manifest = require('./manifest.json');

module.exports = manifest
  .filter((entry) => !entry.skip)
  .map((entry) => ({
    ...entry,
    ...require(`./${entry.id}`)
  }));
