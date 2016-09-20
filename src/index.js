/* global document */
import 'babel-regenerator-runtime';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import fetchMiddleware from './middlewares/fetch';
import { reducers } from './redux';
import App from './pages/App';


const initialState = global.__REDUX_STATE__ || {}; // eslint-disable-line
const endpoint = global.__API_ENDPOINT__ || ''; // eslint-disable-line
const middlewares = applyMiddleware(
  thunk,
  fetchMiddleware(endpoint, global.fetch)
);

const store = createStore(reducers, initialState, middlewares);

render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('cats'));
