import React from 'react';
import logo from './logo.svg';
import './App.css';

import {PageChat} from './pages/PageChat';

class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: PageChat,
    };
  }
  goTo(nextPage) {
    this.setState({
      currentPage: nextPage, 
    })
  }
  render() {
    return (
      React.createElement(this.state.currentPage,
        {goToPage: (page) => this.goTo(page)})
    );
  }
}

export default App;
