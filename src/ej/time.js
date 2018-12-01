class EJ_Time {
    static init() {
        this._now = performance.now();
        this._delta_time = 0;
        this._start_time = performance.now();
        this._draw_count = 0;
    }
}
