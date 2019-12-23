import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import Basic from './Basic';
import Spinner from '../common/Spinner';
import './table.css';

const URL = 'http://api.isitgettinghotorisitjust.me';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numInstanceLoaded: false,
      instanceLoaded: false,
      errLoaded: false,

      numInstance: 0,
      instance: [],
      instanceResult: null,

      activePage: 1,
      itemCountPerPage: 9,

      sortby: {
        value: '',
        label: 'Default'
      },
      orderDesc: false,
      searchQuery: ''
    };
  }

  componentDidMount() {
    fetch(URL + this.getNumInstanceEndpoint())
      .then(resp => resp.json())
      .then(body => {
        this.setState({
          numInstanceLoaded: true,
          numInstance: this.extractNumInstanceFromMetadata(body)
        });
      })
      .catch(this._handleRequestError);
  }

  _composeGetInstance(queryNumbers) {
    const { sortby, orderDesc, searchQuery } = this.state;
    const sortbyValue = sortby.value;
    var addr = URL + this.getInstanceFetchPath() + `?query=[${queryNumbers}]`;
    if (sortbyValue !== '') {
      addr += `&sort=${sortbyValue}&order=${orderDesc ? 'desc' : 'asc'}`;
    }
    if (searchQuery !== '') {
      const keywords = searchQuery.split(/[\s,]+/);
      addr += '&keywords=[';
      for (var i = 0; i < keywords.length; i++) {
        addr += `"${keywords[i]}"`;
        if (i < keywords.length - 1) addr += ',';
      }
      addr += ']';
    }
    addr += this.getFilterQuery();
    return addr;
  }

  _loadInstance(indexL, indexR) {
    var numbers = '';
    for (var i = indexL; i < indexR; i++) {
      numbers += `${i}`;
      if (i < indexR-1) numbers += ',';
    }

    fetch(this._composeGetInstance(numbers))
      .then(resp => resp.json())
      .then(body => {
        this.setState({
          instanceLoaded: true,
          numInstance: body.count,
          instanceResult: body.results
        });
      })
      .catch(this._handleRequestError);
  }

  _handleRequestError() {
    this.setState({
      errLoaded: true
    });
  }

  _renderEmptyCard() {
    return (
      <div className="card mb-4 shadow-sm bg-dark">
        <div className="card-body">
          <Spinner />
        </div>
      </div>
    );
  }

  _renderSummaryCard(summary) {
    return (
      <Link
        to={this.composeModelPath(summary['code'])}
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <div className="card mb-4 shadow-sm bg-dark">
          <img
            className="card-img-top"
            src={summary['imagePath']}
            alt={summary['name']}
            height="200rem"
          />
          <div className="card-body">
            <h5 className="card-text">{summary['name']}</h5>
            {summary['description']}
          </div>
        </div>
      </Link>
    );
  }

  _renderCard(instanceIndex) {
    const summary = this.getSummary(instanceIndex);
    const isUndefined = summary == null;

    return (
      <div className="col-md-4" key={instanceIndex}>
        {isUndefined && this._renderEmptyCard()}
        {!isUndefined && this._renderSummaryCard(summary)}
      </div>
    );
  }

  _renderNoResultsFound(){
    const output=[];
    output.push(
      <div className="col-md-12 my-5 py-5">
        <h1>No Results Found</h1>
      </div>
    );
    return output;
  }
  _renderGridCard(indexL, indexR) {
    const rows = [];
    for (var i = indexL; i < indexR; i++) rows.push(this._renderCard(i));
    if(this.state.instanceLoaded && this.state.numInstance === 0)
      rows.push(this._renderNoResultsFound());
    return rows;
  }

  _onFilterSelect(selectedFilter) {
    throw new Error('NotImplementedError: not now...');
  }

  _onSortSelect = selectedSort => {
    const { sortby, orderDesc } = this.state;
    const sortbyValue = sortby.value;
    const { value, orderDescDefault } = selectedSort;
    if (sortbyValue === value)
      this.setState({
        instanceLoaded: false,
        instanceResult: null,
        activePage: 1,
        orderDesc: !orderDesc,
      });
    else
      this.setState({
        instanceLoaded: false,
        instanceResult: null,
        activePage: 1,
        sortby: selectedSort,
        orderDesc: orderDescDefault,
      });
  };

  _onSearchChange = (event) => {
    const value = event.target.value;
    this.setState({
      searchQuery: value,
    });
  };

  _handlePageChange(pageNumber) {
    const { activePage } = this.state;
    if (activePage !== pageNumber) {
      this.setState({
        instanceLoaded: false,
        instanceResult: null,
        activePage: pageNumber
      });
    }
  }

  renderItems(items) {
    // copied from IssueModel.js
    const letterLimit = 5;
    const output = [];
    const numRender = Math.min(4, items.length);
    if (items.length === 0) {
      output.push(
        <button
          type="button"
          className="btn btn-item btn-outline-warning text-center m-1"
          key="more"
        >
          {`Not enough info`}
        </button>
      );
    } else {
      for (var i = 0; i < numRender; i++) {
        var itemName = items[i].substring(0, letterLimit);
        if (items[i].length > letterLimit) itemName += '...';
        output.push(
          <button
            type="button"
            className="btn btn-item btn-outline-info text-center m-1"
            key={items[i]}
          >
            {itemName}
          </button>
        );
      }
      if (numRender < items.length) {
        output.push(
          <button
            type="button"
            className="btn btn-item btn-outline-info text-center m-1"
            key="more"
          >
            {`${items.length - numRender}+ more`}
          </button>
        );
      }
    }
    return output;
  }

  _renderTableSearch() {
    return (
      <form className="form-inline" onSubmit={this.handleSearchSubmit}>
        <input
          type="text"
          className="form-control-sm ml-2 mr-2"
          id="epi-min"
          placeholder="search"
          onChange={this._onSearchChange}
        />
      </form>
    );
  }

  handleFilterSubmit = (event) => {
    this.setState({
      instanceLoaded: false,
      instanceResult: null,
      activePage: 1,
    });
    event.preventDefault();
  };

  handleSearchSubmit = (event) => {
    this.setState({
      instanceLoaded: false,
      instanceResult: null,
      activePage: 1,
    });
    event.preventDefault();
  };

  getNumInstanceEndpoint(metadata) {
    throw new Error(
      'NotImplementedError: implement getNumInstanceEndpoint in child class!'
    );
  }

  extractNumInstanceFromMetadata(metadata) {
    throw new Error(
      'NotImplementedError: implement extractNumInstanceFromMetadata in child class!'
    );
  }

  getInstanceFetchPath() {
    throw new Error(
      'NotImplementedError: implement getInstanceFetchPath in child class!'
    );
  }

  composeModelPath(code) {
    throw new Error(
      'NotImplementedError: implement composeModelPath in child class!'
    );
  }

  getFilterQuery(code) {
    throw new Error(
      'NotImplementedError: implement getFilterQuery in child class!'
    );
  }

  getSummary(instanceIndex) {
    throw new Error(
      'NotImplementedError: implement getSummary in child class!'
    );
  }

  getSortOptions() {
    throw new Error(
      'NotImplementedError: implement getSortOptions in child class!'
    );
  }

  renderHeader() {
    throw new Error(
      'NotImplementedError: implement renderHeader in child class!'
    );
  }

  renderFilterForm() {
    throw new Error(
      'NotImplementedError: implement renderFilterForm in child class!'
    );
  }

  render() {
    const {
      numInstanceLoaded,
      instanceLoaded,
      numInstance,
      activePage,
      itemCountPerPage,
      sortby
    } = this.state;

    const renderIndexL = Math.min((activePage - 1) * itemCountPerPage + 1, numInstance + 1);
    const renderIndexR = Math.min(renderIndexL + itemCountPerPage, numInstance + 1);
    const currentItemCount = renderIndexR - renderIndexL

    if (numInstanceLoaded && !instanceLoaded)
      this._loadInstance(renderIndexL, renderIndexR);

    const sortOptions = this.getSortOptions();

    const isNoCard = this.state.instanceLoaded && this.state.numInstance === 0;

    return (
      <Basic>
        <section className="jumbotron text-center">
          {this.renderHeader()}
        </section>

        <ul className="flex-container-nav">
          <li className="flex-item-nav">Search:</li>
          <li className="flex-item-nav">
            {this._renderTableSearch()}
          </li>
        </ul>

        <ul className="flex-container-nav">
          <li className="flex-item-nav">Sort by:</li>
          <li className="flex-item-nav-sort">
            <Select
              value={sortby}
              onChange={this._onSortSelect}
              options={sortOptions}
              className="select-sort"
            />
          </li>
          <li className="flex-item-nav ml-5">Filter:</li>
          <li className="flex-item-nav">
            {this.renderFilterForm()}
          </li>
        </ul>

        <ul className="flex-container-nav">
        </ul>

        <div className="album">
          <div className="container">
            <div className="row">
              {isNoCard && this._renderNoResultsFound()}
              {!isNoCard && this._renderGridCard(0, currentItemCount)}
            </div>
          </div>
        </div>

        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemCountPerPage}
          totalItemsCount={numInstance}
          pageRangeDisplayed={5}
          onChange={pageNumber => {
            this._handlePageChange(pageNumber);
          }}
          innerClass="pagination justify-content-center"
          itemClass="page-item"
          linkClass="page-link"
        />
      </Basic>
    );
  }
}

export default Table;
