class Game extends atom.Game
  
  constructor: (h, w, ps)  ->
    super
    atom.input.bind atom.key.LEFT_ARROW, 'move_left'
    atom.input.bind atom.key.RIGHT_ARROW, 'move_right'
    atom.input.bind atom.key.UP_ARROW, 'move_up'
    atom.input.bind atom.key.DOWN_ARROW, 'move_down'
    atom.input.bind atom.key.SPACE, 'toggle_pause'

    @height = h
    @width = w
    @pixelsize = ps
    atom.canvas.height = @height * @pixelsize 
    atom.canvas.width = @height * @pixelsize
    #@showIntro()
    @startGame()
  
  startGame: ->
    _x = Math.floor(@width / 2)
    _y = Math.floor(@height / 2)
    @snake = [ [ _x, _y ], [ --_x, _y ], [ --_x, _y ], [ --_x, _y ] ]
    @dir = ""
    @newdir = "right"
    @score = 0
    @gstarted = true
    @gpaused = false
    @food = []
    @last_dt = 0.00
    @delay = 0.08
    @noshow = true
    @gpaused = true
    @genFood()
    @showIntro()

  genFood: ->
    x = undefined
    y = undefined
    loop
      x = Math.floor(Math.random() * (@width - 1))
      y = Math.floor(Math.random() * (@height - 1))
      break unless @testCollision(x, y)
    @food = [ x, y ]

  drawFood: ->
    atom.context.beginPath()
    atom.context.arc (@food[0] * @pixelsize) + @pixelsize / 2, (@food[1] * @pixelsize) + @pixelsize / 2, @pixelsize / 2, 0, Math.PI * 2, false
    atom.context.fill()

  drawSnake: ->
    i = 0
    l = @snake.length
    while i < l
      x = @snake[i][0]
      y = @snake[i][1]
      atom.context.fillRect x * @pixelsize, y * @pixelsize, @pixelsize, @pixelsize
      i++

  testCollision: (x, y) ->
    return true  if x < 0 or x > @width - 1
    return true  if y < 0 or y > @height - 1
    i = 0
    l = @snake.length

    while i < l
      return true  if x is @snake[i][0] and y is @snake[i][1]
      i++
    false
  
  endGame: ->
    @gstarted = false
    atom.context.fillStyle = "rgba(0,0,0,0.8)"
    atom.context.fillRect 0, 0, @width * @pixelsize, @height * @pixelsize
    atom.context.fillStyle = "#fff"
    atom.context.font = "30px monospace"
    atom.context.textAlign = "center"
    atom.context.fillText "Game Over", @width / 2 * @pixelsize, @height / 2 * @pixelsize
    atom.context.fillStyle = "#fff"
    atom.context.font = "18px monospace"
    atom.context.fillText "Score: " + @score, @width / 2 * @pixelsize, @height / 1.5 * @pixelsize

  togglePause: ->
    unless @gpaused
      @gpaused = true
      atom.context.fillStyle = "#fff"
      atom.context.font = "20px sans-serif"
      atom.context.textAlign = "center"
      atom.context.fillText "Paused", @width / 2 * @pixelsize, @height / 2 * @pixelsize
    else
      @gpaused = false
      @noshow = false 

  showIntro: ->
    atom.context.fillStyle = "#000"
    atom.context.fillRect 0, 0, @width * @pixelsize, @height * @pixelsize
    atom.context.fillStyle = "#fff"
    atom.context.font = "30px sans-serif"
    atom.context.textAlign = "center"
    #atom.context.fillText "Snake", @width / 2 * @pixelsize, @height / 4 * @pixelsize, @width * @pixelsize
    atom.context.textAlign = "left"
    atom.context.font = "30px monospace"
    atom.context.fillText "Instructions:", 2 * @pixelsize, @height / 3 * @pixelsize, @width * @pixelsize
    atom.context.font = "18px monospace"
    atom.context.fillText "Use arrows to change the snake's direction.", 2 * @pixelsize, @height / 2.5 * @pixelsize
    atom.context.fillText "Press space to start/pause the game.", 2 * @pixelsize, @height / 2.3 * @pixelsize
    #atom.context.textAlign = "center"
    atom.context.fillText "Pro-tip: Try pressing space now!", 2 * @pixelsize, @height / 1.9 * @pixelsize

  update: (dt) ->

    if atom.input.pressed 'move_left'
      @newdir = "left"  unless @dir is "right"
      console.log "left"
    else if atom.input.pressed 'move_up'
      @newdir = "up"  unless @dir is "down"
    else if atom.input.pressed  'move_right'
      @newdir = "right" unless @dir is "left"
    else if atom.input.pressed  'move_down'
      @newdir = "down"  unless @dir is "up"
    else if atom.input.pressed  'toggle_pause'
      unless @gstarted
        # uncomment to restart via space bar
        # @startGame()
      else
        @togglePause()

    # Slow down the game
    if @last_dt < @delay
      @last_dt += dt
      return
    else 
      @last_dt = 0.00
    
    # Don#t do anything id game is paused 
    return if not @gstarted or @gpaused

    # Update snake
    x = @snake[0][0]
    y = @snake[0][1]
    switch @newdir
      when "up"
        y--
      when "right"
        x++
      when "down"
        y++
      when "left"
        x--
    
    # Check for collision with self or wall
    if @testCollision(x, y)
      @endGame()
      return

    # Move the snake
    @snake.unshift [ x, y ]
    if x is @food[0] and y is @food[1]
      @score++
      @genFood()
    else
      @snake.pop()
    @dir = @newdir
    atom.context.fillStyle = "#000"
    atom.context.fillRect 0, 0, @width * @pixelsize, @height * @pixelsize
    atom.context.fillStyle = "#fff"

  draw: ->
    @drawFood() unless @noshow
    @drawSnake() unless @noshow

game = new Game(20, 20, 30)
game.run()