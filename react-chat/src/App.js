import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';

import { ConnectedPageChat, ConnectedPageGeneralChat, ConnectedPageChatList, PageProfile, PageLogin, PageLoginSuccess } from './pages';

function App () {
  const PrivateRoute = ({ children }) => {
    const sessionExpires = JSON.parse(localStorage.getItem('sessionExpires'))
    // return children
    return (sessionExpires && Date.parse(sessionExpires) > Date.now()) ? children : <Navigate to='/login'/>
  }
  const LogInRoute = ({ children }) => {
    const sessionExpires = JSON.parse(localStorage.getItem('sessionExpires'))
    return (sessionExpires && Date.parse(sessionExpires) > Date.now()) ? <Navigate to='/'/> : children
  }
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/login' element={<LogInRoute><PageLogin /></LogInRoute>}/>

          <Route path='/login/success' element={<PageLoginSuccess />}/>

          <Route path='/im' element={<PrivateRoute><ConnectedPageChatList/></PrivateRoute>}/>
          <Route path='' element={<PrivateRoute><ConnectedPageChatList/></PrivateRoute>}/>
          <Route path='/im/:id' element={<PrivateRoute><ConnectedPageChat /></PrivateRoute>}/>
          <Route path='/im/general' element={<PrivateRoute><ConnectedPageGeneralChat /></PrivateRoute>}/>
          <Route path='/user/:id' element={<PrivateRoute><PageProfile /></PrivateRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
