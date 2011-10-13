class AbExerciseCollection extends Backbone.Collection
  url : 'js/exercises.json'

AbExercises = new AbExerciseCollection
AbExercises.fetch()

###
  class AbExerciseView extends Backbone.View
    initialize: ->
      continue

    events:
      "click #send_feedback" : "send_feedback"

  class WorkoutProgressView extends Backbone.View
    initialize: ->
      continue

    events:
      "click #send_feedback" : "send_feedback"

  class AbExerciseProgressView extends Backbone.View
    initialize: ->
      continue

    events:
      "click #send_feedback" : "send_feedback"

  class AbTimeApp extends Backbone.Router
    initialize: ->
      continue
###