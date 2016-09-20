import { __, update, assign } from 'lodash/fp';
import { getFormData } from './formDispatcherBrowser';
import { setRedirect } from './redux/browserRedirect';

// Submitting a form GET to the server sets the query parameters to the form data
export default (e, location) => {
  const formQuery = getFormData(e);
  const locationWithFormQuery = update('query', assign(__, formQuery), location);
  return setRedirect(locationWithFormQuery); // dispatch
};
