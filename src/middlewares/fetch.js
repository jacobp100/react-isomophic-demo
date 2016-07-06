/* eslint no-console: [0] */
const FETCH = '@@middleware/fetch/FETCH';


export default (baseUrl, fetchImplementation = global.fetch) => {
  const doFetch = async (method, url, data) => {
    const params = { method };

    if (data) {
      params.body = JSON.stringify(data);
    }

    const response = await fetchImplementation(url, params);
    let body;
    try {
      body = await response.json();
    } catch (e) {
      const dataJSON = JSON.stringify(data);
      console.error(`Failed to fetch ${url} with method ${method} and body ${dataJSON}`);
      console.error(e);
      throw e;
    }

    if (!response.ok) throw new Error(body.message);

    return { body, headers: response.headers };
  };

  return () => next => action => (
    (action.type !== FETCH)
      ? next(action)
      : doFetch(action.method, `${baseUrl}${action.url}`, action.data)
  );
};

export const fetchJson = (method, url, data) => ({
  type: FETCH,
  method,
  url,
  data,
});
