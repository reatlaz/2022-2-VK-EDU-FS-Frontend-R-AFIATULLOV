import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';

import {ConnectedPageTranslate, PageHistory} from './pages';

function App()  {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='' element={<ConnectedPageTranslate/>}/>
          <Route path='/history' element={<PageHistory/>}/>
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
