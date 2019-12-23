import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Basic from './Basic';

import { teamData } from '../common/TeamData';

import './basic.css';

// const axiosConfig = {
//   headers: { 'PRIVATE-TOKEN': 'WkzhU4cpDizMUi52PmXj' }
// };

class About extends Component {
  constructor() {
    super();
    this.state = {
      commits: {},
      issues: {},
      tests: {}
    };
  }

  // Will revisit implementation with Redux
  componentDidMount() {
    this._getCommits();
    this._getIssues();
    this._getTests();
  }

  _getCommits() {
    axios
      .get(
        'https://gitlab.com/api/v4/projects/ramonfabrega%2Fidb/repository/contributors'
      )
      .then(res => {
        const temp = {};

        res.data.forEach(user => {
          const key = user.email.split('@')[0];
          temp[key] = user.commits;
        });

        this.setState({
          commits: temp
        });
      })
      .catch(err => console.log(err));
  }

  _getIssues() {
    axios
      .get(
        'https://gitlab.com/api/v4/projects/ramonfabrega%2Fidb/issues?state=closed&per_page=100'
      )
      .then(res => {
        const temp = {};

        res.data.forEach(issue => {
          const key = issue.closed_by.username;
          if (temp[key]) {
            temp[key] += 1;
          } else {
            temp[key] = 1;
          }
        });

        this.setState({
          issues: temp
        });
      })
      .catch(err => console.log(err));
  }

  _getTests() {
    const CORS = 'https://cors-anywhere.herokuapp.com/';

    let URLs = [
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-be/testing/test_backend.py',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/About.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/Basic.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/CharityModel.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/CharityTable.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/CountryModel.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/CountryTable.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/Home.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/IssueModel.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/IssueTable.test.js',
      'https://gitlab.com/ramonfabrega/idb/raw/master/iighoiijm-fe/test/LineChart.test.js'
    ];
    URLs = URLs.map(url => CORS + url);

    // test object to track to then place in state
    const tests = {};

    teamData.forEach(member => {
      tests[member.username] = member.tests;
    });

    // Store axios promises for the URLs
    const promises = [];
    URLs.forEach(l => {
      promises.push(axios.get(l));
    });

    axios.all(promises).then(results => {
      results.forEach(res => {
        teamData.forEach(member => {
          const searchParam = new RegExp(`@${member.username}`, 'g');

          const count = (res.data.match(searchParam) || []).length;
          tests[member.username] += count;
        });
      });
    });

    this.setState({ tests });
  }

  // Create the cards for the team members from the information
  _generateMembers(members) {
    let cols = [];

    members.forEach(member => {
      const commitKey = member.email.split('@')[0];
      const commits = this.state.commits[commitKey];

      const issueKey = member.username;
      const issues = this.state.issues[issueKey];

      const testKey = member.username;
      const tests = this.state.tests[testKey];

      cols.push(
        <div className="col-12 col-md-4 mb-5" key={member.username}>
          <img
            className="rounded-circle img-thumbnail mb-3"
            src={member.photo}
            alt={member.name}
            style={{ width: '150px' }}
          />
          <h3 className="mb-1">{member.name}</h3>
          <h6 className="mb-3 text-muted">{member.responsibilities}</h6>
          <p>{member.bio}</p>
          <p className="mb-1">{`${commits ? commits : 0} commits`}</p>
          <p className="mb-1">{`${issues ? issues : 0} issues closed`}</p>
          <p className="mb-0">{`${tests ? tests : 0} unit tests created`}</p>
        </div>
      );
    });

    return cols;
  }

  render() {
    let totalCommits = 0;
    let totalIssues = 0;
    let totalTests = 0;

    for (const user in this.state.commits) {
      totalCommits += this.state.commits[user];
    }

    for (const user in this.state.issues) {
      totalIssues += this.state.issues[user];
    }

    for (const user in this.state.tests) {
      totalTests += this.state.tests[user];
    }

    return (
      <Basic>
        <div className="about mt-5 mb-2">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="display-4">IIGettingHot|IIJustMe</h1>
                <p className="lead text-muted">
                  Countries all over the world are facing an enormous amount of
                  environmental issues.
                  <br />A variety of organizations help alleviate these
                  problems.
                  <br />
                  Our purpose is to show its users which issues are affecting
                  different countries, and how different organizations are
                  avaiable should they wish to donate and help. We expect that
                  anyone who is concerned about the environment will benefit
                  from the data we have collected.
                </p>
              </div>
            </div>
            <div className="row py-5">
              <div className="col-12">
                <h1 className="jumbotron-heading">Meet the Team</h1>
                <p className="lead text-muted">
                  Learn about the team of IIGettingHot|IIJustMe
                </p>
                <div className="row">{this._generateMembers(teamData)}</div>
              </div>
            </div>
            <div className="row pb-5">
              <div className="col-12">
                <h1 className="jumbotron-heading">Repository Stats</h1>
                <p className="lead text-muted">Aggregated GitLab Statistics</p>
                <h5>{`${totalCommits} total commits`}</h5>
                <h5>{`${totalIssues} total issues closed`}</h5>
                <h5>{`${totalTests} total unit tests`}</h5>
              </div>
            </div>

            <div className="row py-5">
              <div className="col-12">
                <h1 className="jumbotron-heading">Data Sources</h1>
                <p className="lead text-muted">
                  Information on the data sources and scraping methods
                </p>
                <div className="row">
                  <div className="col">
                    <Link
                      to="/countries"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <h3>Countries</h3>
                    </Link>
                    <a href="https://pypi.org/project/iso3166/">
                      Countries Data Source
                    </a>
                    <p className="mt-1">
                      The Countries list is acquired using the Python module
                      ISO3166. Temperature, rain, and emissions are scraped from
                      the datahelpdesk factbooks{' '}
                      <a href="https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api">
                        (Temperature, Rain
                      </a>{' '}
                      -{' '}
                      <a href="https://data.worldbank.org/indicator/EN.ATM.CO2E.PC">
                        C02 Emissions)
                      </a>
                      . The flags are then scraped from{' '}
                      <a href="https://fabian7593.github.io/CountryAPI/">
                        Country API
                      </a>
                      .
                    </p>
                  </div>
                  <div className="col">
                    <Link
                      to="/issues"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <h3>Issues</h3>
                    </Link>
                    <a href="https://pypi.org/project/wikipedia/">
                      Issues Data Source
                    </a>
                    <p className="mt-1">
                      Issues are entirely scraped from Wikipedia using the
                      Python module wikipedia. The data connecting the issues to
                      the countries is scraped from the{' '}
                      <a href="https://www.cia.gov/library/publications/the-world-factbook/fields/2032.html">
                        CIA Factbook
                      </a>
                      .
                    </p>
                  </div>
                  <div className="col">
                    <Link
                      to="/charities"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <h3>Charities</h3>
                    </Link>
                    <a href="https://www.charitynavigator.org/">
                      Charities Data Source
                    </a>
                    <p className="mt-1">
                      Charities are scraped from the source using their API. The{' '}
                      <a href="https://clearbit.com/logo">Clearbit API</a> is
                      used to scrape the charity logos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row py-5">
              <div className="col-12">
                <h1 className="jumbotron-heading">Tools</h1>
                <p className="lead text-muted">
                  Tools used in the creation of this website
                </p>
                <div className="row">
                  <div className="col-3 p-1">
                    React JS
                    <p className="text-muted">Frontend Development</p>
                  </div>
                  <div className="col-3 p-1">
                    Create React App
                    <p className="text-muted">
                      React Boilerplate / Build Config
                    </p>
                  </div>
                  <div className="col-3 p-1">
                    AWS
                    <p className="text-muted">Hosting</p>
                  </div>
                  <div className="col-3 p-1">
                    Python Wikipedia Module
                    <p className="text-muted">Scraping</p>
                  </div>
                  <div className="col-3 p-1">
                    Python ISO3166 Module
                    <p className="text-muted">Country ISO Codes</p>
                  </div>
                  <div className="col-3 p-1">
                    Postman
                    <p className="text-muted">API Generation</p>
                  </div>
                  <div className="col-3 p-1">
                    Selenium
                    <p className="text-muted">Automated Browser Testing</p>
                  </div>
                  <div className="col-3 p-1">
                    D3.js
                    <p className="text-muted">Data Visualization</p>
                  </div>
                  <div className="col-3 p-1">
                    Flask
                    <p className="text-muted">Python Web Framework</p>
                  </div>
                  <div className="col-3 p-1">
                    PostgreSQL
                    <p className="text-muted">Database</p>
                  </div>
                  <div className="col-3 p-1">
                    psycopg2
                    <p className="text-muted">
                      Python-PostgreSQL Database Adapter
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row py-5">
              <div className="col-12">
                <h1 className="jumbotron-heading">Project Links</h1>
                <div className="row">
                  <div className="col">
                    <a href="https://gitlab.com/ramonfabrega/idb/">
                      GitLab Repository
                    </a>
                  </div>
                  <div className="col">
                    <a href="https://documenter.getpostman.com/view/5497939/RWgm2LED">
                      Postman API
                    </a>
                  </div>
                  <div className="col">
                    <Link to="/vis" style={{ textDecoration: 'none', color: 'white' }}>
                    <p>Data Visualizations</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Basic>
    );
  }
}

export default About;
