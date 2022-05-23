
const { updateCommands } = require('./deploy-commands.js');
const { exitHandler } = require('./exit.js');
const { playHandler } = require('./play.js');
const { stopHandler } = require('./stop.js');
const { searchHandler } = require('./search.js');

module.exports = {
  updateCommands,
  exitHandler,
  playHandler,
  stopHandler,
  searchHandler,
};