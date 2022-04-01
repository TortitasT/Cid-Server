module.exports = class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static distance(v1, v2) {
    return Vector2.substract(v1, v2).magnitude();
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }
  static substract(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }
};
