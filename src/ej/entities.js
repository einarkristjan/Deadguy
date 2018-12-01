class EJ_Entities {
    static init() {
        let that = this;
        this._uid = 1;
        this._b2Scale = 60;
        this._entities = {};
        this._inactives = {};
        this._entity_count = 0;
        this._destroy_keys = [];
        this._destroy_physics_keys = [];
        this._world = new Box2D.b2World(new Box2D.b2Vec2(EJ._options.gravity.x, EJ._options.gravity.y));

        let listener = new Box2D.JSContactListener();
        listener.BeginContact = function(contactPtr) {
            that._contact.call(that, contactPtr, "begin_contact", true);
        };
        listener.EndContact = function(contactPtr) {
            that._contact.call(that, contactPtr, "end_contact", false);
        };
        listener.PreSolve = function(contactPtr) {
            that._contact.call(that, contactPtr, "pre_solve", true);
        };
        listener.PostSolve = function(contactPtr) {
            that._contact.call(that, contactPtr, "post_solve", true);
        };
        this._world.SetContactListener(listener);
    }

    static update() {
        this._world.Step(EJ_Time._delta_time, 1, 1);
        let destroy_count = 0;
        let destroy_physics_count = 0;

        for(let key in this._entities) {
            let ent = this._entities[key];

            if(ent.__destroy) {
                this._destroy_keys[destroy_count] = key;
                destroy_count++;
            }

            if(ent.__physics){
                if(ent.__physics._marked_to_destroy) {
                    this._destroy_physics_keys[destroy_physics_count] = key;
                    destroy_physics_count++;
                }
                else {
                    let body = ent.__physics._body;
                    if(body.GetType() === EJ._dynamic && body.IsAwake()) {
                        let pos = body.GetPosition();
                        ent.set_position(pos.get_x() * this._b2Scale, pos.get_y() * this._b2Scale);
                        if(!body.IsFixedRotation()) {
                            ent.set_rotation(body.GetAngle());
                        }
                    }
                }
            }
        }

        for(let key in this._entities) {
            let ent = this._entities[key];
            if(ent.__script) {
                ent.__script();
            }
        }

        for(let i = 0; i < destroy_physics_count; i++) {
            let ent = this._entities[this._destroy_physics_keys[i]];
            this._world.DestroyBody(ent.__physics._body);
            delete ent.__physics;
        }
        for(let i = 0; i < destroy_count; i++) {
            let ent = this._entities[this._destroy_keys[i]];
            if(ent.__sprite && ent.__sprite.parent) {
                ent.__sprite.parent.removeChild(ent.__sprite);
            }
            delete this._entities[this._destroy_keys[i]];
            this._entity_count--;
        }
    }

    static add_entity(entity) {
        let id = this._uid++;
        this._entities[id] = entity;
        this._entity_count++;
        return id;
    }

    static _contact(contactPtr, resolve_func_name, must_touch) {
        let contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
        if(must_touch && !contact.IsTouching()) {
            return;
        }
        let fixtureA = contact.GetFixtureA();
        let fixtureB = contact.GetFixtureB();
        let bodyA = fixtureA.GetBody();
        let bodyB = fixtureB.GetBody();
        let entA = this._entities[bodyA.GetUserData()];
        let entB = this._entities[bodyB.GetUserData()];

        if(entA.__physics[resolve_func_name]) {
            entA.__physics[resolve_func_name](entB);
        }
        if(entB.__physics[resolve_func_name]) {
            entB.__physics[resolve_func_name](entA);
        }
    }
}
