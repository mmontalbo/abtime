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
      @move_exercise_type_to_end(randomExercises, "plank")

    ###
    # move_exercise_type_to_end
    #
    # @param exercises array of exercise models
    # @param type string type of exercise to move to the end
    #
    # Moves all exercises of the given type to the end of the array by iterating
    # backwards through the array, swapping type exercises with the non-type exercises.
    #
    # @return exercises array with all exercises of the given type moved to the end
    ###
    move_exercise_type_to_end : (exercises, type) =>
      swapIndex = exercises.length - 1
      while exercises[swapIndex].get("type") is type
        swapIndex--

      i = swapIndex
      while i > -1
        if exercises[i].get("type") is type
          e = exercises[swapIndex]
          exercises[swapIndex] = exercises[i]
          exercises[i] = e
          swapIndex--
        i--
      exercises
  ###
  # AudioView
  #
  # Plays an audio file everytime it renders
  ###

  class AudioView extends Backbone.View

    el : $ 'div#audio'

    initialize:->
      @startSound = @el.find('audio').get(0)
      @endSound = @el.find('audio').get(1)
      @tickSound = @el.find('audio').get(2)
      @
    play:->
      @startSound.play()

    end:->
      @endSound.play()

    tick:->
      @tickSound.play()


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
    render_next_exercise: (ex, secs, video, description) =>
      @current_exercise = ex
      @secs_left = 30
      @current_video = video
      @current_description = description
      @render()
      @render_intro_animation()

      if @current_video == ""
        tmpl = '''
                <span class="exerciseDescription"><%= text %></span>
               '''
      else if true #check if mobile browser or not
        tmpl = '''
          		  <img src="media/<%= vid %>.gif" />
               '''
      else
        tmpl = '''
                  <video autoplay loop onended="this.play()">
          				  <source src="media/<%= vid %>.webm" type="video/webm" />
                    <source src="media/<%= vid %>.m4v" type="video/m4v" />
          				  Your browser does not support the video tag. Please upgrade your browser.
          				</video>
               '''
      @exercise_video = _.template(tmpl)
      $(@el.find("div#exercise_video").html(@exercise_video({ vid : @current_video, text : @current_description})))

    render: =>
      tmpl = '''
              <div class="row exerciseTitle">
  					   <div class="span16">
    					   <h2 class="currentExcercise"><%= ex %></h2>
  					   </div>
              </div>
             '''

      clock_tmpl = "<div class='row' id='clock'>"

      if @secs_left > 10
        clock_tmpl = '''
                     <div class="span8 offset4 clock">
                       0:<span class="timerSeconds"><%= secs_left %></span>
                     </div>
                   '''
      else
        clock_tmpl = '''
                     <div class="span8 offset4 clock">
                        <span class="timerSeconds lastTenSeconds"><%= secs_left %></span>
                     </div>
                     '''
      clock_tmpl = clock_tmpl + "</div>"

      tmpl = clock_tmpl + tmpl
      @ab_exercise_view = _.template(tmpl)
      $(@el.find("div#exercise").html(@ab_exercise_view({ ex : @current_exercise, secs_left : @secs_left })))
      @

    reset_view: =>
      tmpl = '''
				     <div class="row">
  					   <div class="span16">
    					   <h1>Get Ready!</h1>
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
      else if @secs_left < 4 and @secs_left > 0
        @trigger("exercise_countdown_almost_complete")
        @render()
      else
        @render()


  ###
  # SummaryView
  #
  # Creates a view that summarizes the workout
  ###
  class SummaryView extends Backbone.View
    initialize: ->
      @workoutExercises = @options.exercises
      @render()

    render: ->
      tmpl = '''
				     <h2>Another abtime in the books!</h2>
              <ul id="exercisesCompleted">
              <% _.each(exercises, function(ex){ %> <li> <%= ex.get("name") %> </li> <% }); %>
              </ul>
             '''
      @workoutSummaryView = _.template(tmpl)
      $(@el.html(@workoutSummaryView({exercises: @workoutExercises})))
      @

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
        "crunch"      : "orange" # :4
        "lawn_chair"  : "green" # :2
        "bikes"       : "red"    # :2
        "crossover"   : "green" # :1
        "hold"        : "blue"  # :3
        "climb"       : "red"    # :1
        "jack_knives" : "red"    # :1
        "frogs"       : "green" # :1
        "plank"       : "blue"  # :3

      #@names = (ex.get('name') for ex in @workoutExercises)
      #@types = (ex.get('type') for ex in @workoutExercises)

      @render()

    render: =>

      @timelineHTML = "<ul class='workoutBar'>"
      for ex in @workoutExercises
        @timelineHTML = @timelineHTML + "<li class='exercise "+@exerciseColors[ex.get('type')]+"'><div class='bubble' >" + ex.get('name') + "</div></li>"
        #@timelineHTML = @timelineHTML + "<div class='exercise "+@exerciseColors[ex.get('type')]+"'>" + "</div>"

      @timelineHTML = "<div class='span16'>"+@timelineHTML+"</ul></div>"

      $(@el.html(@timelineHTML))
      @

    render_increment_progress: (i) =>
      $("li.exercise").eq(i).addClass("exerciseComplete")

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
  # WallpaperView
  #
  # Assigns and controls the wallpaper (aka background image)
  ###

  class WallpaperView extends Backbone.View

    el : $ ('body')

    initialize: ->
      @setRandomWallpaper()
      @render

    render: ->
      @

    setRandomWallpaper: ->
      rand = Math.ceil(Math.random() * 21)
      cssBGProperty = "url('media/bg/bg_"+rand+".jpg') no-repeat center center fixed"
      @el.css("background",cssBGProperty)
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
      @audioView = new AudioView()
      @wallpaperView = new WallpaperView()

    populate_views: =>
      @startStopButton = new StartStopButtonView(el : $('#controls'))

      # Set up event binding for start/stop button
      @startStopButton.bind("start_clicked", @start_workout)
      @startStopButton.bind("stop_clicked", @stop_workout)

      @populate_workout_views()

    populate_workout_views: =>
      # Initialize views and get set of exercises
      @exercises = @abExerciseCollection.get_random_exercises()
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), exercises : @exercises)
      @abExerciseView = new AbExerciseView(el: $('#view_exercisePage'))
      @workoutSummaryView = new SummaryView(el: $('#view_summaryPage'), exercises: @exercises)

      # Set up event binding
      @abExerciseView.bind('intro_animation_end', @start_workout_countdown)
      @abExerciseView.bind('exercise_countdown_complete', @exercise_countdown_complete)

      @abExerciseView.bind('exercise_countdown_almost_complete', @exercise_countdown_play_sound)

      # Put app into initial view state
      @workoutProgressView.el.hide()
      @abExerciseView.el.hide()
      @workoutSummaryView.el.hide()

    start_workout: =>
      if (@currentIndex is 0)
        $("h1").hide();
        @abExerciseView.reset_view()
        @startStopButton.el.hide()
        $("div#view_splashPage").hide()
        @workoutSummaryView.el.hide()
        @abExerciseView.el.show()
        @audioView.play()
        setTimeout @start_workout_intro, 3000
      else
        @start_workout_intro
    start_workout_intro: =>
      secs = @exercises[@currentIndex].get("secs_in_countdown")
      name = @exercises[@currentIndex].get("name")
      video = @exercises[@currentIndex].get("video")
      description = @exercises[@currentIndex].get("description")
      @workoutProgressView.el.show()
      @startStopButton.el.show()
      @abExerciseView.render_next_exercise(name,secs,video,description)
    start_workout_countdown: =>
      @workoutProgressView.render_increment_progress(@currentIndex)
      $(document).everyTime("1s","workoutCountdown",@abExerciseView.tick_countdown)
    exercise_countdown_play_sound: =>
      @audioView.tick()
    exercise_countdown_complete: =>
      @currentIndex++
      if @currentIndex < NUM_EXERCISES_IN_WORKOUT
        @audioView.play()
        $(document).stopTime("workoutCountdown")
        @start_workout_intro()
      else
        @audioView.end()
        @stop_workout_countdown()
    stop_workout_countdown: =>
      @startStopButton.toggle_btn_state()
      @stop_workout()
    stop_workout: =>
      $(document).stopTime("workoutCountdown")
      @populate_workout_views()
      @abExerciseView.reset_view()

      if @currentIndex == NUM_EXERCISES_IN_WORKOUT
        @workoutSummaryView.el.show()
      else
        $("h1").show();
        $("div#view_splashPage").show()

      @currentIndex = 0



  window.app = new AbTimeApp
