import { set } from 'lodash/fp';

const defaultState = {
  schemaErrors: {},
  submissionError: {},
  isSubmitting: {},
};

export const SET_FORM_SCHEMA_ERRORS = 'forms/SET_FORM_SCHEMA_ERRORS';
export const SET_FORM_SUBMISSION_ERROR = 'forms/SET_FORM_SUBMISSION_ERROR';
export const SET_FORM_IS_SUBMITTING = 'forms/SET_FORM_IS_SUBMITTING';

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_FORM_SCHEMA_ERRORS:
      return set(['schemaErrors', action.formId], action.schemaErrors, state);
    case SET_FORM_SUBMISSION_ERROR:
      return set(['submissionError', action.formId], action.submissionError, state);
    case SET_FORM_IS_SUBMITTING:
      return set(['isSubmitting', action.formId], action.isSubmitting, state);
    default:
      return state;
  }
};

export const setSchemaErrors = (formId, schemaErrors) =>
  ({ type: SET_FORM_SCHEMA_ERRORS, formId, schemaErrors });
export const setSubmissionError = (formId, submissionError) =>
  ({ type: SET_FORM_SUBMISSION_ERROR, formId, submissionError });
export const setFormIsSubmitting = (formId, isSubmitting) =>
  ({ type: SET_FORM_IS_SUBMITTING, formId, isSubmitting });
