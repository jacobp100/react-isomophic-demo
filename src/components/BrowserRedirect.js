import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { clearRedirect } from '../redux/browserRedirect';


/*
FIXME:

In the form handlers, we want to imperatively set the location. However, there's currently no way
to do this without access to the React context, nor a way to sync the location with Redux.
*/

class App extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.redirect !== this.props.redirect && this.props.redirect) {
      this.props.clearRedirect();
    }
  }

  render() {
    const { redirect } = this.props;
    return redirect ? <Redirect to={redirect} /> : null;
  }
}

export default connect(
  state => ({
    redirect: state.browserRedirect.redirect,
  }),
  { clearRedirect }
)(App);
