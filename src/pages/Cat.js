import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getCats } from '../redux/cats';
import { createFormDispatcher } from '../formDispatcherBrowser';


const getFormRef = id => `update-remove-cat:${id}`;

class Cats extends Component {
  static fetchData({ dispatch }) {
    return dispatch(getCats());
  }

  componentDidMount() {
    Cats.fetchData(this.props);
  }

  render() {
    const { cat, schemaErrors, submissionError, isSubmitting, handleCatUpdateRemove } = this.props;

    if (!cat) return <div />;

    return (
      <div>
        <h1>{cat.name}</h1>
        <form method="POST">
          <input type="hidden" name="form[handler]" value="update-remove-cat" />
          <input type="hidden" name="form[ref]" value={getFormRef(cat.id)} />
          <input type="hidden" name="id" value={cat.id} />
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              defaultValue={cat.name}
              disabled={isSubmitting}
            />
            <div>{schemaErrors.name}</div>
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              name="age"
              defaultValue={cat.age}
              disabled={isSubmitting}
            />
            <div>{schemaErrors.age}</div>
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              defaultValue={cat.gender}
              disabled={isSubmitting}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div>{schemaErrors.gender}</div>
          </div>
          <button
            name="action"
            value="update"
            onClick={handleCatUpdateRemove}
            disabled={isSubmitting}
          >
            Update
          </button>
          <button
            name="action"
            value="remove"
            onClick={handleCatUpdateRemove}
            disabled={isSubmitting}
          >
            Delete
          </button>
        </form>
        {submissionError && <p>{submissionError}</p>}
        <Link to="/">Back</Link>
      </div>
    );
  }
}

export default connect(
  (state, { params }) => ({
    cat: state.cats.cats[params.id],
    schemaErrors: state.forms.schemaErrors[getFormRef(params.id)] || {},
    submissionError: state.forms.submissionError[getFormRef(params.id)] || '',
    isSubmitting: state.forms.isSubmitting[getFormRef(params.id)] || false,
  }),
  dispatch => ({
    handleCatUpdateRemove: createFormDispatcher(dispatch),
    dispatch,
  })
)(Cats);
