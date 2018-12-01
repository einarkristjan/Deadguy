class DG_Map {
    static start() {
        this._tile_size = 500;

        this._width = 12;
        this._height = 9;

        this._max_x = this._width  * 10000000;
        this._max_y = this._height * 10000000;

        let map = [
            "D2 B0 B0 F1 E2 E2 E2 C1 E2 E2 E2 C1",
            "D0 E0 E0 F3 B2 B2 B2 F2 B2 B2 B2 A2",
            "E2 E2 E2 C1 E2 E2 E2 E2 E2 E2 E1 B1",
            "G0 G2 G0 A3 B2 G0 G2 G0 G2 B2 D3 D1",
            "E0 E0 E0 B3 E3 E0 E0 E0 E0 E1 G1 E3",
            "E2 E2 E1 B1 E2 E2 E2 E2 E2 E1 G1 E3",
            "G2 G0 B0 A1 G0 G2 G0 G2 G0 B0 D0 D2",
            "E0 E0 E0 C1 E0 E0 E0 E0 E0 E0 D2 D4",
            "C2 C2 C0 A2 C2 C0 C2 F0 C2 C0 F2 F4"
        ];

        this._map = {};

        for(let y = 0; y < this._height; y++) {
            let row = map[y].split(" ");
            this._map[y] = {};
            for(let x = 0; x < this._width; x++) {
                this._map[y][x] = row[x];
            }
        }

        this._tiles = {};

        this._extras = {};
    }

    static reload() {
        this._player = DG_Players.get_player();
        this._player_sector = new EJ_Vec2(
            Math.round(this._player._position._x / this._tile_size),
            Math.round(this._player._position._y / this._tile_size)
        );

        let x = this._player_sector._x;
        let y = this._player_sector._y;

        for(let key in this._extras) {
            if(this._extras[key]) {
                this._extras[key].destroy();
                delete this._extras[key];
            }
        }

        for(let y in this._tiles) {
            for(let x in this._tiles[y]) {
                this._tiles[y][x].remove();
                delete this._tiles[y][x];
            }
            delete this._tiles[y];
        }

        this._tiles = {};
        this._tiles[y] = {};
        this._tiles[y - 1] = {};
        this._tiles[y + 1] = {};

        this._tiles[  y  ][  x  ] = this._get_tile( y ,  x , false);
        this._tiles[y - 1][  x  ] = this._get_tile(y-1,  x , false);
        this._tiles[  y  ][x + 1] = this._get_tile( y , x+1, false);
        this._tiles[y + 1][  x  ] = this._get_tile(y+1,  x , false);
        this._tiles[  y  ][x - 1] = this._get_tile( y , x-1, false);
        this._tiles[y - 1][x - 1] = this._get_tile(y-1, x-1, false);
        this._tiles[y - 1][x + 1] = this._get_tile(y-1, x+1, false);
        this._tiles[y + 1][x - 1] = this._get_tile(y+1, x-1, false);
        this._tiles[y + 1][x + 1] = this._get_tile(y+1, x+1, false);
    }

    static update() {
        this._calculate_player_sector();
    }

    static _calculate_player_sector() {
        let nx = Math.round(this._player._position._x / this._tile_size);
        let ny = Math.round(this._player._position._y / this._tile_size);

        if(this._player_sector._y !== ny) {
            let x = this._player_sector._x;
            let top = ny < this._player_sector._y;
            let y1 = top ? ny-1 : ny+1;
            let y2 = top ? ny+2 : ny-2;

            this._tiles[y2][x-1].remove();
            this._tiles[y2][ x ].remove();
            this._tiles[y2][x+1].remove();

            // delete column
            delete this._tiles[y2];

            this._tiles[y1] = {};
            this._tiles[y1][x-1] = this._get_tile(y1, x-1);
            this._tiles[y1][ x ] = this._get_tile(y1, x);
            this._tiles[y1][x+1] = this._get_tile(y1, x+1);

            this._player_sector.set(this._player_sector._x, ny);
        }
        else if(this._player_sector._x !== nx) {
            let y = this._player_sector._y;
            let left = nx < this._player_sector._x;
            let x1 = left ? nx-1 : nx+1;
            let x2 = left ? nx+2 : nx-2;

            // delete row
            this._tiles[y-1][x2].remove();
            delete this._tiles[y-1][x2];
            this._tiles[ y ][x2].remove();
            delete this._tiles[ y ][x2];
            this._tiles[y+1][x2].remove();
            delete this._tiles[y+1][x2];

            this._tiles[y-1] = this._tiles[y-1] || {};
            this._tiles[y-1][x1] = this._get_tile(y-1, x1);
            this._tiles[ y ] = this._tiles[ y ] || {};
            this._tiles[ y ][x1] = this._get_tile( y , x1);
            this._tiles[y+1] = this._tiles[y+1] || {};
            this._tiles[y+1][x1] = this._get_tile(y+1, x1);

            this._player_sector.set(nx, this._player_sector._y);
        }
    }

    static _get_tile(y, x) {
        let ny = y < 0 ? y + this._max_y : y;
        let nx = x < 0 ? x + this._max_x : x;

        nx = Math.abs(nx) % this._width;
        ny = Math.abs(ny) % this._height;
        let tile = this._map[ny][nx];
        return new DG_Street(tile[0], x * this._tile_size, y * this._tile_size, tile[1]);
    }

    static check_destroy_if_distance(entity) {
        if(!entity._next_destroy_check || entity._next_destroy_check < EJ_Time._now) {
            let sectorX = Math.round(entity._position._x / this._tile_size);
            let sectorY = Math.round(entity._position._y / this._tile_size);
            if(Math.abs(this._player_sector._x - sectorX) > 1 || Math.abs(this._player_sector._y - sectorY) > 1) {
                if(this._extras[entity.__id]) {
                    delete this._extras[entity.__id];
                }
                return true;
            }
            entity._next_destroy_check = EJ_Time._now + 1000;
        }
        return false;
    }
}