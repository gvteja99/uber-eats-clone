// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home.js';
import Dashboard from './components/Dashboard';
import Tickets from './components/ticket.js'

function App() {
  return (
    <>
      <Route exact path='/' component={Home} />
      <Route exact path='/dashboad' component={Dashboard} />
      <Route path='/tickets' component={Tickets} />
    </>
  );
}

export default App;
