require 'sinatra/base'
require "sinatra/json"
require 'yajl'
require './neogaf'

class App < Sinatra::Base
  helpers Sinatra::JSON

  get '/' do
    File.read(File.join('public', 'index.html'))
  end

  get '/api/replies' do
    json Neogaf.find_replies(params[:user], params[:md5_pass])
  end

end