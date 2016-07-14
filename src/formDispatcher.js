import serialize from 'form-serialize';
import history from './history';
import handlers from './handlers';


export const getFormData = event => {
  if ('preventDefault' in event) event.preventDefault(); // Sometimes we fake events

  const { currentTarget } = event;
  const isChild = 'form' in currentTarget;
  const form = isChild ? currentTarget.form : currentTarget;
  const params = serialize(form, { hash: true, empty: true });

  if (isChild && currentTarget.tagName === 'BUTTON' && currentTarget.name) {
    params[currentTarget.name] = currentTarget.value;
  }

  return params;
};

export const formDispatcher = dispatch => async event => {
  const params = getFormData(event);
  let { handler, redirect } = handlers[params.handler]; // eslint-disable-line

  try {
    await dispatch(handler(params));
    if (typeof redirect === 'function') redirect = redirect(params);
    if (redirect) history.push(redirect);
  } catch (e) {
    throw e;
  }
};
