import 'babel-regenerator-runtime';

import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import fetchMiddleware from './middlewares/fetch';
import history from './history';
import routes from './routes';
import { reducers } from './redux';


const initialState = global.__REDUX_STATE__ || {}; // eslint-disable-line
const endpoint = global.__API_ENDPOINT__ || ''; // eslint-disable-line
const middlewares = applyMiddleware(
  thunk,
  fetchMiddleware(global.fetch)
);

const store = createStore(reducers, initialState, middlewares);

render((
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
), document.getElementById('cats'));
