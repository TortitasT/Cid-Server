const shortID = require("shortid");

module.exports = class Player {
  constructor(id, character, pos) {
    this.id = id;
    this.character = character;
    this.pos = pos
  }
};
