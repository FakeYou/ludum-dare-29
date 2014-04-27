var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('title', 'Ludum Dare 29');

// add an articifial delay between each file to test loading
app.use(function(req,res,next){setTimeout(next,1000)});

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.listen(3000);