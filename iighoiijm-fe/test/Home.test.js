import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Home from '../src/components/views/Home';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Homepage', () => {
  const wrapper=shallow(<Home/>);
  //@SuspectTax
  it('should render', () => {
    expect(wrapper.length).to.equal(1);
  });
  //@SuspectTax
  it('should contain header and footer', () => {
    expect(wrapper.find('Basic').length).to.equal(1);
  });
  //@SuspectTax
  it('should have 2 typist objects', () => {
    expect(wrapper.find('Typist').length).to.equal(2);
  });
});
