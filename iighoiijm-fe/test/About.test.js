import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import About from '../src/components/views/About';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('About Page', () => {
  const wrapper=shallow(<About/>);
  //@SuspectTax
  it('should render', () => {
    expect(wrapper.length).to.equal(1);
  });
  //@SuspectTax
  it('should contain header and footer', () => {
    expect(wrapper.find('Basic').length).to.equal(1);
  });
  //@SuspectTax
  it('should have 6 team members', () => {
    expect(wrapper.find('img').length).to.equal(6);
  });
});
