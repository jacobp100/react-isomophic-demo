import { addCatViaForm, updateRemoveCatViaForm } from './redux/cats';

export default {
  'add-cat': {
    handler: addCatViaForm,
    redirect: '/',
  },
  'update-remove-cat': {
    handler: updateRemoveCatViaForm,
    redirect: params => (params.action === 'remove' ? '/' : null),
  },
};
