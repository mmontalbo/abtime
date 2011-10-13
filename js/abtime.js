(function() {
  var AbExerciseCollection, AbExercises;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  AbExerciseCollection = (function() {
    __extends(AbExerciseCollection, Backbone.Collection);
    function AbExerciseCollection() {
      AbExerciseCollection.__super__.constructor.apply(this, arguments);
    }
    AbExerciseCollection.prototype.url = 'js/exercises.json';
    return AbExerciseCollection;
  })();
  AbExercises = new AbExerciseCollection;
  AbExercises.fetch();
  /*
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
  */
}).call(this);
