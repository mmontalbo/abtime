###
# http://stackoverflow.com/questions/4825812/
# clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
#
# removes item at index e from array
###
Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1

$(document).ready ->
  NUM_EXERCISES_IN_WORKOUT = 10
  NUM_FLASHES_ON_INTRO = 3

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
    get_exercises : (n = NUM_EXERCISES_IN_WORKOUT) =>
      if n <= 0 or @length is 0
        return []
      exercises = (@at(i % @length) for i in [0..n-1])

    ###
    # get_random_exercises
    #
    # @param n int, number of exercises to return
    # @param r int, maximum number of times an exercise should repeat
    #
    # @return n random exercises, with exercises repeating at most r
    # times throughout the workout
    ###
    get_random_exercises : (n = NUM_EXERCISES_IN_WORKOUT, r = 1) =>
      if n <= 0
        return []

      exercises = (m for m in @models)
      exercisesChosen = {}
      randomExercises = []

      while exercises.length > 0 and randomExercises.length < n
        rand = Math.floor(Math.random() * exercises.length)
        randomExercise = exercises[rand]
        randomExercises.push(randomExercise)
        randomExerciseName = randomExercise.get("name")

        exercisesChosen[randomExerciseName] ?= 0
        if r == 1
          exercises.remove(randomExercise)
        else if exercisesChosen[randomExerciseName] < r-1
          exercisesChosen[randPick]++
        else if exercisesChosen[randomExerciseName] < r
          exercises.remove(randomExercise)
      randomExercises

  ###
  # AudioView
  #
  # Plays an audio file everytime it renders
  ###

  class AudioView extends Backbone.View

    el : $ 'div#audio'

    initialize:->
      @render()

    render: =>
      tmpl='''
              <audio id="gong" preload="auto" autobuffer autoplay>
		<source src="<%= audiosrc %>"/>
	      </audio>
           '''
      @audioEl = _.template(tmpl)
      $(@el.html(@audioEl({audiosrc : 'media/Ding.wav'})))
      @

  ###
  # AbExerciseView
  #
  # Creates main exercise view DOM, including the current exercise
  # name, a countdown of how much time is left, as well as all associated
  # animations.
  ###
  class AbExerciseView extends Backbone.View
    initialize: ->
      @current_exercise = ""
      @current_video = ""
      @num_flashes = 0
      @secs_left = 30
      @render

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
    render_next_exercise: (ex, secs, video) =>
      @current_exercise = ex
      @secs_left = 30
      @current_video = video
      @render()
      @audioView = new AudioView()
      @render_intro_animation()

      tmpl = '''
              <video autoplay loop onended="this.play()" poster="media/video_bg.jpg">
      				  <source src="media/<%= vid %>.webm" type="video/webm" />
                <source src="media/<%= vid %>.m4v" type="video/m4v" />
      				  Your browser does not support the video tag. Please upgrade your browser.
      				</video>
             '''
      @exercise_video = _.template(tmpl)
      $(@el.find("div#exercise_video").html(@exercise_video({ vid : @current_video})))

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
                       0:<span class="timerSeconds"><%= secs_left %></span>
                     </div>
                   '''
      else
        clock_tmpl = '''
                     <div class="span8 offset4">
                        <span class="timerSeconds lastTenSeconds"><%= secs_left %></span>
                     </div>
                     '''
      tmpl = tmpl + clock_tmpl + '</div>'
      @ab_exercise_view = _.template(tmpl)
      $(@el.find("div#exercise").html(@ab_exercise_view({ ex : @current_exercise, secs_left : @secs_left })))
      @

    reset_view: =>
      tmpl = '''
				     <div class="row">
  					   <div class="span16">
    					   <h2 class="currentExcercise">Get Ready!</h2>
  					   </div>
				      </div>
              '''
      @ab_exercise_view = _.template(tmpl)
      $(@el.find("div#exercise").html(@ab_exercise_view({})))
      $(@el.find("div#exercise_video").html(""))

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
      # orange : 4
      # red : 4
      # blue : 4
      # green : 6
      @exerciseColors =
        "crunch"      : "orange" # 4
        "lawn_chair"  : "green" # 2
        "bikes"       : "red"    # 2
        "crossover"   : "green" # 1
        "hold"        : "blue"  # 3
        "climb"       : "red"    # 1
        "jack_knives" : "red"    # 1
        "frogs"       : "green" # 1
        "plank"       : "blue"  # 3
      @render()

    render: =>
      @names = (ex.get('name') for ex in @workoutExercises)

      tmpl = '''
             <div class="span16">
               <%
                _.each(names, function(name) { %>
                 <div class="exercise"><%= name %></div>
               <% }); %>
             </div>
             '''
      @exercise_progress_bar = _.template(tmpl)
      $(@el.html(@exercise_progress_bar({ names : @names })))
      @

    render_increment_progress: (i) =>
      $("div.exercise").eq(i).addClass(@exerciseColors[@workoutExercises[i].get("type")])

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
    initialize: ->
      @abExerciseCollection = new AbExerciseCollection
      @abExerciseCollection.bind("reset",@populate_views)
      @abExerciseCollection.fetch()
      @currentIndex = 0

    populate_views: =>
      @startStopButton = new StartStopButtonView(el : $('#controls'))

      # Set up event binding for start/stop button
      @startStopButton.bind("start_clicked", @start_workout)
      @startStopButton.bind("stop_clicked", @stop_workout)

      @populate_workout_views()

    populate_workout_views: =>
      # Initialize views an get set of exercises
      @exercises = @abExerciseCollection.get_random_exercises()
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), exercises : @exercises)
      @abExerciseView = new AbExerciseView(el: $('#view_exercisePage'))

      # Set up event binding
      @abExerciseView.bind('intro_animation_end', @start_workout_countdown)
      @abExerciseView.bind('exercise_countdown_complete', @exercise_countdown_complete)

      # Put app into initial view state
      @workoutProgressView.el.hide()
      @abExerciseView.el.hide()

    start_workout: =>
      if (@currentIndex is 0)
        @abExerciseView.reset_view()
        @startStopButton.el.hide()
        $("div#view_splashPage").hide()
        @abExerciseView.el.show()
        setTimeout @start_workout_intro, 3000
      else
        @start_workout_intro
    start_workout_intro: =>
      secs = @exercises[@currentIndex].get("secs_in_countdown")
      name = @exercises[@currentIndex].get("name")
      video = @exercises[@currentIndex].get("video")
      @workoutProgressView.el.show()
      @startStopButton.el.show()
      @abExerciseView.render_next_exercise(name,secs,video)
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
      @populate_workout_views()
      $("div#view_splashPage").show()
      @abExerciseView.reset_view()

  window.app = new AbTimeApp
