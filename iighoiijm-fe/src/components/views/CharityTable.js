import React from 'react';
import Table from './Table';

class CharityTable extends Table {

  _composeSummaryDescription(instance) {
    const {
      country,
      issues,
    } = instance;
    const countryItem = this.renderItems(country);
    const issueItem = this.renderItems(issues);
    return (
      <div>
        <li className="description-item">country: {countryItem}</li>
        <li className="description-item">issue: {issueItem}</li>
      </div>
    );
  }

  _setCountryFilter = (event) => {
    const value = event.target.value;
    this.setState({
      countryFilter: value,
    });
  };

  getNumInstanceEndpoint() {
    return "/charity?query=[]";
  }

  extractNumInstanceFromMetadata(metadata) {
    return metadata.count;
  }

  getInstanceFetchPath() {
    return '/charity';
  }

  composeModelPath(code) {
    return `/charities/charityCode=${code}`;
  }

  getFilterQuery() {
    const {
      countryFilter,
    } = this.state;
    var query = "";
    if(countryFilter) {
      query += `&country=["${countryFilter}"]`;
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
        code: instance.charity_name,
        name: instance.charity_name,
        imagePath: instance.Image,
        description: this._composeSummaryDescription(instance),
      };
    }
    return null;
  }

  getSortOptions() {
    return [
      {value: 'charity_name', label: 'Charity Name', 'orderDescDefault': false},
      {value: 'country', label: 'Country Count', 'orderDescDefault': true},
      {value: 'issue', label: 'Issue Count', 'orderDescDefault': true},
      {value: '', label: 'Default', 'orderDescDefault': false},
    ];
  }

  renderHeader() {  
    return (
      <div className="container">
        <h1 className="jumbotron-heading">Charities</h1>
        <p className="lead text-muted">
          Take actions, save our world
        </p>
      </div>
    );
  }

  renderFilterForm() {  
    return (
      <form className="form-inline ml-3" onSubmit={this.handleFilterSubmit}>
        <label>By Country: </label>
        <input
          type="text"
          className="form-control-sm mr-1"
          id="country"
          placeholder="country code"
          onChange={this._setCountryFilter}
        />
        <input className="flex-item-sort" type="submit" value="filter"/>
      </form>
    );
  }
}

export default CharityTable;
