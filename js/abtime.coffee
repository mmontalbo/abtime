$(document).ready ->
  class AbExerciseCollection extends Backbone.Collection
    url : 'js/exercises.json'

    getExercises : (n) =>
      if n <= 0
        return []

      exercises = (@at(i % @length) for i in [0..n-1])
      return exercises

  class AbExerciseView extends Backbone.View

  class AbExerciseProgressView extends Backbone.View

  class WorkoutProgressView extends Backbone.View
    initialize: ->
      @workoutExercises = @options.workoutExercises
      @abExerciseProgressViews = (@create_exercise_progress_view(@workoutExercises[i],i) for i in [0..@workoutExercises.length-1])

    create_exercise_progress_view: (exercise, i) =>
      return new AbExerciseProgressView(el: $('#timeline_exercise'+i))

  NUM_EXERCISES_IN_WORKOUT = 10
  class AbTimeApp extends Backbone.Router
    initialize: ->
      @abExcericseCollection = new AbExerciseCollection
      @abExcericseCollection.bind("reset",@populateViews)
      @abExcericseCollection.fetch()

    populateViews: =>
      workoutExercises = @abExcericseCollection.getExercises(NUM_EXERCISES_IN_WORKOUT)
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), workoutExercises : workoutExercises)
      @abExerciseView = new AbExerciseView(el: $('#view_firstPage'))

  window.app = new AbTimeApp
