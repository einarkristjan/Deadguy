class DG_Bullet extends EJ_Entity {
    constructor(player_id, x, y, rot) {
        super(x, y, rot);
        let that = this;
        this._life_time = EJ_Time._now + 500;
        this._has_hit = false;
        this._player_id = player_id;

        this.init_physics({
            type: EJ._dynamic,
            linearDamping: 5,
            angularDamping: 5,
            bullet: true
        });

        this.init_circle_collider(2, { density: 100 });
        this.init_sprite('spritesheet', {
            width: 38,
            height: 1,
            tileX: 1378,
            tileY: 1667,
            offsetX: 19,
            sorting: 5
        });

        let rotX = Math.cos(rot);
        let rotY = Math.sin(rot);

        this.__physics.apply_impulse(rotX * 30, rotY * 30);

        this.__physics.begin_contact = function(otherEnt) {
            that.destroy();
        };

        this.__physics.end_contact = function(otherEnt) {
            if(this._has_hit) {
                return;
            }
            let x = that._position._x;
            let y = that._position._y;
            if(otherEnt instanceof DG_Enemy || otherEnt instanceof DG_Player) {
                new DG_BulletBlood(x, y, 0);
            }
            else {
                new DG_BulletHit(x, y, 0);
            }
            this._has_hit = true;
        };

        this.init_script(this._update.bind(this));
    }

    _update() {
        if(EJ_Time._now >= this._life_time) {
            this.destroy();
        }
    }
}

class DG_BoxBig extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this._width = 25;
        this._height = 25;

        this._center = {
            _x: this._width * 0.5,
            _y: this._height * 0.5
        };

        this._index = 0;

        this.init_physics({
            type: EJ._dynamic,
            linearDamping: 10,
            angularDamping: 10
        });
        this.init_box_collider(this._width, this._height, { density: 120 });
        this.init_sprite('spritesheet', {
            width: this._width,
            height: this._height,
            tileX: 1314,
            tileY: 1576,
            sorting: 6
        });

        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 4, 10);

        if(DG_Map.check_destroy_if_distance(this)) {
            this.destroy();
        }
    }
}

class DG_BoxSmall extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 20;
        let height = 20;
        this.init_physics({
            type: EJ._dynamic,
            linearDamping: 10,
            angularDamping: 10
        });
        this.init_box_collider(width, height, { density: 100 });
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1349,
            tileY: 1576,
            sorting: 4
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 4, 5);

        if(DG_Map.check_destroy_if_distance(this)) {
            this.destroy();
        }
    }
}
