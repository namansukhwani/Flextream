import React from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistStrore } from './redux/Store'

const theme = createMuiTheme({
  // overrides: {
  //   MuiCssBaseline: {
  //     '@global': {
  //       '*::-webkit-scrollbar': {
  //         width: '0.4em',
  //       },
  //       '*::-webkit-scrollbar-track': {
  //         '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
  //       },
  //       '*::-webkit-scrollbar-thumb': {
  //         backgroundColor: 'rgba(0,0,0,.1)',
  //         outline: '1px solid slategrey'
  //       }
  //     }
  //   }
  // }
})

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStrore}>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
