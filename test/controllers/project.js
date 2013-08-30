var should = require('should');
var project = require('../../controllers/project');
var ProjectModel = require('../../models/project')
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

		var projectName = "testProject";

		//req "stub"
		var req = {
			body: {
				projectName: projectName
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

		//result "stub"
		var res = {
			render: function(name, obj) {
				done(new Error("render called instead of redirect"));
				return '';
			},
			redirect: function(url) {
				checkForProjectInModel();
			}
		};

		//next "stub"
		var next = function(callback) {
			done(new Error("next called instead of redirect"));
		};

		//create project
		project.createProject(req, res, next);

		//callback after project is created
		function checkForProjectInModel() {

			var projectFoundInModel = false;
			ProjectModel.find({ name: projectName }, function(err, docs) {
				if (err) {
					done(err);
				} else {
					docs.length.should.equal(1);
					done();
				}
			});	

		}

	});

	afterEach(function() {
		mongoose.connection.db.dropDatabase();
	});

});
