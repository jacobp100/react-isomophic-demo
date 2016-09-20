import serialize from 'form-serialize';
import formDispatcherBase from './formDispatcherBase';
import { setRedirect } from './redux/browserRedirect';


export const getFormData = (event) => {
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

export const formHandler = event => async (dispatch) => {
  const inputParams = getFormData(event);

  try {
    const { redirect } = await dispatch(formDispatcherBase(inputParams));
    if (redirect) dispatch(setRedirect(redirect));
  } catch (e) {
    return;
  }
};
