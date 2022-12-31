import React, {useState, useEffect} from 'react';
import { Icon } from '@mui/material';
import { connect } from 'react-redux';

import {Button} from '../../components';

import './PageTranslate.css';
import { getLanguages } from '../../actions';



function PageTranslate(props) {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('Translation');

  const languages = props.languages;
  const langMap = props.langMap;
  // const [detectedLanguage, setDetectedLanguage] = useState('Язык определится автоматически');
  useEffect(() => {
    props.getLanguages();
    console.log('getLanguages called')

  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
  const handleChange = (event) => {
    setText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (text !== '') {
      translate();
    }
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




        <div className='language'>
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
const mapStateToProps = (state) => ({
  languages: state.languages.languages,
  langMap: state.languages.langMap,
})
export const ConnectedPageTranslate = connect(mapStateToProps, { getLanguages })(PageTranslate)