import React from 'react'
import { Router, Link } from 'react-static'
//
import Routes from 'react-static-routes'
const debug = require('debug');
const appDebug = debug("mbe:static-app");
appDebug.enabled = true;

import './app.css'

export default (data) => {
  return (
    <Router>
      <div>
        <div className="content">
          <Routes />
        </div>
      </div>
    </Router>
  );
}
