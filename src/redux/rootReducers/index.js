// ** Reducers Slice Imports
import { setupListeners } from '@reduxjs/toolkit/query';

import {api} from '../rtk/api';
import counterSlice from '../reducers/counterSlice';

const rootReducers = {
  counterSlice,
  [api.reducerPath]: api.reducer,
};

export default rootReducers;

setupListeners(api.middleware);
