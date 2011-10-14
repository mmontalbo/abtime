(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $(document).ready(function() {
    var AbExerciseCollection, AbExerciseProgressView, AbExerciseView, AbTimeApp, NUM_EXERCISES_IN_WORKOUT, WorkoutProgressView;
    AbExerciseCollection = (function() {
      __extends(AbExerciseCollection, Backbone.Collection);
      function AbExerciseCollection() {
        this.getExercises = __bind(this.getExercises, this);
        AbExerciseCollection.__super__.constructor.apply(this, arguments);
      }
      AbExerciseCollection.prototype.url = 'js/exercises.json';
      AbExerciseCollection.prototype.getExercises = function(n) {
        var exercises, i;
        if (n <= 0) {
          return [];
        }
        exercises = (function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = n - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            _results.push(this.at(i % this.length));
          }
          return _results;
        }).call(this);
        return exercises;
      };
      return AbExerciseCollection;
    })();
    AbExerciseView = (function() {
      __extends(AbExerciseView, Backbone.View);
      function AbExerciseView() {
        AbExerciseView.__super__.constructor.apply(this, arguments);
      }
      return AbExerciseView;
    })();
    AbExerciseProgressView = (function() {
      __extends(AbExerciseProgressView, Backbone.View);
      function AbExerciseProgressView() {
        AbExerciseProgressView.__super__.constructor.apply(this, arguments);
      }
      return AbExerciseProgressView;
    })();
    WorkoutProgressView = (function() {
      __extends(WorkoutProgressView, Backbone.View);
      function WorkoutProgressView() {
        this.create_exercise_progress_view = __bind(this.create_exercise_progress_view, this);
        WorkoutProgressView.__super__.constructor.apply(this, arguments);
      }
      WorkoutProgressView.prototype.initialize = function() {
        var i;
        this.workoutExercises = this.options.workoutExercises;
        return this.abExerciseProgressViews = (function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = this.workoutExercises.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            _results.push(this.create_exercise_progress_view(this.workoutExercises[i], i));
          }
          return _results;
        }).call(this);
      };
      WorkoutProgressView.prototype.create_exercise_progress_view = function(exercise, i) {
        return new AbExerciseProgressView({
          el: $('#timeline_exercise' + i)
        });
      };
      return WorkoutProgressView;
    })();
    NUM_EXERCISES_IN_WORKOUT = 10;
    AbTimeApp = (function() {
      __extends(AbTimeApp, Backbone.Router);
      function AbTimeApp() {
        this.populateViews = __bind(this.populateViews, this);
        AbTimeApp.__super__.constructor.apply(this, arguments);
      }
      AbTimeApp.prototype.initialize = function() {
        this.abExcericseCollection = new AbExerciseCollection;
        this.abExcericseCollection.bind("reset", this.populateViews);
        return this.abExcericseCollection.fetch();
      };
      AbTimeApp.prototype.populateViews = function() {
        var workoutExercises;
        workoutExercises = this.abExcericseCollection.getExercises(NUM_EXERCISES_IN_WORKOUT);
        this.workoutProgressView = new WorkoutProgressView({
          el: $('#timeline'),
          workoutExercises: workoutExercises
        });
        return this.abExerciseView = new AbExerciseView({
          el: $('#view_firstPage')
        });
      };
      return AbTimeApp;
    })();
    return window.app = new AbTimeApp;
  });
}).call(this);
