import {
  GET_LANGUAGES_REQUEST,
  GET_LANGUAGES_SUCCESS ,
  GET_LANGUAGES_FAILURE
} from '../constants/ActionTypes'

const initialState = {
  loading: false,
  languages: [],
  langMap: new Map(),
  error: '',
}

export default (state = initialState, action) => { // eslint-disable-line import/no-anonymous-default-export
  switch (action.type) {
    case GET_LANGUAGES_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_LANGUAGES_SUCCESS:
      return {
        loading: false,
        languages: action.languagePayload,
        langMap: action.langMapPayload,
        error: '',
      }
    case GET_LANGUAGES_FAILURE:
      return {
        loading: false,
        languages: state.languages,
        langMap: state.langMap,
        error: action.payload,
      }
    default:
      return state
  }
}