class EJ_Audio {
    static init() {
        this._sounds = {};
    }

    static play(name, oncomplete_callback) {
        this._sounds[name].currentTime = 0;
        this._sounds[name].play();

        if(oncomplete_callback) {
            oncomplete_callback();
        }
    }

    static stop(name) {
        this._sounds[name].currentTime = 0;
        this._sounds[name].pause();
    }
}