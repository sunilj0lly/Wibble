var should = require('should');
var project = require('../../controllers/project');
var ProjectModel = require('../../models/project')
var sinon = require("sinon");
var mongoose = require('mongoose');

var PROJECT_NAME = "testProjectName";

function getRequestStub() {
	return {
		body: {
			projectName: PROJECT_NAME
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
}

function fetchProjectsFromDB(done, callback) {
	ProjectModel.find({ name: PROJECT_NAME }, function(err, docs) {
		if (err) {
			done(err);
		} else {
			callback(docs);
		}
	});
}

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

		var req = getRequestStub();
		var res = {
			redirect: function(url) {
				checkForProjectInModel();
			}
		};

		project.createProject(req, res, null);

		function checkForProjectInModel() {
			fetchProjectsFromDB(done, function(projects) {
				projects.length.should.equal(1);
				done();
			});
		}

	});

	it('should not create a project if there are validation errors', function(done) {

		var req = getRequestStub();
		req.validationErrors = function() {
			return true;
		}

		var res = {
			render: function(url) {
				//do nothing
			}
		};

		project.createProject(req, res, null);

		fetchProjectsFromDB(done, function(projects) {
			projects.length.should.equal(0);
			done();
		});

	});

	it('should not create another project when one already exists', function(done) {

		var req = getRequestStub();
		var firstRes = {
			redirect: function(url) {
				project.createProject(req, secondRes, null);
			}
		};

		var secondRes = {
			render: function(url, obj) {
				checkForProjectInModel();
			}
		};

		project.createProject(req, firstRes, null);

		function checkForProjectInModel() {
			fetchProjectsFromDB(done, function(projects) {
				projects.length.should.equal(1);
				done();
			});
		}

	});

	afterEach(function() {
		mongoose.connection.db.dropDatabase();
	});

});
