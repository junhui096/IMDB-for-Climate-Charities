import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './basic.css';

// TODO: active on Navbar

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      redirect: null
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    });
  }

  render() {
    return (
      <header className="masthead mb-auto">
        <div className="inner">
          <h3 className="masthead-brand">IIGettingHot|IIJustMe</h3>
          <nav className="nav nav-masthead justify-content-center">
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/countries">
              Country
            </Link>
            <Link className="nav-link" to="/issues">
              Issue
            </Link>
            <Link className="nav-link" to="/charities">
              Charity
            </Link>
            <Link className="nav-link" to="/about">
              About
            </Link>
            <form className="form-inline ml-3">
              <input
                type="search"
                className="form-control-sm mr-1 search-bar"
                id="search-bar"
                onChange={this.handleSearch}
              />
              <Link to={`/search/${this.state.search}`}>
                <button className="btn btn-sm search-bar">Search</button>
              </Link>
            </form>
          </nav>
        </div>
      </header>
    );
  }
}

export default Navbar;
