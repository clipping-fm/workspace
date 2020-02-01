import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducers from 'state/reducers';

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  combineReducers(reducers),
  composeEnhancers(applyMiddleware(thunk, promise))
);
