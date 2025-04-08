class Tile{
    constructor(x, y, type='grass', w=100, h=100){
        this.x = x
        this.y = y
        this.sprite = new Image()
        this.sprite.src = `./Tiles/${type}.png`
        this.width = w
        this.height = h
    }
}
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false
ctx.imageRendering = "pixelated"

canvas.style.height = "90%"
canvas.width = canvas.height

let debug_mode = {
    show_coords: true,
    show_grid: false,
    game_loop: false,
    map_gen: false
}

let tiles = []
let keys = {
    "Up": false,
    "Down": false,
    "Left": false,
    "Right": false
}
let frame_x = 500
let frame_y = 500

let speed = 10

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.Up = true
            break
        case "ArrowDown":
            keys.Down = true
            break
        case "ArrowLeft":
            keys.Left = true
            break
        case "ArrowRight":
            keys.Right = true
            break
    }
})
document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.Up = false
            break
        case "ArrowDown":
            keys.Down = false
            break
        case "ArrowLeft":
            keys.Left = false
            break
        case "ArrowRight":
            keys.Right = false
            break
    }
})

/*function terrain_gen(size_x, size_y) {
    // Clear existing tiles
    tiles = [];

    // Create initial empty map with grass tiles
    let map = [];
    for(let x = 0; x < size_x; x++) {
        map[x] = [];
        for(let y = 0; y < size_y; y++) {
            map[x][y] = "grass";
        }
    }

    // Generate some wall patterns
    // First create some random wall starts
    let wallStartPoints = Math.floor((size_x * size_y) / 100) + 3;
    for(let i = 0; i < wallStartPoints; i++) {
        let x = Math.floor(Math.random() * (size_x - 4)) + 2;
        let y = Math.floor(Math.random() * (size_y - 4)) + 2;

        // Start with a vertical or horizontal wall
        let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        let length = Math.floor(Math.random() * 8) + 3;

        // Create wall
        if(direction === "horizontal") {
            for(let j = 0; j < length && x + j < size_x - 2; j++) {
                map[x + j][y] = "grass_wall";
            }
        } else {
            for(let j = 0; j < length && y + j < size_y - 2; j++) {
                map[x][y + j] = "grass_wall";
            }
        }
    }

    // Add some corners and connect walls
    for(let x = 1; x < size_x - 1; x++) {
        for(let y = 1; y < size_y - 1; y++) {
            // Random chance to add corner pieces where appropriate
            if(map[x][y] === "grass" && Math.random() < 0.1) {
                // Check for horizontal wall above
                if(map[x][y-1] === "grass_wall") {
                    // Corrected: grass_wall_diagonal_east goes from east to west on the top
                    // grass_wall_diagonal_west goes from west to east on the top
                    if(Math.random() < 0.5) {
                        map[x][y] = "grass_wall_diagonal_west"; // From west to east on top
                    } else {
                        map[x][y] = "grass_wall_diagonal_east"; // From east to west on top
                    }
                }
                    // Check for wall to left and right (corner opportunity)
                    // Corrected: grass_wall_corner_east goes from east to west on the bottom
                // grass_wall_corner_west goes from west to east on the bottom
                else if(map[x-1][y] === "grass_wall" && map[x+1][y] === "grass") {
                    map[x][y] = "grass_wall_corner_west"; // From west to east on bottom
                }
                else if(map[x+1][y] === "grass_wall" && map[x-1][y] === "grass") {
                    map[x][y] = "grass_wall_corner_east"; // From east to west on bottom
                }
            }
        }
    }

    // Post-processing: Fix inconsistencies and add detail
    // This pass ensures walls connect properly and corners make sense
    for(let x = 1; x < size_x - 1; x++) {
        for(let y = 1; y < size_y - 1; y++) {
            // Make sure diagonal tiles have proper connections
            // Corrected diagonal tile orientation
            if(map[x][y] === "grass_wall_diagonal_east") { // East to west on top
                if(map[x+1][y] !== "grass_wall" && map[x][y-1] !== "grass_wall") {
                    map[x][y] = "grass";
                }
            }
            else if(map[x][y] === "grass_wall_diagonal_west") { // West to east on top
                if(map[x-1][y] !== "grass_wall" && map[x][y-1] !== "grass_wall") {
                    map[x][y] = "grass";
                }
            }
                // Make sure corners have proper connections
            // Corrected corner tile orientation
            else if(map[x][y] === "grass_wall_corner_east") { // East to west on bottom
                if(map[x+1][y] !== "grass_wall") {
                    map[x][y] = "grass";
                }
            }
            else if(map[x][y] === "grass_wall_corner_west") { // West to east on bottom
                if(map[x-1][y] !== "grass_wall") {
                    map[x][y] = "grass";
                }
            }
        }
    }

    // Convert the map array to tile objects
    const offsetX = Math.floor(size_x / 2);
    const offsetY = Math.floor(size_y / 2);

    for(let x = 0; x < size_x; x++) {
        for(let y = 0; y < size_y; y++) {
            let tileType = map[x][y];
            let new_tile = new Tile(
                (x - offsetX) * 100,
                (y - offsetY) * 100,
                tileType
            );
            tiles.push(new_tile);
        }
    }

    debug_mode.map_gen && console.log("Generated map with walls and corners");
    return tiles;
}*/

function text_generate_map(size_x, size_y){
    for(let x=(0-(size_x/2)); x<(size_x/2); x++){
        for(let y=(0-(size_y/2)); y<(size_y/2); y++){
            let new_tile = new Tile(x*100, y*100, Math.random() < 0.7 ? (Math.random() < 0.5 ? "grass" : "dirt") : "water")
            tiles.push(new_tile)
            debug_mode.map_gen && console.log(new_tile)
        }
    }
    debug_mode.map_gen && console.log(tiles)
}

function game_loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(keys.Up) frame_y += speed
    if(keys.Down) frame_y -= speed
    if(keys.Left) frame_x += speed
    if(keys.Right) frame_x-= speed
    for (let tile of tiles) {
        let screen_x = tile.x + frame_x
        let screen_y = tile.y + frame_y

        if (screen_x + tile.width > 0 && screen_x < canvas.width &&
            screen_y + tile.height > 0 && screen_y < canvas.height) {
            if (tile.sprite.complete) {
                ctx.drawImage(tile.sprite, screen_x, screen_y, tile.width, tile.height)
            } else {
                // fallback while image is loading
                ctx.fillStyle = "#009500"
                ctx.fillRect(screen_x, screen_y, tile.width, tile.height)
            }
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            debug_mode.show_grid && ctx.strokeRect(screen_x, screen_y, tile.width, tile.height)
        }
    }
    ctx.fillStyle = "#ffffff"
    ctx.font = "30px arial"
    ctx.textAlign = "left"
    debug_mode.show_coords && (() => {
        ctx.fillText(`X${frame_x} Y${frame_y}`, 5, 25)
        ctx.strokeText(`X${frame_x} Y${frame_y}`, 5, 25)
    })()
    debug_mode.game_loop && console.log("loop run")
    requestAnimationFrame(game_loop)
}

text_generate_map(30, 30)

game_loop()