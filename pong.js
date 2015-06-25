var DEBUG = true;

var assert = function (expected, actual) {
    result = (expected == actual) ? "pass" : "fail";
    console.log(expected, " = ", actual, " ", result);
};

var Game = {
    canvas: undefined,
    context: undefined,
    state: undefined,
    player1: undefined,
    player2: undefined,
    ball: undefined,
    score: undefined
}

var FPS = 1000/60;
var SCREEN_WIDTH = undefined;
var SCREEN_HEIGHT = undefined;

var P1_X = undefined;
var P1_Y = undefined;
var P2_X = undefined;
var P2_Y = undefined;
var B_X = undefined;
var B_Y = undefined;

var P_WIDTH = 8;
var P_HEIGHT = 30;
var B_WIDTH = 10;
var B_HEIGHT = 10;
var P_COLOR = "#FFFFFF";

var MAX_SCORE = 10;

var v = [1,1];

function Sprite(x, y, asset) {
    this.x = x;
    this.y = y;
    this.color = P_COLOR;
    if (asset == "player") {
        this.w = P_WIDTH;
        this.h = P_HEIGHT;
    }
    else if (asset == "ball") {
        this.w = B_WIDTH;
        this.h = B_HEIGHT;
    }
    this.update_center = function () {
        this.center = [(this.x + (this.w / 2)), 
                       (this.y + (this.h / 2))];
    };
    this.update_center();
}

Game.start = function() {
    Game.canvas = document.getElementById("game");
    Game.context = Game.canvas.getContext("2d");
    SCREEN_WIDTH = Game.canvas.width;
    SCREEN_HEIGHT = Game.canvas.height;
    Game.context.fillStyle = "#000000";
    Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.init();

    if (DEBUG == "A") {
        assert(Game.player1.x, SCREEN_WIDTH + 10);
        assert(Game.player1.y, SCREEN_HEIGHT / 2);
        assert(Game.player2.x, SCREEN_WIDTH - 10);
        assert(Game.player2.y, SCREEN_HEIGHT / 2);
    };

    Game.mainLoop();
};

document.addEventListener("DOMContentLoaded", Game.start);

Game.init = function() {
    Game.state = 0;
    P1_X = 10;
    P1_Y = (SCREEN_HEIGHT / 2) - 30;
    P2_X = SCREEN_WIDTH - 18;
    P2_Y = (SCREEN_HEIGHT / 2) - 30;

    B_X = (SCREEN_WIDTH / 2) - B_HEIGHT;
    B_Y = (SCREEN_HEIGHT / 2) - B_HEIGHT;

    Game.player1 = new Sprite(P1_X, P1_Y, "player");
    Game.player2 = new Sprite(P2_X, P2_Y, "player");

    Game.ball = new Sprite(B_X, B_Y, "ball");
    Game.ball.vx = v[0];
    Game.ball.vy = v[1];
    
    Game.score = [0,0];

    // Draw Player 1
    Game.draw_sprites();
    // Draw Score
    Game.draw_score();
     
};

Game.reset_assets = function () {
    Game.player1.x = P1_X;
    Game.player1.y = P1_Y;
    Game.player2.x = P2_X;
    Game.player2.y = P2_Y;

    Game.ball.x = B_X;
    Game.ball.y = B_Y;
    Game.ball.vx = v[0];
    Game.ball.vy = v[1];
}

Game.draw_bg = function () {
    Game.context.fillStyle = "#000000";
    Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
};

Game.get_score = function() {
    return(Game.score[0] + " | " + Game.score[1]);
};

Game.draw_score = function() {
    var text_length = Game.context.measureText(Game.get_score()).width;
    Game.context.fillStyle = "#FFFFFF";
    Game.context.font = "bold 16px Arial, sans-serif";
    Game.context.fillText(Game.get_score(),
                          ((SCREEN_WIDTH / 2) - (text_length / 2)),
                          20);

};

Game.draw_sprites = function() {
    // Draw Player 1
    Game.context.fillStyle = Game.player1.color;
    Game.context.fillRect(Game.player1.x,
                          Game.player1.y,
                          Game.player1.w,
                          Game.player1.h);
    Game.player1.update_center();
    // Draw Player 2
    Game.context.fillStyle = Game.player2.color;
    Game.context.fillRect(Game.player2.x,
                          Game.player2.y,
                          Game.player2.w,
                          Game.player2.h);
    Game.player2.update_center();
    // Draw Ball
    Game.context.fillStyle = Game.ball.color;
    Game.context.fillRect(Game.ball.x,
                          Game.ball.y,
                          Game.ball.w,
                          Game.ball.h);
    Game.ball.update_center();

};

Game.detect_collisions = function() {
    var p1_dx = Game.player1.center[0] - Game.ball.center[0];
    var p1_dy = Game.player1.center[1] - Game.ball.center[1];
    var p2_dx = Game.player1.center[0] - Game.ball.center[0];
    var p2_dy = Game.player1.center[1] - Game.ball.center[1];

    // TODO: collision player colision detection
    /*
    if ((Math.abs(p1_dx) < Game.player1.center[0]) &&
        (Math.abs(p1_dy) < Game.player1.center[1])) {
        Game.ball.vx = -Game.ball.vx;
        Game.ball.vy = -Game.ball.vy;
    };
    */

    // Award point if ball hits player's court
    if (Game.ball.x == 0) {
        Game.award_point(2);
    }
    if (Game.ball.x == SCREEN_WIDTH - Game.ball.w) {
        Game.award_point(1); 
    };

}

Game.award_point = function(player) {
    switch (player) {
        case 1:
            Game.score[0] += 1;
            break;
        case 2:
            Game.score[1] += 1;
        default:
            break;
    };
};

Game.clear_canvas = function () {
    Game.context.clearRect(0,
                           0,
                           Game.canvas.width,
                           Game.canvas.height);
};

Game.draw = function() {
    // Clear
    Game.clear_canvas();
    // Draw background
    Game.draw_bg();
    // Draw sprites
    Game.draw_score();
    Game.draw_sprites();
};

Game.update = function() {
    // move ball around
    Game.ball.x += Game.ball.vx;
    Game.ball.y += Game.ball.vy;
    Game.detect_collisions();
    if ((Game.ball.x >= SCREEN_WIDTH - Game.ball.w) ||
        (Game.ball.x <= 0)) {
        Game.ball.vx = -Game.ball.vx;
    };

    if ((Game.ball.y >= SCREEN_HEIGHT - Game.ball.w) ||
        (Game.ball.y <= 0)) {
        Game.ball.vy = -Game.ball.vy;
    };
};

Game.menu = function() {
    Game.state = 1;
    // Draw menu: start, options
    console.log("loading menu");
};

Game.mainLoop = function() {
    switch (Game.state) {
        case 0:
            Game.menu();
            break;
        case 1:
            if (Game.score[0] == MAX_SCORE || Game.score[1] == MAX_SCORE) {
                Game.score = [0,0];
                Game.state = 3;
            };
           break;
        case 2:
            break;
        case 3:
            Game.reset_assets();
            Game.state = 0;
            break;
        default:
            break;
    };


    Game.update();
    Game.draw();
    window.setTimeout(Game.mainLoop, FPS);
};
