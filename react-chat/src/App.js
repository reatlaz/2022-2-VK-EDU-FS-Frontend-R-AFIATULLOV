import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
//import logo from './logo.svg';
import './App.css';

import {ConnectedPageChat, ConnectedPageGeneralChat, ConnectedPageChatList, PageProfile} from './pages';

function App()  {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/im' element={<ConnectedPageChatList/>}/>
          <Route path='' element={<ConnectedPageChatList/>}/>
          <Route path='/im/:id' element={<ConnectedPageChat />}/>
          <Route path='/im/general' element={<ConnectedPageGeneralChat />}/>
          <Route path='/user/:id' element={<PageProfile />}/>
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
