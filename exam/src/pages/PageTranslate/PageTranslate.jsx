import React, {useState} from 'react';
import {Button} from '../../components';
import './PageTranslate.css';

export function PageTranslate() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('Translation');
  const [language, setLanguage] = useState('');
  const handleChange = (event) => {
    setText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (text !== '') {
      translate(language);
      setText('');

    }
  }
  const translate = (to) => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'df5ffa97f3mshfa5277882376ad1p1db7b7jsnb69ba524116a',
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      body: '[{"Text":"I would really like to drive your car around the block a few times."}]'
    };

    fetch(`https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${to}&api-version=3.0&profanityAction=NoAction&textType=plain`, options)
      .then(response => response.json())
      .then(response => {
        setTranslatedText(response)
      })
      .catch(err => console.error(err));
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
          <form className="form" onSubmit={handleSubmit}>
            <input className='translate-input'
              placeholder="Введите текст"
              onChange={handleChange}
              value={text}
            />
          </form>
        </div>
        <div className='translate-to'>
          {translatedText}
        </div>
      </div>

    </div>
    <div className='history-button'>
      <Button className='button' value='device_reset' goTo='/history'/>
    </div>

    </div>
  )
}