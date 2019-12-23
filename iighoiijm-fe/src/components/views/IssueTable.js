import React from 'react';
import Table from './Table';

class IssueTable extends Table {

  _composeSummaryDescription(instance) {
    const {
      countries,
      charities,
    } = instance;
    const countryItem = this.renderItems(countries);
    const charityItem = this.renderItems(charities);
    return (
      <div>
        <li className="description-item">country: {countryItem}</li>
        <li className="description-item">charity: {charityItem}</li>
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
    return "/issue?query=[]";
  }

  extractNumInstanceFromMetadata(metadata) {
    return metadata.count;
  }

  getInstanceFetchPath() {
    return '/issue';
  }

  composeModelPath(code) {
    return `/issues/issueCode=${code}`;
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
        code: instance.issue_name,
        name: instance.issue_name,
        imagePath: instance.images,
        description: this._composeSummaryDescription(instance),
      };
    }
    return null;
  }

  getSortOptions() {
    return [
      {value: 'issue_name', label: 'Issue Name', 'orderDescDefault': false},
      {value: 'country', label: 'Country Count', 'orderDescDefault': true},
      {value: 'charity', label: 'Charity Count', 'orderDescDefault': true},
      {value: '', label: 'Default', 'orderDescDefault': false},
    ];
  }

  renderHeader() {
    return (
      <div className="container">
        <h1 className="jumbotron-heading">Environmental Issues</h1>
        <p className="lead text-muted">
          Environmental issues are happening now
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

export default IssueTable;
