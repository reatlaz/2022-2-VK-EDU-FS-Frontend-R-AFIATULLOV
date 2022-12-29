import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Link, useParams} from 'react-router-dom'
import {Button} from '../../components';
import './PageHistory.css';

export function PageHistory() {
  const [text, setText] = useState('');
  const handleChange = (event) => {
    setText(event.target.value);
  }
  return (
    <div className='page-translate'>
    <nav>
      <div className='heading'>
        VK Translate
      </div>
    </nav>
    <div className='translate-box'>
      <div className='translate-header'>

      </div>
      <div className='translate'>
        <div className='translate-from'>
          <input className='translate-input'
            placeholder="Введите текст"
            onChange={handleChange}
            value={text}
          />
        </div>
        <div className='translate-to'>
          <p>Translation</p>
        </div>
      </div>

    </div>
    <div className='history-button'>
      <Button className='button' value='device_reset' to='/history'/>
    </div>

    </div>
  )
}