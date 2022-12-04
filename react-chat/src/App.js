import React from 'react';
import logo from './logo.svg';
import './App.css';

import {PageChat, PageChatList} from './pages';


class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: PageChat,
      pages: new Map([
        ['PageChat', PageChat],
        ['PageChatList', PageChatList],
      ])
    };
  }
  goTo(nextPage) {
    this.setState({
      currentPage: this.state.pages.get(nextPage), 
    })
  }
  render() {
    return (
      React.createElement(this.state.currentPage,
        {goToPage: (page) => {console.log(page); this.goTo(page)}})
    );
  }
}

export default App;
