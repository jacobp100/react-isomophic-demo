import serialize from 'form-serialize';
import history from './history';
import handlers from './handlers';


export const getFormData = event => {
  if ('preventDefault' in event) event.preventDefault(); // Sometimes we fake events

  const { currentTarget } = event;
  const isChild = 'form' in currentTarget;
  const form = isChild ? currentTarget.form : currentTarget;
  const actionParams = serialize(form, { hash: true, empty: true });

  if (isChild && currentTarget.tagName === 'BUTTON' && currentTarget.name) {
    actionParams[currentTarget.name] = currentTarget.value;
  }

  return actionParams;
};

export const formDispatcher = dispatch => async event => {
  const actionParams = getFormData(event);

  let { actionCreator, redirect } = handlers[actionParams.handler]; // eslint-disable-line

  const action = actionCreator(actionParams);
  await dispatch(action);

  if (typeof redirect === 'function') redirect = redirect(actionParams);
  if (redirect) history.push(redirect);
};
