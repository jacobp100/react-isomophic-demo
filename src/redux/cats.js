import {
  __, flow, set, update, map, reduce, assign, reject, equals, curry, union, flip, compact,
} from 'lodash/fp';
import { fetchJson } from '../middlewares/fetch';


const defaultState = {
  catIds: [],
  cats: {},
  genderFilter: '',
  didSetCats: false,
};

export const SET_CATS = 'cats/SET_CATS';
export const UPDATE_CAT = 'cats/UPDATE_CAT';
export const REMOVE_CAT = 'cats/REMOVE_CAT';
export const SET_FILTER = 'cats/SET_FILTER';
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
    case UPDATE_CAT: // eslint-disable-line
      return flow(
        update('catIds', union([action.cat.id])),
        updateCatInState(action.cat)
      )(state);
    case REMOVE_CAT:
      return update('catIds', reject(equals(action.id)), state);
    case SET_FILTER:
      return action.genderFilter === state.genderFilter
        ? state
        : flow(
          set('genderFilter', action.genderFilter),
          set('didSetCats', false)
        )(state);
    case SET_CAT_FORM_ERRORS:
      return set(['formErrorsPerCat', action.id], action.errors, state);
    default:
      return state;
  }
};

export const getCats = () => async (dispatch, getState) => {
  const { didSetCats, genderFilter } = getState().cats || {};

  if (didSetCats) return;

  const query = compact([
    genderFilter && `gender=${genderFilter}`,
  ]).join('&');
  const url = compact(['/cats', query]).join('?');
  const cats = await dispatch(fetchJson('GET', url));
  dispatch({ type: SET_CATS, cats });
};

export const updateCat = (id, params) => async (dispatch) => {
  try {
    const cat = await dispatch(fetchJson('POST', `/cats/${id}`, params));
    dispatch({ type: UPDATE_CAT, cat });
  } catch (e) {
    throw new Error('Failed to update cat');
  }
};

export const addCat = params => async (dispatch) => {
  try {
    const cat = await dispatch(fetchJson('PUT', '/cats', params));
    dispatch({ type: UPDATE_CAT, cat });
  } catch (e) {
    throw new Error('Failed to add cat');
  }
};

export const removeCat = id => async (dispatch) => {
  try {
    await dispatch(fetchJson('DELETE', `/cats/${id}`));
    dispatch({ type: REMOVE_CAT, id });
  } catch (e) {
    throw new Error('Failed to remove cat');
  }
};

export const setQueryParams = inputParams => async (dispatch) => {
  // Async because you might use validation
  dispatch({ type: SET_FILTER, genderFilter: inputParams.gender || '' });
};
