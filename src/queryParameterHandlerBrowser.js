import { __, update, assign } from 'lodash/fp';
import { getFormData } from './formDispatcherBrowser';
import history from './history';

// Submitting a form GET to the server sets the query parameters to the form data
export default location => e => {
  const formQuery = getFormData(e);
  const locationWithFormQuery = update('query', assign(__, formQuery), location);
  history.replace(locationWithFormQuery);
};
