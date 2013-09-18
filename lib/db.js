var mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect(process.env.MONGOHQ_URL);

    console.log('MONGOHQ_URL =  ' + process.env.MONGOHQ_URL);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log('connected to db');
    });
};