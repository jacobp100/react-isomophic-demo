/* eslint no-param-reassign: [0], no-console: [0] */

import 'babel-regenerator-runtime';

import { readFileSync } from 'fs';
import { join } from 'path';

import { template } from 'lodash/fp';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Express from 'express';
import bodyParser from 'body-parser';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ServerRouter, createServerRenderContext } from 'react-router';
import fetch from 'node-fetch';
import createFetchMiddleware from '../src/middlewares/fetch';
import { reducers } from '../src/redux';
import formDispatcherBase from '../src/formDispatcherBase';
import App from '../src/pages/App';


const config = {
  clientEndpoint: 'http://localhost:8081',
  serverEndpoint: 'http://localhost:8081',
  port: 8080,
};


const index = readFileSync(join(__dirname, './index.html'));
const renderTemplate = template(index);

const server = new Express();
server.use(bodyParser.urlencoded({ extended: true }));


// UTIL
const getFinalState = async (store) => {
  let state;
  do {
    state = store.getState();
    await Promise.resolve();
  } while (state !== store.getState());
};


// STATIC FILES
server.use('/dist', Express.static(join(__dirname, '../dist')));


// SETUP STORE
server.all('*', (req, res, next) => {
  const fetchMiddleware = createFetchMiddleware(config.serverEndpoint, fetch);
  const middlewares = applyMiddleware(
    thunk,
    fetchMiddleware,
  );
  req.store = createStore(reducers, middlewares);
  req.fetchMiddleware = fetchMiddleware;

  next();
});


// FORM HANDLERS
server.post('*', async (req, res, next) => {
  try {
    const inputParams = req.body;
    const { redirect } = await req.store.dispatch(formDispatcherBase(inputParams));

    if (redirect) {
      res.redirect(redirect);
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    next();
  }
});


// RENDER PAGE
server.all('*', async (req, res) => {
  const { fetchMiddleware, store } = req;

  const context = createServerRenderContext();

  try {
    let markup;
    let fetchRequests;
    do {
      fetchRequests = fetchMiddleware.getFetchRequests();
      await Promise.all(fetchRequests);
      markup = renderToString(
        <Provider store={store}>
          <ServerRouter location={req.url} context={context}>
            <App />
          </ServerRouter>
        </Provider>
      );
      await getFinalState(store);
    } while (fetchMiddleware.getFetchRequests() !== fetchRequests);

    // TODO: Redirects
    // Note that form handlers have their own redirect logic
    const reduxState = store.getState();

    res.send(renderTemplate({
      apiEndpoint: config.clientEndpoint,
      markup,
      reduxState,
    }));
  } catch (e) {
    res.status(500).send('Failed to load page');
  }
});

server.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Server started');
  }
});
