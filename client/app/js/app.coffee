root = this
md5 = root

_.mixin(_.str.exports());

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
    xhr = $.ajax
      url: '/api/replies'
      type: 'post'
      data: user.toJSON(),
      success: (replies) =>
        return root.app.renderAlert('No replies found') unless replies?.length > 0
        _(replies).each (reply) => @create(reply)
        @trigger('reset')
      error: (response) ->
        root.app.renderAlert """
                             A failure occurred:

                             #{response.responseText}
                             """, "danger"
    @trigger('fetch:started')
    root.app.renderProgressBar(xhr)
    xhr.always => @trigger('fetch:complete')



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
    @collection.on('fetch:started', => @toggleButtons(true))
    @collection.on('fetch:complete', => @toggleButtons(false))

  fetchReplies: (e) ->
    e.preventDefault()
    @collection.fetchRepliesFor(@user) unless @buttonsDisabled

  deleteReplies: (e) ->
    e.preventDefault()
    @collection.destroyAll() unless @buttonsDisabled

  toggleButtons: (disable) =>
    @buttonsDisabled = disable
    @$('button').toggleClass('disabled', disable)

  logout: (e) ->
    e.preventDefault()
    @user.save(user: undefined, pass: undefined)
    @trigger('navigate')

class AlertView extends Backbone.Fixins.SuperView
  template: "app/templates/alert.us"

  events:
    'click .hide-details': 'hideDetails'
    'click .show-details': 'showDetails'

  templateContext: ->
    messageLines = _(@model.get('message')).lines()

    hideDetails: @hideDetails
    type: @model.get('type')
    block: messageLines.length > 1
    messageSummary: _(messageLines).first(4).join("<br/>")
    messageDetails: _(messageLines).rest(4).join("<br/>")

  hideDetails: (e) ->
    e.preventDefault()
    @hideDetails = true
    @render()

  showDetails: (e) ->
    e.preventDefault()
    @hideDetails = false
    @render()

class ProgressBarView extends Backbone.Fixins.SuperView
  template: "app/templates/progress_bar.us"

  initialize: (options) ->
    @xhr = options.xhr
    @xhr.always(@kill)
    @startTime = new Date()
    @intervalId = setInterval((=> @render()), 50)

  kill: =>
    clearInterval(@intervalId)
    @remove()

  templateContext: ->
    percentComplete: @percentComplete()

  percentComplete: ->
    secondsElapsed = (new Date() - @startTime) / 1000
    expectedSeconds = 30.0
    fractionComplete = secondsElapsed / expectedSeconds
    Math.round(fractionComplete * 100)


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
    @

  currentView: ->
    if @user.loggedIn() then @views.replies else @views.login

  renderAlert: (message, type) ->
    $('#notifications').prepend(
      new AlertView(model: new Backbone.Model(message: message, type: type)).render().el
    )

  renderProgressBar: (xhr) ->
    $('#notifications').prepend(new ProgressBarView(xhr: xhr).render().el)


$ -> root.app = new App().renderPage()
