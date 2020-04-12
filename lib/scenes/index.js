const manifest = require('./manifest.json');

exports.scenes = manifest.map((entry) => ({
  ...entry,
  ...require(`./${entry.id}`)
}));
