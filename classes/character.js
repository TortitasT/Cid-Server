const Inventory = require("./inventory.js");

module.exports = class Character {
  constructor(character) {
    this.name = character.name,
    this.level = character.level,
    this.levelProgress = character.levelProgress,
    this.inventory = new Inventory(character.inventory);
  }
};
