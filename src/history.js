import { useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import qs from 'qs';

const history = global.navigator
  ? useRouterHistory(createBrowserHistory)({
    stringifyQuery: qs.stringify,
    parseQueryString: qs.parse,
  })
  : null;

export default history;
