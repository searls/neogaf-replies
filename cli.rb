#!/usr/bin/env ruby

require './neogaf'

Neogaf.find_replies(ENV['LOGIN'], ENV['PASS']).tap { |r| require 'pry'; binding.pry }