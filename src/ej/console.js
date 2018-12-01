class EJ_Console_Text {
    constructor(label, value) {
        this._pixi_text_label = new PIXI.Text(label, EJ_Console._text_style);
        EJ_Console._layer.addChild(this._pixi_text_label);
        this._pixi_text_label.x = EJ_Console._txt_pos_x;
        this._pixi_text_label.y = EJ_Console._txt_pos_y + EJ_Console._text_style.fontSize * EJ_Console._line_count;

        this._pixi_text_value = new PIXI.Text(value, EJ_Console._text_style);
        EJ_Console._layer.addChild(this._pixi_text_value);
        this._pixi_text_value.x = label.length * 9.7 + EJ_Console._txt_pos_x;
        this._pixi_text_value.y = EJ_Console._txt_pos_y + EJ_Console._text_style.fontSize * EJ_Console._line_count;

        EJ_Console._line_count++;
        EJ_Console._lines.push(this._pixi_text_label);
        EJ_Console._lines.push(this._pixi_text_value);
    }

    set(value) {
        this._pixi_text_value.text = value;
    }
}

class EJ_Console {
    static init() {
        this._layer = EJ._layers["console"];
        this._line_count = 0;
        this._txt_pos_x = 10;
        this._txt_pos_y = 10;
        this._lines = [];
        this._text_style = new PIXI.TextStyle({
                fontFamily: 'Courier',
                fontSize: 16,
                fill: '#0ff',
                stroke: '#4a1850',
                strokeThickness: 2,
            });
    }

    static clear() {
        this._line_count = 0;
        for(let i = 0; i < this._lines.length; i++) {
            this._layer.removeChild(this._lines[i]);
        }
    }
}