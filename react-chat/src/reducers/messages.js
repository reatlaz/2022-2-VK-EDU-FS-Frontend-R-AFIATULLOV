import { GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE } from '../constants/ActionTypes';

const initialState = {
  loading: false,
  messages: [],
  user_id: null,
  error: ''
}

export default (state = initialState, action) => { // eslint-disable-line  import/no-anonymous-default-export
  switch (action.type) {
    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_MESSAGES_SUCCESS:
      return {
        loading: false,
        messages: action.payload.data,
        user_id: action.payload.user_id,
        error: ''
      }
    case GET_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
