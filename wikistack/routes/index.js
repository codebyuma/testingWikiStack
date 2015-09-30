var express = require('express');
var router = express.Router();
var models = require('../models')

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Page.find({}, function(err, pages) {
    res.render('index', {
      title: 'Wikistack',
      pages: pages 
    });
  })

});

router.get('/wiki/tags/:tag', function(req, res) {
  models.Page.findByTag(req.params.tag, function(err, pages) {
    res.render('index', {pages: pages, title: 'Pages matching tag: ' + req.params.tag})
  })
})

router.get('/wiki/:title', function(req, res, next) {
  //look at page name
  //find the page in the database
  //render a view with that object
  models.Page.findOne({ url_name: req.params.title }, function(err, page) {
    if(err) return next(err)
    if(!page) return res.status(404).send()

    for(var key in page) {
      res.locals[key] = page[key]
    }

    res.render('show')
  })
})

router.get('/wiki/:title/similar', function(req, res, next) {
  models.Page.findOne({ url_name: req.params.title }, function(err, page) {
    if(err) return next(err)
    if(!page) return res.status(404).send()

    page.getSimilar(function(err, pages) {
      res.render('index', {
        pages: pages,
        title: 'Pages similar to: ' + page.title
      })
    })
  })
})

router.get('/wiki/:url_name/edit', function(req, res, next) {
  models.Page.findOne({ url_name: req.params.url_name }, function(err, page) {
    if(err) return next(err)
    if(!page) return next()
    res.render('edit', { 
      title: page.title, 
      body: page.body, 
      tags: page.tags.join(', '),
      url_name: page.url_name
     })
  })
})

var tagStrToArr = function(tagStr) {
  return tagStr.split(',').map(function(tag) {
    return tag.trim()
  })
}

router.post('/wiki/:url_name/edit', function(req, res, next) {
  models.Page.findOne({ url_name: req.params.url_name }, function(err, page) { // find a page with this url_name in the database
    if(!page) return next()
    var tags = tagStrToArr(req.body.tags) // create an array of tags from the string we recieved in the form
    delete req.body.tags // WHY? So when we do var key in req.body on line 85, it won't do tags again

    page.tags = []; // in the page we found, set tags to an empty array

    tags.forEach(function(tag) { // go through our array of new tags
      page.tags.addToSet(tag) // for each of our new tags, add it to the page's tags array. addToSet() ensure's there are no duplicates
    })

    //I'm overwriting properites on page that exist in req.body
    //namely title and body
    for(var key in req.body) { // for each value we recieved in the form 
      page[key] = req.body[key] // store that value in the key with the same name in page
    }

    page.save(function(err, page) {
      console.log(err)
      if(err) return next(err)
      console.log('this is page before redirect', page)
      res.redirect("page.full_route")
    })
  });
})

router.post('/add/submit', function(req, res) {
  var tags = tagStrToArr(req.body.tags)
  delete req.body.tags

  var newPage = new models.Page(req.body)

  tags.forEach(function(tag) {
    newPage.tags.addToSet(tag)
  })

  newPage.save(function(err, page) {
    res.redirect(page.full_route)
  })
})

router.get('/add', function(req, res) {
  res.render('add')
})

module.exports = router;
