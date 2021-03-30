import React from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

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
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>

  );
}

export default App;
