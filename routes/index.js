'use strict';
var express = require('express');
var router = express.Router();
var client= require("../db/");

module.exports = function makeRouterWithSockets (io) {


// client.query('SELECT * FROM tweets', function (err, result) {
  // if (err) return next(err); // pass errors to Express
  // var tweets = result.rows;
  // res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
// });





  // a reusable function
  function respondWithAllTweets (req, res, next){
  client.query('select tweets.id as tweetID, tweets.content as content, users.name as name, users.pictureurl as pictureurl, users.id as person from tweets inner join users on tweets.userid=users.id', function(err,data){
      if (err) return next(err) ;

    res.render('index', {
      title: 'Twitter.js',
      tweets: data.rows,
      showForm: true
    });

    })
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);



  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query('select tweets.id as tweetID, tweets.content as content, users.name as name, users.pictureurl as pictureurl, users.id as person from tweets inner join users on tweets.userid=users.id where users.name=$1', [req.params.username], function(err,data){
      if (err) return next(err) ; 
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows,
        showForm: true,
        username: req.params.username
      });
    })    
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query('select tweets.id as tweetID, tweets.content as content, users.name as name, users.pictureurl as pictureurl, users.id as person from tweets inner join users on tweets.userid=users.id where tweets.id =  $1', [req.params.id], function(err,data){
      if (err) return next(err) ;
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows // an array of only one element ;-)
      });
    })
    
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    // var newTweet = tweetBank.add(req.body.name, req.body.content);


      client.query("insert into tweets (userid, content) values ( (select id from users where name=$1) , $2 )", [req.body.name, req.body.content], function(err,data){
        if (err) return next(err) ;
        //io.sockets.emit('new_tweet', data.rows);
        res.redirect('/');
      })
    
    
    
  });

    router.get('/delete/:id', function(req, res, next){
    // var newTweet = tweetBank.add(req.body.name, req.body.content);


      client.query("DELETE FROM tweets where id=$1 ", [req.params.id], function(err,data){
        if (err) return next(err) ;
        //io.sockets.emit('new_tweet', data.rows);
        res.redirect('/');
      })
    
    
    
  });

  router.post('/searchresults', function(req, res, next){
// console.log(req.body.search);
var newSearch= '%'+req.body.search+'%';
console.log (newSearch);

    client.query('select tweets.id as tweetID, tweets.content as content, users.name as name, users.pictureurl as pictureurl, users.id as person from tweets inner join users on tweets.userid=users.id where tweets.content LIKE  $1  OR users.name LIKE  $2', [ newSearch ,   newSearch ], function(err,data){
      if (err) return next(err) ;
      res.render('index', {
        title: 'Twitter.js',
        tweets: data.rows // an array of only one element ;-)
      });
    })
    
  });



  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
