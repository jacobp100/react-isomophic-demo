import { combineReducers } from 'redux';
import cats from './cats';
import forms from './forms';
import browserRedirect from './browserRedirect';

/* eslint-disable import/prefer-default-export */
export const reducers = combineReducers({
  cats,
  forms,
  browserRedirect,
});
