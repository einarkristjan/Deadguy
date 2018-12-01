class EJ_Loop {
    static init(updateFn, renderFn) {
        this._updateFn = updateFn;
        this._renderFn = renderFn;
        this._last_time = performance.now();

        setInterval(this._frame.bind(this), 0);
        this._draw = this._draw.bind(this);
        this._draw();
    }

    static _frame() {
        EJ_Time._now = performance.now();
        EJ_Time._delta_time = (EJ_Time._now - this._last_time) * 0.001;
        this._last_time = EJ_Time._now;
        this._updateFn();
    }

    static _draw() {
        requestAnimationFrame(this._draw);
        this._renderFn();
        EJ_Time._draw_count++;
    }
}
