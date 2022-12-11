import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
//import logo from './logo.svg';
import './App.css';

import {PageChat, PageChatList, PageProfile} from './pages';

function App()  {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/im' element={<PageChatList/>}/>
          <Route path='' element={<PageChatList/>}/>
          <Route path='/im/:id' element={<PageChat />}/>
          <Route path='/user/:id' element={<PageProfile />}/>
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
