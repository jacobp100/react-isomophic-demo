export const FETCH = '@@middleware/fetch/FETCH';

const headers = {
  'Content-Type': 'application/json',
};

export default (baseUrl, fetchImplementation = global.fetch) => () => {
  const doFetch = async (method, url, data) => {
    const params = { method, headers };
    if (data) params.body = JSON.stringify(data);

    const response = await fetchImplementation(url, params);
    return await response.json();
  };

  return next => action => (
    (action.type === FETCH)
      ? doFetch(action.method, `${baseUrl}${action.url}`, action.data)
      : next(action)
  );
};

export const fetchJson = (method, url, data) => ({
  type: FETCH,
  method,
  url,
  data,
});
