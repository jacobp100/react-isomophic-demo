import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getCats } from '../redux/cats';
import { formDispatcher } from '../formDispatcher';

class Cats extends Component {
  static fetchData({ dispatch }) {
    return dispatch(getCats());
  }

  componentDidMount() {
    Cats.fetchData(this.props);
  }

  render() {
    const { cat, formErrors, handleCatUpdateDelete } = this.props;

    if (!cat) return <div />;

    return (
      <div>
        <h1>{cat.name}</h1>
        <form method="POST">
          <input type="hidden" name="handler" value="update-remove-cat" />
          <input type="hidden" name="id" value={cat.id} />
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={cat.name} />
            <div>{formErrors.name}</div>
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input id="age" type="number" name="age" defaultValue={cat.age} />
            <div>{formErrors.age}</div>
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" defaultValue={cat.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div>{formErrors.gender}</div>
          </div>
          <button name="action" value="update" onClick={handleCatUpdateDelete}>
            Update
          </button>
          <button name="action" value="remove" onClick={handleCatUpdateDelete}>
            Delete
          </button>
        </form>
        <Link to="/">Back</Link>
      </div>
    );
  }
}

export default connect(
  (state, { params }) => ({
    cat: state.cats.cats[params.id],
    formErrors: state.cats.formErrorsPerCat[params.id] || {},
  }),
  dispatch => ({
    handleCatUpdateDelete: formDispatcher(dispatch),
    dispatch,
  })
)(Cats);
