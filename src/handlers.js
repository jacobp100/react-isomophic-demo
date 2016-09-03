import yup from 'yup';
import { addCat, removeCat, updateCat } from './redux/cats';


export default {
  'add-cat': {
    actionCreator: addCat,
    schema: yup.object().shape({
      name: yup.string().required('You must provide a name'),
      age: yup.number().typeError('Must be a number'),
      gender: yup.string().oneOf(['male', 'female'], 'Must select a valid gender'),
    }),
    redirect: '/',
  },
  'update-remove-cat': {
    actionCreator: ({ id, action, ...params }) => (
      action === 'remove'
        ? removeCat(id)
        : updateCat(id, params)
    ),
    schema: yup.object().shape({
      id: yup.string(),
      action: yup.string(),
      name: yup.string().required('You must provide a name'),
      age: yup.number().typeError('Must be a number'),
      gender: yup.string().oneOf(['male', 'female'], 'Must select a valid gender'),
    }),
    redirect: params => (params.action === 'remove' ? '/' : null),
  },
};
