class EJ {
    static init(options) {
        options = options || {};
        this._options = {
            canvas: options.canvas || document.createElement("canvas"),
            width: options.width || 1920,
            height: options.height || 1080,
            layers: options.layers || {
                scene: {
                    sortingCount: 1
                },
                UI: {
                    sortingCount: 1
                }
            },
            sounds: options.sounds || {},
            textures: options.textures || {},
            gravity: options.gravity || {x: 0, y: 10 },
            start: options.start || function() {},
            update: options.update || function() {},
            draw: options.draw || function() {}
        };

        this._view = this._options.canvas;
        this._layers = {};

        this._center = {
            _x: this._options.width * 0.5,
            _y: this._options.height * 0.5
        };

        this._pixiApp = new PIXI.Application({
            view: this._options.canvas,
            width: this._options.width,
            height: this._options.height,
            autoStart: false,
            sharedTicker: false,
            roundPixels: false
        });

        if(!options.canvas) {
            document.body.appendChild(this._pixiApp.view);
        }

        this._preload();
    }

    static _preload() {
        let that = this;
        let sounds_loaded = 0;
        let sounds_count = Object.keys(this._options.sounds).length;

        EJ_Layers.init();
        EJ_Console.init();
        EJ_Audio.init();

        new EJ_Console_Text('Loading...', '');
        this._pixiApp.renderer.render(this._pixiApp.stage);

        // start loading Box2D
        Box2D().then((_Box2D) => {
            // init & overwrite namespace
            Box2D = _Box2D;

            that._done_loading_physics = true;
            that._check_if_loaded();
        });

        if(Object.keys(this._options.textures).length) {
            for(let key in this._options.textures) {
                PIXI.loader.add(key, this._options.textures[key]);
            }

            PIXI.loader.load(); // start loading

            PIXI.loader.onComplete.add((loader, textures) => {
                that._textures = textures;
                that._done_loading_textures = true;
                that._check_if_loaded();
            });
        }
        else {
            that._done_loading_textures = true;
        }

        if(sounds_count) {
            for(let key in this._options.sounds) {
                let sound = document.createElement('audio');
                sound.src = this._options.sounds[key];
                sound.preload = 'auto';
                sound.load();
                sound.addEventListener('canplaythrough', function() {
                    sounds_loaded++;
                    if(sounds_loaded === sounds_count) {
                        that._done_loading_sounds = true;
                        that._check_if_loaded();
                    }
                });
                EJ_Audio._sounds[key] = sound;
            }
        }
        else {
            that._done_loading_sounds = true;
        }
    }

    static _check_if_loaded() {
        if(this._done_loading_textures && this._done_loading_physics && this._done_loading_sounds) {
            this._start();
        }
    }

    static _start() {
        this._debug = window.location.href.indexOf("debug=true") > -1;

        // shortcuts
        this._static = Box2D.b2_staticBody;
        this._dynamic = Box2D.b2_dynamicBody;
        this._kinematic = Box2D.b2_kinematicBody;

        EJ_Camera.init();
        EJ_Entities.init();
        EJ_Input.init();

        EJ_Console.clear();

        if(!PIXI.utils.isWebGLSupported()){
            new EJ_Console_Text("Warning: WebGL off!");
        }

        if(this._debug) {
            EJ_Debug.init();
        }

        EJ_Time.init();

        // start game
        this._options.start();
        EJ_Loop.init(
            this._update.bind(this),
            this._draw.bind(this)
        );
    }

    static _update() {
        EJ_Layers.update();
        EJ_Entities.update();
        this._options.update();
        EJ_Camera.update();

        if(this._debug) {
            EJ_Debug.update();
        }
    }

    static _draw() {
        this._pixiApp.renderer.render(this._pixiApp.stage);
        this._options.draw();

        if(this._debug) {
            EJ_Debug.draw();
        }
    }

    // min: inclusive, max: exclusive
    static get_random(min, max) {
        return Math.random() * (max - min) + min;
    }
}