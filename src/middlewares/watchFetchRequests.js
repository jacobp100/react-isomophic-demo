import { FETCH } from './fetch';

// Used on the server to get all fetch requests so we can wait until they're complete
export default () => {
  let fetchRequests = [];

  const middleware = () => next => (action) => {
    const result = next(action);
    if (action.type === FETCH) {
      const fetchRequestWithCatch = result.catch(() => {});
      fetchRequests = fetchRequests.concat([fetchRequestWithCatch]);
    }
    return result;
  };

  const getFetchRequests = () => fetchRequests;

  return { middleware, getFetchRequests };
};
