(function() {
  /*
  # http://stackoverflow.com/questions/4825812/
  # clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
  #
  # removes item at index e from array
  */  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Array.prototype.remove = function(e) {
    var t, _ref;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };
  $(document).ready(function() {
    var AbExerciseCollection, AbExerciseView, AbTimeApp, AudioView, NUM_EXERCISES_IN_WORKOUT, NUM_FLASHES_ON_INTRO, StartStopButtonView, SummaryView, WallpaperView, WorkoutProgressView;
    NUM_EXERCISES_IN_WORKOUT = 10;
    NUM_FLASHES_ON_INTRO = 3;
    /*
      # AbExerciseCollection
      #
      # Implements logic to fetch useful sets of exercises.
      # Its data source is a JSON document containing properties such
      # as exercise names.
      */
    AbExerciseCollection = (function() {
      __extends(AbExerciseCollection, Backbone.Collection);
      function AbExerciseCollection() {
        this.move_exercise_type_to_end = __bind(this.move_exercise_type_to_end, this);
        this.get_random_exercises = __bind(this.get_random_exercises, this);
        this.get_exercises = __bind(this.get_exercises, this);
        this.get_random_exercises = __bind(this.get_random_exercises, this);
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
        if (n == null) {
          n = NUM_EXERCISES_IN_WORKOUT;
        }
        if (n <= 0 || this.length === 0) {
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
      /*
          # get_random_exercises
          #
          # @param n int, number of exercises to return
          # @param r int, maximum number of times an exercise should repeat
          #
          # @return n random exercises, with exercises repeating at most r
          # times throughout the workout
          */
      AbExerciseCollection.prototype.get_random_exercises = function(n, r) {
        if (n == null) {
          n = NUM_EXERCISES_IN_WORKOUT;
        }
        if (r == null) {
          r = 1;
        }
        if (n <= 0) {
          return [];
        }
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
        if (n == null) {
          n = NUM_EXERCISES_IN_WORKOUT;
        }
        if (n <= 0 || this.length === 0) {
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
      /*
          # get_random_exercises
          #
          # @param n int, number of exercises to return
          # @param r int, maximum number of times an exercise should repeat
          #
          # @return n random exercises, with exercises repeating at most r
          # times throughout the workout
          */
      AbExerciseCollection.prototype.get_random_exercises = function(n, r) {
        var exercises, exercisesChosen, m, rand, randomExercise, randomExerciseName, randomExercises, _ref;
        if (n == null) {
          n = NUM_EXERCISES_IN_WORKOUT;
        }
        if (r == null) {
          r = 1;
        }
        if (n <= 0) {
          return [];
        }
        exercises = (function() {
          var _i, _len, _ref, _results;
          _ref = this.models;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            m = _ref[_i];
            _results.push(m);
          }
          return _results;
        }).call(this);
        exercisesChosen = {};
        randomExercises = [];
        while (exercises.length > 0 && randomExercises.length < n) {
          rand = Math.floor(Math.random() * exercises.length);
          randomExercise = exercises[rand];
          randomExercises.push(randomExercise);
          randomExerciseName = randomExercise.get("name");
                    if ((_ref = exercisesChosen[randomExerciseName]) != null) {
            _ref;
          } else {
            exercisesChosen[randomExerciseName] = 0;
          };
          if (r === 1) {
            exercises.remove(randomExercise);
          } else if (exercisesChosen[randomExerciseName] < r - 1) {
            exercisesChosen[randPick]++;
          } else if (exercisesChosen[randomExerciseName] < r) {
            exercises.remove(randomExercise);
          }
        }
        return this.move_exercise_type_to_end(randomExercises, "plank");
      };
      /*
          # move_exercise_type_to_end
          #
          # @param exercises array of exercise models
          # @param type string type of exercise to move to the end
          #
          # Moves all exercises of the given type to the end of the array by iterating
          # backwards through the array, swapping type exercises with the non-type exercises.
          #
          # @return exercises array with all exercises of the given type moved to the end
          */
      AbExerciseCollection.prototype.move_exercise_type_to_end = function(exercises, type) {
        var e, i, swapIndex;
        swapIndex = exercises.length - 1;
        while (exercises[swapIndex].get("type") === type) {
          swapIndex--;
        }
        i = swapIndex;
        while (i > -1) {
          if (exercises[i].get("type") === type) {
            e = exercises[swapIndex];
            exercises[swapIndex] = exercises[i];
            exercises[i] = e;
            swapIndex--;
          }
          i--;
        }
        return exercises;
      };
      return AbExerciseCollection;
    })();
    /*
      # AudioView
      #
      # Plays an audio file everytime it renders
      */
    AudioView = (function() {
      __extends(AudioView, Backbone.View);
      function AudioView() {
        AudioView.__super__.constructor.apply(this, arguments);
      }
      AudioView.prototype.el = $('div#audio');
      AudioView.prototype.initialize = function() {
        this.startSound = this.el.find('audio').get(0);
        this.endSound = this.el.find('audio').get(1);
        this.tickSound = this.el.find('audio').get(2);
        return this;
      };
      AudioView.prototype.play = function() {
        return this.startSound.play();
      };
      AudioView.prototype.end = function() {
        return this.endSound.play();
      };
      AudioView.prototype.tick = function() {
        return this.tickSound.play();
      };
      return AudioView;
    })();
    /*
      # AbExerciseView
      #
      # Creates main exercise view DOM, including the current exercise
      # name, a countdown of how much time is left, as well as all associated
      # animations.
      */
    AbExerciseView = (function() {
      __extends(AbExerciseView, Backbone.View);
      function AbExerciseView() {
        this.tick_countdown = __bind(this.tick_countdown, this);
        this.reset_view = __bind(this.reset_view, this);
        this.render = __bind(this.render, this);
        this.render_next_exercise = __bind(this.render_next_exercise, this);
        this.render_intro_animation = __bind(this.render_intro_animation, this);
        this.render_flash_low = __bind(this.render_flash_low, this);
        this.render_flash_high = __bind(this.render_flash_high, this);
        this.render_flash_normal = __bind(this.render_flash_normal, this);
        this.intro_animation_end = __bind(this.intro_animation_end, this);
        AbExerciseView.__super__.constructor.apply(this, arguments);
      }
      AbExerciseView.prototype.initialize = function() {
        this.current_exercise = "";
        this.current_video = "";
        this.num_flashes = 0;
        this.secs_left = 30;
        return this.render;
      };
      AbExerciseView.prototype.intro_animation_end = function() {
        return this.trigger("intro_animation_end");
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
      AbExerciseView.prototype.render_next_exercise = function(ex, secs, video, description) {
        var tmpl;
        this.current_exercise = ex;
        this.secs_left = 30;
        this.current_video = video;
        this.current_description = description;
        this.render();
        this.render_intro_animation();
        if (this.current_video === "") {
          tmpl = '<span class="exerciseDescription"><%= text %></span>';
        } else if (true) {
          tmpl = '<img src="media/<%= vid %>.gif" />';
        } else {
          tmpl = '                  <video autoplay loop onended="this.play()">\n  <source src="media/<%= vid %>.webm" type="video/webm" />\n                    <source src="media/<%= vid %>.m4v" type="video/m4v" />\n  Your browser does not support the video tag. Please upgrade your browser.\n</video>';
        }
        this.exercise_video = _.template(tmpl);
        return $(this.el.find("div#exercise_video").html(this.exercise_video({
          vid: this.current_video,
          text: this.current_description
        })));
      };
      AbExerciseView.prototype.render = function() {
        var clock_tmpl, tmpl;
        tmpl = '              <div class="row exerciseTitle">\n<div class="span16">\n    					   <h2 class="currentExcercise"><%= ex %></h2>\n</div>\n              </div>';
        clock_tmpl = "<div class='row' id='clock'>";
        if (this.secs_left > 10) {
          clock_tmpl = '<div class="span8 offset4 clock">\n  0:<span class="timerSeconds"><%= secs_left %></span>\n</div>';
        } else {
          clock_tmpl = '<div class="span8 offset4 clock">\n   <span class="timerSeconds lastTenSeconds"><%= secs_left %></span>\n</div>';
        }
        clock_tmpl = clock_tmpl + "</div>";
        tmpl = clock_tmpl + tmpl;
        this.ab_exercise_view = _.template(tmpl);
        $(this.el.find("div#exercise").html(this.ab_exercise_view({
          ex: this.current_exercise,
          secs_left: this.secs_left
        })));
        return this;
      };
      AbExerciseView.prototype.reset_view = function() {
        var tmpl;
        tmpl = '<div class="row">\n  					   <div class="span16">\n    					   <h1>Get Ready!</h1>\n  					   </div>\n </div>';
        this.ab_exercise_view = _.template(tmpl);
        $(this.el.find("div#exercise").html(this.ab_exercise_view({})));
        return $(this.el.find("div#exercise_video").html(""));
      };
      AbExerciseView.prototype.tick_countdown = function() {
        this.secs_left--;
        if (this.secs_left === 0) {
          return this.trigger("exercise_countdown_complete");
        } else if (this.secs_left < 4 && this.secs_left > 0) {
          this.trigger("exercise_countdown_almost_complete");
          return this.render();
        } else {
          return this.render();
        }
      };
      return AbExerciseView;
    })();
    /*
      # SummaryView
      #
      # Creates a view that summarizes the workout
      */
    SummaryView = (function() {
      __extends(SummaryView, Backbone.View);
      function SummaryView() {
        SummaryView.__super__.constructor.apply(this, arguments);
      }
      SummaryView.prototype.initialize = function() {
        this.workoutExercises = this.options.exercises;
        return this.render();
      };
      SummaryView.prototype.render = function() {
        var credits, tmpl;
        tmpl = '<h2>Another abtime in the books!</h2>\n              <ul id="exercisesCompleted">\n              <% _.each(exercises, function(ex){ %> <li> <%= ex.get("name") %> </li> <% }); %>\n              </ul>';
        this.workoutSummaryView = _.template(tmpl);
        $(this.el.html(this.workoutSummaryView({
          exercises: this.workoutExercises
        })));
        credits = '              <h3>Shot and directed by: <a href="http://www.imdb.com/name/nm0158432/" target="_blank" >Tony Chui</a></h3>\n<h3>Exercise model #1 (red belt): <a href="mailto:missnayda@gmail.com">Nayda Lebron</a></h3>\n<h3>Exercise model #2 (pink top): <a href="http://www.fabiennemaurer.com" target="_blank" >Fabienne Maurer</a></h3>\n          		<h3>Exercise model #3 (black top): <a href="http://www.brendanicolewalsh.com" target="_blank" >Brenda Nicole Walsh</a></h3>';
        $(this.el.append(credits));
        return this;
      };
      return SummaryView;
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
        this.exerciseColors = {
          "crunch": "orange",
          "lawn_chair": "green",
          "bikes": "red",
          "crossover": "green",
          "hold": "blue",
          "climb": "red",
          "jack_knives": "red",
          "frogs": "green",
          "plank": "blue"
        };
        return this.render();
      };
      WorkoutProgressView.prototype.render = function() {
        var ex, _i, _len, _ref;
        this.timelineHTML = "<ul class='workoutBar'>";
        _ref = this.workoutExercises;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ex = _ref[_i];
          this.timelineHTML = this.timelineHTML + "<li class='exercise " + this.exerciseColors[ex.get('type')] + "'><div class='bubble' >" + ex.get('name') + "</div></li>";
        }
        this.timelineHTML = "<div class='span16'>" + this.timelineHTML + "</ul></div>";
        $(this.el.html(this.timelineHTML));
        return this;
      };
      WorkoutProgressView.prototype.render_increment_progress = function(i) {
        return $("li.exercise").eq(i).addClass("exerciseComplete");
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
      # WallpaperView
      #
      # Assigns and controls the wallpaper (aka background image)
      */
    WallpaperView = (function() {
      __extends(WallpaperView, Backbone.View);
      function WallpaperView() {
        WallpaperView.__super__.constructor.apply(this, arguments);
      }
      WallpaperView.prototype.el = $('body');
      WallpaperView.prototype.initialize = function() {
        this.setRandomWallpaper();
        return this.render;
      };
      WallpaperView.prototype.render = function() {
        return this;
      };
      WallpaperView.prototype.setRandomWallpaper = function() {
        var cssBGProperty, rand;
        rand = Math.ceil(Math.random() * 21);
        cssBGProperty = "url('media/bg/bg_" + rand + ".jpg') no-repeat center center fixed";
        this.el.css("background", cssBGProperty);
        return this;
      };
      return WallpaperView;
    })();
    /*
      # AbTimeApp
      #
      # Main application logic responsible for intializing collection and views
      # and registering for appropriate application events based on time and user
      # interaction.
      */
    AbTimeApp = (function() {
      __extends(AbTimeApp, Backbone.Router);
      function AbTimeApp() {
        this.stop_workout = __bind(this.stop_workout, this);
        this.stop_workout_countdown = __bind(this.stop_workout_countdown, this);
        this.exercise_countdown_complete = __bind(this.exercise_countdown_complete, this);
        this.exercise_countdown_play_sound = __bind(this.exercise_countdown_play_sound, this);
        this.start_workout_countdown = __bind(this.start_workout_countdown, this);
        this.start_workout_intro = __bind(this.start_workout_intro, this);
        this.start_workout = __bind(this.start_workout, this);
        this.populate_workout_views = __bind(this.populate_workout_views, this);
        this.populate_views = __bind(this.populate_views, this);
        AbTimeApp.__super__.constructor.apply(this, arguments);
      }
      AbTimeApp.prototype.initialize = function() {
        this.abExerciseCollection = new AbExerciseCollection;
        this.abExerciseCollection.bind("reset", this.populate_views);
        this.abExerciseCollection.fetch();
        this.currentIndex = 0;
        this.audioView = new AudioView();
        return this.wallpaperView = new WallpaperView();
      };
      AbTimeApp.prototype.populate_views = function() {
        this.startStopButton = new StartStopButtonView({
          el: $('#controls')
        });
        this.startStopButton.bind("start_clicked", this.start_workout);
        this.startStopButton.bind("stop_clicked", this.stop_workout);
        return this.populate_workout_views();
      };
      AbTimeApp.prototype.populate_workout_views = function() {
        this.exercises = this.abExerciseCollection.get_random_exercises();
        this.workoutProgressView = new WorkoutProgressView({
          el: $('#timeline'),
          exercises: this.exercises
        });
        this.abExerciseView = new AbExerciseView({
          el: $('#view_exercisePage')
        });
        this.workoutSummaryView = new SummaryView({
          el: $('#view_summaryPage'),
          exercises: this.exercises
        });
        this.abExerciseView.bind('intro_animation_end', this.start_workout_countdown);
        this.abExerciseView.bind('exercise_countdown_complete', this.exercise_countdown_complete);
        this.abExerciseView.bind('exercise_countdown_almost_complete', this.exercise_countdown_play_sound);
        this.workoutProgressView.el.hide();
        this.abExerciseView.el.hide();
        return this.workoutSummaryView.el.hide();
      };
      AbTimeApp.prototype.start_workout = function() {
        if (this.currentIndex === 0) {
          $("h1").hide();
          this.abExerciseView.reset_view();
          this.startStopButton.el.hide();
          $("div#view_splashPage").hide();
          this.workoutSummaryView.el.hide();
          this.abExerciseView.el.show();
          this.audioView.play();
          return setTimeout(this.start_workout_intro, 3000);
        } else {
          return this.start_workout_intro;
        }
      };
      AbTimeApp.prototype.start_workout_intro = function() {
        var description, name, secs, video;
        secs = this.exercises[this.currentIndex].get("secs_in_countdown");
        name = this.exercises[this.currentIndex].get("name");
        video = this.exercises[this.currentIndex].get("video");
        description = this.exercises[this.currentIndex].get("description");
        this.workoutProgressView.el.show();
        this.startStopButton.el.show();
        return this.abExerciseView.render_next_exercise(name, secs, video, description);
      };
      AbTimeApp.prototype.start_workout_countdown = function() {
        this.workoutProgressView.render_increment_progress(this.currentIndex);
        return $(document).everyTime("1s", "workoutCountdown", this.abExerciseView.tick_countdown);
      };
      AbTimeApp.prototype.exercise_countdown_play_sound = function() {
        return this.audioView.tick();
      };
      AbTimeApp.prototype.exercise_countdown_complete = function() {
        this.currentIndex++;
        if (this.currentIndex < NUM_EXERCISES_IN_WORKOUT) {
          this.audioView.play();
          $(document).stopTime("workoutCountdown");
          return this.start_workout_intro();
        } else {
          this.audioView.end();
          return this.stop_workout_countdown();
        }
      };
      AbTimeApp.prototype.stop_workout_countdown = function() {
        this.startStopButton.toggle_btn_state();
        return this.stop_workout();
      };
      AbTimeApp.prototype.stop_workout = function() {
        $(document).stopTime("workoutCountdown");
        this.populate_workout_views();
        this.abExerciseView.reset_view();
        if (this.currentIndex === NUM_EXERCISES_IN_WORKOUT) {
          this.workoutSummaryView.el.show();
        } else {
          $("h1").show();
          $("div#view_splashPage").show();
        }
        return this.currentIndex = 0;
      };
      return AbTimeApp;
    })();
    return window.app = new AbTimeApp;
  });
}).call(this);
