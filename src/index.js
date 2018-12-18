import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './redux/store/configureStore';
import { Router, browserHistory, Route, Switch } from 'react-router';
 import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getRoutes from './routes';
import './index.scss';
//end css import
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import ApiClient from './helpers/ApiClient';
import Dashboard from './components/Dashboard';
import ChallengePage from './components/Creator/Challenge';

const client = new ApiClient();



const store = configureStore(browserHistory, client);
const history = syncHistoryWithStore(browserHistory, store)


render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={Dashboard} />
        <Route path="/challenge" component={ChallengePage} />
        
        
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);