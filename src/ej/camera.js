class EJ_Camera {
    static init() {
        this._center = { _x: 0, _y: 0 };
        this._zoom = 1.0;
    }

    static set_center(x, y) {
        this._center._x = x;
        this._center._y = y;
    }

    static set_zoom(zoom) {
        this._zoom = zoom;
    }

    static update() {
        let layer = EJ._layers.scene.transform;
        layer.position.x = -this._center._x * this._zoom + EJ._center._x;
        layer.position.y = -this._center._y * this._zoom + EJ._center._y;
        layer.scale.x = this._zoom;
        layer.scale.y = this._zoom;
        layer.updateTransform(layer);
    }
}
