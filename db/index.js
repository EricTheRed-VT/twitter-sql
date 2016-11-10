var pg = require('pg');
// var client = new pg.Client('postgres://var/lib/postgresql/9.5/main/tweetdb');
var client = new pg.Client('postgres://localhost/twitterdb');
client.connect();
module.exports =client;
