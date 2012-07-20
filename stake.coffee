$(document).ready ->
  # Canvas
  canvas = $("#canvas")[0]
  ctx = canvas.getContext("2d")
  w = $("#canvas").width()
  h = $("#canvas").height()
  
  # Init variables
  cw = 10
  d = " "
  food = 0
  score = 0
  game_loop = null
  snake_array = [] # an array of cells to make up the snake
  
  init = ->
    d = "right" # default direction
    create_snake()
    create_food() 
    score = 0;
    # Move the snake every 60ms
    clearInterval(game_loop) if game_loop?
    game_loop = setInterval(paint, 60)
    return

  create_snake = ->
    length = 5 # Length of the initial snake
    snake_array = []
    for cell_index in [length..1]
      snake_array.push({x: cell_index, y:0})

  # Create a random food cell
  create_food = ->
    food =
      x: Math.round(Math.random()*(w-cw)/cw)
      y: Math.round(Math.random()*(h-cw)/cw)
  
  # Paint the snake
  paint = ->
    # To avoid the snake trail we need to paint the BG on every frame
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = "black"
    ctx.strokeRect(0, 0, w, h)
    
    # Pop out the tail cell and place it in front of the head cell
    new_x = snake_array[0].x
    new_y = snake_array[0].y

    # Add movement
    if d is "right"
      new_x++
    else if d is "left"
      new_x--
    else if d is "up"
      new_y--
    else if d is "down"
      new_y++
    
    # This will restart the game if the snake hits the wall 
    # or if the head of the snake bumps into its body
    if new_x is -1 or new_x is w/cw or new_y is -1 or new_y is h/cw or check_collision(new_x, new_y, snake_array)
      # restart game
      init()
      return
    
    # If the snake eats food create a new head cell
    # If not, move the tail cell
    if new_x is food.x and new_y is food.y
      tail = {x: new_x, y: new_y}
      score++
      # Create new food
      create_food()
    else
      tail = snake_array.pop() # pops out the last cell
      tail.x = new_x
      tail.y = new_y
  
    snake_array.unshift(tail) #put the tail as the first cell
    
    # Paint the cells of the snake
    for cell in snake_array
      paint_cell(cell.x, cell.y)
    
    # paint the food
    paint_cell(food.x, food.y)
    # Display the score
    score_text = "Score: " + score
    ctx.fillText(score_text, 5, h-5)
  
  # Generic function to paint cells
  paint_cell = (x, y) ->
    ctx.fillStyle = "blue"
    ctx.fillRect(x*cw, y*cw, cw, cw)
    ctx.strokeStyle = "white"
    ctx.strokeRect(x*cw, y*cw, cw, cw)
  
  # Check if the provided x/y coordinates exist in an array of cells or not
  check_collision = (x, y, array) ->
    for cell in array
      return true if cell.x is x and cell.y is y
    return false
  
  # Keyboard controls
  $(document).keydown (e) ->
    key = e.which;
    if key is 37 and d isnt "right"
      d = "left"
      console.log "left"
    else if key is 38 and d isnt "down"
      console.log "down"
      d = "up"
    else if key is 39 and d isnt "left"
      console.log "right"
      d = "right"
    else if key is 40 and d isnt "up"
      console.log "down"
      d = "down"
    return

  
  init()
  return
