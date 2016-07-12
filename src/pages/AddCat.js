import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import history from '../history';
import { getCats } from '../redux/cats';
import { formDispatcher } from '../util';

class Cats extends Component {
  static fetchData({ dispatch }) {
    return dispatch(getCats());
  }

  componentDidMount() {
    Cats.fetchData(this.props);
  }

  render() {
    const { formErrors, handleCatAddition } = this.props;

    return (
      <div>
        <h1>Add Cat</h1>
        <form method="POST" onSubmit={handleCatAddition}>
          <input type="hidden" name="handler" value="add-cat" />
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" />
            <div>{formErrors.name}</div>
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input id="age" type="number" name="age" />
            <div>{formErrors.age}</div>
          </div>
          <button>
            Add
          </button>
        </form>
        <Link to="/">Back</Link>
      </div>
    );
  }
}

export default connect(
  state => ({
    formErrors: state.cats.formErrorsPerCat['@@add-cat'] || {},
  }),
  dispatch => ({
    handleCatAddition: formDispatcher(dispatch, err => {
      if (!err) history.push('/');
    }),
    dispatch,
  })
)(Cats);
