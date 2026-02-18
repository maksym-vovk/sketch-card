const zip = require('zip-local');
const { paths } = require('./settings');

function archive() {
  const currentDate = new Date().toISOString().split('T')[0];
  zip.sync.zip(paths.build.main).compress().save(`${paths.build.main}/sketch-card-${currentDate}.zip`);
  return Promise.resolve("Done!");
}

module.exports = archive;
