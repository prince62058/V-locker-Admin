import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import {api} from '../rtk/api';
import rootReducers from '../rootReducers';

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore specific action types from serialization check
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(api.middleware)
      .concat(thunk), // Add RTK Query middleware
  devTools: process.env.NODE_ENV !== 'production',
});
setupListeners(store.dispatch);
export { store };
