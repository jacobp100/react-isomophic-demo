import { set } from 'lodash/fp';

const defaultState = {
  redirect: null,
};

export const SET_REDIRECT = 'browserRedirect/SET_REDIRECT';

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_REDIRECT:
      return set('redirect', action.redirect, state);
    default:
      return state;
  }
};

export const setRedirect = redirect => ({ type: SET_REDIRECT, redirect });
export const clearRedirect = () => setRedirect(null);
