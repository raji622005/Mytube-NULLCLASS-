import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import {thunk} from 'redux-thunk'; 
import { createLogger } from 'redux-logger';
import { authReducer } from './reducers/auth.reducer';

const rootReducer = combineReducers({
  auth:authReducer,
});

const logger = createLogger(); 

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

export default store;

