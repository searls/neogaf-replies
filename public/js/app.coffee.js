(function() {
  var App, LoginView, Replies, RepliesView, Reply, User, md5, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = this;

  md5 = root;

  root.gafBaseUrl = function() {
    if ($(window).width() <= 1024) {
      return "http://m.neogaf.com/";
    } else {
      return "http://www.neogaf.com/forum/";
    }
  };

  User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.localStorage = new Backbone.LocalStorage("User");

    User.prototype.initialize = function() {
      return this.set({
        id: 1
      });
    };

    User.prototype.loggedIn = function() {
      return this.get('user') && this.get('pass');
    };

    return User;

  })(Backbone.Model);

  Reply = (function(_super) {

    __extends(Reply, _super);

    function Reply() {
      return Reply.__super__.constructor.apply(this, arguments);
    }

    return Reply;

  })(Backbone.Model);

  Replies = (function(_super) {

    __extends(Replies, _super);

    function Replies() {
      this.destroyAll = __bind(this.destroyAll, this);

      this.fetchRepliesFor = __bind(this.fetchRepliesFor, this);
      return Replies.__super__.constructor.apply(this, arguments);
    }

    Replies.prototype.localStorage = new Backbone.LocalStorage("Replies");

    Replies.prototype.model = Reply;

    Replies.prototype.comparator = function(reply) {
      return parseInt(reply.id, 10) * -1;
    };

    Replies.prototype.fetchRepliesFor = function(user) {
      var _this = this;
      return $.post('/api/replies', user.toJSON(), function(replies) {
        if ((replies != null ? replies.length : void 0) > 0) {
          _(replies).each(function(reply) {
            return _this.create(reply);
          });
          return _this.trigger('reset');
        } else {
          return _this.trigger('alert', 'No replies found');
        }
      });
    };

    Replies.prototype.destroyAll = function() {
      var _this = this;
      _(this.models.slice(0)).each(function(reply) {
        return reply.destroy();
      });
      return this.trigger('reset');
    };

    return Replies;

  })(Backbone.Collection);

  LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = "app/templates/login.us";

    LoginView.prototype.events = {
      'submit form': 'saveUser'
    };

    LoginView.prototype.saveUser = function(e) {
      var attrs;
      e.preventDefault();
      attrs = {
        user: this.user(),
        pass: this.pass()
      };
      if (attrs.user && attrs.pass) {
        this.model.save(attrs);
        return this.trigger('navigate');
      }
    };

    LoginView.prototype.user = function() {
      return this.$(':input[name="user"]').val();
    };

    LoginView.prototype.pass = function() {
      var pass;
      if (pass = this.$(':input[name="pass"]').val()) {
        return md5.hex_md5(pass);
      }
    };

    return LoginView;

  })(Backbone.Fixins.SuperView);

  RepliesView = (function(_super) {

    __extends(RepliesView, _super);

    function RepliesView() {
      return RepliesView.__super__.constructor.apply(this, arguments);
    }

    RepliesView.prototype.template = "app/templates/replies.us";

    RepliesView.prototype.events = {
      'click .fetch': 'fetchReplies',
      'click .delete': 'deleteReplies',
      'click .logout': 'logout'
    };

    RepliesView.prototype.initialize = function(options) {
      var _this = this;
      this.user = options.user;
      this.collection.fetch();
      return this.collection.on('reset ', function() {
        return _this.render();
      });
    };

    RepliesView.prototype.fetchReplies = function(e) {
      e.preventDefault();
      return this.collection.fetchRepliesFor(this.user);
    };

    RepliesView.prototype.deleteReplies = function(e) {
      e.preventDefault();
      return this.collection.destroyAll();
    };

    RepliesView.prototype.logout = function(e) {
      e.preventDefault();
      this.user.save({
        user: void 0,
        pass: void 0
      });
      return this.trigger('navigate');
    };

    return RepliesView;

  })(Backbone.Fixins.SuperView);

  App = (function() {

    function App() {
      this.renderPage = __bind(this.renderPage, this);

      var _this = this;
      this.user = _(new User()).tap(function(u) {
        return u.fetch();
      });
      this.views = {
        login: new LoginView({
          model: this.user
        }),
        replies: new RepliesView({
          user: this.user,
          collection: new Replies
        })
      };
      _(this.views).each(function(view) {
        return view.on('navigate', _this.renderPage);
      });
    }

    App.prototype.renderPage = function() {
      $('#app').html(this.currentView().render().el);
      return this.currentView().delegateEvents();
    };

    App.prototype.currentView = function() {
      if (this.user.loggedIn()) {
        return this.views.replies;
      } else {
        return this.views.login;
      }
    };

    return App;

  })();

  $(function() {
    return new App().renderPage();
  });

}).call(this);
