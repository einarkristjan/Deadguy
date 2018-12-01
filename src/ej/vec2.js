class EJ_Vec2 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    normalize() {
        let distance = this.length();
        this._x = this._x / distance;
        this._y = this._y / distance;
    }

    length() {
         return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    set(x, y) {
        this._x = x;
        this._y = y;
    }

    rotate(radians) {
        let ca = Math.cos(radians);
        let sa = Math.sin(radians);
        let nx = ca * this._x - sa * this._y;
        let ny = sa * this._x + ca * this._y;
        this._x = nx;
        this._y = ny;
    }
}
