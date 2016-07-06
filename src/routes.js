import Cats from './pages/Cats';
import AddCat from './pages/AddCat';
import Cat from './pages/Cat';

export default {
  path: '/',
  indexRoute: {
    component: Cats,
  },
  childRoutes: [
    {
      path: 'cats/add',
      component: AddCat,
    },
    {
      path: 'cats/:id',
      component: Cat,
    },
  ],
};
