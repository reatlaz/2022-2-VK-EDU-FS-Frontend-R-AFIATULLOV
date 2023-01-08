import { GET_LAST_MESSAGE_GENERAL_REQUEST, GET_LAST_MESSAGE_GENERAL_SUCCESS, GET_LAST_MESSAGE_GENERAL_FAILURE } from '../constants/ActionTypes';

const initialState = {
  loading: false,
  lastMessageGeneral: [],
  error: ''
}

export default (state = initialState, action) => { // eslint-disable-line  import/no-anonymous-default-export
  switch (action.type) {
    case GET_LAST_MESSAGE_GENERAL_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_LAST_MESSAGE_GENERAL_SUCCESS:
      return {
        loading: false,
        lastMessageGeneral: action.payload,
        error: ''
      }
    case GET_LAST_MESSAGE_GENERAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
