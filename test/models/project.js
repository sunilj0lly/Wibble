var should = require('should');
var Project = require('../../models/project');
var Retrospective = require('../../models/retrospective');
var sinon = require("sinon");
var mongoose = require('mongoose');
var project;

function getTestProject() {
	var project = new Project({
		name : 'testProject'
	});
	return project;
}

describe('projectSchema', function() {

	beforeEach(function(done) {

		project = getTestProject();

		mongoose.disconnect();
		mongoose.connect('mongodb://localhost/wibble-test');
		var connection = mongoose.connection;
		connection.on('error', console.error.bind(console, 'connection error:'));
		connection.once('open', function callback () {
			done();
		});
	});

	it('should return no variation when there no retrospectives', function(done) {
		
		project.save(function(error, project){
			if(error){
				done(error);
			} else {
				done();
			}
		});

		project.health.amount.should.equal(0);
		project.health.variation.should.equal(0);

	});

	it('should return the health when a single question is answered', function(done) {
		
		project.retrospectives.push({
			date: new Date(),
			facilitator : 'testFacilitator',
			participants: [
				{
					name: 'testParticipant'
				}
			],
			questions : [
				{
					answers : [
						{
							participant: 'testParticipant',
							answer: 1
						}
					]
				}
			]
		});

		project.save(function(error, project){
			if(error){
				done(error);
			} else {
				project.health.amount.should.equal(100);
				project.health.variation.should.equal(0);
				done();
			}
		});

	});

	it('should return the health when mulitple participants answer the same question', function(done) {

		project.retrospectives.push({
			date: new Date(),
			facilitator : 'testFacilitator',
			participants: [
				{
					name: 'testParticipant'
				},
				{
					name: 'testParticipant2'
				}
			],
			questions : [
				{
					answers : [
						{
							participant: 'testParticipant',
							answer: 1
						},
						{
							participant: 'testParticipant2',
							answer: 2
						}
					]
				}
			]
		});

		project.save(function(error, project){
			if(error){
				done(error);
			} else {
				project.health.amount.should.equal(83);
				project.health.variation.should.equal(0);
				done();
			}
		});

	});

	it('should return the health variation between two retrospectives', function(done) {

		project.retrospectives.push({
			date: new Date(),
			facilitator : 'testFacilitator',
			participants: [
				{
					name: 'testParticipant'
				},
				{
					name: 'testParticipant2'
				}
			],
			questions : [
				{
					answers : [
						{
							participant: 'testParticipant',
							answer: 1
						}
					]
				}
			]
		});


		project.retrospectives.push({
			date: new Date(),
			facilitator : 'testFacilitator',
			participants: [
				{
					name: 'testParticipant'
				},
				{
					name: 'testParticipant2'
				}
			],
			questions : [
				{
					answers : [
						{
							participant: 'testParticipant',
							answer: 1
						},
						{
							participant: 'testParticipant2',
							answer: 2
						}
					]
				}
			]
		});

		project.save(function(error, project){
			if(error){
				done(error);
			} else {
				project.health.amount.should.equal(83);
				project.health.variation.should.equal(-17);
				done();
			}
		});

	});

	afterEach(function() {
		mongoose.connection.db.dropDatabase();
	});

})
