var Game, game,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Game = (function(_super) {

  __extends(Game, _super);

  function Game(h, w, ps) {
    Game.__super__.constructor.apply(this, arguments);
    atom.input.bind(atom.key.LEFT_ARROW, 'move_left');
    atom.input.bind(atom.key.RIGHT_ARROW, 'move_right');
    atom.input.bind(atom.key.UP_ARROW, 'move_up');
    atom.input.bind(atom.key.DOWN_ARROW, 'move_down');
    atom.input.bind(atom.key.SPACE, 'toggle_pause');
    this.height = h;
    this.width = w;
    this.pixelsize = ps;
    atom.canvas.height = this.height * this.pixelsize;
    atom.canvas.width = this.height * this.pixelsize;
    this.startGame();
  }

  Game.prototype.startGame = function() {
    var _x, _y;
    _x = Math.floor(this.width / 2);
    _y = Math.floor(this.height / 2);
    this.snake = [[_x, _y], [--_x, _y], [--_x, _y], [--_x, _y]];
    console.log(this.snake);
    this.dir = "";
    this.newdir = "right";
    this.score = 0;
    this.gstarted = true;
    this.gpaused = false;
    this.food = [];
    this.last_dt = 0.00;
    this.delay = 0.08;
    this.noshow = true;
    this.gpaused = true;
    this.genFood();
    return this.showIntro();
  };

  Game.prototype.genFood = function() {
    var x, y;
    x = void 0;
    y = void 0;
    while (true) {
      x = Math.floor(Math.random() * (this.width - 1));
      y = Math.floor(Math.random() * (this.height - 1));
      if (!this.testCollision(x, y)) break;
    }
    return this.food = [x, y];
  };

  Game.prototype.drawFood = function() {
    atom.context.beginPath();
    atom.context.arc((this.food[0] * this.pixelsize) + this.pixelsize / 2, (this.food[1] * this.pixelsize) + this.pixelsize / 2, this.pixelsize / 2, 0, Math.PI * 2, false);
    return atom.context.fill();
  };

  Game.prototype.drawSnake = function() {
    var i, l, x, y, _results;
    i = 0;
    l = this.snake.length;
    _results = [];
    while (i < l) {
      x = this.snake[i][0];
      y = this.snake[i][1];
      atom.context.fillRect(x * this.pixelsize, y * this.pixelsize, this.pixelsize, this.pixelsize);
      _results.push(i++);
    }
    return _results;
  };

  Game.prototype.testCollision = function(x, y) {
    var i, l;
    if (x < 0 || x > this.width - 1) return true;
    if (y < 0 || y > this.height - 1) return true;
    i = 0;
    l = this.snake.length;
    while (i < l) {
      if (x === this.snake[i][0] && y === this.snake[i][1]) return true;
      i++;
    }
    return false;
  };

  Game.prototype.endGame = function() {
    this.gstarted = false;
    atom.context.fillStyle = "rgba(0,0,0,0.8)";
    atom.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    atom.context.fillStyle = "#fff";
    atom.context.font = "30px monospace";
    atom.context.textAlign = "center";
    atom.context.fillText("Game Over", this.width / 2 * this.pixelsize, this.height / 2 * this.pixelsize);
    atom.context.fillStyle = "#fff";
    atom.context.font = "18px monospace";
    return atom.context.fillText("Score: " + this.score, this.width / 2 * this.pixelsize, this.height / 1.5 * this.pixelsize);
  };

  Game.prototype.togglePause = function() {
    if (!this.gpaused) {
      this.gpaused = true;
      atom.context.fillStyle = "#fff";
      atom.context.font = "20px sans-serif";
      atom.context.textAlign = "center";
      return atom.context.fillText("Paused", this.width / 2 * this.pixelsize, this.height / 2 * this.pixelsize);
    } else {
      this.gpaused = false;
      return this.noshow = false;
    }
  };

  Game.prototype.showIntro = function() {
    atom.context.fillStyle = "#000";
    atom.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    atom.context.fillStyle = "#fff";
    atom.context.font = "30px sans-serif";
    atom.context.textAlign = "center";
    atom.context.textAlign = "left";
    atom.context.font = "30px monospace";
    atom.context.fillText("Instructions:", 2 * this.pixelsize, this.height / 3 * this.pixelsize, this.width * this.pixelsize);
    atom.context.font = "18px monospace";
    atom.context.fillText("Use arrows to change the snake's direction.", 2 * this.pixelsize, this.height / 2.5 * this.pixelsize);
    atom.context.fillText("Press space to start/pause the game.", 2 * this.pixelsize, this.height / 2.3 * this.pixelsize);
    return atom.context.fillText("Pro-tip: Try pressing space now!", 2 * this.pixelsize, this.height / 1.9 * this.pixelsize);
  };

  Game.prototype.update = function(dt) {
    var x, y;
    if (atom.input.pressed('move_left')) {
      if (this.dir !== "right") this.newdir = "left";
      console.log("left");
    } else if (atom.input.pressed('move_up')) {
      if (this.dir !== "down") this.newdir = "up";
    } else if (atom.input.pressed('move_right')) {
      if (this.dir !== "left") this.newdir = "right";
    } else if (atom.input.pressed('move_down')) {
      if (this.dir !== "up") this.newdir = "down";
    } else if (atom.input.pressed('toggle_pause')) {
      if (!this.gstarted) {} else {
        this.togglePause();
      }
    }
    if (this.last_dt < this.delay) {
      this.last_dt += dt;
      return;
    } else {
      this.last_dt = 0.00;
    }
    if (!this.gstarted || this.gpaused) return;
    x = this.snake[0][0];
    y = this.snake[0][1];
    switch (this.newdir) {
      case "up":
        y--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
    }
    if (this.testCollision(x, y)) {
      this.endGame();
      return;
    }
    this.snake.unshift([x, y]);
    if (x === this.food[0] && y === this.food[1]) {
      this.score++;
      this.genFood();
    } else {
      this.snake.pop();
    }
    this.dir = this.newdir;
    atom.context.fillStyle = "#000";
    atom.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    return atom.context.fillStyle = "#fff";
  };

  Game.prototype.draw = function() {
    if (!this.noshow) this.drawFood();
    if (!this.noshow) return this.drawSnake();
  };

  return Game;

})(atom.Game);

game = new Game(20, 20, 30);

game.run();
