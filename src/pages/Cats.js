import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'lodash/fp';
import { setQueryParams, getCats } from '../redux/cats';
import queryParameterHandler from '../queryParameterHandlerBrowser';

class Cats extends Component {
  static fetchData({ location, dispatch }) {
    return dispatch(setQueryParams(location.query || {}))
      .then(() => dispatch(getCats()));
  }

  constructor(props) {
    super();
    Cats.fetchData(props);
  }

  componentDidUpdate() {
    Cats.fetchData(this.props);
  }

  render() {
    const { catIds, cats, genderFilter, setFilter } = this.props;

    return (
      <div>
        <h1>Cats</h1>
        <form method="GET" onSubmit={setFilter}>
          <label>
            Gender <select name="gender" defaultValue={genderFilter}>
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <button>
            Filter
          </button>
        </form>
        <hr />
        {map(id => (
          <Link key={id} to={`/cats/${id}`}>
            <div>
              {cats[id].name}
            </div>
          </Link>
        ), catIds)}
        <hr />
        <Link to="/add-cat">
          Add Cat
        </Link>
      </div>
    );
  }
}

export default connect(
  state => ({
    catIds: state.cats.catIds,
    cats: state.cats.cats,
    genderFilter: state.cats.genderFilter,
  }),
  (dispatch, { location }) => ({
    setFilter: e => dispatch(queryParameterHandler(e, location)),
    dispatch,
  })
)(Cats);
