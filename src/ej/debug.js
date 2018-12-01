class EJ_FPS {
    constructor() {
        this._value = 0;
        this._acc = 0;
        this._last_time = performance.now();
    }

    calculate() {
        let now = EJ_Time._now;
        this._acc++;
        if(now - this._last_time >= 1000) {
            this._value = this._acc;
            this._acc = 0;
            this._last_time = now;
        }
    }
}

class EJ_Debug {
    static init() {
        this._ups = new EJ_FPS();
        this._fps = new EJ_FPS();

        this._ups_txt = new EJ_Console_Text("UPS: ", "");
        this._fps_txt = new EJ_Console_Text("FPS: ", "");
        this._entities_count_txt = new EJ_Console_Text("ENT: ", "");
        this._enemy_count_txt = new EJ_Console_Text("ENM: ", "");
        this._slow_updates_txt = new EJ_Console_Text("SLW: ", "");
        this._slow_updates = 0;
        this._min_ms = 1 / 60;

        this._next_time = performance.now() + 1000;
    }

    static update() {
        this._ups.calculate();

        if(EJ_Time._delta_time > this._min_ms) {
            this._slow_updates++;
            this._slow_updates_txt.set(this._slow_updates);
        }

        if(this._next_time <= EJ_Time._now) {
            this._ups_txt.set(this._ups._value);
            this._fps_txt.set(this._fps._value);
            this._entities_count_txt.set(EJ_Entities._entity_count);
            this._enemy_count_txt.set(DG_Enemies.enemy_count);

            this._next_time += 1000;
        }
    }

    static draw() {
        this._fps.calculate();
    }
}