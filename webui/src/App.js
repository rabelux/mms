import React, { Component } from 'react';
import './App.css';
import { withStyles } from 'material-ui/styles';
import AppHeader from './AppHeader';
import MainDrawer from './MainDrawer';
import FolderChooser from './FolderChooser';

const styles = {
};

class App extends Component {
  render() {
    return (
      <div>
        <AppHeader />
        <MainDrawer />
        <FolderChooser />
      </div>
    );
  }
}

export default withStyles(styles)(App);