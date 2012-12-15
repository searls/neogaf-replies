#!/usr/bin/env ruby

require "rubygems"
require "bundler/setup"
require "nokogiri"
require "httparty"
require 'pry'


#wrap httparty

class Http
  def login(user, pass)
    md5_pass = Digest::MD5.hexdigest(pass)
    response = post("login.php?do=login", {
      "vb_login_username"        => user,
      "vb_login_password"        => "",
      "cookieuser"               => 1,
      "s"                        => "",
      "securitytoken"            => "guest",
      "do"                       => "login",
      "vb_login_md5password"     => md5_pass,
      "vb_login_md5password_utf" => md5_pass
    })
    @cookie = response.headers["set-cookie"]

    require 'ruby-debug'; debugger; 2;
  end

  def find_posts_by_user
    response = get("search.php?do=finduser&u=4182")

    #do stuff

    require 'ruby-debug'; debugger; 2;
  end

private

  def base_path
    "http://www.neogaf.com/forum/"
  end

  def post(path, params = {})
    HTTParty.post("#{base_path}#{path}", :query => params)
  end

  def get(path)
    raise "Not logged in" unless @cookie

    HTTParty.get("#{base_path}#{path}",
      :headers => {'Cookie' => @cookie }
    )
  end
end



#script
gaf = Http.new
gaf.login(ENV["NEOGAF_USER"], ENV["NEOGAF_PASS"])
gaf.find_posts_by_user