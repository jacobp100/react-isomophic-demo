import serialize from 'form-serialize';
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

export const formDispatcher = (dispatch, cb) => async event => {
  const params = getFormData(event);
  const fn = handlers[params.handler];

  try {
    await dispatch(fn(params));
    if (cb) cb();
  } catch (e) {
    if (cb) cb(e);
    throw e;
  }
};
