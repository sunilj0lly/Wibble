var mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://localhost/wibble-test');

    console.log('connect');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('connected to db');
    });
};