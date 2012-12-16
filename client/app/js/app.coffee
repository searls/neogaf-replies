root = this
md5 = root

root.gafBaseUrl = ->
  if $(window).width() <= 1024
    "http://m.neogaf.com/"
  else
    "http://www.neogaf.com/forum/"


class User extends Backbone.Model
  localStorage: new Backbone.LocalStorage("User")

  initialize: -> @set(id: 1)

  loggedIn: -> @get('user') && @get('pass')

class Reply extends Backbone.Model

class Replies extends Backbone.Collection
  localStorage: new Backbone.LocalStorage("Replies")
  model: Reply

  comparator: (reply) -> parseInt(reply.id, 10) * -1

  fetchRepliesFor: (user) =>
    $.post '/api/replies', user.toJSON(), (replies) =>
      if replies?.length > 0
        _(replies).each (reply) => @create(reply)
        @trigger('reset')
      else
        @trigger('alert', 'No replies found')

  destroyAll: =>
    _(@models.slice(0)).each (reply) => reply.destroy()
    @trigger('reset')

class LoginView extends Backbone.Fixins.SuperView
  template: "app/templates/login.us"

  events:
    'submit form': 'saveUser'

  saveUser: (e) ->
    e.preventDefault()
    attrs = user: @user(), pass: @pass()
    if attrs.user && attrs.pass
      @model.save(attrs)
      @trigger('navigate')

  user: ->
    @$(':input[name="user"]').val()

  pass: ->
    if pass = @$(':input[name="pass"]').val()
      md5.hex_md5(pass)


class RepliesView extends Backbone.Fixins.SuperView
  template: "app/templates/replies.us"

  events:
    'click .fetch': 'fetchReplies'
    'click .delete': 'deleteReplies'
    'click .logout': 'logout'

  initialize: (options) ->
    @user = options.user
    @collection.fetch()
    @collection.on('reset ', => @render())

  fetchReplies: (e) ->
    e.preventDefault()
    @collection.fetchRepliesFor(@user)

  deleteReplies: (e) ->
    e.preventDefault()
    @collection.destroyAll()

  logout: (e) ->
    e.preventDefault()
    @user.save(user: undefined, pass: undefined)
    @trigger('navigate')

class App
  constructor: ->
    @user = _(new User()).tap (u) -> u.fetch()
    @views =
      login: new LoginView(model: @user)
      replies: new RepliesView(user: @user, collection: new Replies)

    _(@views).each (view) => view.on('navigate', @renderPage)

  renderPage: =>
    $('#app').html(@currentView().render().el)
    @currentView().delegateEvents()

  currentView: ->
    if @user.loggedIn() then @views.replies else @views.login

$ -> new App().renderPage()
