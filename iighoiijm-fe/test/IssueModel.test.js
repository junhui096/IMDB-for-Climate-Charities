import IssueModel from '../src/components/views/IssueModel'
var assert = require('assert');

describe('IssueModel', function() {
   var data = {
     "key": "sampleIssue",
     "summary": "sampleSummary",
     "countries": ["USA", "JPN"],
     "charities": ["charity1","charity2"]
  }
  describe('#_renderIssueTitle()', function() {
	 //@DavidNeveling
    it('should be a div', function() {
      var issue = new IssueModel();
      assert.equal(issue._renderIssueTitle(data.key, data)[0].type, 'div');
    });
	 //@DavidNeveling
    it('should contain 2 divs', function() {
      var issue = new IssueModel();
      assert.equal(issue._renderIssueTitle(data.key, data)[0].props.children.length, 2);
    });
	 //@DavidNeveling
    it('should contain the right info', function() {
      var issue = new IssueModel();
      // reach into the div, then the first child div, then that child div's h4 element, then the body of that h4 element
      assert.equal(issue._renderIssueTitle(data.key, data)[0].props.children[0].props.children.props.children, 'sampleIssue');
      // reach into the div, then the first child div, then that child div's body
      assert.equal(issue._renderIssueTitle(data.key, data)[0].props.children[1].props.children, 'sampleSummary');
    });
  });
  describe('#_renderIssueCountries()', function() {
	 //@DavidNeveling
    it('should contain 2 countries', function() {
      var issue = new IssueModel();
      assert.equal(issue._renderIssueCountries(data.key, data)[0].props.data.length, 2);
    });
	 //@DavidNeveling
    it('should have links containing the right info', function() {
      var issue = new IssueModel();
      for (var i = 0; i < data.countries.length; i++){
         // reach into the Link, then the button, then the button's body
         assert.equal(issue._renderIssueCountries(data.key, data)[0].props.data[i], data.countries[i]);
      }
    });
  });
  describe('#_renderIssueCharities()', function() {
	  //@DavidNeveling
     it('should contain 2 Links', function() {
      var issue = new IssueModel();
      assert.equal(issue._renderIssueCharities(data).length, 2);
     });
	  //@DavidNeveling
     it('should have links containing the right info', function() {
      var issue = new IssueModel();
      for (var i = 0; i < data.countries.length; i++){
         // reach into the Link, then the button, then the button's body
          assert.equal(issue._renderIssueCharities(data)[i].props.children.props.children, data.charities[i]);
      }
     });
  });
});
