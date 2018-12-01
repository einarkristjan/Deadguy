class DG_Player extends EJ_Entity {
    constructor(id, x, y, rot) {
        super(x, y, rot);
        let that = this;
        this._player_id = id;
        this._radius = 16;
        this._state = DG_Players._state._default;
        this._spawn_offset = this._radius + 10;
        this._bullets = 12;
        this._score = 0;
        this._move_speed = 700;
        this._next_shoot_time = EJ_Time._now + 300;
        this._reload_finished_time = 0;
        this._ready_to_retry = 0;
        this.init_physics({
            type: EJ._dynamic,
            linearDamping: 10,
            angularDamping: 10,
            allowSleep: false,
            fixedRotation: true
        });
        this.init_circle_collider(this._radius, { density: 80 });
        this.__physics.begin_contact = function(otherEnt) {
            if(DG_Enemies._spawn_start_time > EJ_Time._now) {
                return;
            }

            if(that._state !== DG_Players._state._dead && otherEnt instanceof DG_Enemy) {
                that._state = DG_Players._state._dead;
                that.__physics.destroy();
                that.init_sprite('spritesheet', {
                    width: 71,
                    height: 50,
                    tileX: 1023,
                    tileY: 1197,
                    sorting: 3
                });

                that._blood_pool = new DG_Bloodpool(that._position._x, that._position._y, 0);

                EJ_Audio.play("death");
                EJ_Audio.stop("reload");

                EJ_Audio.stop("theme_mid");
                EJ_Audio.play("theme_end", function() {
                    EJ_Audio.play("theme_mid");
                });

                let end_text = "";

                if(localStorage) {
                    let stored_score = localStorage.getItem('highscore');
                    let highscore = parseInt(stored_score);

                    if(!stored_score) {
                        localStorage.setItem('highscore', that._score);
                    }
                    else {
                        if (highscore < that._score) {
                            // new high score!
                            localStorage.setItem('highscore', that._score);
                            end_text += "New High Score!\n";
                        }

                        end_text += "Your last Highest Score: " + highscore + "\n";
                    }
                }

                end_text += "Your score this game: " + that._score;

                DG_Players._end_text.text = end_text;

                that._ready_to_retry = EJ_Time._now + 1000;
            }
        };

        this._set_default();

        this.init_script(this._update.bind(this));
    }

    _update() {
        switch(this._state) {
            case DG_Players._state._default:

                break;
            case DG_Players._state._reloading:
                if(this._reload_finished_time < EJ_Time._now) {
                    this._bullets = 12;
                    DG_Game._ui_bullets._text.text = this._bullets;
                    DG_Game._ui_clip.__sprite.visible = true;
                    this._set_default();
                }
                break;
            case DG_Players._state._hit:

                break;
            case DG_Players._state._dead:
                if(this._ready_to_retry < EJ_Time._now &&
                    (EJ_Input._key["Enter"] || EJ_Input._mouse._button[0] || EJ_Input._touch_down)) {
                    DG_Game.reload_scene();
                }
                break;
        }
    }

    _clear() {
        if(this._blood_pool) {
            this._blood_pool.destroy();
        }
        this.destroy()
    }

    _set_default() {
        this._state = DG_Players._state._default;
        this.init_sprite('spritesheet', {
            width: 30,
            height: 29,
            tileX: 1025,
            tileY: 955,
            offsetX: -1,
            offsetY: 0,
            sorting: 6
        });
    }

    _set_reloading() {
        this._state = DG_Players._state._reloading;
        this._reload_finished_time = EJ_Time._now + 2000;
        DG_Game._ui_clip.__sprite.visible = false;
        this.init_sprite('spritesheet', {
            width: 30,
            height: 29,
            tileX: 1025,
            tileY: 1035,
            offsetX: -1,
            offsetY: 0,
            sorting: 6
        });
        EJ_Audio._sounds.reload.play();
    }

    shoot() {
        if(this._next_shoot_time <= EJ_Time._now && this._bullets) {
            this._next_shoot_time = EJ_Time._now + 300;

            let bulletPosX = Math.cos(this._rotation) * this._spawn_offset;
            let bulletPosY = Math.sin(this._rotation) * this._spawn_offset;
            new DG_Bullet(this._player_id, this._position._x + bulletPosX, this._position._y + bulletPosY, this._rotation);

            this._bullets--;
            DG_Game._ui_bullets._text.text = this._bullets;

            if(this._bullets === 0) {
                this._set_reloading();
            }

            EJ_Audio.play("gunshot");
        }
    }
}

class DG_Players {
    static start() {
        this._state = {
            _default: 0,
            _reloading: 1,
            _hit: 2,
            _dead: 3
        };

        this._players = [];

        this._mid_point = new EJ_Vec2(0, 0);
        this._camera_scale = 1;

        EJ_Camera.set_center(320, 240);
        EJ_Camera.set_zoom(this._camera_scale, this._camera_scale);

        this._fov = new DG_FOV(0, 0, 0);

        let text_style = new PIXI.TextStyle({
            fontFamily: 'Trebuchet MS',
            fontSize: 17,
            fill: '#fff',
            align: 'center',
            stroke: '#000',
            strokeThickness: 4
        });

        this._end_text = new PIXI.Text(0, text_style);
        EJ._layers['UI'].children[0].addChild(this._end_text);
        this._end_text.x = EJ._center._x;
        this._end_text.y = EJ._center._y;
        this._end_text.anchor.x = 0.5;
        this._end_text.anchor.y = 0.5;
    }

    static reload() {
        this._end_text.text = "";

        if(this._players[0]) {
            this._players[0]._clear();
        }

        this._players[0] = new DG_Player(0, 0, 0, 0.0);

        // if(this._players[1]) {
            // this._players[1]._clear();
        // }
        // this._players[1] = new DG_Player(0, 250, 250, 3.0);

        DG_Game._ui_score._text.text = this._players[0]._score;
        DG_Game._ui_bullets._text.text = this._players[0]._bullets;
        DG_Game._ui_clip.__sprite.visible = true;

        this._can_shoot = true;
        this._next_shoot_window = -1;
        this._last_touch_down = false;
    }

    static get_player() {
        return this._players[0];
    }

    static update() {
        let player = this.get_player();

        if(player._state === DG_Players._state._dead) {
            return;
        }

        let speed = player._move_speed;

        if(EJ_Input._key["KeyW"]) {
            this._players[0].__physics.apply_force(0, -speed);
        }
        else if(EJ_Input._key["KeyS"]) {
            this._players[0].__physics.apply_force(0, speed);
        }

        if(EJ_Input._key["KeyA"]) {
            this._players[0].__physics.apply_force(-speed, 0);
        }
        else if(EJ_Input._key["KeyD"]) {
            this._players[0].__physics.apply_force(speed, 0);
        }

        this.update_transforms();

        if(EJ_Input._mouse._button["0"] && this._can_shoot) {
            player.shoot();
            this._can_shoot = false;
        }
        else if(!EJ_Input._mouse._button["0"] && !this._can_shoot) {
            this._can_shoot = true;
        }

        // touch
        if(EJ_Input._touch_down && this._next_shoot_window > EJ_Time._now) {
            player.shoot();
            this._next_shoot_window = 0;
        }

        if(EJ_Input._touch_down !== this._last_touch_down) {
            if(!EJ_Input._touch_down) {
                this._next_shoot_window = EJ_Time._now + 200;
            }
            this._last_touch_down = EJ_Input._touch_down;
        }
    }

    static update_transforms() {
        let player = this.get_player();
        let p1pos = player._position;

        this._mid_point.set(p1pos._x, p1pos._y);

        if(this._players.length > 1) {
            let p2pos = this._players[1]._position;
            this._mid_point.set((p1pos._x + p2pos._x) * 0.5, (p1pos._y + p2pos._y) * 0.5);
        }

        this._fov.set_position(p1pos._x, p1pos._y);
        this._fov.set_rotation(player._rotation);

        let mouse_world_x = -((p1pos._x - this._mid_point._x) * this._camera_scale - DG_Game._mouse_x + EJ._center._x);
        let mouse_world_y = -((p1pos._y - this._mid_point._y) * this._camera_scale - DG_Game._mouse_y + EJ._center._y);

        if(this._players.length === 1) {
            this._mid_point.set(this._mid_point._x + mouse_world_x * 0.4, this._mid_point._y + mouse_world_y * 0.4);
        }

        EJ_Camera.set_center(this._mid_point._x, this._mid_point._y);

        // rotate player to mouse
        this._players[0].set_rotation(Math.atan2(mouse_world_y, mouse_world_x));
    }

    static draw() {

    }
}