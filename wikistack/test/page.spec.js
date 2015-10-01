var expect = require('chai').expect
var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models')
var Page = models.Page;
var User = models.User;
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/wikistack');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'mongodb connection error:'));


chai.use(spies);

describe('Page model', function() {
    //Q: remind me why we need to define page outside of our test suites
    var page;
    describe('Validations', function() {

        beforeEach(function() {
            page = new Page();
        })

        //Q: how does done work
        it('errors without title', function(done) {
            page.validate(function(err, page) {
                //Q: "err" is the error object and "errors" is a property that lists the error?
                expect(err.errors).to.have.property('title')
                done()
            });
        });

        it('errors without body', function(done) {
            page.validate(function(err, page) {
                expect(err.errors).to.have.property('body')
                done()
            });
        });
    });

    describe('Statics', function() {

        beforeEach(function(done) {
            //do we need to be clearing out database as well?
            //how do we clear a database because it is adding the below page each time we run this test
            // db.Page.remove(function(err){
            //     if (err) return done(er);
            Page.remove({}, function(err, pages){
        
                Page.create({
                    title: "newTitle",
                    body: "someBody",
                    tags: ["tag1", "tag2", "tag3"]
                }, done);
            })

        })

        describe('findByTag', function() {
            it('gets pages with the search tag', function(done) {
                Page.findByTag('tag1', function(err, pages) {
                    expect(pages).to.have.lengthOf(1)
                    done()
                })
            })

            it('does not get pages without the search tag', function(done) {
                Page.findByTag('dog', function(err, pages) {
                    expect(pages).to.have.lengthOf(0)
                    done()
                })
            })
        });
    });

    describe('Methods', function() {

        beforeEach(function(done) {
            Page.remove({}, function(err, pages){
                //base
                Page.create({
                    title: "Second Title",
                    body: "secondBody",
                    tags: ["tag1"]
                });
                //shared tag
                Page.create({
                    title: "Third Title",
                    body: "thirdBody",
                    tags: ["tag1"]
                });
                //no shared tags
                Page.create({
                    title: "Fourth Title",
                    body: "fourthBody",
                    tags: ["uselessTag"]
                }, done);
            })
        });

        describe('computeUrlName', function() {
            it('converts non-word-like chars to underscores', function(done) {
                Page.findOne({url_name: "Second_Title"}, function(err, page) {
                    expect(page).to.not.equal(null);
                    done();
                })
            })
        });

        describe('getSimilar', function() {
            it('never gets itself', function(done) {
                Page.findOne({url_name: "Second_Title"}, function(err, page) {
                    page.getSimilar(function(err, pages){
                        var truthfullness = true;
                        pages.forEach(function(obj){
                            if (obj.url_name === "Second_Title"){
                                truthfullness = false;
                            }
                        })
                        expect(truthfullness).to.equal(true);
                        // expect(pages.length).to.equal(1);
                        done();
                    })
                })
            });
            it('gets other pages with any common tags', function(done) {                
                Page.findOne({url_name: "Second_Title"}, function(err, page) {
                    page.getSimilar(function(err, pages){
                        expect(pages.length).to.equal(1);
                        done();
                    })
                })});
            it('does not get other pages without any common tags', function(done) {
                Page.findOne({url_name: "Second_Title"}, function(err, page) {
                    page.getSimilar(function(err, pages){
                        var truthfullness = true;
                        pages.forEach(function(obj){
                            if(obj.tags[0] !== page.tags[0]){
                                truthfullness = false;
                            }
                        })
                        expect(truthfullness).to.equal(true);
                        // expect(pages.length).to.equal(1);
                        done();
                    })
                })

            });
        });
    });

    describe('Virtuals', function() {

        beforeEach(function(done) {
            Page.remove({}, function(err, pages){
                //base
                Page.create({
                    title: "Second Title",
                    body: "secondBody",
                    url_name: "Second_Title",
                    tags: ["tag1"]
                }, done);
            })
        });


        describe('full_route', function() {
            it('returns the url_name prepended by "/wiki/"', function(done) {
                Page.findOne({url_name: "Second_Title"}, function(err, page) {
                    expect(page.full_route).to.equal("/wiki/Second_Title");
                    done();
                });
                
            });
        });

    });

    describe('Hooks', function() {
        xit('calls computeUrlName before save', function(done) {
                
                computeUrlName = chai.spy(Page.computeUrlName);
                samplePage = new Page ({
                    title: "Third Title",
                    body: "thirdBody",
                    tags: ["tag1"]
                });
                samplePage.save(function(err, page){
                    expect(computeUrlName).to.have.been.called();
                    done(); 
                })

        });
    });

});