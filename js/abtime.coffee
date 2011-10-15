$(document).ready ->
  class AbExerciseCollection extends Backbone.Collection
    url : 'js/exercises.json'

    getExercises : (n) =>
      if n <= 0
        return []

      exercises = (@at(i % @length) for i in [0..n-1])
      return exercises

  class AbExerciseView extends Backbone.View

  class WorkoutProgressView extends Backbone.View
    initialize: ->
      @workoutExercises = @options.workoutExercises
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

  NUM_EXERCISES_IN_WORKOUT = 10
  class AbTimeApp extends Backbone.Router
    initialize: ->
      @abExcericseCollection = new AbExerciseCollection
      @abExcericseCollection.bind("reset",@populateViews)
      @abExcericseCollection.fetch()

    populateViews: =>
      exercises = @abExcericseCollection.getExercises(NUM_EXERCISES_IN_WORKOUT)
      @workoutProgressView = new WorkoutProgressView(el: $('#timeline'), workoutExercises : exercises)
      @abExerciseView = new AbExerciseView(el: $('#view_firstPage'))

  window.app = new AbTimeApp
