var express = require('express');
var wagner = require('wagner-core');

var app = express();

app.use('/api/v1_0', require('./api')(wagner));

app.listen(3001);
console.log('Listening on port 3001!');
