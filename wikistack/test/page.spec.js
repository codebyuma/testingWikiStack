var expect = require('chai').expect
var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models')
var Page = models.Page;
var User = models.User;

chai.use(spies);

describe('Page model', function() {
	var page;
    describe('Validations', function() {
        
		beforeEach(function(){
		page = new Page();
		})

        it('errors without title', function(done) {
        	page.validate(function(err, page){
        		expect(err.errors).to.have.property('title')
        		done()});
        });
        it('errors without body', function(done) {
        	page.validate(function(err, page){
        		expect(err.errors).to.have.property('body')
        		done()});
        });
    });

    describe('Statics', function() {
        
		beforeEach(function(done){
		//do we need to be clearing out database as well?
		//how do we clear a database
		Page.create({title: "newTitle", body: "someBody", tags: ["tag1", "tag2", "tag3"]}, done);
		})

        describe('findByTag', function() {
            it('gets pages with the search tag', function(done) {
            	Page.findByTag('tag1', function(er, pages){
            		expect(pages).to.have.lengthOf(1)
            		done()
			})})

            it('does not get pages without the search tag', function(done) {
            	Page.findByTag('dog', function(er, pages){
            		expect(pages).to.have.lengthOf(0)
            		done()
            })})
        });
    });

    describe('Methods', function() {
        describe('computeUrlName', function() {
            xit('converts non-word-like chars to underscores', function() {});
        });
        describe('getSimilar', function() {
            xit('never gets itself', function() {});
            xit('gets other pages with any common tags', function() {});
            xit('does not get other pages without any common tags', function() {});
        });
    });

    describe('Virtuals', function() {
        describe('full_route', function() {
            xit('returns the url_name prepended by "/wiki/"', function() {});
        });
    });

    describe('Hooks', function() {
        xit('calls computeUrlName before save', function() {});
    });

});