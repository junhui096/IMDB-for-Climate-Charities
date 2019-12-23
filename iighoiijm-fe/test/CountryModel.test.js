import CountryModel from '../src/components/views/CountryModel'
var assert = require('assert');

//Used for simulated mounting of components
//Throws many errors and I haven't found a way to run class methods
/*
import React from 'react';
import { mount, shallow, configure  } from 'enzyme';
import {expect} from 'chai';
import 'jsdom-global/register';
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
*/

describe('CountryModel', function() {

   // gives a series of errors and doesn't register API call at time of console.log()

   // var countryModel = mount(<CountryModel match={{"params":{"asset":"USA"}}}/>);
   // describe('#mount of CountryModel', function() {
   //    it('print state', function() {
   //       console.log(countryModel.state());
   //    });
   // });
   var data = {
     "country_name": "United States of America",
     "issues": ["issue1", "issue2"],
     "charities": ["charity1","charity2"]
  }
   describe('#_renderCountryName()', function() {
      //@DavidNeveling
      it('should contain the correct name', function() {
       var countryModel = new CountryModel();
       assert.equal(countryModel._renderCountryName(data)[0].props.children, data.country_name);
      });
   });
   describe('#_renderCountryIssues()', function() {
      //@DavidNeveling
      it('should contain the correct info', function() {
       var countryModel = new CountryModel();
       for (var i = 0; i < data.issues.length; i++){
          assert.equal(countryModel._renderCountryIssues(data)[i].props.children.key, data.issues[i]);
       }
      });
    });
    describe('#_renderCountryCharities()', function() {
      //@DavidNeveling
      it('should contain the correct info', function() {
       var countryModel = new CountryModel();
       for (var i = 0; i < data.charities.length; i++){
          assert.equal(countryModel._renderCountryCharities(data)[i].props.children.key, data.charities[i]);
       }
      });
    });
    /*
    describe('#_renderCountryTemperature()', function() {
      //@DavidNeveling
      it('should contain the correct name', function() {
       var countryModel = new CountryModel();
       assert.equal(countryModel._renderCountryName(data)[0].props.children, data.country_name);
      });
    });
    describe('#_renderCountryRainfall()', function() {
      //@DavidNeveling
      it('should contain the correct name', function() {
       var countryModel = new CountryModel();
       assert.equal(countryModel._renderCountryName(data)[0].props.children, data.country_name);
      });
    });
    describe('#_renderCountryEmissions()', function() {
      //@DavidNeveling
      it('should contain the correct name', function() {
       var countryModel = new CountryModel();
       assert.equal(countryModel._renderCountryName(data)[0].props.children, data.country_name);
      });
    });
    */
});
