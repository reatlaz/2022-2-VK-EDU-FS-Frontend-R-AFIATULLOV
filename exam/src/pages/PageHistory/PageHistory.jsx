import React, {useState} from 'react';
// import {Link, useParams} from 'react-router-dom'
import {Button} from '../../components';
import './PageHistory.css';

export function PageHistory() {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')));
  // useEffect(() => {
  //   console.log(history)
  // }, [])
  return (
    <div className='page-translate'>
    <nav>
      <div className='heading'>
        История
      </div>
    </nav>

    <div className='translate-history'>
      {history && history.map(
        (item, index) => <div
        className='history-item'
        key={index}>
          <div className='black-text'>
            <div className='lang-name'>{'→ ' + item.language}</div>        
            <div>{item.text}</div>
          </div>
          <div>{item.translatedText}</div>
        </div>
      )}
    </div>
    <div className='history-buttons'>

      <Button className='button' value='arrow_back' goTo='/'/>
      <div className='clear-button' onClick={() =>  {localStorage.clear(); setHistory([])}}>
        Очистить историю
      </div>
    </div>

    </div>
  )
}