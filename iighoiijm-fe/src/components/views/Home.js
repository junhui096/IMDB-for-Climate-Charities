import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typist from 'react-typist';
import Basic from './Basic';

class Home extends Component {
  render() {
    const typistCursor = {
      element: '|',
      hideWhenDone: true,
      hideWhenDoneDelay: 0
    };
    return (
      <Basic>
        <h1 className="cover-header">
          <Typist cursor={typistCursor}>
            Is it getting hot or is it just me?
          </Typist>
        </h1>
        <Typist
          className="lead"
          startDelay={2700}
          avgTypingDelay={30}
          stdTypingDelay={0}
          cursor={typistCursor}
        >
            Explore <Link to="/countries">country influence</Link>,{' '}
            <Link to="/issues">environmental issues</Link>, and{' '}
            <Link to="/charities">charities</Link>.
        </Typist>
      </Basic>
    );
  }
}

export default Home;
