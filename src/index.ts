var express = require('express');
var app = express();

app.get('/', function(req:any, res:any) {
  res.send('hello world');
});

app.listen(3000);
console.log("server starting...");
