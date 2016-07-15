import { addCatViaForm, updateRemoveCatViaForm } from './redux/cats';

export default {
  'add-cat': {
    actionCreator: addCatViaForm,
    redirect: '/',
  },
  'update-remove-cat': {
    actionCreator: updateRemoveCatViaForm,
    redirect: params => (params.action === 'remove' ? '/' : null),
  },
};
