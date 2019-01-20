import React from 'react';
import Routes from './routes';
import 'normalize.css';
import './styles/index.scss';
import $ from 'jquery';
window.jQuery = window.$ = $;
require('bootstrap');

const App = () => (
  <div className='App'>
    <Routes/>
  </div>
);

export default App;
