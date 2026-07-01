let SKY_COLOR = "skyblue";

let PLAYER_COLOR = "limegreen";
let ENEMY_COLOR = "red";
let GROUND_BASE_COLOR = "green";
let OCEAN_COLOR = "blue";
let PLATFORM_COLOR = "tan";
let WIN_BOX_COLOR = "gold";

let COIN_COLOR = "orange";
let COIN_VALUE = 100;
let COIN_SPIN = 1;

let TIME_LIMIT = 100;

let JUMP_SPEED = 10;
let ALLOW_REJUMP = false;
let PLAYER_SPEED = 10;
let ENEMY_SPEED = 5;
let GRAVITY = 10;

let SUN_COLOR = "white";
let SUN_BRIGHTNESS = 20;

let GROUND_SPOT_R_START = 0;
let GROUND_SPOT_R_VARIANCE = 0;
let GROUND_SPOT_G_START = 120;
let GROUND_SPOT_G_VARIANCE = 120;
let GROUND_SPOT_B_START = 0;
let GROUND_SPOT_B_VARIANCE = 0;

let GROUND_SIZE = 100;

let PLATFORM_LOCATIONS = [
  { north: 20, east: 20, vertical: 0, width: 10, length: 10 },
  { north: -20, east: 20, vertical: 0, width: 10, length: 10 },
  { north: -15, east: -10, vertical: 1, width: 8, length: 8 },
  { north: -25, east: -10, vertical: 2, width: 5, length: 8 },
  { north: -25, east: -20, vertical: 3.5, width: 5, length: 5 },
  { north: -15, east: -20, vertical: 5, width: 5, length: 5 },
  { north: -5, east: -20, vertical: 5.9, width: 4, length: 4 },
  { north: 10, east: -20, vertical: 4, width: 10, length: 1 },
];

let COIN_LOCATIONS = [
  { north: 20, east: 20, vertical: 1.2 },
  { north: -20, east: 20, vertical: 1.2 },
  { north: -15, east: -10, vertical: 2.2 },
  { north: -25, east: -10, vertical: 3.2 },
  { north: -25, east: -20, vertical: 4.7 },
  { north: -15, east: -20, vertical: 6.2 },
  { north: -5, east: -20, vertical: 7.1 },
  { north: 20, east: -20, vertical: 5.2 },
  { north: 10, east: -20, vertical: 5.2 },
  { north: 5, east: -20, vertical: 5.2 },
  { north: 7.5, east: -20, vertical: 5.2 },
  { north: 12.5, east: -20, vertical: 5.2 },
];

let ENEMY_LOCATIONS = [
  { north: -10, east: -15, vertical: 3 },
  { north: -10, east: -10, vertical: 1 },
  { north: 15, east: -15, vertical: 1 },
  { north: -20, east: 20, vertical: 1 },
  { north: 5, east: -10, vertical: -10 },
  { north: 100, east: 0, vertical: -10 },
  { north: -100, east: 0, vertical: -10 },
];
