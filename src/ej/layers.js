class EJ_Layers {
    static init() {
        this._console = new PIXI.Graphics();

        for(let key in EJ._options.layers) {
            EJ._layers[key] = new PIXI.Container();
            EJ._pixiApp.stage.addChild(EJ._layers[key]);
            for(let i = 0; i < EJ._options.layers[key].sortingCount; i++) {
                EJ._layers[key].addChild(new PIXI.Graphics());
            }
        }

        EJ._pixiApp.stage.addChild(this._console);
        EJ._layers["console"] = this._console;
    }

    static update() {
        for(let key in EJ._options.layers) {
            for(let i = 0; i < EJ._layers[key].children.length; i++) {
                EJ._layers[key].children[i].clear();
            }
        }

        this._console.clear();
    }
}
