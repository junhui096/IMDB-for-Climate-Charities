import React from 'react';
import Table from './Table';

class CountryTable extends Table {

  _composeSummaryDescription(instance) {
    const {
      EPI,
    } = instance;
    return (
      <p className="card-text">{`EPI: ${EPI}`}</p>
    );
  };

  _setEpiFilterMin = (event) => {
    const value = parseFloat(event.target.value);
    this.setState({
      epiFilterMin: value,
    });
  };

  _setEpiFilterMax = (event) => {
    const value = parseFloat(event.target.value);
    this.setState({
      epiFilterMax: value,
    });
  };

  getNumInstanceEndpoint() {
    return "/country?query=[]";
  }

  extractNumInstanceFromMetadata(metadata) {
    return metadata.count;
  }

  getInstanceFetchPath() {
    return '/country';
  }

  composeModelPath(code) {
    return `/countries/countryCode=${code}`;
  }

  getFilterQuery() {
    const {
      epiFilterMin,
      epiFilterMax,
    } = this.state;
    var query = "";
    if(!isNaN(epiFilterMin) || !isNaN(epiFilterMax)) {
      const epiMin = isNaN(epiFilterMin) ? 0 : epiFilterMin;
      const epiMax = isNaN(epiFilterMax) ? 100 : epiFilterMax;
      query += `&EPI=[${epiMin}, ${epiMax}]`;
    }
    return query;
  }

  getSummary(instanceIndex) {
    const {instanceResult} = this.state;
    if(instanceResult !== null && instanceIndex < instanceResult.length) {
      const instance = instanceResult[instanceIndex];
      if(instance.error)
        return null;
      return {
        code: instance.country_code,
        name: `${instance.country_name} (${instance.country_code})`,
        imagePath: instance.flag_link,
        description: this._composeSummaryDescription(instance),
      };
    }
    return null;
  }

  getSortOptions() {
    return [
      {value: 'country_name', label: 'Country Name', 'orderDescDefault': false},
      {value: 'country_code', label: 'Country Code', 'orderDescDefault': false},
      {value: 'EPI', label: 'Environmental Performance Index (EPI)', 'orderDescDefault': true},
      {value: '', label: 'Default', 'orderDescDefault': false},
    ];
  }

  renderHeader() {  
    return (
      <div className="container">
        <h1 className="jumbotron-heading">Countries</h1>
        <p className="lead text-muted">
          Learn about how each country's contribution to climate change
        </p>
      </div>
    );
  }

  renderFilterForm() {  
    return (
      <form className="form-inline" onSubmit={this.handleFilterSubmit}>
        <label> EPI: </label>
        <input
          type="text"
          className="form-control-sm ml-2 mr-2 bound-num"
          id="epi-min"
          placeholder="0"
          onChange={this._setEpiFilterMin}
        />
        <label> - </label>
        <input
          type="text"
          className="form-control-sm ml-2 mr-3 bound-num"
          id="epi-max"
          placeholder="100"
          onChange={this._setEpiFilterMax}
        />
        <input className="flex-item-sort" type="submit" value="filter"/>
      </form>
    );
  }
}

export default CountryTable;
