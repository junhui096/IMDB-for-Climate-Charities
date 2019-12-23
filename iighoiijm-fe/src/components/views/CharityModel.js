import React, { Component } from 'react';
import Basic from './Basic';
import { Link } from 'react-router-dom';
import BasicMap from './WorldMap'

import axios from 'axios';

class CharityModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: null,
      data: null
    };
  }

  componentDidMount() {
    const url =
      'http://api.isitgettinghotorisitjust.me/charity?query=["' +
      this.props.match.params.asset +
      '"]';

    axios
      .get(url)
      .then(res => {
        const charityData = res.data.results[0];
        if (charityData.error) {
          this.props.history.push('/not-found');
        } else {
          this.setState({
            asset: this.props.match.params.asset,
            data: charityData
          });
        }
      })
      .catch(err => console.log(err));
  }

  _renderCharityBio(charityName, charity_data) {
    const charity_address = charity_data['Address'];
    const output = [];

    output.push(
      <div className="card bg-dark" key="container">
      <div className="card-header bg-info">
        <h2 className="text-center">{charityName}</h2>
      </div>
        <div className="card">
          <img
            className="card-img-top"
            src={charity_data['Image']}
            alt={charityName}
            height="200rem"
          />
        </div>
        <div className="p-3">
          <p>{charity_data['tagLine']}</p>
          <p>
            {charity_address['streetAddress1']}{' '}
            {charity_address['streetAddress2']}, {charity_address['city']}{' '}
            {charity_address['stateOrProvince']},{' '}
            {charity_address['postalCode']}
          </p>
          <Link to={charity_data['website']}>{charity_data['website']}</Link>
        </div>
      </div>
    );
    return output;
  }

  _renderCharityCountries(charity_data) {
    const output = [];
    var country = charity_data.country;
    output.push(
      <BasicMap
        data={country}
        />
    );
    /*for (var i = 0; i < country.length; i++) {
      output.push(
        <Link
          to={`/countries/countryCode=${country[i]}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={`country${i}`}
        >
          <button
            type="button"
            className="btn btn-outline-info text-center m-1"
            key={country[i]}
          >
            {country[i]}
          </button>
        </Link>
      );
    }*/
    return output;
  }

  _renderCharityIssues(charity_data) {
    const output = [];
    var issues = charity_data.issues;
    for (var i = 0; i < issues.length; i++) {
      output.push(
        <Link
          to={`/issues/issueCode=${issues[i]}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={`issue${i}`}
        >
          <button
            type="button"
            className="btn btn-outline-danger text-center m-1"
            key={issues[i]}
          >
            {issues[i]}
          </button>
        </Link>
      );
    }
    return output;
  }

  _renderCharityMission(charity_data) {
    const output = [];
    output.push(
        <div className="card bg-dark" key='mission'>
          <div className="card-header bg-info">
            <h5>Mission</h5>
          </div>
          <div>
            <p className="p-3">{charity_data['mission']}</p>
          </div>
        </div>
    );
    return output;
  }

  render() {
    if (this.state.asset && this.state.data) {
      return (
        <Basic>
          <main role="main" className="inner cover">
            <div className="container">
              <div className="row mt-5">
                <div className="col-sm-4 px-4">
                  <div className="row">
                    <div className="card bg-dark mt-3 w-100 pb-3">
                      {this._renderCharityBio(
                        this.state.asset,
                        this.state.data
                      )}
                      <div className="row justify-content-center mt-3">
                        <a
                          href={this.state.data.donation_link}
                          style={{ textDecoration: 'none', color: 'white' }}
                        >
                          <button
                            type="button"
                            className="btn btn-outline-warning text-center m-1"
                          >
                            Donate Here
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8 px-4">
                  <div className="row">
                    <div className="card bg-dark mt-3">
                      {this._renderCharityMission(this.state.data)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="card bg-dark m-3 w-100">
                      <div className="card-header bg-warning">
                        <h5>Countries Impacted</h5>
                      </div>
                      <div className="card-body mt-3">
                        {this._renderCharityCountries(this.state.data)}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="card bg-dark m-3 w-100">
                      <div className="card-header bg-warning">
                        <h5>Issues</h5>
                      </div>
                      <div className="card-body mt-3">
                        {this._renderCharityIssues(this.state.data)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Basic>
      );
    } else {
      return <div />;
    }
  }
}

export default CharityModel;
