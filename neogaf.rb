require "nokogiri"
require "httparty"

module Neogaf

  def self.find_replies(user_name, pass)
    puts "Searching for replies to #{user_name}'s posts"
    user = User.new(user_name, pass)
    LogsIn.new.with_user(user).login!
    puts "Logged in as #{user.name}"
    urls = GathersThreadUrls.new.with_user(user).gather
    quotes = GathersQuotes.new(FindsReplies.new.with_user(user).with_history(History.new)).gather(urls)
  end

  User = Struct.new(:name, :pass, :auth_cookie, :id)

  class History
    def add(url)
      @urls ||= []
      @urls << url
    end

    def searched?(url)
      @urls.include?(url) if @urls
    end
  end

  class Post
    def post_for(quote)
      post = quote.parent.parent
      post_id = post.attr('id').gsub(/post/,'')
      {
        :id => post_id,
        :author => post.css('.authorName').text,
        :timestamp => post.css('.postTimestamp').text.strip,
        :text => post.xpath("div[@class='message']/text()").text.strip,
        :post_path => post.css('.postTimestamp a').attr('href').to_s,
        :thread_path => "showthread.php?p=#{post_id}&highlight=#post#{post_id}"
      }
    end
  end

  #mixins


  module HasUser
    def with_user(user)
      @user = user
      self
    end
  end

  module HasHistory
    def with_history(history)
      @history = history
      self
    end
  end

  module Http
    include HasUser

    def post(path, params = {})
      HTTParty.post("#{base_path}#{path}", :body => params)
    end

    def get(path)
      raise "Not logged in" unless @user.auth_cookie
      HTTParty.get("#{base_path}#{path}",
        :headers => {'Cookie' => @user.auth_cookie }.merge(headers)
      )
    end

    def base_path
      "http://www.neogaf.com/forum/"
    end

    def headers
      {}
    end
  end

  module Mobile
    def headers
      {
        "User-Agent" => "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25"
      }
    end

    def base_path
      "http://m.neogaf.com/"
    end
  end

  #behaviors


  class LogsIn
    include Http

    def login!
      response = post("login.php?do=login", {
        "vb_login_username"        => @user.name,
        "vb_login_password"        => "",
        "cookieuser"               => 1,
        "s"                        => "",
        "securitytoken"            => "guest",
        "do"                       => "login",
        "vb_login_md5password"     => @user.pass,
        "vb_login_md5password_utf" => @user.pass
      })
      raise "Login failed" unless response.body.include?("Thank you for logging in")
      @user.auth_cookie = response.headers["set-cookie"]
      @user.id = find_user_id(response)
    end

  private

    def find_user_id(response)
      response.headers['set-cookie'].match(/bbuserid=(\d+)/)[1]
    end
  end

  class GathersThreadUrls
    include Http

    def gather
      find_thread_paths_with_posts_by_user(search_for_posts_by_user)
    end

  private

    def find_thread_paths_with_posts_by_user(doc)
      doc.xpath("//a[starts-with(@href, 'showthread.php?p=')]").map { |a| a.attr('href') }
    end

    def search_for_posts_by_user
      body = get("search.php?do=finduser&u=#{@user.id}").body
      raise "Search for threads failed" if body.include?("You are not logged in")
      search_for_posts_by_user if wait_was_needed?(body)
      Nokogiri::HTML(body)
    end

    def wait_was_needed?(body)
      match = body.match(/Please try again in (\d+) seconds/)
      if match && match[1]
        puts "Thread search was asked to wait for #{match[1]} seconds"
        sleep(match[1].to_i + 1)
        true
      end
    end
  end


  class FindsReplies
    include Http
    include Mobile
    include HasHistory

    def find(url, mode = nil)
      @pages_to_check = 3 if mode == :reset
      unless @history.searched?(url)
        doc = load(url)
        find_quotations(doc) + next_page_quotations(doc)
      else
        puts "skipping #{url} (already searched)"
        []
      end
    end

  private

    def load(url)
      @history.add(url)
      puts "downloading #{url}"
      Nokogiri::HTML(get(url).body)
    end

    def find_quotations(doc)
      quotations = doc.xpath("//div[@class='quoteAuthor']/strong[text()='#{@user.name}']/../..").to_a
      puts "Found #{quotations.size} replies"

      quotations.map do |quote|
        Post.new.post_for(quote)
      end
    end

    def next_page_quotations(doc)
      return [] unless @pages_to_check > 0
      @pages_to_check -= 1
      next_link = doc.xpath("//a[@class='nextButton']").first
      next_link ? find(next_link.attr('href')) : []
    end
  end

  class GathersQuotes

    def initialize(finds_replies)
      @finds_replies = finds_replies
    end

    def gather(urls)
      urls.map do |url|
        @finds_replies.find(url, :reset)
      end.
        flatten.
          uniq { |p| p[:id] }.
            sort_by { |p| p[:id] }.
              reverse
    end
  end
end

#Neogaf.find_replies(ENV["NEOGAF_USER"], ENV["NEOGAF_PASS"])