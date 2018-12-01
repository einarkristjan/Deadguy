class EJ_Input {
    static init() {
        let that = this;
        this._key = {};
        this._mouse = {
            _position: { _x: 0, _y: 0 },
            _button: {}
        };
        this._touch_down = false;

        EJ._options.canvas.addEventListener("mousemove", function(e) {
            that._mouse._position._x = e.offsetX;
            that._mouse._position._y = e.offsetY;
        });

        document.addEventListener("keydown", function(e) {
            that._key[e.code] = true;
        });

        document.addEventListener("keyup", function(e) {
            that._key[e.code] = false;
        });

        document.addEventListener("mousedown", function(e) {
            that._mouse._button[e.button] = true;
        });

        document.addEventListener("mouseup", function(e) {
            that._mouse._button[e.button] = false;
        });

        EJ._options.canvas.addEventListener("touchstart", function(e){
            let last_touch = e.changedTouches[e.changedTouches.length-1];
            that._mouse._position._x = last_touch.layerX - e.target.offsetLeft;
            that._mouse._position._y = last_touch.layerY - e.target.offsetTop;

            that._touch_down = true;
        });

        EJ._options.canvas.addEventListener("touchmove", function(e){
            let last_touch = e.changedTouches[e.changedTouches.length-1];
            that._mouse._position._x = last_touch.layerX - e.target.offsetLeft;
            that._mouse._position._y = last_touch.layerY - e.target.offsetTop;
        });

        EJ._options.canvas.addEventListener("touchend", function(e){
            that._touch_down = false;
        });
    }
}
