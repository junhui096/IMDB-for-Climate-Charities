import React, { Component } from 'react';
import Navbar from './Navbar';
import './basic.css';

class Basic extends Component {
  render() {
    const mainBody = this.props.children;
    return (
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column text-center">
        <Navbar />

        <main role="main" className="inner cover">
          {mainBody}
        </main>

        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>Is it Getting Hot or is it Just Me?</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Basic;
