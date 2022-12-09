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
          <Route path='/im/1' element={<PageChat userId='1'/>}/>
          <Route path='/im/2' element={<PageChat userId='2'/>}/>
          <Route path='/im/3' element={<PageChat userId='3'/>}/>
          <Route path='/user/1' element={<PageProfile userId='1'/>}/>
          <Route path='/user/2' element={<PageProfile userId='2'/>}/>
          <Route path='/user/3' element={<PageProfile userId='3'/>}/>
          <Route path='/im' element={<PageChatList/>}/>
        </Routes>

      </div>
    </Router>
  );
  
}

export default App;
