// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home.js';
import Dashboard from './components/dashboard.js';
import Tickets from './components/ticket.js';
import Login from './components/login.js';
import ResProfile  from './components/restProfile';

function App() {
  return (
    <>
      <Route exact path='/' component={Home} />
      <Route exact path='/dashboad' component={Dashboard} />
      <Route path='/tickets' component={Tickets} />
      <Route path='/login' component={Login} />
      <Route path='/res_profile' component={ResProfile} />
    </>
  );
}

export default App;
