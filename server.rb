require 'sinatra/base'
require "sinatra/json"
require 'yajl'
require './neogaf'

class App < Sinatra::Base
  helpers Sinatra::JSON

  get '/' do
    File.read(File.join('public', 'index.html'))
  end

  post '/api/replies' do
    expect([:user, :pass])
    json Neogaf.find_replies(params[:user], params[:pass])
  end

  def expect(param_names)
    param_names.each do |param|
      raise "param #{param} is required" unless params[param] && !params[param].strip.empty?
    end
  end

private

  def sample_data
    [
      {
        :id=>"45465179",
        :author=>"Jeremy",
        :timestamp=>"Today, 01:13 AM, Post #3193",
        :text=> "I agree too. After only four stats with this thing I really can't go back to the normal size. I am typing on this with",
        :post_path=>"showpost.php?p=45465177",
        :thread_path=>"showthread.php?p=45465177&highlight=#post45465177"
      },
      {
        :id=>"45465177",
        :author=>"The Real Abed",
        :timestamp=>"Today, 01:13 AM, Post #3193",
        :text=> "I agree too. After only four stats with this thing I really can't go back to the normal size. I am typing on this with",
        :post_path=>"showpost.php?p=45465177",
        :thread_path=>"showthread.php?p=45465177&highlight=#post45465177"
      },
      {
        :id=>"45442183",
        :author=>"Edmond Dantes",
        :timestamp=>"Yesterday, 01:54 AM, Post #13",
        :text=>"He loves the Legendarium. He'd adapt The Silmarillion if he could.",
        :post_path=>"showpost.php?p=45442183",
        :thread_path=>"showthread.php?p=45442183&highlight=#post45442183"
      }
    ]
  end

end