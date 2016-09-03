import serialize from 'form-serialize';
import history from './history';
import formDispatcherBase from './formDispatcherBase';


export const getFormData = event => {
  if ('preventDefault' in event) event.preventDefault(); // Sometimes we fake events

  const { currentTarget } = event;
  const isChildOfForm = 'form' in currentTarget;
  const form = isChildOfForm ? currentTarget.form : currentTarget;
  const actionParams = serialize(form, { hash: true, empty: true });

  if (isChildOfForm && currentTarget.tagName === 'BUTTON' && currentTarget.name) {
    actionParams[currentTarget.name] = currentTarget.value;
  }

  return actionParams;
};

export const createFormDispatcher = dispatch => async event => {
  const inputParams = getFormData(event);

  try {
    const { redirect } = await dispatch(formDispatcherBase(inputParams));
    if (redirect) history.push(redirect);
  } catch (e) {
    return;
  }
};
