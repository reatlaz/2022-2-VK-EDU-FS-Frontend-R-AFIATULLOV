import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Link, useParams} from 'react-router-dom'
import {Button} from '../../components';
import './PageHistory.css';

export function PageHistory() {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')));
  useEffect(() => {
    console.log(history)
  }, [])
  return (
    <div className='page-translate'>
    <nav>
      <div className='heading'>
        VK Translate
      </div>
    </nav>
    <div className='translate-box'>
      {history && history.map((i) => <div>{i}</div>)}
    </div>
    <div className='history-button'>
      <Button className='button' value='arrow_back' goTo='/'/>
    </div>

    </div>
  )
}