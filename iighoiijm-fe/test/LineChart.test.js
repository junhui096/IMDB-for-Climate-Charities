import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import LineChart from '../src/LineChart';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('LineChart', () => {
  const wrapper=shallow(<LineChart size={[500,200]}/>);
  //@SuspectTax
  it('should render', () => {
    expect(wrapper.length).to.equal(1);
  });
  //@SuspectTax
  it('should contain a title', () => {
    expect(wrapper.find('h5').length).to.equal(1);
  });
  //@SuspectTax
  it('should contain an svg of the lineChart', () => {
    expect(wrapper.find('svg').length).to.equal(1);
  });

});
