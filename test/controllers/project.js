var should = require('should');
var project = require('../../controllers/project');
var sinon = require("sinon");
var mongoose = require('mongoose');

describe('controllers/project', function() {

	beforeEach(function(done) {

		mongoose.disconnect();
		mongoose.connect('mongodb://localhost/wibble-test');
		var connection = mongoose.connection;
		connection.on('error', console.error.bind(console, 'connection error:'));
		connection.once('open', function callback () {
			done();
		});
	});

	it('should create a project with no retrospectives', function(done) {

		var req = {
			body: {
				projectName: 'myTestProjectAgain'
			},
			assert: function(val1, val2) {
				return {
					notEmpty: function() {
						return true;
					}
				}
			},
			validationErrors: function() {
				return null;
			}
		};

		var res = {
			render: function(name, obj) {
				done();
				return '';
			},
			redirect: function(url) {
				done();
			}
		};

		var next = function(callback) {
			done();
		};

		project.createProject(req, res, next);
	});

	afterEach(function() {
		mongoose.connection.db.dropDatabase();
	});

})
