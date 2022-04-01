module.exports = class Inventory {
  constructor(inventory) {
    this.items = inventory ? inventory.items : []; // Array of items
    this.equipped = {
      head: inventory ? inventory.equipped.head : {},
      body: inventory ? inventory.equipped.body : {},
      legs: inventory ? inventory.equipped.legs : {},
      feet: inventory ? inventory.equipped.feet : {},
    };
  }
};
