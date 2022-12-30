import React, {useState} from 'react';
import { Icon } from '@mui/material';
import {Button} from '../../components';

import './PageTranslate.css';
import { useEffect } from 'react';

export function PageTranslate() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('Translation');

  const [languages, setLanguages] = useState([]);
  const [langMap, setLangMap] = useState(new Map());
  // const [detectedLanguage, setDetectedLanguage] = useState('Язык определится автоматически');
  useEffect(() => {
    chooseLanguage()
  }, [])
  const handleChange = (event) => {
    setText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (text !== '') {
      translate();
      setText('');

    }
  }
  const chooseLanguage = () => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'df5ffa97f3mshfa5277882376ad1p1db7b7jsnb69ba524116a',
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        'x-rapidapi-ua': 'RapidAPI-Playground'
      }
    };

    fetch('https://microsoft-translator-text.p.rapidapi.com/languages?api-version=3.0', options)
      .then(response => response.json())
      .then(response => {
        // console.log(response)

        let langs = []
        let langsMap = new Map()
        Object.keys(response.translation).forEach(function(key, index) {
          langs.push({key, ...(response.translation[key])})
          langsMap.set(key, response.translation[key].name)
        });
        setLanguages(langs)
        setLangMap(langsMap)
        // console.log(langs)
        })
      .catch(err => console.error(err));
  }
  const translate = () => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'df5ffa97f3mshfa5277882376ad1p1db7b7jsnb69ba524116a',
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      body: `[{"Text":"${text}"}]`
    };
    const e = document.getElementById('lang-select');
    const language = e.value;

    fetch(`https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${language}&api-version=3.0&profanityAction=NoAction&textType=plain`, options)
      .then(response => response.json())
      .then(response => {
        const res = response[0].translations[0].text
        let history = JSON.parse(localStorage.getItem('history'));
        if(history === null) {
          history = []
        }
        // console.log(response[0].translations[0])
        setTranslatedText(res);
        history.push({
          language: langMap.get(language),
          text: text,
          translatedText: res
          });
        localStorage.setItem('history', JSON.stringify(history));
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
        <div className='language'>
          Language is detected automatically
        </div>
        <div>
          <Icon className='arrow material-symbols-outlined'>
            arrow_forward
          </Icon>
        </div>




        <div className='language' onClick={chooseLanguage}>
          <span className="custom-dropdown">
            <select id='lang-select'>
              {/* <option value="">Select language</option> */}
              {languages && languages.map((item, index) => <option value={item.key} key={index}>{item.name + ' (' + item.nativeName + ')'}</option>
              )}
            </select>
          </span>
        </div>
      </div>
      <div className='translate'>
        <div className='translate-from'>
          <form className="text-form" onSubmit={handleSubmit}>
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