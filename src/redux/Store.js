import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import mylist from './slices/myListSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: storage,
}

const rootReducer = combineReducers({
    mylist: mylist
})

const persistreducer = persistReducer(
    persistConfig,
    rootReducer
);

export const store = configureStore({
    reducer: persistreducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat([ReduxThunk])
    ,
    devTools: true,
})

export let persistStrore = persistStore(store);