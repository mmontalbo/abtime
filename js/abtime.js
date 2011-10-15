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
    var AbExerciseCollection, AbExerciseView, AbTimeApp, NUM_EXERCISES_IN_WORKOUT, WorkoutProgressView;
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
    WorkoutProgressView = (function() {
      __extends(WorkoutProgressView, Backbone.View);
      function WorkoutProgressView() {
        this.render = __bind(this.render, this);
        WorkoutProgressView.__super__.constructor.apply(this, arguments);
      }
      WorkoutProgressView.prototype.initialize = function() {
        this.workoutExercises = this.options.workoutExercises;
        return this.render();
      };
      WorkoutProgressView.prototype.render = function() {
        var ex, tmpl;
        this.names = (function() {
          var _i, _len, _ref, _results;
          _ref = this.workoutExercises;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ex = _ref[_i];
            _results.push(ex.get('name'));
          }
          return _results;
        }).call(this);
        tmpl = '<div class="span16">\n  <% _.each(exercises, function(exercise) { %>\n    <div class="exercise"><%= exercise %></div>\n  <% }); %>\n</div>';
        this.exercise_progress_bar = _.template(tmpl);
        $(this.el.html(this.exercise_progress_bar({
          exercises: this.names
        })));
        return this;
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
        var exercises;
        exercises = this.abExcericseCollection.getExercises(NUM_EXERCISES_IN_WORKOUT);
        this.workoutProgressView = new WorkoutProgressView({
          el: $('#timeline'),
          workoutExercises: exercises
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
