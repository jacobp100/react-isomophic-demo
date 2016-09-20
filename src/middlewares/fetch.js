/* eslint no-console: [0] */
const FETCH = '@@middleware/fetch/FETCH';


const headers = {
  'Content-Type': 'application/json',
};

export default (baseUrl, fetchImplementation = global.fetch) => {
  let fetchRequests = [];

  const doFetch = async (method, url, data) => {
    const params = { method, headers };
    if (data) params.body = JSON.stringify(data);

    const response = await fetchImplementation(url, params);
    return await response.json();
  };

  const middleware = () => next => (action) => {
    if (action.type !== FETCH) return next(action);

    const fetchRequest = doFetch(action.method, `${baseUrl}${action.url}`, action.data);
    const fetchRequestWithCatch = fetchRequest.catch(() => {});
    fetchRequests = fetchRequests.concat([fetchRequestWithCatch]);

    return fetchRequest;
  };

  middleware.getFetchRequests = () => fetchRequests;

  return middleware;
};

export const fetchJson = (method, url, data) => ({
  type: FETCH,
  method,
  url,
  data,
});
