import {
  GET_LANGUAGES_REQUEST,
  GET_LANGUAGES_SUCCESS ,
  GET_LANGUAGES_FAILURE
} from '../constants/ActionTypes'


const getLanguagesStarted = () => ({
  type: GET_LANGUAGES_REQUEST,
})

const getLanguagesSuccess = (languages, langMap) => ({
  type: GET_LANGUAGES_SUCCESS,
  languagePayload: languages,
  langMapPayload: langMap,
})

const getLanguagesFailure = (message) => ({
  type: GET_LANGUAGES_FAILURE,
  payload: message,
})

export const getLanguages = () => {
  return ((dispatch, getState) => {
    console.log('state: ', getState());
    dispatch(getLanguagesStarted());

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
        console.log(response)
        let langs = []
        let langsMap = new Map()
        Object.keys(response.translation).forEach(function(key, index) {
          langs.push({key, ...(response.translation[key])})
          langsMap.set(key, response.translation[key].name)
        });
        dispatch(getLanguagesSuccess(langs, langsMap))
        console.log(langs)
        })
      .catch(err => {
        dispatch(getLanguagesFailure(err))
        console.error(err)
      });
  })
}