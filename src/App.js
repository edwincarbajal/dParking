import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import Home from './Home';
import {
  UserSession,
  AppConfig
} from 'blockstack';
import { Switch, Route } from 'react-router-dom'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })


export default class App extends Component {


  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <Switch>
            <Route
              path='/:username?'
              render={
                routeProps => 
                  <Profile 
                    userSession={userSession} 
                    handleSignOut={ this.handleSignOut } 
                    {...routeProps} 
                  />
              }
            />
          </Switch>
          }

        </div>
      </div>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}
