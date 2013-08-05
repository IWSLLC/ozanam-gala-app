should = require "should"
regs = require "../lib/registrations"

describe "Node's Modules", -> 
	it "uses require to pull in modules that you install", -> 
		should.exist should

	it "has a set of core modules", -> 
		should.exist require "http"
		should.exist require "fs"
		should.exist require "net"
    