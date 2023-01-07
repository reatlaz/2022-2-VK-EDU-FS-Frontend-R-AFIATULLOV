import { GET_CHATS_REQUEST, GET_CHATS_SUCCESS, GET_CHATS_FAILURE } from '../constants/ActionTypes';

const initialState = {
  loading: false,
  chats: [],
  error: ''
}

export default (state = initialState, action) => { // eslint-disable-line  import/no-anonymous-default-export
  switch (action.type) {
    case GET_CHATS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_CHATS_SUCCESS:
      return {
        loading: false,
        chats: action.payload,
        error: ''
      }
    case GET_CHATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
