class DG_UI_Score extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 100,
            height: 28,
            tileX: 1024,
            tileY: 1866,
            layer: "UI"
        });

        let text_style = new PIXI.TextStyle({
            fontFamily: 'Trebuchet MS',
            fontSize: 17,
            fill: '#fff'
        });

        this._text = new PIXI.Text(0, text_style);
        this.__sprite.addChild(this._text);
        this._text.x = 42;
        this._text.y = -10;
        this._text.anchor.x = 1;
    }
}

class DG_UI_Bullets extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 28,
            height: 28,
            tileX: 1134,
            tileY: 1866,
            layer: "UI"
        });

        let text_style = new PIXI.TextStyle({
            fontFamily: 'Trebuchet MS',
            fontSize: 17,
            fill: '#fff'
        });

        this._text = new PIXI.Text(0, text_style);
        this.__sprite.addChild(this._text);
        this._text.x = 0;
        this._text.y = -10;
        this._text.anchor.x = 0.5;
    }
}

class DG_UI_Bullets_Warning extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 28,
            height: 28,
            tileX: 1172,
            tileY: 1866,
            layer: "UI"
        });
    }
}

class DG_UI_Health extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 45,
            height: 45,
            tileX: 1024,
            tileY: 1904,
            layer: "UI"
        });
    }
}

class DG_UI_Crosshair extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 33,
            height: 33,
            tileX: 1078,
            tileY: 1904,
            layer: "UI"
        });
    }
}

class DG_UI_Position_Indicator extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 30,
            height: 30,
            tileX: 1119,
            tileY: 1906,
            layer: "UI"
        });

    }
}

class DG_UI_Gun extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 55,
            height: 34,
            tileX: 1161,
            tileY: 1904,
            layer: "UI"
        });
    }
}

class DG_UI_Gun_Clip extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 18,
            height: 35,
            tileX: 1227,
            tileY: 1904,
            layer: "UI"
        });
    }
}

class DG_UI_Arrow extends EJ_Entity {
    constructor(x, y, rot) {
        super(x, y, rot);
        this.init_sprite('spritesheet', {
            width: 30,
            height: 30,
            tileX: 1210,
            tileY: 1866,
            layer: "UI"
        });

    }
}