import CharityModel from '../src/components/views/CharityModel'
var assert = require('assert');

describe('CharityModel', function() {

   // gives a series of errors and doesn't register API call at time of console.log()

   // var charityModel = mount(<charityModel match={{"params":{"asset":"USA"}}}/>);
   // describe('#mount of charityModel', function() {
   //    it('print state', function() {
   //       console.log(charityModel.state());
   //    });
   // });
   var data = {
		"name": "charity1",
     "country": ["USA", "JPN"],
     "issues": ["issue1", "issue2"],
     "mission": "mission statement",
	  "Address": {
		  "streetAddress1": "",
		  "streetAddress2": "",
		  "city": "",
		  "stateOrProvince": "",
		  "postalCode": 0
	  }
  }
   describe('#_renderCharityBio()', function() {
      //@DavidNeveling
      it('should contain the correct number of bio attributes', function() {
       var charityModel = new CharityModel();
		 assert.equal(charityModel._renderCharityBio(data.name, data)[0].props.children.length, 3);
      });
   });
   describe('#_renderCharityCountries()', function() {
      //@DavidNeveling
      it('should contain the correct info', function() {
       var charityModel = new CharityModel();
       for (var i = 0; i < data.country.length; i++){
          assert.equal(charityModel._renderCharityCountries(data)[0].props.data[i], data.country[i]);
       }
      });
    });
    describe('#_renderCharityIssues()', function() {
      //@DavidNeveling
      it('should contain the correct info', function() {
       var charityModel = new CharityModel();
       for (var i = 0; i < data.issues.length; i++){
          assert.equal(charityModel._renderCharityIssues(data)[i].props.children.key, data.issues[i]);
       }
      });
    });
    describe('#_renderCharityMission()', function() {
      //@DavidNeveling
      it('should contain the correct statement', function() {
       var charityModel = new CharityModel();
       assert.equal(charityModel._renderCharityMission(data)[0].props.children[1].props.children.props.children, data['mission']);
      });
    });
});
