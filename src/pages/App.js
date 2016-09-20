import React from 'react';
import { Match, Miss } from 'react-router';
import Cats from './Cats';
import AddCat from './AddCat';
import Cat from './Cat';
import BrowserRedirect from '../components/BrowserRedirect';


export default () => (
  <div>
    <BrowserRedirect />
    <Match pattern="/add-cat" component={AddCat} />
    <Match pattern="/cats/:id" component={Cat} />
    <Miss component={Cats} />
  </div>
);
