import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Basic from './Basic';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCount: 0,
      issueCount: 0,
      charityCount: 0,
      countryData: [],
      issueData: [],
      charityData: [],
      isLoaded: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.asset !== prevProps.match.params.asset) {
      // Get keywords from params and parse for query
      const asset = this.props.match.params.asset; 
      if(asset === undefined) {
        this.setState({
          countryCount: 0,
          issueCount: 0,
          charityCount: 0,
          countryData: [],
          issueData: [],
          charityData: [],
          isLoaded: true,
        });
        return;
      }
      const keywords = asset.split(' ');
      let keywordsString = '';
      keywords.forEach(word => {
        keywordsString += `"${word}",`;
      });
      keywordsString = keywordsString.substring(0, keywordsString.length - 1);

      axios
        .all([
          axios.get(this._buildQuery('country', [], keywordsString)),
          axios.get(this._buildQuery('issue', [], keywordsString)),
          axios.get(this._buildQuery('charity', [], keywordsString))
        ])
        .then(
          axios.spread((countryRes, issueRes, charityRes) => {
            // Use results to determine amount of cards
            this.setState({
              countryCount: countryRes.data.count,
              issueCount: issueRes.data.count,
              charityCount: charityRes.data.count,
              isLoaded: false,
            });

            // Call the correct query to fetch all matches
            axios
              .all([
                axios.get(
                  this._buildQuery(
                    'country',
                    countryRes.data.count,
                    keywordsString
                  )
                ),
                axios.get(
                  this._buildQuery('issue', issueRes.data.count, keywordsString)
                ),
                axios.get(
                  this._buildQuery(
                    'charity',
                    charityRes.data.count,
                    keywordsString
                  )
                )
              ])
              .then(
                axios.spread((countryRes2, issueRes2, charityRes2) => {
                  this.setState({
                    countryCount: countryRes2.data.count,
                    issueCount: issueRes2.data.count,
                    charityCount: charityRes2.data.count,
                    countryData: countryRes2.data.results,
                    issueData: issueRes2.data.results,
                    charityData: charityRes2.data.results,
                    isLoaded: true,
                  });
                })
              );
          })
        );
    }
  }

  _buildQuery(model, query, keywords) {
    let queryString = '';

    for (let i = 1; i <= query; i++) {
      queryString += i;
      if (i < query) {
        queryString += ',';
      }
    }

    return `http://api.isitgettinghotorisitjust.me/${model}?query=[${queryString}]&keywords=[${keywords}]`;
  }

  render() {
    let countryLinks = [];
    let issueLinks = [];
    let charityLinks = [];

    this.state.countryData.forEach((country, i) => {
      countryLinks.push(
        <Link
          to={`/countries/countryCode=${country.country_code}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={i}
        >
          <button
            type="button"
            className="btn btn-outline-info text-center m-1"
            key={i}
          >
            {country.country_name}
          </button>
        </Link>
      );
    });

    this.state.issueData.forEach((issue, i) => {
      issueLinks.push(
        <Link
          to={`/issues/issueCode=${issue.issue_name}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={i}
        >
          <button
            type="button"
            className="btn btn-outline-danger text-center m-1"
            key={i}
          >
            {issue.issue_name}
          </button>
        </Link>
      );
    });

    this.state.charityData.forEach((charity, i) => {
      charityLinks.push(
        <Link
          to={`/charities/charityCode=${charity.charity_name}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={i}
        >
          <button
            type="button"
            className="btn btn-outline-warning text-center m-1"
            key={i}
          >
            {charity.charity_name}
          </button>
        </Link>
      );
    });

    return (
      <Basic>
        <div className="search mt-5 mb-2">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3>Search results for: {this.props.match.params.asset}</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-5">
                <h4>Countries</h4>
                {!this.state.isLoaded &&
                  <p className="lead text-muted">loading...</p>}
                {this.state.isLoaded &&
                  (<div>
                    <p className="lead text-muted">
                      {this.state.countryCount === 1
                        ? this.state.countryCount + ' match'
                        : this.state.countryCount + ' matches'}
                    </p>
                    {countryLinks}
                  </div>)
                }
              </div>
              <div className="col-12 mt-5">
                <h4>Issues</h4>
                {!this.state.isLoaded &&
                  <p className="lead text-muted">loading...</p>}
                {this.state.isLoaded &&
                  (<div>
                    <p className="lead text-muted">
                      {this.state.issueCount === 1
                        ? this.state.issueCount + ' match'
                        : this.state.issueCount + ' matches'}
                    </p>
                    {issueLinks}
                  </div>)
                }
              </div>
              <div className="col-12 mt-5">
                <h4>Charities</h4>
                {!this.state.isLoaded &&
                  <p className="lead text-muted">loading...</p>}
                {this.state.isLoaded &&
                  (<div>
                    <p className="lead text-muted">
                      {this.state.charityCount === 1
                        ? this.state.charityCount + ' match'
                        : this.state.charityCount + ' matches'}
                    </p>
                    {charityLinks}
                  </div>)
                }
              </div>
            </div>
          </div>
        </div>
      </Basic>
    );
  }
}
