import {
  GET_LANGUAGES_REQUEST,
  GET_LANGUAGES_SUCCESS ,
  GET_LANGUAGES_FAILURE
} from '../constants/ActionTypes'


const getLanguagesStarted = () => ({
  type: GET_LANGUAGES_REQUEST,
})

const getLanguagesSuccess = (languages) => ({
  type: GET_LANGUAGES_SUCCESS,
  payloas: languages,
})

const getLanguagesFailure = (message) => ({
  type: GET_LANGUAGES_FAILURE,
  payloas: message,
})

export const getLanguages = () => {
  return ((dispatch, getState) => {
    console.log('state: ', getState());
    dispatch(getLanguagesStarted);

    
  })
}