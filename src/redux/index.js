import { combineReducers } from 'redux';
import cats from './cats';
import forms from './forms';

export const reducers = combineReducers({
  cats,
  forms,
});
