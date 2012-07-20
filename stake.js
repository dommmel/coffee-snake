
$(document).ready(function() {
  var canvas, check_collision, create_food, create_snake, ctx, cw, d, food, game_loop, h, init, paint, paint_cell, score, snake_array, w;
  canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  w = $("#canvas").width();
  h = $("#canvas").height();
  cw = 10;
  d = " ";
  food = 0;
  score = 0;
  game_loop = null;
  snake_array = [];
  init = function() {
    d = "right";
    create_snake();
    create_food();
    score = 0;
    if (game_loop != null) clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
  };
  create_snake = function() {
    var cell_index, length, _results;
    length = 5;
    snake_array = [];
    _results = [];
    for (cell_index = length; length <= 1 ? cell_index <= 1 : cell_index >= 1; length <= 1 ? cell_index++ : cell_index--) {
      _results.push(snake_array.push({
        x: cell_index,
        y: 0
      }));
    }
    return _results;
  };
  create_food = function() {
    return food = {
      x: Math.round(Math.random() * (w - cw) / cw),
      y: Math.round(Math.random() * (h - cw) / cw)
    };
  };
  paint = function() {
    var cell, new_x, new_y, score_text, tail, _i, _len;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);
    new_x = snake_array[0].x;
    new_y = snake_array[0].y;
    if (d === "right") {
      new_x++;
    } else if (d === "left") {
      new_x--;
    } else if (d === "up") {
      new_y--;
    } else if (d === "down") {
      new_y++;
    }
    if (new_x === -1 || new_x === w / cw || new_y === -1 || new_y === h / cw || check_collision(new_x, new_y, snake_array)) {
      init();
      return;
    }
    if (new_x === food.x && new_y === food.y) {
      tail = {
        x: new_x,
        y: new_y
      };
      score++;
      create_food();
    } else {
      tail = snake_array.pop();
      tail.x = new_x;
      tail.y = new_y;
    }
    snake_array.unshift(tail);
    for (_i = 0, _len = snake_array.length; _i < _len; _i++) {
      cell = snake_array[_i];
      paint_cell(cell.x, cell.y);
    }
    paint_cell(food.x, food.y);
    score_text = "Score: " + score;
    return ctx.fillText(score_text, 5, h - 5);
  };
  paint_cell = function(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    return ctx.strokeRect(x * cw, y * cw, cw, cw);
  };
  check_collision = function(x, y, array) {
    var cell, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      cell = array[_i];
      if (cell.x === x && cell.y === y) return true;
    }
    return false;
  };
  $(document).keydown(function(e) {
    var key;
    key = e.which;
    if (key === 37 && d !== "right") {
      d = "left";
      console.log("left");
    } else if (key === 38 && d !== "down") {
      console.log("down");
      d = "up";
    } else if (key === 39 && d !== "left") {
      console.log("right");
      d = "right";
    } else if (key === 40 && d !== "up") {
      console.log("down");
      d = "down";
    }
  });
  init();
});
