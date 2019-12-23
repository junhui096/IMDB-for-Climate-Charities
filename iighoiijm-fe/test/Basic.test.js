import React from 'react';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Basic from '../src/components/views/Basic';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('Basic(Header and Footer)', () => {
  const wrapper=shallow(<Basic/>);
  //@SuspectTax
  it('should render', () => {
    expect(wrapper.length).to.equal(1);
  });
  //@SuspectTax
  it('should contan navbar', () => {
    expect(wrapper.find('Navbar').length).to.equal(1);
  });
  //@SuspectTax
  it('should have a body', () => {
    expect(wrapper.find('main').length).to.equal(1);
  });
  //@SuspectTax
  it('should have footer', () => {
    expect(wrapper.find('footer').length).to.equal(1);
  });
  //@SuspectTax
  it('should have footer message', () => {
    expect(wrapper.find('footer').find('p').length).to.equal(1);
  });
});
