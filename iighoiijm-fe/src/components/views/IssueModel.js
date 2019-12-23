import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BasicMap from './WorldMap'
import Basic from './Basic';

import axios from 'axios';

class IssueModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: null,
      data: null
    };
  }

  componentDidMount() {
    const url =
      'http://api.isitgettinghotorisitjust.me/issue?query=["' +
      this.props.match.params.asset +
      '"]';

    axios
      .get(url)
      .then(res => {
        const issueData = res.data.results[0];
        if (issueData.error) {
          this.props.history.push('/not-found');
        } else {
          this.setState({
            asset: this.props.match.params.asset,
            data: issueData
          });
        }
      })
      .catch(err => console.log(err));
  }

  _renderIssueTitle(issue_key, issue_data) {
    const output = [];
    output.push(
      <div className="card bg-dark" key='title'>
        <div className="card-header bg-danger" key={issue_key}>
          <h4>{issue_key}</h4>
        </div>
        <div className="card-body" key="issue">
          {issue_data.summary}
        </div>
      </div>
    );
    return output;
  }

  _renderIssueCountries(issue_name, issue_data) {
    const output = [];
    var countries = issue_data.countries;
    output.push(
      <BasicMap
        className="my-4"
        data={countries}
        />
    );
    return output;
  }

  _renderIssueCountryNames(issue_name, issue_data) {
    // console.log(this);
    const output = [];
    var countries = issue_data.countries;
    for (var i = 0; i < countries.length; i++) {
      output.push(
        <Link
          to={`/countries/countryCode=${countries[i]}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={`country${i}`}
        >
          <button
            type="button"
            className="btn btn-outline-info text-center m-1"
            key={countries[i]}
          >
            {countries[i]}
          </button>
        </Link>
      );
    }
    return output;
  }

  _renderIssueCharities(issue_data) {
    const output = [];
    var charities = issue_data.charities;
    for (var i = 0; i < charities.length; i++) {
      output.push(
        <Link
          to={`/charities/charityCode=${charities[i]}`}
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <button
            type="button"
            className="btn btn-outline-warning text-center m-1"
            key={charities[i]}
          >
            {charities[i]}
          </button>
        </Link>
      );
    }
    return output;
  }

  render() {
    if (this.state.asset && this.state.data) {
      return (
        <Basic>
          <div className="container">
            <div className="row mt-3">
              <div className="col-12">
                {this._renderIssueTitle(this.state.asset, this.state.data)}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <div className="card bg-dark w-100">
                  <div className="card-header bg-danger">
                    <h5>Charities</h5>
                  </div>
                  <div className="card-body">
                    {this._renderIssueCharities(this.state.data)}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-dark">
                  <div className="card-header bg-danger">
                    <h4>Countries Affected</h4>
                  </div>
                  <div className="card-body">
                    {this._renderIssueCountries(
                      this.state.asset,
                      this.state.data
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Basic>
      );
    } else {
      return <div />;
    }
  }
}

export default IssueModel;
