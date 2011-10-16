$(document).ready ->
  class AbExerciseCollection extends Backbone.Collection
    url : 'js/exercises.json'
    defaults :
      'secs_in_countdown' : 30

    get_exercises : (n) =>
      if n <= 0
        return []
      exercises = (@at(i % @length) for i in [0..n-1])

  class AbExerciseView extends Backbone.View
    NUM_FLASHES_ON_INTRO = 3
    initialize: ->
      @current_exercise = ""
      @num_flashes = 0
      @secs_left = 30
      @render()

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
    intro_animation_end: =>
      @trigger("intro_animation_end")

    render_next_exercise: (ex, secs) =>
      @current_exercise = ex
      @secs_left = 30
      @render()
      @render_intro_animation()

    render: =>
      tmpl = '''
				     <div class="row">
  					   <div class="span8 offset4">
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

  class AbTimeApp extends Backbone.Router
    NUM_EXERCISES_IN_WORKOUT = 10
    initialize: ->
      @abExerciseCollection = new AbExerciseCollection
      @abExerciseCollection.bind("reset",@populate_views)
      @abExerciseCollection.fetch()
      @currentIndex = 0

    populate_views: =>
      @startStopButton = new StartStopButtonView(el : $('#controls'))
      @startStopButton.bind("start_clicked", @start_workout_intro)
      @startStopButton.bind("stop_clicked", @stop_workout_countdown)
      @exercises = @abExerciseCollection.get_exercises(NUM_EXERCISES_IN_WORKOUT)
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), exercises : @exercises)
      @workoutProgressView.el.hide()
      @abExerciseView = new AbExerciseView(el: $('#view_firstPage'), secs_in_countdown : @exercises[@currentIndex].get("secs_in_countdown"))
      @abExerciseView.bind('intro_animation_end', @start_workout_countdown)
      @abExerciseView.bind('exercise_countdown_complete', @exercise_countdown_complete)
      @abExerciseView.el.hide()

    start_workout_intro: =>
      secs = @exercises[@currentIndex].get("secs_in_countdown")
      name = @exercises[@currentIndex].get("name")
      $("div#view_splashPage").hide()
      @workoutProgressView.el.show()
      @abExerciseView.el.show()
      @abExerciseView.render_next_exercise(name,secs)
    start_workout_countdown: =>
      $(document).everyTime("1s","workoutCountdown",@abExerciseView.tick_countdown)

    stop_workout_countdown: =>
      @currentIndex = 0
      $(document).stopTime("workoutCountdown")
      @abExerciseView.el.hide()
      @workoutProgressView.el.hide()
      $("div#view_splashPage").show();

    exercise_countdown_complete: =>
      @currentIndex++
      if @currentIndex < NUM_EXERCISES_IN_WORKOUT
        $(document).stopTime("workoutCountdown")
        @start_workout_intro()
      else
        @stop_workout_countdown()

  window.app = new AbTimeApp
