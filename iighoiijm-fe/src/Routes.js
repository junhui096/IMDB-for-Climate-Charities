import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/views/Home';
import CountryTable from './components/views/CountryTable';
import IssueTable from './components/views/IssueTable';
import CountryModel from './components/views/CountryModel';
import IssueModel from './components/views/IssueModel';
import CharityTable from './components/views/CharityTable';
import CharityModel from './components/views/CharityModel';
import About from './components/views/About';
import Search from './components/views/Search';
import Maintenance from './components/views/Maintenance';
import D3Vis from './components/views/D3Vis';

class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/countries" component={CountryTable} />
          <Route
            exact
            path="/countries/countryCode=:asset"
            component={CountryModel}
          />
          <Route exact path="/charities" component={CharityTable} />
          <Route
            exact
            path="/charities/charityCode=:asset"
            component={CharityModel}
          />
          <Route exact path="/issues" component={IssueTable} />
          <Route exact path="/issues/issueCode=:asset" component={IssueModel} />
          <Route path="/charities" component={CharityTable} />
          <Route path="/about" component={About} />
          <Route path="/search/:asset" component={Search} />
          <Route path="/search" component={Search} />
          <Route path="/fixing" component={Maintenance} />
          <Route path="/vis" component={D3Vis} />
          <Route path="/not-found" component={Maintenance} />
          <Route path="*" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
