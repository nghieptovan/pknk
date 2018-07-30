import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './redux/store/configureStore';
import {Router, IndexRoute, Route, useRouterHistory} from 'react-router';
import { syncHistoryWithStore, routerReducer, push } from 'react-router-redux';
import { useBasename } from 'history';
 import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';
 import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import container
import getRoutes from './routes';
//end import container

//css import
// import 'bootstrap/dist/css/bootstrap.css';
// import './assets/css/style.css';
// import './assets/css/grid.css';
// import './assets/css/icon-font-entribe.css';
import './index.scss';
//end css import

import ApiClient from './helpers/ApiClient';


const client = new ApiClient();
const env = process.env.NODE_ENV;
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: env.includes('demo') ? '/demo': '' 
  // basename: '/demo'
});
const store = configureStore(browserHistory, client);
const history = syncHistoryWithStore(browserHistory, store);

const component = (
  <Router history={history}>
      {getRoutes(store)}
  </Router>
);

render(
  <Provider store={store}>
    <MuiThemeProvider>
    {component}
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
export default history;