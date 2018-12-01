class DG_Intro extends EJ_Entity {
    constructor() {
        super(0, 0, 0);
        this._fadeout_started = false;

        this._scale_time = 1000;
        this._scale_end = 0;

        this._entities = [];

        this._entities.push(new DG_Intro_Background());

        this._entities.push(new DG_Intro_Logo_Eyes(1, EJ._center._x + 107, EJ._center._y - 108, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(2, EJ._center._x - 55, EJ._center._y + 55, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(3, EJ._center._x - 87, EJ._center._y - 91, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(4, EJ._center._x + 78, EJ._center._y + 80, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(5, EJ._center._x + 37, EJ._center._y - 61, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(6, EJ._center._x - 50, EJ._center._y - 44, 0));
        this._entities.push(new DG_Intro_Logo_Eyes(7, EJ._center._x - 10, EJ._center._y + 98, 0));

        this._entities.push(new DG_Intro_Logo_Text(EJ._center._x - 2, EJ._center._y + 4, 0));

        let text_style = new PIXI.TextStyle({
            fontFamily: 'Trebuchet MS',
            fontSize: 17,
            fill: '#ccc'
        });

        this._text = new PIXI.Text(0, text_style);
        EJ._layers['intro'].children[0].addChild(this._text);
        this._text.x = EJ._options.width - 36;
        this._text.y = EJ._options.height - 32;
        this._text.anchor.x = 1.0;
        this._text.anchor.y = 1.0;
        this._text.text = DG_Game._version;

        this._input_count = 0;

        this.init_script(this._update.bind(this));
    }

    _update() {
        if(this._input_count <= 1 && (EJ_Input._key["Enter"] || EJ_Input._mouse._button[0] || EJ_Input._touch_down)) {
            this._input_count = 1;
        }
        else if(this._input_count === 1) {
            this._input_count = 2;
        }
        else if(this._input_count === 2) {
            DG_Game.load_scene();
            this._input_count = 3;
        }

        if(this._input_count !== 3) {
            return;
        }

        let layer = EJ._layers['intro'].children[0];

        if(!this._scale_end && layer.alpha >= 1) {
            this._scale_end = EJ_Time._now + this._scale_time;
        }

        layer.alpha = (this._scale_end - EJ_Time._now) / this._scale_time;

        if(layer.alpha <= 0) {
            for(let i = 0; i < this._entities.length; i++) {
                this._entities[i].destroy();
            }

            this._text.parent.removeChild(this._text);

            this.destroy();
        }
    }
}

class DG_Intro_Background extends EJ_Entity {
    constructor() {
        super(EJ._center._x, EJ._center._y, 0);
        this.init_sprite('spritesheet', {
            width: 22,
            height: 22,
            tileX: 1137,
            tileY: 1869,
            layer: "intro"
        });

        this.__sprite.scale.x = 30;
        this.__sprite.scale.y = 30;
    }
}

class DG_Intro_Logo_Text extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 218,
            height: 49,
            tileX: 1024,
            tileY: 1959,
            layer: "intro"
        });
    }
}

class DG_Intro_Logo_Eyes extends EJ_Entity {
    constructor(id, x, y, rot) {
        super(x, y, rot);

        switch(id) {
            case 1:
                this.init_sprite('spritesheet', {
                    width: 34,
                    height: 25,
                    tileX: 1028,
                    tileY: 2015,
                    layer: "intro"
                });
                break;
            case 2:
                this.init_sprite('spritesheet', {
                    width: 35,
                    height: 26,
                    tileX: 1066,
                    tileY: 2015,
                    layer: "intro"
                });
                break;
            case 3:
                this.init_sprite('spritesheet', {
                    width: 33,
                    height: 27,
                    tileX: 1106,
                    tileY: 2015,
                    layer: "intro"
                });
                break;
            case 4:
                this.init_sprite('spritesheet', {
                    width: 33,
                    height: 30,
                    tileX: 1143,
                    tileY: 2015,
                    layer: "intro"
                });
                break;
            case 5:
                this.init_sprite('spritesheet', {
                    width: 32,
                    height: 28,
                    tileX: 1179,
                    tileY: 2015,
                    layer: "intro"
                });
                break;
            case 6:
                this.init_sprite('spritesheet', {
                    width: 42,
                    height: 37,
                    tileX: 1216,
                    tileY: 2009,
                    layer: "intro"
                });
                break;
            case 7:
                this.init_sprite('spritesheet', {
                    width: 44,
                    height: 36,
                    tileX: 1262,
                    tileY: 2009,
                    layer: "intro"
                });
                break;
        }

        this.init_script(this._update.bind(this));
    }

    _update() {

    }
}