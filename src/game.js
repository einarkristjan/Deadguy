class DG_Game {
    static init() {
        this._version = "0.7";

        let canvas = document.createElement("canvas");
        let start_width = 640;
        let start_height = 480;
        let canvas_aspect_ratio = start_width / start_height;
        let resize_event;
        let resize_delay = 100;

        this._scene_has_started = false;
        this._player_to_points = [new EJ_Vec2(0, 0), new EJ_Vec2(0, 0), new EJ_Vec2(0, 0), new EJ_Vec2(0, 0)];
        this._scale = 1.0;

        // remove loading indicator
        document.body.removeChild(document.querySelector('pre'));

        document.body.appendChild(canvas);

        function do_resize() {
            let width = window.innerWidth;
            let height = window.innerHeight;
            const window_aspect_ratio = width / height;

            if(canvas_aspect_ratio - window_aspect_ratio > 0) {
                height = width / canvas_aspect_ratio;
            } else {
                width = height * canvas_aspect_ratio;
            }
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";

            this._scale = width / start_width;
        }

        function on_resize() {
            clearTimeout(resize_event);
            resize_event = setTimeout(do_resize.bind(this), resize_delay);
        }

        do_resize.call(this);
        window.addEventListener("resize", on_resize.bind(this));

        // init game library
        EJ.init({
            canvas: canvas,
            width: start_width,
            height: start_height,
            layers: {
                scene: {
                    sortingCount: 12
                },
                UI: {
                    sortingCount: 1
                },
                intro: {
                    sortingCount: 1
                }
            },
            gravity: {
                x: 0,
                y: 0
            },
            textures: {
                spritesheet: "spritesheet.png"
            },
            sounds: {
                theme_start: "audio/dg-theme-start.mp3",
                gunshot:     "audio/gunshot.mp3",
                theme_mid:   "audio/dg-theme-mid.mp3",
                reload:      "audio/reload.mp3",
                bloodhit1:   "audio/bloodhit1.mp3",
                bloodhit2:   "audio/bloodhit2.mp3",
                bloodhit3:   "audio/bloodhit3.mp3",
                death:       "audio/playerDeath.mp3",
                theme_end:   "audio/dg-theme-end.mp3"
            },
            start: this.start.bind(this),
            update: this.update.bind(this),
            draw: this.draw.bind(this)
        });
    }

    static start() {
        EJ_Audio._sounds["theme_mid"].loop = true;

        new DG_Intro();
    }

    static load_scene() {
        let width = EJ._options.width;
        let height = EJ._options.height;

        this._mouse_x = 0;
        this._mouse_y = 0;

        this._crosshair = new DG_UI_Crosshair(50, 50, 0);
        this._ui_bullets = new DG_UI_Bullets(width - 50, height - 40, 0);
        this._ui_gun = new DG_UI_Gun(width - 102, height - 38, 0);
        this._ui_clip = new DG_UI_Gun_Clip(width - 142, height - 38, 0);
        this._ui_score = new DG_UI_Score(80, height - 40, 0);

        // new DG_UI_Bullets_Warning(width - 50, 50, 0);
        // new DG_UI_Health(width - 50, 50, 0);
        // new DG_UI_Position_Indicator(width - 50, 50, 0);

        // new DG_UI_Arrow(EJ._center._x, EJ._center._y, 0);

        DG_Players.start();
        DG_Enemies.start();
        DG_Map.start();

        this.reload_scene();

        this._scene_has_started = true;
    }

    static reload_scene() {
        EJ_Audio.stop("theme_start");
        EJ_Audio.stop("theme_mid");
        EJ_Audio.stop("theme_end");

        EJ_Audio.play("theme_start", function() {
            EJ_Audio.play("theme_mid");
        });

        DG_Players.reload();
        DG_Enemies.reload();
        DG_Map.reload();
    }

    static update() {
        if(!this._scene_has_started) {
            return;
        }

        this._mouse_x = EJ_Input._mouse._position._x / DG_Game._scale;
        this._mouse_y = EJ_Input._mouse._position._y / DG_Game._scale;
        DG_Game._crosshair.set_position(this._mouse_x, this._mouse_y);

        DG_Players.update();
        DG_Enemies.update();
        DG_Map.update();
    }

    static draw() {

    }

    static draw_shadow(shape_points, points_count, layerSorting, shadow_length) {
        let playerPos = DG_Players._players[0]._position;

        for(let i = 0; i < points_count; i++) {
            let vec = this._player_to_points[i];
            let point = shape_points[i];
            vec.set(point._x - playerPos._x, point._y - playerPos._y);
            shadow_length = shadow_length === undefined ? vec.length() : shadow_length;
            vec.normalize();
            vec._x *= shadow_length;
            vec._y *= shadow_length;
        }

        for(let i = 0; i < points_count; i++) {
            let idx1 = i === 0 ? shape_points.length - 1 : i-1;
            let idx2 = i;
            let pp1 = this._player_to_points[idx1];
            let pp2 = this._player_to_points[idx2];
            let p1 = shape_points[idx1];
            let p2 = shape_points[idx2];

            // check which side of the segment player is on
            if(Math.sign((p2._x - p1._x) * pp1._y - (p2._y - p1._y) * pp1._x) < 0) {
                let layer = EJ._layers.scene.children[layerSorting];
                layer.beginFill(0x000000);
                layer.moveTo(p1._x, p1._y);
                layer.lineTo(p2._x, p2._y);
                layer.lineTo(p2._x + pp2._x, p2._y + pp2._y);
                layer.lineTo(p1._x + pp1._x, p1._y + pp1._y);
                layer.endFill();
            }
        }
    }
}