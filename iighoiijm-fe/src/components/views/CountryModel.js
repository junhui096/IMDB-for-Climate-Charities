import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Basic from './Basic';
import LineChart from '../../LineChart';

import axios from 'axios';

class CountryModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      asset: null,
      data: null
    };
  }

  componentDidMount() {
    const url =
      'http://api.isitgettinghotorisitjust.me/country?query=["' +
      this.props.match.params.asset +
      '"]';

    axios
      .get(url)
      .then(res => {
        const countryData = res.data.results[0];
        if (countryData.error) {
          this.props.history.push('/not-found');
        } else {
          this.setState({
            asset: this.props.match.params.asset,
            data: countryData
          });
        }
      })
      .catch(err => console.log(err));
      console.log(this.props);
  }

  _renderCountryName(country_data) {
    const output = [];
    output.push(
      <h1 className="text-center" key={country_data.country_name}>
        {country_data.country_name}
      </h1>
    );
    return output;
  }

  _renderCountryIssues(country_data) {
    const output = [];
    var issues = country_data.issues;
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

  _renderCountryCharities(country_data) {
    const output = [];
    var charities = country_data.charities;
    for (var i = 0; i < charities.length; i++) {
      output.push(
        <Link
          to={`/charities/charityCode=${charities[i]}`}
          style={{ textDecoration: 'none', color: 'white' }}
          key={`charity${i}`}
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

  _renderCountryTemperature(country_data) {
    const output = [];
    var temps = country_data.temperature;
    output.push(
          <LineChart
          name={'Average Temperature'}
          data={temps}
          format={'score'}  //(20 year average)
          size={[500, 200]}
          color={'#fe9922'}
          xlabel={'Date'}
          ylabel={'Temperature °C'}
          key='tempchart'
          />
    );

    return output;
  }


  _renderCountryRainfall(country_data) {
    const output = [];
    var rain = country_data.rainfall;
    output.push(
          <LineChart
          name={'Rainfall'}
          data={rain}
          format={'score'}  //(20 year average)
          size={[500, 200]}
          color={'#4485ed'}
          xlabel={'Date'}
          ylabel={'Rainfall ( in/year )'}
          key='rainfall'
          />
    );
    return output;
  }

  _renderCountryEmissions(country_data){
    const output=[];
    var emissions=country_data.emission;
    output.push(
          <LineChart
          name={'Average Emissions'}
          data={emissions}
          format={'year'}  //(1 year average)
          size={[500,200]}
          color={'#4485ed'}
          xlabel={'Date'}
          ylabel={'Million Tons of CO2'}
          key='emission'
          />
    );
    return output;
  }


  render() {
    if (this.state.asset && this.state.data) {
      return (
        <Basic>
          <div className="container">
            {this._renderCountryName(this.state.data)}
          </div>
          <div className="container">
            <div className="row" />
            <div className="row mt-5">
              <div className="col-sm-4">
                <div className="row">
                  <div className="card bg-dark m-3 w-100">
                    <div className="card-header bg-info">
                      <h5>Environmental Performance Index</h5>
                    </div>
                    <div className="card-body mt-1">
                      {this.state.data['EPI']}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card bg-dark m-3 w-100">
                    <div className="card-header bg-info">
                      <h5>Issues</h5>
                    </div>
                    <div className="card-body mt-3">
                      {this._renderCountryIssues(this.state.data)}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card bg-dark m-3 w-100">
                    <div className="card-header bg-info">
                      <h5>Charities</h5>
                    </div>
                    <div className="card-body mt-3">
                      {this._renderCountryCharities(this.state.data)}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card bg-dark m-3 w-100">
                    <div className="card-header bg-info">
                      <h5>Location</h5>
                    </div>
                    <div className="card-body mt-1">
                      {`Latitude: ${this.state.data.latitude}`}
                      <br />
                      {`Longitude: ${this.state.data.longtitude}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-8">
                {this._renderCountryTemperature(this.state.data)}
                {this._renderCountryRainfall(this.state.data)}
                {this._renderCountryEmissions(this.state.data)}
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

export default CountryModel;
