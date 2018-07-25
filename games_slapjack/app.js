"use strict";

var path = require('path');
var morgan = require('morgan');
var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.get('/', function(req, res) {
  res.render('index');
});

// Here is your new Game!
var Card = require('./card');
var Player = require('./player');
var Game = require('./game');
var game = new Game();
var count = 0; // Number of active socket connections
var winner = null; // Username of winner

function getGameState() {
  var currentPlayerUsername;
  var players = "";
  var numCards = {};

  // YOUR CODE HERE


  var numCards = {};

  for (var player in game.players){
    numCards[game.players[player].id] = game.players[player].pile.length
  }
  if (!game.isStarted) {
    numCards = "Game has not started"
  }

  var playersInGame = [];
  for (var player in game.players){
    playersInGame.push(game.players[player].username)
  }

  // return an object with 6 different properties
  return {
    'isStarted': game.isStarted,
    'numCards': numCards,
    'currentPlayerUsername': game.players[game.playerOrder[0]].username,
    'playersInGame': playersInGame,
    'cardsInDeck': game.pile.length,
    'win': winner

  }
}

io.on('connection', function(socket) {

  if (game.isStarted) {
    // whenever a player joins an already started game, he or she becomes
    // an observer automatically
    socket.emit('observeOnly');
  }
  count++;
  socket.on('disconnect', function () {
    count--;
    if (count === 0) {
      game = new Game();
      winner = null;
    }
  });

  socket.on('username', function(data) {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }
    try  {
      console.log('HERE', data);
      socket.playerId = game.addPlayer(data);
      socket.emit('username', {
        'id': socket.playerId,
        'username': data
      });
      io.emit('updateGame', getGameState() );
    }
    catch(error){
      //emit error message
      // console.log(error.messge);
      socket.emit('errorMessage', error.message);
    }
  });

  socket.on('start', function() {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }
    // YOUR CODE HERE
    if (socket.playerId == undefined) {
      socket.emit('errorMessage', 'You are not a player of the game!');
    } else {
      try {
        game.startGame();
        io.emit('start');
        io.emit('updateGame', getGameState());

      } catch (error) {
        socket.emit('errorMessage', error.message);
      }
    }
  });

  socket.on('playCard', function() {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }
    // YOUR CODE HERE
    if (socket.playerId == undefined) {
      socket.emit('errorMessage', "You are not a player of the game!");
    } else {
      try {
        var card = game.playCard(socket.playerId);
        io.emit('playCard', card);
      }
      catch(error) {
        socket.emit('errorMessage', error.message);
      }

    }


    // YOUR CODE ENDS HERE
    // broadcast to everyone the game state
    io.emit('updateGame', getGameState());
  });

  socket.on('slap', function() {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }
    // YOUR CODE HERE
    if (socket.playerId == undefined){
      socket.emit('errorMessage', 'You are not a player of the game!');
    } else{
      try {
        console.log("SOCKET", socket.playerId);
        var slapResult = game.slap(socket.playerId);
        //check if won
        if (slapResult) {
          winner = game.players[socket.playerId].username;
        }
        //TO DO : IS THIS IF OR ELSE IF
        if (slapResult.message = 'got the pile!') {
          io.emit('clearDeck');
        }
        if (game.players[socket.playerId].pile.length == 0) {
          var playersLeft = 0;
          for (var player in game.players) {
            if (game.players[player].list.length != 0)
              playersLeft.push(game.players[player]);
          }
          if (playersLeft.length == 1) {
            winner = playersLeft[0].username
            game.isStarted = false;
          }
          else {
            game.nextPlayer()
          }
        }
        //other good stuff
        io.emit('updateGame', getGameState());
        socket.emit('message', "You lost 3 cards!");
        socket.broadcast.emit('message', game.players[playerId].username);


      } catch(error){
        console.log('caught error', error.message);
        socket.emit('errorMessage', error.message);
      }
    }
  });

});

var port = process.env.PORT || 3001;
http.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
