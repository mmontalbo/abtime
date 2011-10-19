$(document).ready ->
  ###
  # AbExerciseCollection
  #
  # Implements logic to fetch useful sets of exercises.
  # Its data source is a JSON document containing properties such
  # as exercise names.
  ###
  class AbExerciseCollection extends Backbone.Collection
    url : 'js/exercises.json'
    defaults :
      'secs_in_countdown' : 30

    ###
    # get_exercises
    #
    # @param n int, number of exercises to return
    #
    # @return n exercises, repeating if the collection contains
    # less than n elements. If the collection contains no elements,
    # an empty list is returned.
    ###
    get_exercises : (n) =>
      if n <= 0
        return []
      exercises = (@at(i % @length) for i in [0..n-1])

  ###
  # AbExerciseView
  #
  # Creates main exercise view DOM, including the current exercise
  # name, a countdown of how much time is left, as well as all associated
  # animations.
  ###
  class AbExerciseView extends Backbone.View
    NUM_FLASHES_ON_INTRO = 3
    initialize: ->
      @current_exercise = ""
      @num_flashes = 0
      @secs_left = 30
      @render()

    intro_animation_end: =>
      @trigger("intro_animation_end")
    render_flash_normal: =>
      @el.animate({opacity:1},150,@intro_animation_end)
    render_flash_high: =>
      @el.animate({opacity:0.75},150,@render_intro_animation)
    render_flash_low: (callback) =>
      @el.animate({opacity:0.25},150,callback)
    render_intro_animation: =>
      if @num_flashes < NUM_FLASHES_ON_INTRO
        @num_flashes++
        @render_flash_low(@render_flash_high)
      else
        @num_flashes = 0
        @render_flash_low(@render_flash_normal)
      @
    render_next_exercise: (ex, secs) =>
      @current_exercise = ex
      @secs_left = 30
      @render()
      @render_intro_animation()

    render: =>
      tmpl = '''
				     <div class="row">
  					   <div class="span16">
    					   <h2 class="currentExcercise"><%= ex %></h2>
  					   </div>
				      </div>
				      <div class="row" id="clock">
              '''
      if @secs_left > 10
        clock_tmpl = '''
                     <div class="span8 offset4">
                       0:<span><%= secs_left %></span>
                     </div>
                   '''
      else
        clock_tmpl = '''
                     <span class="lastTenSeconds"><%= secs_left %></span>
                     '''
      tmpl = tmpl + clock_tmpl + '</div>'
      @ab_exercise_view = _.template(tmpl)
      $(@el.html(@ab_exercise_view({ ex : @current_exercise, secs_left : @secs_left })))
      @

    tick_countdown: =>
      @secs_left--
      if @secs_left is 0
        @trigger("exercise_countdown_complete")
      else
        @render()

  ###
  # WorkoutProgressView
  #
  # Creates progress bar view DOM, including individual exercise progress
  # elements and controlling workout progress animation.
  ###
  class WorkoutProgressView extends Backbone.View
    initialize: ->
      @workoutExercises = @options.exercises
      @render()

    render: =>
      @names = (ex.get('name') for ex in @workoutExercises)
      tmpl = '''
             <div class="span16">
               <% _.each(exercises, function(exercise) { %>
                 <div class="exercise"><%= exercise %></div>
               <% }); %>
             </div>
             '''
      @exercise_progress_bar = _.template(tmpl)
      $(@el.html(@exercise_progress_bar({ exercises : @names })))
      @

    render_increment_progress: (i) =>
      $("div.exercise").eq(i).css("background-color","blue")

    render_clear_progress: =>
      $("div.exercise").css("background-color","gray")


  ###
  # StartStopButtonView
  #
  # Creates start/stop button DOM and handles logic and signaling
  # associated with user interaction.
  ###
  class StartStopButtonView extends Backbone.View
    initialize: ->
      @isStarted = false
      @render()

    events:
      "click input[value='start']" : "clicked_start",
      "click input[value='stop']" : "clicked_stop",

    clicked_start: =>
      @isStarted = true
      @render_btn()
      @trigger("start_clicked")

    clicked_stop: =>
      @isStarted = false
      @render_btn()
      @trigger("stop_clicked")

    toggle_btn_state: =>
      @isStarted = !@isStarted
      @render_btn()

    render_btn: =>
      if @isStarted
        @el.children("input[value='start']").hide()
        @el.children("input[value='stop']").show()
      else
        @el.children("input[value='start']").show()
        @el.children("input[value='stop']").hide()

    render: =>
      tmpl = '''
    					<input type="button" class="btn success" value="start">
    					<input type="button" class="btn danger" value="stop">
             '''
      @start_stop_button = _.template(tmpl)
      $(@el.html(@start_stop_button()))
      @render_btn()
      @

  ###
  # AbTimeApp
  #
  # Main application logic responsible for intializing collection and views
  # and registering for appropriate application events based on time and user
  # interaction.
  ###
  class AbTimeApp extends Backbone.Router
    NUM_EXERCISES_IN_WORKOUT = 10
    initialize: ->
      @abExerciseCollection = new AbExerciseCollection
      @abExerciseCollection.bind("reset",@populate_views)
      @abExerciseCollection.fetch()
      @currentIndex = 0

    populate_views: =>
      # Initialize views an get set of exercises
      @exercises = @abExerciseCollection.get_exercises(NUM_EXERCISES_IN_WORKOUT)
      @startStopButton = new StartStopButtonView(el : $('#controls'))
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), exercises : @exercises)
      @abExerciseView = new AbExerciseView(el: $('#view_firstPage'), secs_in_countdown : @exercises[@currentIndex].get("secs_in_countdown"))

      # Set up event binding
      @startStopButton.bind("start_clicked", @start_workout_intro)
      @startStopButton.bind("stop_clicked", @stop_workout)
      @abExerciseView.bind('intro_animation_end', @start_workout_countdown)
      @abExerciseView.bind('exercise_countdown_complete', @exercise_countdown_complete)
      # Put app into initial view state
      @workoutProgressView.el.hide()
      @abExerciseView.el.hide()

    start_workout_intro: =>
      secs = @exercises[@currentIndex].get("secs_in_countdown")
      name = @exercises[@currentIndex].get("name")
      $("div#view_splashPage").hide()
      @workoutProgressView.el.show()
      @abExerciseView.el.show()
      @abExerciseView.render_next_exercise(name,secs)
    start_workout_countdown: =>
      @workoutProgressView.render_increment_progress(@currentIndex)
      $(document).everyTime("1s","workoutCountdown",@abExerciseView.tick_countdown)

    exercise_countdown_complete: =>
      @currentIndex++
      if @currentIndex < NUM_EXERCISES_IN_WORKOUT
        $(document).stopTime("workoutCountdown")
        @start_workout_intro()
      else
        @stop_workout_countdown()
    stop_workout_countdown: =>
      @startStopButton.toggle_btn_state()
      @stop_workout()
    stop_workout: =>
      @currentIndex = 0
      $(document).stopTime("workoutCountdown")
      @abExerciseView.el.hide()
      @workoutProgressView.render_clear_progress()
      @workoutProgressView.el.hide()
      $("div#view_splashPage").show()
  window.app = new AbTimeApp
