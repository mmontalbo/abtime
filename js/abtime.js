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
    /*
      # AbExerciseCollection
      #
      # Implements logic to fetch useful sets of exercises.
      # Its data source is a JSON document containing properties such
      # as exercise names.
      */
    var AbExerciseCollection, AbExerciseView, AbTimeApp, StartStopButtonView, WorkoutProgressView;
    AbExerciseCollection = (function() {
      __extends(AbExerciseCollection, Backbone.Collection);
      function AbExerciseCollection() {
        this.get_exercises = __bind(this.get_exercises, this);
        AbExerciseCollection.__super__.constructor.apply(this, arguments);
      }
      AbExerciseCollection.prototype.url = 'js/exercises.json';
      AbExerciseCollection.prototype.defaults = {
        'secs_in_countdown': 30
      };
      /*
          # get_exercises
          #
          # @param n int, number of exercises to return
          #
          # @return n exercises, repeating if the collection contains
          # less than n elements. If the collection contains no elements,
          # an empty list is returned.
          */
      AbExerciseCollection.prototype.get_exercises = function(n) {
        var exercises, i;
        if (n <= 0) {
          return [];
        }
        return exercises = (function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = n - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            _results.push(this.at(i % this.length));
          }
          return _results;
        }).call(this);
      };
      return AbExerciseCollection;
    })();
    /*
      # AbExerciseView
      #
      # Creates main exercise view DOM, including the current exercise
      # name, a countdown of how much time is left, as well as all associated
      # animations.
      */
    AbExerciseView = (function() {
      var NUM_FLASHES_ON_INTRO;
      __extends(AbExerciseView, Backbone.View);
      function AbExerciseView() {
        this.tick_countdown = __bind(this.tick_countdown, this);
        this.render = __bind(this.render, this);
        this.render_next_exercise = __bind(this.render_next_exercise, this);
        this.intro_animation_end = __bind(this.intro_animation_end, this);
        this.render_intro_animation = __bind(this.render_intro_animation, this);
        this.render_flash_low = __bind(this.render_flash_low, this);
        this.render_flash_high = __bind(this.render_flash_high, this);
        this.render_flash_normal = __bind(this.render_flash_normal, this);
        AbExerciseView.__super__.constructor.apply(this, arguments);
      }
      NUM_FLASHES_ON_INTRO = 3;
      AbExerciseView.prototype.initialize = function() {
        this.current_exercise = "";
        this.num_flashes = 0;
        this.secs_left = 30;
        return this.render();
      };
      AbExerciseView.prototype.render_flash_normal = function() {
        return this.el.animate({
          opacity: 1
        }, 150, this.intro_animation_end);
      };
      AbExerciseView.prototype.render_flash_high = function() {
        return this.el.animate({
          opacity: 0.75
        }, 150, this.render_intro_animation);
      };
      AbExerciseView.prototype.render_flash_low = function(callback) {
        return this.el.animate({
          opacity: 0.25
        }, 150, callback);
      };
      AbExerciseView.prototype.render_intro_animation = function() {
        if (this.num_flashes < NUM_FLASHES_ON_INTRO) {
          this.num_flashes++;
          this.render_flash_low(this.render_flash_high);
        } else {
          this.num_flashes = 0;
          this.render_flash_low(this.render_flash_normal);
        }
        return this;
      };
      AbExerciseView.prototype.intro_animation_end = function() {
        return this.trigger("intro_animation_end");
      };
      AbExerciseView.prototype.render_next_exercise = function(ex, secs) {
        this.current_exercise = ex;
        this.secs_left = 30;
        this.render();
        return this.render_intro_animation();
      };
      AbExerciseView.prototype.render = function() {
        var clock_tmpl, tmpl;
        tmpl = '<div class="row">\n  					   <div class="span8 offset4">\n    					   <h2 class="currentExcercise"><%= ex %></h2>\n  					   </div>\n </div>\n <div class="row" id="clock">';
        if (this.secs_left > 10) {
          clock_tmpl = '<div class="span8 offset4">\n  0:<span><%= secs_left %></span>\n</div>';
        } else {
          clock_tmpl = '<span class="lastTenSeconds"><%= secs_left %></span>';
        }
        tmpl = tmpl + clock_tmpl + '</div>';
        this.ab_exercise_view = _.template(tmpl);
        $(this.el.html(this.ab_exercise_view({
          ex: this.current_exercise,
          secs_left: this.secs_left
        })));
        return this;
      };
      AbExerciseView.prototype.tick_countdown = function() {
        this.secs_left--;
        if (this.secs_left === 0) {
          return this.trigger("exercise_countdown_complete");
        } else {
          return this.render();
        }
      };
      return AbExerciseView;
    })();
    /*
      # WorkoutProgressView
      #
      # Creates progress bar view DOM, including individual exercise progress
      # elements and controlling workout progress animation.
      */
    WorkoutProgressView = (function() {
      __extends(WorkoutProgressView, Backbone.View);
      function WorkoutProgressView() {
        this.render_clear_progress = __bind(this.render_clear_progress, this);
        this.render_increment_progress = __bind(this.render_increment_progress, this);
        this.render = __bind(this.render, this);
        WorkoutProgressView.__super__.constructor.apply(this, arguments);
      }
      WorkoutProgressView.prototype.initialize = function() {
        this.workoutExercises = this.options.exercises;
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
      WorkoutProgressView.prototype.render_increment_progress = function(i) {
        return $("div.exercise").eq(i).css("background-color", "blue");
      };
      WorkoutProgressView.prototype.render_clear_progress = function() {
        return $("div.exercise").css("background-color", "gray");
      };
      return WorkoutProgressView;
    })();
    /*
      # StartStopButtonView
      #
      # Creates start/stop button DOM and handles logic and signaling
      # associated with user interaction.
      */
    StartStopButtonView = (function() {
      __extends(StartStopButtonView, Backbone.View);
      function StartStopButtonView() {
        this.render = __bind(this.render, this);
        this.render_btn = __bind(this.render_btn, this);
        this.toggle_btn_state = __bind(this.toggle_btn_state, this);
        this.clicked_stop = __bind(this.clicked_stop, this);
        this.clicked_start = __bind(this.clicked_start, this);
        StartStopButtonView.__super__.constructor.apply(this, arguments);
      }
      StartStopButtonView.prototype.initialize = function() {
        this.isStarted = false;
        return this.render();
      };
      StartStopButtonView.prototype.events = {
        "click input[value='start']": "clicked_start",
        "click input[value='stop']": "clicked_stop"
      };
      StartStopButtonView.prototype.clicked_start = function() {
        this.isStarted = true;
        this.render_btn();
        return this.trigger("start_clicked");
      };
      StartStopButtonView.prototype.clicked_stop = function() {
        this.isStarted = false;
        this.render_btn();
        return this.trigger("stop_clicked");
      };
      StartStopButtonView.prototype.toggle_btn_state = function() {
        this.isStarted = !this.isStarted;
        return this.render_btn();
      };
      StartStopButtonView.prototype.render_btn = function() {
        if (this.isStarted) {
          this.el.children("input[value='start']").hide();
          return this.el.children("input[value='stop']").show();
        } else {
          this.el.children("input[value='start']").show();
          return this.el.children("input[value='stop']").hide();
        }
      };
      StartStopButtonView.prototype.render = function() {
        var tmpl;
        tmpl = '<input type="button" class="btn success" value="start">\n<input type="button" class="btn danger" value="stop">';
        this.start_stop_button = _.template(tmpl);
        $(this.el.html(this.start_stop_button()));
        this.render_btn();
        return this;
      };
      return StartStopButtonView;
    })();
    /*
      # AbTimeApp
      #
      # Main application logic responsible for intializing collection and views
      # and registering for appropriate application events based on time and user
      # interaction.
      */
    AbTimeApp = (function() {
      var NUM_EXERCISES_IN_WORKOUT;
      __extends(AbTimeApp, Backbone.Router);
      function AbTimeApp() {
        this.stop_workout = __bind(this.stop_workout, this);
        this.stop_workout_countdown = __bind(this.stop_workout_countdown, this);
        this.exercise_countdown_complete = __bind(this.exercise_countdown_complete, this);
        this.start_workout_countdown = __bind(this.start_workout_countdown, this);
        this.start_workout_intro = __bind(this.start_workout_intro, this);
        this.populate_views = __bind(this.populate_views, this);
        AbTimeApp.__super__.constructor.apply(this, arguments);
      }
      NUM_EXERCISES_IN_WORKOUT = 10;
      AbTimeApp.prototype.initialize = function() {
        this.abExerciseCollection = new AbExerciseCollection;
        this.abExerciseCollection.bind("reset", this.populate_views);
        this.abExerciseCollection.fetch();
        return this.currentIndex = 0;
      };
      AbTimeApp.prototype.populate_views = function() {
        this.exercises = this.abExerciseCollection.get_exercises(NUM_EXERCISES_IN_WORKOUT);
        this.startStopButton = new StartStopButtonView({
          el: $('#controls')
        });
        this.workoutProgressView = new WorkoutProgressView({
          el: $('#timeline'),
          exercises: this.exercises
        });
        this.abExerciseView = new AbExerciseView({
          el: $('#view_firstPage'),
          secs_in_countdown: this.exercises[this.currentIndex].get("secs_in_countdown")
        });
        this.startStopButton.bind("start_clicked", this.start_workout_intro);
        this.startStopButton.bind("stop_clicked", this.stop_workout);
        this.abExerciseView.bind('intro_animation_end', this.start_workout_countdown);
        this.abExerciseView.bind('exercise_countdown_complete', this.exercise_countdown_complete);
        this.workoutProgressView.el.hide();
        return this.abExerciseView.el.hide();
      };
      AbTimeApp.prototype.start_workout_intro = function() {
        var name, secs;
        secs = this.exercises[this.currentIndex].get("secs_in_countdown");
        name = this.exercises[this.currentIndex].get("name");
        $("div#view_splashPage").hide();
        this.workoutProgressView.el.show();
        this.abExerciseView.el.show();
        return this.abExerciseView.render_next_exercise(name, secs);
      };
      AbTimeApp.prototype.start_workout_countdown = function() {
        return $(document).everyTime("1s", "workoutCountdown", this.abExerciseView.tick_countdown);
      };
      AbTimeApp.prototype.exercise_countdown_complete = function() {
        this.workoutProgressView.render_increment_progress(this.currentIndex);
        this.currentIndex++;
        if (this.currentIndex < NUM_EXERCISES_IN_WORKOUT) {
          $(document).stopTime("workoutCountdown");
          return this.start_workout_intro();
        } else {
          return this.stop_workout_countdown();
        }
      };
      AbTimeApp.prototype.stop_workout_countdown = function() {
        this.startStopButton.toggle_btn_state();
        return this.stop_workout();
      };
      AbTimeApp.prototype.stop_workout = function() {
        this.currentIndex = 0;
        $(document).stopTime("workoutCountdown");
        this.abExerciseView.el.hide();
        this.workoutProgressView.render_clear_progress();
        this.workoutProgressView.el.hide();
        return $("div#view_splashPage").show();
      };
      return AbTimeApp;
    })();
    return window.app = new AbTimeApp;
  });
}).call(this);
