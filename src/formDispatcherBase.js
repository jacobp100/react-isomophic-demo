import handlers from './handlers';
import { setSchemaErrors, setSubmissionError, setFormIsSubmitting } from './redux/forms';


const yupErrors = e => e.inner.reduce((accum, { path, message }) => {
  accum[path] = message; // eslint-disable-line
  return accum;
}, {});

const validateForm = async (inputParams, schema) => {
  try {
    const params = await schema.validate(inputParams, {
      abortEarly: false,
      stripUnknown: true,
    });
    return params;
  } catch (e) {
    const schemaErrors = yupErrors(e);
    throw schemaErrors;
  }
};

export default inputParams => async dispatch => {
  let { form, ...params } = inputParams; // eslint-disable-line
  const { handler, ref = handler } = form;

  if (!(handler in handlers)) throw new Error(`No handler found for ${handler}`);

  let { actionCreator, schema, redirect = null } = handlers[handler]; // eslint-disable-line

  try {
    params = await validateForm(params, schema);
  } catch (schemaErrors) {
    dispatch(setSchemaErrors(ref, schemaErrors));
    return { redirect: null };
  }

  try {
    dispatch(setFormIsSubmitting(ref, true));

    const action = actionCreator(params);
    await dispatch(action);

    if (typeof redirect === 'function') redirect = redirect(inputParams);

    return { redirect };
  } catch (e) {
    const sumbissionError = e.message;
    dispatch(setSubmissionError(ref, sumbissionError));
    return { redirect: null };
  } finally {
    dispatch(setFormIsSubmitting(ref, false));
  }
};
