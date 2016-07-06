import {
  __, flow, set, update, map, reduce, assign, reject, equals, omit, uniqueId, curry, concat, flip,
} from 'lodash/fp';
import yup from 'yup';
import { yupErrors } from '../yupUtil';


const addUpdateRemoveCatSchema = yup.object().shape({
  action: yup.string(),
  id: yup.string(),
  name: yup.string().required('You must provide a name'),
  age: yup.number().typeError('Must be a number'),
});

const defaultState = {
  catIds: [],
  cats: {},
  formErrorsPerCat: {},
  didSetCats: false,
};

export const SET_CATS = 'cats/SET_CATS';
export const UPDATE_CAT = 'cats/UPDATE_CAT';
export const ADD_CAT = 'cats/ADD_CAT';
export const REMOVE_CAT = 'cats/REMOVE_CAT';
export const SET_CAT_FORM_ERRORS = 'cats/SET_CAT_FORM_ERRORS';


const updateCatInState = curry((cat, state) => update(['cats', cat.id], assign(__, cat), state));

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_CATS:
      return flow(
        set('catIds', map('id', action.cats)),
        reduce(flip(updateCatInState), __, action.cats),
        set('didSetCats', true)
      )(state);
    case UPDATE_CAT:
      return updateCatInState(action.cat, state);
    case ADD_CAT: // eslint-disable-line
      const id = uniqueId();
      const cat = set('id', id, action.cat);
      return flow(
        update('catIds', concat(id)),
        updateCatInState(cat)
      )(state);
    case REMOVE_CAT:
      return update('catIds', reject(equals(action.id)), state);
    case SET_CAT_FORM_ERRORS:
      return set(['formErrorsPerCat', action.id], action.errors, state);
    default:
      return state;
  }
};

export const getCats = () => async (dispatch, getState) => {
  const { didSetCats } = getState().cats || {};

  if (didSetCats) return;

  dispatch({ type: SET_CATS, cats: [
    { id: 'default-1', name: 'Sprinkles', age: 8 },
    { id: 'default-2', name: 'Boots', age: 5 },
    { id: 'default-3', name: 'Waffles', age: 9 },
  ] });
};

export const updateCat = (id, params) => async dispatch => {
  dispatch({ type: UPDATE_CAT, cat: set('id', id, params) });
};

export const addCat = cat => async dispatch => {
  dispatch({ type: ADD_CAT, cat });
};

export const deleteCat = id => async dispatch => {
  dispatch({ type: REMOVE_CAT, id });
};

export const updateRemoveCatViaForm = inputParams => async dispatch => {
  try {
    const { action, id, ...params } = await addUpdateRemoveCatSchema.validate(inputParams, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (action === 'update') {
      return await dispatch(updateCat(id, params));
    } else if (action === 'remove') {
      return await dispatch(deleteCat(id));
    }
    return null;
  } catch (e) {
    const errors = yupErrors(e);
    const id = inputParams.id;
    dispatch({ type: SET_CAT_FORM_ERRORS, id, errors });
    throw e;
  }
};

export const addCatViaForm = inputParams => async dispatch => {
  try {
    let params = await addUpdateRemoveCatSchema.validate(inputParams, {
      abortEarly: false,
      stripUnknown: true,
    });
    params = omit(['action', 'id'], params);
    dispatch(addCat(params));
  } catch (e) {
    const errors = yupErrors(e);
    dispatch({ type: SET_CAT_FORM_ERRORS, id: '@@add-cat', errors });
    throw e;
  }
};
