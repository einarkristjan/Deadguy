class EJ_Entity_Physics {
    constructor(bodyDef) {
        this._body = EJ_Entities._world.CreateBody(bodyDef);
        this._shape = null;
        this.begin_contact = null;
        this.end_contact = null;
        this.pre_solve = null;
        this.post_solve = null;
        this._points = [new EJ_Vec2(0, 0), new EJ_Vec2(0, 0), new EJ_Vec2(0, 0), new EJ_Vec2(0, 0)];
        this._tmp_vector = new Box2D.b2Vec2(0, 0);
        this._marked_to_destroy = false;
    }

    set_active(value) {
        this._body.SetActive(value);
    }

    apply_force(x, y) {
        this._tmp_vector.set_x(x);
        this._tmp_vector.set_y(y);
        this._body.ApplyForceToCenter(this._tmp_vector);
    }

    apply_impulse(x, y) {
        this._tmp_vector.set_x(x);
        this._tmp_vector.set_y(y);
        this._body.ApplyLinearImpulse(this._tmp_vector, this._body.GetWorldCenter());
    }

    get_shape_points() {
        for(let i = 0; i < this._shape.GetVertexCount(); i++) {
            let p = this._body.GetWorldPoint(this._shape.GetVertex(i));
            this._points[i].set(p.get_x() * EJ_Entities._b2Scale, p.get_y() * EJ_Entities._b2Scale);
        }
        return this._points;
    }

    destroy() {
        this._marked_to_destroy = true;
    }
}

class EJ_Entity {
    constructor(x, y, rot) {
        this.__id = EJ_Entities.add_entity(this);
        this.__active = true;

        this.__destroy = false;

        this._position = new EJ_Vec2(x, y);
        this._rotation = rot;

        this.__physics = null;
        this.__sprite = null;
        this.__script = null;
    }

    set_active(value) {
        this.__active = value;

        if(this.__physics) {
            this.__physics.set_active(value);
        }

        if(this.__sprite) {
            this.__sprite.visible = value;
        }

        if(this.__active) {
            EJ_Entities._entities[this.__id] = this;
            delete EJ_Entities._inactives[this.__id];
        }
        else {
            EJ_Entities._inactives[this.__id] = this;
            delete EJ_Entities._entities[this.__id];
        }
    }

    set_position(x, y) {
        this._position._x = x;
        this._position._y = y;
        if(this.__sprite) {
            this.__sprite.position.x = this._position._x;
            this.__sprite.position.y = this._position._y;
        }
    }

    set_rotation(rot) {
        this._rotation = rot;
        if(this.__sprite) {
            this.__sprite.rotation = rot;
        }
    }

    init_script(script) {
        this.__script = script;
    }

    init_physics(settings) {
        settings = settings || {};
        settings.type           = settings.type           !== undefined ? settings.type           : EJ._dynamic;
        settings.linearDamping  = settings.linearDamping  !== undefined ? settings.linearDamping  : 0;
        settings.angularDamping = settings.angularDamping !== undefined ? settings.angularDamping : 0;
        settings.allowSleep     = settings.allowSleep     !== undefined ? settings.allowSleep     : true;
        settings.fixedRotation  = settings.fixedRotation  !== undefined ? settings.fixedRotation  : false;
        settings.bullet         = settings.bullet         !== undefined ? settings.bullet         : false;

        let bodyDef = new Box2D.b2BodyDef();

        bodyDef.set_userData(this.__id);
        bodyDef.set_type(settings.type);
        bodyDef.set_position(new Box2D.b2Vec2(
            this._position._x / EJ_Entities._b2Scale,
            this._position._y / EJ_Entities._b2Scale
        ));
        bodyDef.set_angle(this._rotation);
        bodyDef.set_linearDamping(settings.linearDamping);
        bodyDef.set_angularDamping(settings.angularDamping);
        bodyDef.set_allowSleep(settings.allowSleep);
        bodyDef.set_fixedRotation(settings.fixedRotation);
        bodyDef.set_bullet(settings.bullet);

        this.__physics = new EJ_Entity_Physics(bodyDef);
    }

    init_box_collider(width, height, extras) {
        width = width - 1;
        height = height - 1;
        let box_shape = new Box2D.b2PolygonShape();
        box_shape.SetAsBox(width * 0.5 / EJ_Entities._b2Scale, height * 0.5 / EJ_Entities._b2Scale);
        this._create_fixture(box_shape, extras);
    }

    init_circle_collider(radius, extras) {
        let circle_shape = new Box2D.b2CircleShape();
        circle_shape.set_m_radius(radius / EJ_Entities._b2Scale);
        this._create_fixture(circle_shape, extras);
    }

    init_sprite(texture, extras) {
        if(this.__sprite !== null) {
            this.__sprite.parent.removeChild(this.__sprite);
        }

        this.__sprite = new PIXI.extras.TilingSprite(EJ._textures[texture].texture);

        extras = extras !== undefined ? extras : {};
        extras.width   = extras.width   !== undefined ? extras.width   : this.__sprite.width;
        extras.height  = extras.height  !== undefined ? extras.height  : this.__sprite.height;
        extras.tileX   = extras.tileX   !== undefined ? extras.tileX   : 0;
        extras.tileY   = extras.tileY   !== undefined ? extras.tileY   : 0;
        extras.offsetX = extras.offsetX !== undefined ? extras.offsetX : 0;
        extras.offsetY = extras.offsetY !== undefined ? extras.offsetY : 0;
        extras.layer   = extras.layer   !== undefined ? extras.layer   : 'scene';
        extras.sorting = extras.sorting !== undefined ? extras.sorting : 0;

        EJ._layers[extras.layer].children[extras.sorting].addChild(this.__sprite);

        this.__sprite.pivot = new PIXI.Point(extras.offsetX, extras.offsetY);

        this.__sprite.x = this._position._x;
        this.__sprite.y = this._position._y;

        this.__sprite.rotation = this._rotation;

        this.__sprite.width = extras.width;
        this.__sprite.height = extras.height;

        this.__sprite.anchor.x = 0.5;
        this.__sprite.anchor.y = 0.5;

        this.__sprite.tilePosition.x = -extras.tileX;
        this.__sprite.tilePosition.y = -extras.tileY;
    }

    _create_fixture(shape, extras) {
        extras = extras !== undefined ? extras : {};
        extras.density     = extras.density     !== undefined ? extras.density     : 1.0;
        extras.friction    = extras.friction    !== undefined ? extras.friction    : 0.25;
        extras.restitution = extras.restitution !== undefined ? extras.restitution : 0.1;

        let fixtureDef = new Box2D.b2FixtureDef();
        fixtureDef.set_shape(shape);
        fixtureDef.set_density(extras.density);
        fixtureDef.set_friction(extras.friction);
        fixtureDef.set_restitution(extras.restitution);
        this.__physics._body.CreateFixture(fixtureDef);
        this.__physics._shape = shape;
    }

    destroy() {
        if(this.__physics) {
            this.__physics.destroy();
        }
        this.__destroy = true;
        this.__script = null;
    }
}