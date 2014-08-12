/*
* GET routes coming off home page.
*/
var path = require('path');

var public = path.join(__dirname, '../public/views/');

exports.index = function(req, res){
  res.sendFile(public + 'index.html');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.sendFile(public + 'partials/' + name + '.html');
};