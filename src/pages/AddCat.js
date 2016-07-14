import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { formDispatcher } from '../formDispatcher';

const AddCat = ({ formErrors, handleCatAddition }) => (
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
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div>{formErrors.gender}</div>
      </div>
      <button>
        Add
      </button>
    </form>
    <Link to="/">Back</Link>
  </div>
);

export default connect(
  state => ({
    formErrors: state.cats.formErrorsPerCat['@@add-cat'] || {},
  }),
  dispatch => ({
    handleCatAddition: formDispatcher(dispatch),
  })
)(AddCat);
