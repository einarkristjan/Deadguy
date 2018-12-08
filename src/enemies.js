class DG_Enemy_Eye extends EJ_Entity {
    constructor(x, y, rot, parent) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 6,
            height: 6,
            tileX: 1031,
            tileY: 1124
        });

        this.__sprite.setParent(parent);
    }
}

class DG_Enemy_Shadow extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 232,
            height: 45,
            tileX: 1314,
            tileY: 1702,
            offsetX: 116,
            offsetY: 5,
            sorting: 4
        });
    }
}

class DG_Enemy extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let that = this;
        this._player = DG_Players.get_player();
        this._radius = 16;
        this._move_speed = 400;
        this._fall_time = 0;
        this._look_at = new EJ_Vec2(0, 0);
        this._bloodpool = null;
        this._state = DG_Enemies._state._hunting;

        this.init_physics({
            type: EJ._dynamic,
            linearDamping: 10,
            angularDamping: 10,
            fixedRotation: true,
            allowSleep: false
        });
        this.init_circle_collider(this._radius, { density: 80 });
        this.init_sprite('spritesheet', {
            width: 22,
            height: 42,
            tileX: 1026,
            tileY: 1073,
            offsetX: -4,
            sorting: 5
        });

        // eyes
        this._eye_left = new DG_Enemy_Eye(0, -3, rot, this.__sprite);
        this._eye_right = new DG_Enemy_Eye(0, 3, rot, this.__sprite);

        this._shadow = new DG_Enemy_Shadow(x, y, rot);

        this.__physics.begin_contact = function(otherEnt) {
            if(that._is_dead) {
                return;
            }

            if(otherEnt instanceof DG_Bullet) {
                that._state = DG_Enemies._state._hit;
                that._fall_time = EJ_Time._now + 200;
                that._destroy_time = EJ_Time._now + 30000;
                that.__physics.apply_impulse(-that._look_at._x * 100, -that._look_at._y * 100);

                if(otherEnt._player_id === DG_Players.get_player()._player_id) {
                    DG_Game._ui_score._text.text++;
                    that._player._score++;
                }

                let rand = Math.floor(EJ.get_random(1, 4));
                EJ_Audio.play("bloodhit" + rand);
            }
        };

        this.init_script(this._update.bind(this));
    }

    _clear() {
        if(this._bloodpool) {
            this._bloodpool.destroy();
        }
        if(this._shadow) {
            this._shadow.destroy();
        }
        if(this._eye_left) {
            this._eye_left.destroy();
        }
        if(this._eye_right) {
            this._eye_right.destroy();
        }
        this.destroy();
        delete DG_Enemies._enemies[this.__id];
        DG_Enemies.enemy_count--;
    }

    _update() {
        if(DG_Map.check_destroy_if_distance(this)) {
            this._clear();
            return;
        }

        this._shadow.set_position(this._position._x, this._position._y);
        this._shadow.set_rotation(this._rotation);

        switch(this._state) {
            case DG_Enemies._state._searching:
                // TODO
                break;
            case DG_Enemies._state._hunting:
                this._look_at.set(
                    this._player._position._x - this._position._x,
                    this._player._position._y - this._position._y
                );

                this._look_at.normalize();
                let x = this._look_at._x;
                let y = this._look_at._y;

                if(this._player._state !== DG_Players._state._dead) {
                    this.__physics.apply_force(x * this._move_speed, y * this._move_speed);
                }

                this.set_rotation(Math.atan2(y, x));
                break;
            case DG_Enemies._state._hit:
                if(this._fall_time < EJ_Time._now) {
                    this._state = DG_Enemies._state._dead;
                    this.init_sprite('spritesheet', {
                        width: 71,
                        height: 49,
                        tileX: 1023,
                        tileY: 1139,
                        sorting: 3
                    });

                    this._eye_left.destroy();
                    this._eye_right.destroy();
                    this.__physics.destroy();
                    this._shadow.destroy();

                    this._bloodpool = new DG_Bloodpool(this._position._x, this._position._y, 0.0);
                }
                break;
            case DG_Enemies._state._dead:
                if(this._destroy_time < EJ_Time._now) {
                    this._clear();
                }
                break;
        }
    }
}

class DG_Enemies {
    static start() {
        this._state = {
            _searching: 0,
            _hunting: 1,
            _hit: 2,
            _dead: 3
        };

        this._enemies = {};
        this._spawn_vector = new EJ_Vec2(0, 0);
    }

    static reload() {
        this._player = DG_Players.get_player();

        for(let key in this._enemies) {
            this._enemies[key]._clear();
        }

        this._spawn_start_time = EJ_Time._now + 10000;

        this.enemy_count = 0;
        this._next_spawn_time = 0;
        this._spawn_speed = 5000;
    }

    static update() {
        if(this._spawn_start_time < EJ_Time._now &&
            this.enemy_count < 30 && this._next_spawn_time < EJ_Time._now &&
            this._player._state !== DG_Players._state._dead) {
            let player = DG_Players.get_player();
            this._next_spawn_time = EJ_Time._now + this._spawn_speed;
            this._spawn_speed = this._spawn_speed <= 1000 ? 1000 : this._spawn_speed - 10;

            this._spawn_vector.set(500, 0);
            this._spawn_vector.rotate(EJ.get_random(0, Math.PI * 2));
            this._spawn_vector._x += player._position._x;
            this._spawn_vector._y += player._position._y;

            let enemy = new DG_Enemy(
                this._spawn_vector._x,
                this._spawn_vector._y,
                Math.atan2(-this._spawn_vector._y, -this._spawn_vector._x)
            );

            this._enemies[enemy.__id] = enemy;
            this.enemy_count++;
        }
    }

    static draw() {

    }
}