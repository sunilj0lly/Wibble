var should = require('should');
var Project = require('../../models/project');
var Retrospective = require('../../models/retrospective');

describe('projectSchema', function() {

	it('should return no variation when there no retrospectives ', function() {

		var project = new Project({
			name: 'testName',
			retrospectives: [] //no data required for test
		});
		project.health.amount.should.equal(0);
		project.health.variation.should.equal(0);
	});

})
