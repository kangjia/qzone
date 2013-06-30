
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

//config
//app.set('env','production');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.errorHandler());
}

if ('production' == app.get('env')) {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/users', user.list);

// for arts
var arts = require('./routes/arts');

app.get('/arts' , arts.show );
app.get('/arts/:_id' , arts.api );
app.get('/arts/like/addCount/:_id' , arts.addLikeCount );
app.get('/arts/comment/addCount/:_id' , arts.addCommentCount );
//app.get('/arts/today' , arts.today );
//app.get('/arts/history' , arts.history );
//app.get('/arts/rank' , arts.rank );
//app.get('/arts/fav' , arts.fav );
//app.get('/arts/:calendar' , arts.calendar );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
