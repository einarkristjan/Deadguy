class DG_FOV extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 906,
            height: 906,
            tileX: 1024,
            tileY: 0,
            offsetX: 30,
            sorting: 10
        });
    }
}

class DG_Bloodpool extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this._scale = 0;
        this._scale_time = 3000;
        this._scale_end = EJ_Time._now + this._scale_time;

        this.init_sprite('spritesheet', {
            width: 50,
            height: 50,
            tileX: 1314,
            tileY: 1643,
            sorting: 2
        });
        this.__sprite.scale.x = this._scale;
        this.__sprite.scale.y = this._scale;

        this.init_script(this._update.bind(this));
    }

    _update() {
        if(this._scale < 1) {
            this._scale = Math.min(1, 1 - ((this._scale_end - EJ_Time._now) / this._scale_time));
            this.__sprite.scale.x = this._scale;
            this.__sprite.scale.y = this._scale;
        }
    }
}

class DG_Street extends EJ_Entity {
    constructor(id, x, y, axis, spawn_enemies) {
        let rot = axis * 90 * Math.PI / 180;
        super(x, y, rot);

        this._id = id;

        this._street_lights = [];
        this._vec2 = new EJ_Vec2(0, 0);

        switch(id){
            case "G":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 0, tileY: 0 });
                this._create_two_street_ligths(x, y, rot, 200, -Math.PI/2);
                this._create_two_street_ligths(x, y, rot, -200, Math.PI/2);
                break;
            case "B":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 512, tileY: 0 });
                this._create_three_street_lights(x, y, rot, -200, Math.PI/2);
                this._create_two_street_ligths(x, y, rot, 200, -Math.PI/2);
                break;
            case "E":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 0, tileY: 512 });

                this._house = new DG_House(x, y, rot + EJ.get_random(-0.02, 0.02));
                this._walls = [];

                this._vec2.set(-154, -220);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallShort(x + this._vec2._x, y + this._vec2._y, rot));

                this._vec2.set(154, -220);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallShort(x + this._vec2._x, y + this._vec2._y, rot));

                this._vec2.set(220, 50);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallLong(x + this._vec2._x, y + this._vec2._y, rot + Math.PI/2));

                this._vec2.set(220, -200);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallShortest(x + this._vec2._x, y + this._vec2._y, rot + Math.PI/2));

                this._vec2.set(-220, -55);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallLong(x + this._vec2._x, y + this._vec2._y, rot + Math.PI/2));

                this._vec2.set(-220, 195);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallShortest(x + this._vec2._x, y + this._vec2._y, rot + Math.PI/2));

                this._vec2.set(-55, 220);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallLong(x + this._vec2._x, y + this._vec2._y, rot));

                this._vec2.set(200, 220);
                this._vec2.rotate(rot);
                this._walls.push(new DG_WallShortest(x + this._vec2._x, y + this._vec2._y, rot));

                break;
            case "F":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 512, tileY: 512 });

                this._create_three_street_lights(x, y, rot, -200, Math.PI/2);

                this._create_corner_street_light(x, y, rot, 200, 210, Math.PI/2 + 2.33);
                this._create_corner_street_light(x, y, rot, -200, 210, Math.PI/2 - 2.33);

                break;
            case "C":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 0, tileY: 1024 });

                this._create_three_street_lights(x, y, rot, 200, -Math.PI/2);
                this._create_three_street_lights(x, y, rot, -200, Math.PI/2);
                break;
            case "D":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 512, tileY: 1024 });

                this._create_corner_street_light(x, y, rot, -200, -210, Math.PI/2 - 0.66);

                this._create_corner_street_light(x, y, rot, 20, 130, Math.PI/2 + 2.6);
                this._create_corner_street_light(x, y, rot, 150, 20, Math.PI/2 + 2.2);

                this._vec2.set(-168, 200);
                this._vec2.rotate(rot);
                let street_light = new DG_StreetLight(
                    x + this._vec2._x,
                    y + this._vec2._y,
                    rot - Math.PI/2 + EJ.get_random(-0.1, 0.1)
                );
                this._street_lights.push(street_light);

                this._vec2.set(200, -168);
                this._vec2.rotate(rot);
                let street_light2 = new DG_StreetLight(
                    x + this._vec2._x,
                    y + this._vec2._y,
                    rot + Math.PI + EJ.get_random(-0.1, 0.1)
                );
                this._street_lights.push(street_light2);

                this._vec2.set(EJ.get_random(200, 250), EJ.get_random(200, 250));
                this._vec2.rotate(rot);

                let box1 = new DG_BoxBig(x + this._vec2._x, y + this._vec2._y, EJ.get_random(0, 2 * Math.PI));
                DG_Map._extras[box1.__id] = box1;

                this._vec2.set(EJ.get_random(200, 250), EJ.get_random(200, 250));
                this._vec2.rotate(rot);

                let box2 = new DG_BoxSmall(x + this._vec2._x, y + this._vec2._y, EJ.get_random(0, 2 * Math.PI));
                DG_Map._extras[box2.__id] = box2;

                break;
            case "A":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 0, tileY: 1536 });
                this._create_corner_street_light(x, y, rot, 200, -210, Math.PI/2 + 0.66);
                this._create_corner_street_light(x, y, rot, 200, 210, -Math.PI/2 - 0.66);
                this._create_corner_street_light(x, y, rot, -200, -210, -Math.PI/2 + 2.33);
                this._create_corner_street_light(x, y, rot, -200, 210, Math.PI/2 - 2.33);
                break;
            case "H":
                this.init_sprite('spritesheet', { width: 502, height: 502, tileX: 512, tileY: 1536 });
                break;
        }
    }

    remove() {
        for(let i = 0; i < this._street_lights.length; i++) {
            this._street_lights[i].destroy();
        }

        if(this._id === "E") {
            this._house.destroy();
            for(let i = 0; i < this._walls.length; i++) {
                this._walls[i].destroy();
            }
        }

        this.destroy();
    }

    _create_corner_street_light(x, y, rot, offset_x, offset_y, rot_offset) {
        this._vec2.set(offset_x, offset_y);
        this._vec2.rotate(rot);
        let street_light4 = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset  + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light4);
    }

    _create_two_street_ligths(x, y, rot, offset_y, rot_offset) {
        this._vec2.set(168, offset_y);
        this._vec2.rotate(rot);
        let street_light4 = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light4);

        this._vec2.set(-168, offset_y);
        this._vec2.rotate(rot);
        let street_light5 = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light5);
    }

    _create_three_street_lights(x, y, rot, offset_y, rot_offset) {
        this._vec2.set(-168, offset_y);
        this._vec2.rotate(rot);
        let street_light = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light);

        this._vec2.set(0, offset_y);
        this._vec2.rotate(rot);
        let street_light2 = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light2);

        this._vec2.set(168, offset_y);
        this._vec2.rotate(rot);
        let street_light3 = new DG_StreetLight(
            x + this._vec2._x,
            y + this._vec2._y,
            rot + rot_offset + EJ.get_random(-0.1, 0.1)
        );
        this._street_lights.push(street_light3);
    }
}

class DG_House extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 280;
        let height = 280;
        this.init_physics({ type: EJ._static });
        this.init_box_collider(width, height);
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1024,
            tileY: 1576,
            sorting: 9
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 8, 5000);
    }
}

class DG_WallLongest extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 490;
        let height = 10;
        this.init_physics({ type: EJ._static });
        this.init_box_collider(width, height);
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1024,
            tileY: 1536,
            sorting: 9
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 8, 5000);
    }
}

class DG_WallLong extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 340;
        let height = 10;
        this.init_physics({ type: EJ._static });
        this.init_box_collider(width, height);
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1024,
            tileY: 1556,
            sorting: 9
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 8, 5000);
    }
}

class DG_WallShort extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 130;
        let height = 10;
        this.init_physics({ type: EJ._static });
        this.init_box_collider(width, height);
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1374,
            tileY: 1556,
            sorting: 9
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 8, 5000);
    }
}

class DG_WallShortest extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        let width = 50;
        let height = 10;
        this.init_physics({ type: EJ._static });
        this.init_box_collider(width, height);
        this.init_sprite('spritesheet', {
            width: width,
            height: height,
            tileX: 1379,
            tileY: 1576,
            sorting: 9
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        DG_Game.draw_shadow(this.__physics.get_shape_points(), 4, 8, 5000);
    }
}

class DG_StreetLight extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this._radius = 11;
        this.init_physics({ type: EJ._static });
        this.init_circle_collider(this._radius);
        this.init_sprite('spritesheet', {
            width: 145,
            height: 26,
            tileX: 1314,
            tileY: 1609,
            offsetX: -58,
            offsetY: 0,
            sorting: 9
        });

        this._points = [new EJ_Vec2(0, 0), new EJ_Vec2(0, 0)];
        this._shadow_pos = new EJ_Vec2(0, 0);

        this.init_script(this._update.bind(this));
    }

    _update() {
        // calculate shadow segment for radius against player
        // vec1 +---------------------+ vec2

        let pos = this._position;
        let player_pos = DG_Players.get_player()._position;
        this._shadow_pos.set(player_pos._x, player_pos._y);

        this._shadow_pos.set(this._shadow_pos._x - pos._x, this._shadow_pos._y - pos._y);
        this._shadow_pos.normalize();
        this._shadow_pos.set(this._shadow_pos._x * this._radius, this._shadow_pos._y * this._radius);

        this._points[0].set(pos._x - this._shadow_pos._y, pos._y + this._shadow_pos._x);
        this._points[1].set(pos._x + this._shadow_pos._y, pos._y - this._shadow_pos._x);

        DG_Game.draw_shadow(this._points, 2, 8, 5000);
    }
}

class DG_BulletHit extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this._life_time = EJ_Time._now + 100;
        this.init_sprite('spritesheet', {
            width: 10,
            height: 10,
            tileX: 1413,
            tileY: 1643,
            sorting: 5
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        if(this._life_time <= EJ_Time._now) {
            this.destroy();
        }
    }
}

class DG_BulletBlood extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this._life_time = EJ_Time._now + 100;
        this.init_sprite('spritesheet', {
            width: 10,
            height: 10,
            tileX: 1374,
            tileY: 1643,
            sorting: 5
        });
        this.init_script(this._update.bind(this));
    }

    _update() {
        if(this._life_time <= EJ_Time._now) {
            this.destroy();
        }
    }
}
