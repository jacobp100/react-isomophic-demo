/* eslint no-param-reassign: [0], no-console: [0] */

import 'babel-regenerator-runtime';

import {
  template, map, flatMap, flow, compact, cond, isFunction, identity, constant, values,
} from 'lodash/fp';
import React from 'react';
import yargs from 'yargs';
import { renderToString } from 'react-dom/server';
import Express from 'express';
import bodyParser from 'body-parser';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { RouterContext, match } from 'react-router';
import fetch from 'node-fetch';
import fetchMiddleware from '../src/middlewares/fetch';
import handlers from '../src/handlers';
import createRoutes from '../src/routes';
import { reducers } from '../src/redux';

import { readFileSync } from 'fs';
import { join } from 'path';


const args = yargs
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 8080,
  })
  .option('server-endpoint', {
    alias: 's',
    type: 'string',
    default: '',
  })
  .option('client-endpoint', {
    alias: 'c',
    type: 'string',
    default: '',
  })
  .help()
  .argv;

let index = readFileSync(join(__dirname, './index.html'));
index = template(index);

const server = new Express();
server.set('x-powered-by', false);
server.use(bodyParser.urlencoded({ extended: true }));


// STATIC FILES
server.use('/dist', Express.static(join(__dirname, '../dist')));
server.use('/assets', Express.static(join(__dirname, '../assets')));


// LOGGING
server.all('*', (req, res, next) => {
  console.log('Requested', req.url);
  next();
});


// SETUP STORE
server.all('*', (req, res, next) => {
  const middlewares = applyMiddleware(
    thunk,
    fetchMiddleware(fetch)
  );
  req.store = createStore(reducers, middlewares);

  next();
});


// FORM HANDLERS
server.post('*', async (req, res, next) => {
  const handler = handlers[req.body.handler];

  try {
    if (handler) await req.store.dispatch(handler(req.body));
  } catch (e) {
    console.log(e); // eslint-disable-line
  } finally {
    next();
  }
});


// RENDER PAGE
server.all('*', (req, res) => {
  const { store } = req;

  const routes = createRoutes(store);

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500).send(error.message);
    } else if (!renderProps) {
      res.status(404).send('Not found');
    } else {
      const { location, params } = renderProps;
      const { dispatch } = store;

      const dataFetchingRequirements = flow(
        flatMap(cond([
          [isFunction, identity],
          [constant(true), values],
        ])),
        map('WrappedComponent.fetchData'),
        compact,
        map(fetchData => fetchData({ location, params, dispatch }))
      )(renderProps.components);

      Promise.all(dataFetchingRequirements)
        .catch(() => {}) // Ignore errors from data fetching
        .then(() => {
          const reduxState = store.getState();
          const markup = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );

          return { markup, reduxState };
        })
        .catch(e => { // But not errors from rendering to a string
          console.error(`Failed to serve ${req.url}`);
          console.error(e);

          const markup = renderToString(<RouterContext {...renderProps} />);
          return { markup, reduxState: null };
        })
        .then(({ markup, reduxState }) => {
          res.send(index({
            apiEndpoint: args['client-endpoint'],
            markup,
            reduxState,
          }));
        }, () => {
          res.status(500).send('Failed to load page');
        });
    }
  });
});

server.listen(args.port, err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Server started');
  }
});
