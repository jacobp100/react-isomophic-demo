import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createFormDispatcher } from '../formDispatcherBrowser';


const getFormRef = () => 'add-cat';

const AddCat = ({ schemaErrors, submissionError, isSubmitting, handleCatAddition }) => (
  <div>
    <h1>Add Cat</h1>
    <form method="POST" onSubmit={handleCatAddition}>
      <input type="hidden" name="form[handler]" value="add-cat" />
      <input type="hidden" name="form[ref]" value={getFormRef()} />
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" disabled={isSubmitting} />
        <div>{schemaErrors.name}</div>
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input id="age" type="number" name="age" disabled={isSubmitting} />
        <div>{schemaErrors.age}</div>
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" disabled={isSubmitting}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div>{schemaErrors.gender}</div>
      </div>
      <button disabled={isSubmitting}>
        Add
      </button>
    </form>
    {submissionError && <p>{submissionError}</p>}
    <Link to="/">Back</Link>
  </div>
);

export default connect(
  state => ({
    schemaErrors: state.forms.schemaErrors[getFormRef()] || {},
    submissionError: state.forms.submissionError[getFormRef()] || '',
    isSubmitting: state.forms.isSubmitting[getFormRef()] || false,
  }),
  dispatch => ({
    handleCatAddition: createFormDispatcher(dispatch),
  })
)(AddCat);
