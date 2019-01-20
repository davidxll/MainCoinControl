import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Home from './components/Home';
import AuthService from './services/auth.service';
import './styles/index.scss';

const authInstance = new AuthService();

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/login" component={Login} auth={authInstance}/>
      <Route exact path="/dashboard" render={() => (
        authInstance.isLoggedIn() ? (
          <Dashboard auth={authInstance} />
        ) : (
          <Redirect to="/login"/>
        )
      )}/>
      <Route exact path="/" component={Home}/>
    </div>
  </Router>
);

export default Routes;
