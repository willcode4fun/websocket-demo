'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
var uuid = require('node-uuid');
var redis = require('redis');

const auction = require('./auction');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');


const client = redis.createClient(); //creates a new client
client.set('counter', 100);
const auctions = auction.getOrInit(client);
const server = express()
  .use('/public',express.static(path.join(__dirname, '/public')))
  .use('/index.htm',(req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  var uid = uuid.v4();
  console.log('Client connected with id:'+uid);
  
  socket.emit('welcome', { content: 'Salut Client', importance: '1', id : uid , state : auctions});
  
  socket.on('disconnect', () => console.log('Client disconnected'));
  
  socket.on('hello', function (message) {
    console.log('Un client me parle ! Il me dit : ' + message);
	socket.emit('message', { content: 'Salut Client', importance: '1' });
  }); 
});

setInterval(() => decrement(io,client), 1000);
function decrement(io, client){
	client.get('counter', function(err, reply) {
		console.log(reply);
		io.emit('time', reply );
		client.set('counter', reply > 0?reply-1:0);
	});
}