/* eslint-disable react/jsx-filename-extension */
// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home';
import Dashboard from './components/dashboard';
import Tickets from './components/ticket';
import Login from './components/login';
import ResProfile from './components/restProfile';
import CustomerSignup from './components/customerSignup';
import RestaurantSignup from './components/restaurantSignup';
import CustomerProfile from './components/customerProfile';
import RestaurantMenu from './components/restaurantMenu';
import CustomersLanding from './components/CustomersLanding';
import ResLanding from './components/ResLanding';

function App() {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboad" component={Dashboard} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/login" component={Login} />
      <Route path="/res_profile" component={ResProfile} />
      <Route path="/customer_profile" component={CustomerProfile} />
      <Route path="/customer_signup" component={CustomerSignup} />
      <Route path="/res_signup" component={RestaurantSignup} />
      <Route path="/restaurant/menu" component={RestaurantMenu} />
      <Route path="/customer" component={CustomersLanding} />
      <Route path="/restaurant/landing" component={ResLanding} />
    </>
  );
}

export default App;
