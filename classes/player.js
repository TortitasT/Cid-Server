const shortID = require("shortid");
const Vector2 = require("./vector2.js");
const Character = require("./character.js");

module.exports = class Player {
  constructor(player) {
    this.id = player.id;
    this.character = new Character(player.character);
    this.pos = player.pos;
  }
};
