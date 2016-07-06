import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'lodash/fp';
import { getCats } from '../redux/cats';

class Cats extends Component {
  static fetchData({ dispatch }) {
    return dispatch(getCats());
  }

  componentDidMount() {
    Cats.fetchData(this.props);
  }

  render() {
    const { catIds, cats } = this.props;

    return (
      <div>
        <h1>Cats</h1>
        {map(id => (
          <Link key={id} to={`/cats/${id}`}>
            <div>
              {cats[id].name}
            </div>
          </Link>
        ), catIds)}
        <hr />
        <Link to="/cats/add">
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
  })
)(Cats);
